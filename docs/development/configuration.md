# Configuration Reference

Complete guide to configuring the Automatic Chat Template for different environments.

## Environment Files Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| `.env.local.example` | Local development template | Copy to `.env.local` for local Supabase |
| `.env.example` | Production template | Copy to `.env.local` for hosted Supabase |
| `.env.local` | Your active environment | Created by you, contains actual values |

## Local Development Configuration

### 1. Start Local Supabase

```bash
pnpm supabase:start
```

Output example:
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configure Environment Variables

Copy and update `.env.local`:

```bash
cp .env.local.example .env.local
```

Required local variables:

```bash
# ===================================================================
# LOCAL SUPABASE CONFIGURATION
# ===================================================================

# Core Supabase URLs (from CLI output above)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_URL=http://127.0.0.1:54321

# API Keys (from CLI output above)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Direct Database Connection
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Authentication Secret (Generate with: openssl rand -base64 32)
AUTH_SECRET=your_32_character_secret_here

# ===================================================================
# AI PROVIDERS (Same as production)
# ===================================================================

# Choose one or more AI providers
XAI_API_KEY=your_xai_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# ===================================================================
# OPTIONAL SERVICES
# ===================================================================

# File uploads (placeholder for local dev)
BLOB_READ_WRITE_TOKEN=placeholder_for_local_dev

# n8n Integration
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com

# Analytics & Monitoring
VERCEL_ANALYTICS_ID=your_analytics_id
OTEL_SERVICE_NAME="automatic-chat-template"

# Development flags
SKIP_ENV_VALIDATION=false
PLAYWRIGHT=false
```

## Production Configuration

### 1. Hosted Supabase Setup

Create a project at [supabase.com](https://supabase.com) and get your credentials.

### 2. Configure Environment Variables

Copy and update `.env.local`:

```bash
cp .env.example .env.local
```

Required production variables:

```bash
# ===================================================================
# HOSTED SUPABASE CONFIGURATION
# ===================================================================

# From your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_hosted_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_hosted_service_role_key

# From Supabase Settings > Database > Connection string
POSTGRES_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres

# Authentication Secret (Generate with: openssl rand -base64 32)
AUTH_SECRET=your_production_secret_here

# Same AI providers and optional services as local...
```

## Environment Variable Reference

### Core Variables

| Variable | Required | Local Value | Production Value | Description |
|----------|----------|-------------|------------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `http://127.0.0.1:54321` | `https://your-id.supabase.co` | Public Supabase API URL |
| `SUPABASE_ANON_KEY` | ✅ | From CLI output | From dashboard | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | From CLI output | From dashboard | Admin API key |
| `POSTGRES_URL` | ✅ | Local PostgreSQL | Hosted connection string | Database URL |
| `AUTH_SECRET` | ✅ | Generated secret | Generated secret | Session encryption |

### AI Provider Variables

| Variable | Provider | Required | Description |
|----------|----------|----------|-------------|
| `XAI_API_KEY` | xAI | One required | Grok models API key |
| `OPENAI_API_KEY` | OpenAI | One required | GPT models API key |
| `ANTHROPIC_API_KEY` | Anthropic | One required | Claude models API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google | One required | Gemini models API key |

### Optional Variables

| Variable | Purpose | Default | Description |
|----------|---------|---------|-------------|
| `N8N_API_KEY` | Workflow automation | - | n8n instance API key |
| `N8N_BASE_URL` | Workflow automation | - | n8n instance URL |
| `BLOB_READ_WRITE_TOKEN` | File uploads | - | Vercel Blob storage token |
| `VERCEL_ANALYTICS_ID` | Analytics | - | Vercel Analytics tracking |
| `REDIS_URL` | Caching | - | Redis connection string |

## Switching Between Environments

### Local to Production

1. Stop local Supabase: `pnpm supabase:stop`
2. Update `.env.local` with production credentials
3. Restart your application: `pnpm dev`

### Production to Local

1. Start local Supabase: `pnpm supabase:start`
2. Update `.env.local` with local credentials (from CLI output)
3. Restart your application: `pnpm dev`

## SSL Configuration

The application automatically detects environment type:

```typescript
// In lib/db/migrate.ts and lib/db/queries.ts
const isLocal = process.env.POSTGRES_URL!.includes('localhost') || 
                process.env.POSTGRES_URL!.includes('127.0.0.1');

const client = postgres(process.env.POSTGRES_URL!, {
  ssl: isLocal ? false : 'require',
});
```

**Local Development**: SSL disabled (Docker containers)  
**Production**: SSL required (hosted databases)

## Security Best Practices

### Development

- ✅ Use example keys for local development
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use Docker volumes for local data persistence
- ❌ Never commit real API keys to git

### Production

- ✅ Use environment-specific secrets
- ✅ Rotate API keys regularly
- ✅ Use strong `AUTH_SECRET` (32+ characters)
- ✅ Enable database SSL
- ❌ Never log sensitive environment variables

## Validation

The application includes environment validation. Set `SKIP_ENV_VALIDATION=true` to disable during development.

Common validation errors:
- Missing required API keys
- Invalid URL formats
- Weak authentication secrets
- SSL configuration mismatches

## Quick Reference Commands

```bash
# Generate auth secret
openssl rand -base64 32

# Check local Supabase status
pnpm supabase:status

# Test database connection
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# View Supabase Studio
open http://localhost:54323

# Reset everything
pnpm supabase:stop
rm .env.local
pnpm supabase:start
cp .env.local.example .env.local
# Edit .env.local with new values
pnpm dev
```