#!/bin/bash

# DataVault Pro Production Deployment Script
# This script handles the complete deployment process with safety checks

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_LOG="$PROJECT_ROOT/deploy.log"
BACKUP_DIR="$PROJECT_ROOT/backups"
ENV_FILE="$PROJECT_ROOT/.env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$DEPLOY_LOG"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$DEPLOY_LOG"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$DEPLOY_LOG"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$DEPLOY_LOG"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi

    # Check required commands
    local required_commands=("docker" "docker-compose" "curl" "jq" "pg_dump")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "Required command '$cmd' is not installed"
        fi
    done

    # Check if .env.production exists
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Production environment file not found: $ENV_FILE"
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
    fi

    success "Prerequisites check passed"
}

# Load environment variables
load_environment() {
    log "Loading environment variables..."

    # Source the environment file
    set -a
    source "$ENV_FILE"
    set +a

    # Validate required environment variables
    local required_vars=("DB_PASSWORD" "JWT_SECRET" "DOMAIN" "REDIS_PASSWORD")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            error "Required environment variable '$var' is not set"
        fi
    done

    success "Environment variables loaded"
}

# Create backup
create_backup() {
    log "Creating backup..."

    mkdir -p "$BACKUP_DIR"
    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_$backup_timestamp.sql"

    # Database backup
    if docker-compose -f docker-compose.production.yml ps postgres | grep -q "Up"; then
        log "Creating database backup..."
        docker-compose -f docker-compose.production.yml exec -T postgres \
            pg_dump -U datavault -d datavault_prod > "$backup_file"

        if [[ -f "$backup_file" && -s "$backup_file" ]]; then
            success "Database backup created: $backup_file"
        else
            error "Failed to create database backup"
        fi
    else
        warn "PostgreSQL container not running, skipping database backup"
    fi

    # Application files backup
    local app_backup="$BACKUP_DIR/app_backup_$backup_timestamp.tar.gz"
    tar -czf "$app_backup" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=backups \
        --exclude=logs \
        -C "$PROJECT_ROOT" .

    success "Application backup created: $app_backup"

    # Keep only last 7 backups
    find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
    find "$BACKUP_DIR" -name "app_backup_*.tar.gz" -mtime +7 -delete
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."

    # Check Git status
    if [[ -d "$PROJECT_ROOT/.git" ]]; then
        local git_status=$(git status --porcelain)
        if [[ -n "$git_status" ]]; then
            warn "There are uncommitted changes in the repository"
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                error "Deployment cancelled by user"
            fi
        fi
    fi

    # Test database connection
    if command -v pg_isready &> /dev/null; then
        if ! pg_isready -h localhost -p 5432 -U datavault -d datavault_prod &> /dev/null; then
            warn "Cannot connect to production database"
        fi
    fi

    # Check disk space (require at least 2GB free)
    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    if [[ $available_space -lt 2097152 ]]; then  # 2GB in KB
        error "Insufficient disk space. At least 2GB required."
    fi

    success "Pre-deployment checks passed"
}

# Build and deploy
deploy() {
    log "Starting deployment..."

    cd "$PROJECT_ROOT"

    # Pull latest images
    log "Pulling latest Docker images..."
    docker-compose -f docker-compose.production.yml pull

    # Build application
    log "Building application..."
    docker-compose -f docker-compose.production.yml build --no-cache app

    # Run database migrations
    log "Running database migrations..."
    docker-compose -f docker-compose.production.yml run --rm app \
        sh -c "bunx prisma migrate deploy && bunx prisma generate"

    # Start services
    log "Starting services..."
    docker-compose -f docker-compose.production.yml up -d

    success "Deployment completed"
}

# Health checks
health_checks() {
    log "Running health checks..."

    local max_attempts=30
    local attempt=1

    # Wait for application to start
    log "Waiting for application to start..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "http://localhost:3000/api/health" &> /dev/null; then
            success "Application is responding"
            break
        fi

        log "Attempt $attempt/$max_attempts: Application not ready yet..."
        sleep 10
        ((attempt++))
    done

    if [[ $attempt -gt $max_attempts ]]; then
        error "Application failed to start within expected time"
    fi

    # Check individual services
    local services=("postgres" "redis" "nginx")
    for service in "${services[@]}"; do
        if docker-compose -f docker-compose.production.yml ps "$service" | grep -q "Up"; then
            success "$service is running"
        else
            error "$service is not running"
        fi
    done

    # Test database connection
    log "Testing database connection..."
    if docker-compose -f docker-compose.production.yml exec -T postgres \
        pg_isready -U datavault -d datavault_prod &> /dev/null; then
        success "Database connection test passed"
    else
        error "Database connection test failed"
    fi

    # Test Redis connection
    log "Testing Redis connection..."
    if docker-compose -f docker-compose.production.yml exec -T redis \
        redis-cli ping &> /dev/null; then
        success "Redis connection test passed"
    else
        error "Redis connection test failed"
    fi

    success "All health checks passed"
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."

    # Clear application cache
    log "Clearing application cache..."
    docker-compose -f docker-compose.production.yml exec app \
        sh -c "rm -rf .next/cache/*" || warn "Failed to clear cache"

    # Restart monitoring services
    log "Restarting monitoring services..."
    docker-compose -f docker-compose.production.yml restart prometheus grafana

    # Update SSL certificates if needed
    if command -v certbot &> /dev/null; then
        log "Checking SSL certificates..."
        certbot renew --dry-run || warn "SSL certificate renewal check failed"
    fi

    success "Post-deployment tasks completed"
}

# Rollback function
rollback() {
    log "Rolling back deployment..."

    # Stop current services
    docker-compose -f docker-compose.production.yml down

    # Restore from latest backup
    local latest_backup=$(ls -t "$BACKUP_DIR"/backup_*.sql | head -n1)
    if [[ -n "$latest_backup" ]]; then
        log "Restoring database from: $latest_backup"
        docker-compose -f docker-compose.production.yml up -d postgres
        sleep 30  # Wait for postgres to start
        docker-compose -f docker-compose.production.yml exec -T postgres \
            psql -U datavault -d datavault_prod < "$latest_backup"
    fi

    # Restart with previous version
    docker-compose -f docker-compose.production.yml up -d

    error "Rollback completed"
}

# Cleanup function
cleanup() {
    log "Cleaning up..."

    # Remove unused Docker images
    docker image prune -f

    # Remove old containers
    docker container prune -f

    # Clean up old logs
    find "$PROJECT_ROOT/logs" -name "*.log" -mtime +30 -delete 2>/dev/null || true

    success "Cleanup completed"
}

# Signal handlers
trap 'error "Deployment interrupted"' INT TERM
trap 'cleanup' EXIT

# Main deployment flow
main() {
    log "Starting DataVault Pro production deployment"
    log "====================================================="

    check_prerequisites
    load_environment
    pre_deployment_checks
    create_backup

    # Deploy with error handling
    if deploy; then
        if health_checks; then
            post_deployment
            success "🚀 Deployment completed successfully!"
            log "Application is available at: https://$DOMAIN"
        else
            error "Health checks failed. Initiating rollback..."
            rollback
        fi
    else
        error "Deployment failed. Initiating rollback..."
        rollback
    fi
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_checks
        ;;
    "backup")
        create_backup
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|backup|cleanup}"
        exit 1
        ;;
esac
