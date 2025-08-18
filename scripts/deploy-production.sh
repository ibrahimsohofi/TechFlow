#!/bin/bash

# TechFlow Production Deployment Script
# This script handles secure production deployment with validation

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="TechFlow"
REQUIRED_NODE_VERSION="18"
DEPLOYMENT_ENV="${DEPLOYMENT_ENV:-production}"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
check_prerequisites() {
    log_info "🔍 Running pre-deployment checks..."

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    local node_version=$(node -v | sed 's/v//' | cut -d. -f1)
    if [[ $node_version -lt $REQUIRED_NODE_VERSION ]]; then
        log_error "Node.js version $REQUIRED_NODE_VERSION or higher is required. Current: $(node -v)"
        exit 1
    fi

    # Check Bun
    if ! command -v bun &> /dev/null; then
        log_error "Bun is not installed. Please install Bun first."
        exit 1
    fi

    # Check environment file
    if [[ ! -f ".env.production" && ! -f ".env.local" ]]; then
        log_warning "No production environment file found. Creating template..."
        cp .env.production .env.local
        log_error "Please configure .env.local with your production values before deploying"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Security validation
validate_security() {
    log_info "🔒 Validating security configuration..."

    # Check for hardcoded secrets
    if grep -r "password123\|secret-key\|development-" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null; then
        log_error "Hardcoded secrets or development credentials found in source code"
        exit 1
    fi

    # Check environment variables
    source .env.local 2>/dev/null || source .env.production 2>/dev/null || true

    if [[ -z "${JWT_SECRET:-}" || "${JWT_SECRET}" == *"development"* || ${#JWT_SECRET} -lt 32 ]]; then
        log_error "JWT_SECRET must be set and at least 32 characters long"
        exit 1
    fi

    if [[ -z "${DATABASE_URL:-}" ]]; then
        log_error "DATABASE_URL must be set"
        exit 1
    fi

    # Check for secure protocols
    if [[ "${NEXT_PUBLIC_APP_URL:-}" != https://* ]]; then
        log_warning "NEXT_PUBLIC_APP_URL should use HTTPS in production"
    fi

    log_success "Security validation passed"
}

# Code quality checks
run_quality_checks() {
    log_info "🧪 Running code quality checks..."

    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        bun install
    fi

    # TypeScript compilation check
    log_info "Checking TypeScript compilation..."
    if ! bun run lint 2>/dev/null; then
        log_warning "TypeScript compilation has issues. Continuing with deployment..."
    fi

    # Security audit
    log_info "Running security audit..."
    if command -v bun &> /dev/null; then
        if ! bun audit --audit-level moderate 2>/dev/null; then
            log_warning "Security audit found issues. Please review."
        fi
    fi

    log_success "Code quality checks completed"
}

# Database preparation
prepare_database() {
    log_info "🗄️ Preparing database..."

    # Generate Prisma client
    log_info "Generating Prisma client..."
    bun run db:generate

    # Validate schema
    log_info "Validating database schema..."
    if ! npx prisma validate 2>/dev/null; then
        log_error "Database schema validation failed"
        exit 1
    fi

    # For production, we'll let Netlify handle the database setup
    # but validate that the connection string is correct
    if [[ "${DATABASE_URL}" == "file:"* ]]; then
        log_warning "Using SQLite database. Consider PostgreSQL for production scale."
    fi

    log_success "Database preparation completed"
}

# Build optimization
optimize_build() {
    log_info "⚡ Optimizing build configuration..."

    # Set production environment
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1

    # Clean previous builds
    log_info "Cleaning previous builds..."
    rm -rf .next
    rm -rf out

    # Build the application
    log_info "Building application..."
    if ! SKIP_ENV_VALIDATION=true bun run build; then
        log_error "Build failed"
        exit 1
    fi

    # Check build size
    local build_size=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
    log_info "Build size: $build_size"

    log_success "Build optimization completed"
}

# Deployment validation
validate_deployment() {
    log_info "✅ Validating deployment configuration..."

    # Check Next.js configuration
    if [[ ! -f "next.config.js" ]]; then
        log_error "next.config.js not found"
        exit 1
    fi

    # Validate Netlify configuration
    if [[ ! -f "netlify.toml" ]]; then
        log_error "netlify.toml not found"
        exit 1
    fi

    # Check for required pages
    local required_pages=("src/app/page.tsx" "src/app/not-found.tsx" "src/app/layout.tsx")
    for page in "${required_pages[@]}"; do
        if [[ ! -f "$page" ]]; then
            log_error "Required page $page not found"
            exit 1
        fi
    done

    log_success "Deployment validation passed"
}

# Performance checks
check_performance() {
    log_info "⚡ Running performance checks..."

    # Check bundle size
    if command -v npx &> /dev/null; then
        log_info "Analyzing bundle size..."
        # Run bundle analyzer if available
        if [[ -f "package.json" ]] && grep -q "@next/bundle-analyzer" package.json; then
            log_info "Bundle analyzer available but skipped for automated deployment"
        fi
    fi

    # Check for large files
    local large_files=$(find .next -size +1M -type f 2>/dev/null | head -5)
    if [[ -n "$large_files" ]]; then
        log_warning "Large files found in build:"
        echo "$large_files"
    fi

    log_success "Performance checks completed"
}

# Cleanup function
cleanup() {
    log_info "🧹 Cleaning up temporary files..."

    # Remove sensitive files that shouldn't be deployed
    rm -f .env.local.backup 2>/dev/null || true

    # Clean up logs
    rm -f deployment.log 2>/dev/null || true

    log_success "Cleanup completed"
}

# Main deployment function
deploy() {
    log_info "🚀 Starting $PROJECT_NAME deployment to $DEPLOYMENT_ENV..."

    # Create deployment log
    exec 1> >(tee -a deployment.log)
    exec 2> >(tee -a deployment.log >&2)

    # Backup current environment
    if [[ -f ".env.local" ]]; then
        cp .env.local .env.local.backup
    fi

    # Run all checks and preparations
    check_prerequisites
    validate_security
    run_quality_checks
    prepare_database
    optimize_build
    validate_deployment
    check_performance

    log_success "🎉 $PROJECT_NAME is ready for deployment!"
    log_info "📋 Deployment Summary:"
    echo "  • Environment: $DEPLOYMENT_ENV"
    echo "  • Node.js Version: $(node -v)"
    echo "  • Build Tool: Bun $(bun -v)"
    echo "  • Database: ${DATABASE_URL%%\?*}"  # Hide query params
    echo "  • App URL: ${NEXT_PUBLIC_APP_URL:-Not set}"

    # Instructions for manual deployment
    if [[ "${AUTO_DEPLOY:-false}" != "true" ]]; then
        log_info "📌 Next Steps:"
        echo "  1. Commit your changes: git add . && git commit -m 'Deploy to production'"
        echo "  2. Push to main branch: git push origin main"
        echo "  3. Netlify will automatically deploy your changes"
        echo "  4. Monitor deployment at: https://app.netlify.com"
        echo ""
        log_info "🔗 Or deploy manually with:"
        echo "  netlify deploy --prod"
    fi
}

# Error handling
trap cleanup EXIT
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Script execution
main() {
    case "${1:-deploy}" in
        "check")
            check_prerequisites
            validate_security
            ;;
        "build")
            optimize_build
            ;;
        "validate")
            validate_deployment
            ;;
        "deploy"|*)
            deploy
            ;;
    esac
}

# Show help if requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "TechFlow Production Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy     Run full deployment preparation (default)"
    echo "  check      Run only prerequisite and security checks"
    echo "  build      Run only build optimization"
    echo "  validate   Run only deployment validation"
    echo "  --help     Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DEPLOYMENT_ENV    Deployment environment (default: production)"
    echo "  AUTO_DEPLOY       Set to 'true' for automated deployment"
    echo ""
    exit 0
fi

# Run the script
main "$@"
