# Automatic Chat Template

<p align="center">
    Production-ready AI chat application template with n8n workflow integration.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#n8n-integration"><strong>n8n Integration</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a>
</p>
<br/>

## ✨ Features

- **Multi-Provider AI Support**: Works with xAI, OpenAI, Anthropic, and more
- **Real-time Streaming Chat**: Powered by Vercel AI SDK
- **Dynamic Artifacts**: Generate code, documents, and spreadsheets
- **n8n Workflow Integration**: Connect complex automations and workflows
- **User Authentication**: Complete auth system with Supabase
- **Local Development**: Full local Supabase stack with Docker
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **File Upload & Multimodal**: Support for images, documents, and more
- **Database Ready**: Type-safe schema with Drizzle ORM
- **Production Ready**: Optimized for Vercel deployment

### Technical Stack

- [Next.js](https://nextjs.org) App Router with React Server Components
- [AI SDK](https://sdk.vercel.ai/docs) for LLM integration and chat interfaces
- [Supabase](https://supabase.com) for authentication and data persistence
- [shadcn/ui](https://ui.shadcn.com) with [Tailwind CSS](https://tailwindcss.com) for modern UI
- [Drizzle ORM](https://orm.drizzle.team) for type-safe database operations
- [n8n](https://n8n.io) for workflow automation integration

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## 📡 n8n Integration

The template includes built-in n8n workflow integration via the `/api/chat/simple-n8n` endpoint. This allows you to:

- Trigger n8n workflows from chat conversations
- Process data through complex automation pipelines
- Integrate with external APIs and services
- Create custom business logic workflows

See `app/(chat)/api/chat/simple-n8n.ts` for implementation details.

## 🚀 Quick Start

Get started in under 10 minutes! Choose your preferred development path:

### 🏠 Local Development (Recommended)

Perfect for new developers and experimentation:

```bash
# 1. Clone and install
git clone <your-repo-url>
cd automatic-chat-template
pnpm install

# 2. Start local Supabase (requires Docker)
pnpm supabase:start

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your API keys and the keys from supabase:start output

# 4. Start development
pnpm dev:local
```

### ☁️ Hosted Development

Using hosted Supabase for development:

```bash
# 1. Clone and install
git clone <your-repo-url>
cd automatic-chat-template
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys and Supabase project credentials

# 3. Run migrations
pnpm db:migrate

# 4. Start development
pnpm dev
```

**🎉 Success!** Open [http://localhost:3000](http://localhost:3000) to see your chat app.

> 📖 **New to the template?** Check out our [**Quick Start Guide**](./docs/getting-started/quick-start.md) for detailed setup instructions.

Your application will be running on [localhost:3000](http://localhost:3000).

## 🔧 Configuration

### Environment Files

- **`.env.local.example`**: Template for local development with local Supabase
- **`.env.example`**: Template for production/hosted Supabase environments

### Local Development Environment Variables

```bash
# Local Supabase Configuration (from pnpm supabase:start output)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local_anon_key_from_cli_output>
SUPABASE_SERVICE_ROLE_KEY=<local_service_role_key_from_cli_output>

# Local PostgreSQL Database
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Authentication Secret (Required)
AUTH_SECRET=<generate_with_openssl_rand_base64_32>
```

### Production Environment Variables

```bash
# Database (Hosted Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_connection_string

# AI Providers (choose one or more)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
XAI_API_KEY=your_xai_key

# n8n Integration (optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Optional Environment Variables

```bash
# Analytics
VERCEL_ANALYTICS_ID=your_analytics_id

# App Configuration
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_DESCRIPTION="Your app description"
```

## 🛠 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm dev:local        # Start Supabase + Next.js together
pnpm build           # Build for production
pnpm start           # Start production server

# Local Supabase Stack
pnpm supabase:start   # Start local Supabase services
pnpm supabase:stop    # Stop local Supabase services
pnpm supabase:restart # Restart local Supabase services
pnpm supabase:status  # Show status of local services
pnpm supabase:reset   # Reset local database and apply migrations
pnpm supabase:studio  # Open local Supabase Studio

# Database
pnpm db:generate     # Generate database migrations
pnpm db:migrate      # Run database migrations
pnpm db:studio       # Open Drizzle Studio

# Code Quality
pnpm lint            # Run linter
pnpm lint:fix        # Fix linting issues
pnpm format          # Format code

# Testing
pnpm test            # Run Playwright tests
```

## 📊 Database Schema

The template includes a minimal, flexible database schema:

- **Users & Profiles**: User authentication and profile management
- **Chats & Messages**: Conversation history with streaming support
- **Documents**: Generated artifacts and file storage
- **Votes & Suggestions**: User feedback and AI suggestions

All tables include Row Level Security (RLS) policies for data protection.

## 🐳 Local Development with Supabase

This template supports full local development with a complete Supabase stack running in Docker containers.

### Benefits of Local Development

- **⚡ Faster Development**: No network latency for database operations
- **💰 Cost Savings**: Zero database usage charges during development
- **🔒 Safe Testing**: Isolated environment for experiments
- **📶 Offline Development**: Work without internet connectivity
- **🔄 Easy Reset**: Fresh database state with one command

### Local Services

When you run `pnpm supabase:start`, you get:

| Service             | URL                      | Description              |
| ------------------- | ------------------------ | ------------------------ |
| **Supabase API**    | `http://localhost:54321` | REST API, Auth, Realtime |
| **PostgreSQL**      | `localhost:54322`        | Database server          |
| **Supabase Studio** | `http://localhost:54323` | Database management UI   |
| **Inbucket**        | `http://localhost:54324` | Email testing server     |

### Quick Commands

```bash
# Daily workflow
pnpm supabase:start    # Start local stack
pnpm dev              # Start your app
pnpm supabase:stop     # Stop when done

# Database operations
pnpm supabase:reset    # Reset DB and apply migrations
pnpm supabase:studio   # Open database UI

# Convenient combo
pnpm dev:local         # Start everything together
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
# Build and run with Docker
docker build -t automatic-chat-template .
docker run -p 3000:3000 automatic-chat-template
```

## 🤝 Contributing

This template is designed to be customized for your specific use case. Feel free to:

- Modify the UI components and styling
- Add new AI providers or tools
- Extend the database schema
- Integrate additional services
- Create custom n8n workflows

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[📖 Documentation Index](./docs/index.md)** - Complete navigation and reference guide
- **[🚀 Quick Start Guide](./docs/getting-started/quick-start.md)** - Get running in under 10 minutes
- **[🛠️ Local Development](./docs/development/local-development.md)** - Complete local Supabase setup
- **[⚙️ Configuration Reference](./docs/development/configuration.md)** - Environment variables and settings
- **[🚀 Production Deployment](./docs/deployment/production.md)** - Deploy to Vercel, Docker, and more
- **[🎨 Customization Guide](./docs/guides/customization.md)** - Modify UI, branding, and features
- **[🔌 API Integration](./docs/guides/api-integration.md)** - Add custom AI providers and tools
- **[⚡ n8n Integration](./docs/guides/n8n-integration.md)** - Workflow automation setup
- **[🔧 Troubleshooting](./docs/development/troubleshooting.md)** - Common issues and solutions

## 🔗 Useful Links

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [n8n Documentation](https://docs.n8n.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
