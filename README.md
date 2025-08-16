# DataVault Pro - Enterprise Web Scraping SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC)](https://tailwindcss.com/)

**DataVault Pro** is a comprehensive, enterprise-grade web scraping SaaS platform that transforms raw web data into actionable insights. Built with modern technologies and designed for scale, it offers no-code scraping solutions, AI-powered selector generation, and enterprise security features.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun** runtime
- **Git** for version control
- **SQLite** (included) or **PostgreSQL** for production

### 1. Clone & Install
```bash
git clone https://github.com/ibrahimsohofi/saas.git
cd saas
bun install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key" # Optional for AI features
REDIS_URL="redis://localhost:6379"   # Optional for job queuing
```

### 3. Database Setup
```bash
# Generate Prisma client
bun run db:generate

# Set up database
bun run db:push

# Seed with sample data
bun run db:seed
```

### 4. Start Development
```bash
bun run dev
```

Visit http://localhost:3000 and log in with:
- **Admin**: admin@acme.com / password123
- **User**: user@acme.com / password123

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT with secure httpOnly cookies
- **Scraping**: JSDOM + Playwright engines
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Turbopack for fast development

### Key Features
- 🔐 **Multi-tenant Authentication** - Organization-based user management
- 🌐 **Multiple Scraping Engines** - JSDOM, Playwright, and custom engines
- 🤖 **AI-Powered Selectors** - OpenAI integration for smart CSS selection
- 📊 **Real-time Analytics** - Performance metrics and usage tracking
- 🛡️ **Compliance Engine** - Geo-blocking, rate limiting, and ethical scraping
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔌 **RESTful API** - Complete API for external integrations

## 📚 Documentation

### For Users
- [Getting Started Guide](./docs/user-guide/getting-started.md)
- [Creating Your First Scraper](./docs/user-guide/first-scraper.md)
- [Understanding the Dashboard](./docs/user-guide/dashboard.md)
- [Managing Data Exports](./docs/user-guide/data-exports.md)
- [Scheduling & Automation](./docs/user-guide/scheduling.md)

### For Developers
- [API Reference](./docs/api/README.md)
- [Database Schema](./docs/development/database-schema.md)
- [Authentication Flow](./docs/development/authentication.md)
- [Scraping Engines](./docs/development/scraping-engines.md)
- [Deployment Guide](./docs/deployment/README.md)

### Tutorials
- [Building a Product Price Monitor](./docs/tutorials/price-monitor.md)
- [Setting Up News Aggregation](./docs/tutorials/news-aggregator.md)
- [Lead Generation Automation](./docs/tutorials/lead-generation.md)

## 🎯 Core Features

### No-Code Scraper Builder
Create powerful web scrapers without writing code:
- Visual element selection
- Point-and-click field mapping
- Real-time preview and testing
- Advanced scheduling options

### Enterprise Security
- JWT-based authentication
- Role-based access control
- API rate limiting
- Geo-blocking capabilities
- GDPR compliance tools

### Scalable Architecture
- Multi-tenant organization support
- Horizontal scaling ready
- Redis-based job queuing
- Database connection pooling
- CDN and caching support

### AI-Powered Features
- Smart CSS selector generation
- Content pattern recognition
- Automated data validation
- Anomaly detection

## 🛠️ Development

### Project Structure
```
saas/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and configurations
│   └── hooks/            # Custom React hooks
├── docs/                 # Documentation
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── tests/                # Test files
```

### Available Scripts
```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to database
bun run db:seed          # Seed database with sample data
bun run db:studio        # Open Prisma Studio
bun run db:reset         # Reset and reseed database

# Code Quality
bun run lint             # Run TypeScript and ESLint checks
bun run format           # Format code with Biome
bun run test             # Run test suite
bun run test:coverage    # Run tests with coverage
```

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `REDIS_URL` | Redis connection for job queuing | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | No |

## 🚀 Deployment

### Quick Deploy Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build for static export
bun run build
bun run export

# Deploy dist folder to Netlify
```

#### Docker
```bash
# Build image
docker build -t datavault-pro .

# Run container
docker run -p 3000:3000 datavault-pro
```

### Production Checklist
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure Redis for job queuing
- [ ] Set up environment variables
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)

## 📊 Testing

### API Testing
The platform includes comprehensive API tests:
```bash
# Test authentication
node scripts/test-auth.js

# Test scraping functionality
node scripts/test-scraping.js

# Test full user flow
bun run test:integration
```

### Test Accounts
- **Admin**: admin@acme.com / password123
- **User**: user@acme.com / password123
- **Organization**: Acme Corp (PRO plan)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style (Biome formatting)
- Add tests for new features
- Update documentation for API changes
- Use conventional commits

## 📞 Support

### Community
- [GitHub Issues](https://github.com/ibrahimsohofi/saas/issues) - Bug reports and feature requests
- [Discussions](https://github.com/ibrahimsohofi/saas/discussions) - Community support

### Enterprise
- 📧 Email: support@datavault.pro
- 💬 Discord: [DataVault Pro Community](https://discord.gg/datavault)
- 📞 Phone: Enterprise customers only

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Prisma](https://prisma.io/) for database tooling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Playwright](https://playwright.dev/) for browser automation

---

**Made with ❤️ by the DataVault Pro team**
