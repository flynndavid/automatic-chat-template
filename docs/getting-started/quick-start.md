# Quick Start Guide

Get the Automatic Chat Template running in under 10 minutes! This guide will walk you through the fastest path to a working chat application.

## 🚀 Choose Your Path

### Path A: Local Development (Recommended)

✅ **Best for**: New developers, experimentation, offline development  
✅ **Benefits**: Faster, free, isolated, easy to reset  
⏱️ **Time**: 5-10 minutes

### Path B: Hosted Development

✅ **Best for**: Production-like environment, team collaboration  
✅ **Benefits**: Cloud-hosted, shared database, production parity  
⏱️ **Time**: 10-15 minutes (includes Supabase account setup)

---

## Path A: Local Development Setup

### Step 1: Prerequisites ✅

Make sure you have:

- [Node.js 18+](https://nodejs.org/) installed
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Git](https://git-scm.com/) installed

```bash
# Verify your setup
node --version    # Should be 18.0.0 or higher
docker --version  # Should show Docker version
```

### Step 2: Clone and Install 📦

```bash
# Clone the repository
git clone https://github.com/your-username/automatic-chat-template.git
cd automatic-chat-template

# Install dependencies
npm install -g pnpm  # Install pnpm if you don't have it
pnpm install         # Install project dependencies
```

### Step 3: Start Local Supabase 🐳

```bash
# This downloads and starts all Supabase services locally
pnpm supabase:start
```

**Expected output:**

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **First time?** This may take 5-10 minutes as Docker downloads images.

### Step 4: Configure Environment 🔧

```bash
# Copy the local development template
cp .env.local.example .env.local

# Open the file and update with the keys from Step 3
# You need to copy:
# - anon key → SUPABASE_ANON_KEY
# - service_role key → SUPABASE_SERVICE_ROLE_KEY
```

**Edit `.env.local`** with your favorite editor:

```bash
# Local Supabase Configuration (✅ These should already be correct)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_URL=http://127.0.0.1:54321
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Update these with output from Step 3 ⬇️
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate a secure secret for auth
AUTH_SECRET=your_32_character_secret_here

# Add AI provider API keys (choose one or more):
OPENAI_API_KEY=your_openai_api_key              # For OpenAI GPT models
ANTHROPIC_API_KEY=your_anthropic_api_key        # For Claude models
# XAI_API_KEY=your_xai_api_key                  # For xAI Grok models
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_key  # For Gemini models

# Add n8n webhook URL for workflow integration:
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

**🔑 Get API Keys:**

- **xAI**: [https://console.x.ai/](https://console.x.ai/)
- **OpenAI**: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- **Anthropic**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **Google**: [https://ai.google.dev/](https://ai.google.dev/)

**🔐 Generate AUTH_SECRET:**

```bash
# Use this command to generate a secure secret
openssl rand -base64 32
```

### Step 5: Set Up Database 🗄️

```bash
# Apply the database schema to your local Supabase
pnpm supabase:reset
```

### Step 6: Start the Application 🚀

```bash
# Start the Next.js development server
pnpm dev
```

**🎉 Success!** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Path B: Hosted Development Setup

### Step 1: Prerequisites ✅

Make sure you have:

- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [Supabase account](https://supabase.com) (free tier available)

### Step 2: Create Supabase Project ☁️

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for project initialization (2-3 minutes)
4. Go to **Settings → API** and note your:
   - Project URL
   - Anon (public) key
   - Service role (secret) key

### Step 3: Clone and Install 📦

```bash
# Clone the repository
git clone https://github.com/your-username/automatic-chat-template.git
cd automatic-chat-template

# Install dependencies
npm install -g pnpm
pnpm install
```

### Step 4: Configure Environment 🔧

```bash
# Copy the production template
cp .env.example .env.local
```

**Edit `.env.local`** with your Supabase project details:

```bash
# Hosted Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_from_supabase_dashboard
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_dashboard

# Database URL from Supabase Settings → Database
POSTGRES_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres

# Generate auth secret
AUTH_SECRET=your_32_character_secret_here

# Add AI provider API keys (same as Path A)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
# XAI_API_KEY=your_xai_api_key

# Add n8n webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Step 5: Set Up Database 🗄️

```bash
# Apply schema to your hosted Supabase database
pnpm db:migrate
```

### Step 6: Start the Application 🚀

```bash
pnpm dev
```

**🎉 Success!** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification Checklist ✅

Your setup is complete when you can:

- [ ] **Access the app** at [http://localhost:3000](http://localhost:3000)
- [ ] **See the chat interface** with model selector
- [ ] **Send a test message** and get an AI response
- [ ] **Access Supabase Studio**:
  - Local: [http://localhost:54323](http://localhost:54323)
  - Hosted: Go to your Supabase dashboard
- [ ] **See database tables** in Studio (Chat, Message_v2, profiles, etc.)

## Quick Commands Reference 📝

```bash
# Development
pnpm dev              # Start the application
pnpm dev:local        # Start Supabase + Next.js together

# Local Supabase (Path A only)
pnpm supabase:start   # Start local services
pnpm supabase:stop    # Stop local services
pnpm supabase:status  # Check service status
pnpm supabase:studio  # Open database admin UI

# Database
pnpm supabase:reset   # Reset local database
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open Drizzle Studio

# Code Quality
pnpm lint             # Check code
pnpm format           # Format code
pnpm test             # Run tests
```

## Troubleshooting 🔧

### Common Issues

**❌ "Docker not running"**

```bash
# Make sure Docker Desktop is open and running
docker --version
```

**❌ "Port already in use"**

```bash
# Kill processes using Supabase ports
lsof -i :54321  # Find process ID
kill -9 <PID>   # Kill the process
```

**❌ "Environment variables not loading"**

- Check `.env.local` exists and has correct values
- Restart your development server: `Ctrl+C` then `pnpm dev`

**❌ "API key not working"**

- Verify your API key is correct
- Check you have credits/quota remaining
- Try a different AI provider

### Get More Help

- 📖 **Detailed troubleshooting**: [docs/development/troubleshooting.md](../development/troubleshooting.md)
- 🔧 **Configuration guide**: [docs/development/configuration.md](../development/configuration.md)
- 🏠 **Local development deep dive**: [docs/development/local-development.md](../development/local-development.md)

## What's Next? 🎯

Now that you have a working setup:

1. **🎨 Customize the UI** - Modify components in the `components/` directory
2. **🤖 Try different AI models** - Change the model in the chat interface
3. **🗄️ Explore the database** - Check out your data in Supabase Studio
4. **🔄 Set up n8n workflows** - See [docs/guides/n8n-integration.md](../guides/n8n-integration.md)
5. **🚀 Deploy to production** - Follow [docs/deployment/production.md](../deployment/production.md)

**Welcome to the Automatic Chat Template! 🚀**

You now have a production-ready AI chat application running locally. The template is designed to be customized for your specific needs - feel free to explore, modify, and extend it however you'd like!
