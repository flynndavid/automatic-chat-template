# Automatic Chat Template - Documentation

Welcome to the comprehensive documentation for the Automatic Chat Template! This guide will help you get started, develop locally, and deploy to production.

## 📖 Table of Contents

### 🚀 Getting Started
Start here if you're new to the template:

- **[Quick Start Guide](./getting-started/quick-start.md)** - Get up and running in minutes
- **[Template Overview](#template-overview)** - Understanding the architecture
- **[Prerequisites](#prerequisites)** - What you need before starting

### 🛠️ Development
Everything you need for local development:

- **[Local Development](./development/local-development.md)** - Complete local Supabase setup guide
- **[Configuration Reference](./development/configuration.md)** - Environment variables and settings
- **[Troubleshooting](./development/troubleshooting.md)** - Common issues and solutions

### 🚀 Deployment
Deploy your application to production:

- **[Production Deployment](./deployment/production.md)** - Vercel, Docker, and hosting options
- **[Environment Setup](./deployment/production.md#environment-setup)** - Production configuration
- **[CI/CD Pipeline](./deployment/production.md#cicd-setup)** - Automated deployments

### 📚 Guides
Detailed guides for specific features:

- **[n8n Integration](./guides/n8n-integration.md)** - Workflow automation setup
- **[Customization Guide](./guides/customization.md)** - Modify the template for your needs
- **[API Integration](./guides/api-integration.md)** - Adding custom APIs and providers

## Template Overview

The Automatic Chat Template is a production-ready AI chat application built with modern technologies:

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Services      │
│                 │    │                 │    │                 │
│ • Next.js 15    │◄──►│ • API Routes    │◄──►│ • Supabase      │
│ • React 19      │    │ • AI SDK        │    │ • PostgreSQL    │
│ • Tailwind CSS  │    │ • Auth          │    │ • n8n Workflows │
│ • shadcn/ui     │    │ • Streaming     │    │ • File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### ✨ Key Features

- **🤖 Multi-AI Provider Support**: xAI, OpenAI, Anthropic, Google, and more
- **⚡ Real-time Streaming**: Powered by Vercel AI SDK
- **📱 Modern UI**: Built with shadcn/ui and Tailwind CSS
- **🔐 Authentication**: Complete auth system with Supabase
- **🐳 Local Development**: Full local Supabase stack with Docker
- **🔄 Workflow Integration**: n8n automation and custom workflows
- **📊 Database Ready**: Type-safe schema with Drizzle ORM
- **🚀 Production Ready**: Optimized for Vercel deployment

### 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Backend** | Next.js API Routes, Vercel AI SDK |
| **Database** | Supabase (PostgreSQL), Drizzle ORM |
| **Authentication** | Supabase Auth, NextAuth.js |
| **AI Providers** | xAI, OpenAI, Anthropic, Google Gemini |
| **Automation** | n8n Workflows, Custom API integrations |
| **File Storage** | Vercel Blob, Supabase Storage |
| **Deployment** | Vercel, Docker, Self-hosted options |

## Prerequisites

Before you begin, ensure you have:

### Required
- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

### For Local Development
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **4GB+ RAM** available for Docker containers

### For Production
- **Vercel Account** - [Sign up](https://vercel.com)
- **Supabase Account** - [Sign up](https://supabase.com)
- **AI Provider API Key** - Choose from xAI, OpenAI, Anthropic, or Google

## Quick Start Options

### 🏠 Option 1: Local Development (Recommended)
Perfect for development with full local stack:

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd automatic-chat-template
   pnpm install
   ```

2. **Start local services**
   ```bash
   pnpm supabase:start
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with values from supabase:start
   ```

4. **Start development**
   ```bash
   pnpm dev:local
   ```

### ☁️ Option 2: Hosted Development
Using hosted Supabase for development:

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd automatic-chat-template
   pnpm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit with your Supabase project credentials
   ```

3. **Run migrations**
   ```bash
   pnpm db:migrate
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Daily Development
```bash
# Start your development session
pnpm supabase:start     # Start local Supabase (if using local)
pnpm dev               # Start Next.js development server

# During development
pnpm supabase:studio   # Open database admin UI
pnpm db:generate       # Generate new migrations
pnpm supabase:reset    # Reset database with fresh migrations

# End your session
pnpm supabase:stop     # Stop local services to free resources
```

### Code Quality
```bash
pnpm lint              # Check code quality
pnpm lint:fix          # Fix linting issues  
pnpm format            # Format code with Biome
pnpm test              # Run Playwright tests
```

### Database Operations
```bash
pnpm db:studio         # Open Drizzle Studio
pnpm supabase:studio   # Open Supabase Studio
pnpm supabase:reset    # Reset local database
pnpm db:migrate        # Run custom migrations
```

## Environment Configuration

### Local Development
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<from_supabase_start_output>
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Production
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<from_supabase_dashboard>
POSTGRES_URL=<from_supabase_dashboard>
```

## Need Help?

- 📖 **Documentation Issues**: Check our [troubleshooting guide](./development/troubleshooting.md)
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💬 **Questions**: Join our Discord community
- 📧 **Support**: Contact the maintainers

## Contributing

This template is designed to be customized for your needs. Feel free to:

- ✅ Modify UI components and styling
- ✅ Add new AI providers or tools  
- ✅ Extend the database schema
- ✅ Create custom n8n workflows
- ✅ Integrate additional services

## Next Steps

1. **[Set up local development](./development/local-development.md)** - Get your environment running
2. **[Configure your environment](./development/configuration.md)** - Set up API keys and services
3. **[Customize the template](./guides/customization.md)** - Make it your own
4. **[Deploy to production](./deployment/production.md)** - Go live with your chat app

---

**Happy building! 🚀** 

The Automatic Chat Template provides a solid foundation for creating production-ready AI chat applications. The local development setup will save you time and money, while the comprehensive documentation ensures you can customize and extend it to meet your specific needs.