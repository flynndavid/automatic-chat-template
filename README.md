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

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd automatic-chat-template
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys and database URL
```

4. **Set up Supabase database**
```bash
pnpm db:migrate
```

5. **Start development server**
```bash
pnpm dev
```

Your application will be running on [localhost:3000](http://localhost:3000).

## 🔧 Configuration

### Required Environment Variables

```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Providers (choose one or more)
XAI_API_KEY=your_xai_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# n8n Integration (optional)
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com
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
pnpm build           # Build for production
pnpm start           # Start production server

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

## 🔗 Useful Links

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [n8n Documentation](https://docs.n8n.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)