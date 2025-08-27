# Setup Guide

This guide will walk you through setting up the Automatic Chat Template locally and in production.

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18.17 or later
- **pnpm** package manager (recommended) or npm
- A **Supabase** account and project
- API keys for at least one AI provider (xAI, OpenAI, Anthropic, or Google)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd automatic-chat-template
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 3. Required Environment Variables

Open `.env.local` and configure these essential variables:

#### Authentication Secret
```bash
# Generate a secure random string (32+ characters)
AUTH_SECRET=your_auth_secret_here
```

Generate one using:
- [Vercel Secret Generator](https://generate-secret.vercel.app/32)
- Or command line: `openssl rand -base64 32`

#### Supabase Database
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### AI Provider (Choose at least one)
```bash
# xAI (Default)
XAI_API_KEY=your_xai_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

#### File Storage
```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## Detailed Setup

### Supabase Database Setup

#### 1. Create a Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Wait for database provisioning (2-3 minutes)

#### 2. Get Database Credentials

In your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy the **Project URL** (SUPABASE_URL)
3. Copy the **anon public** key (SUPABASE_ANON_KEY)
4. Copy the **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

#### 3. Run Database Migrations

```bash
pnpm db:migrate
```

This will create all necessary tables with Row Level Security (RLS) policies.

#### 4. Verify Database Setup

```bash
pnpm db:studio
```

This opens Drizzle Studio where you can verify your tables were created:
- `profiles` - User profile information
- `Chat` - Chat conversations
- `Message` - Chat messages
- `Document` - Generated artifacts
- `Vote` - Message votes
- `Suggestion` - AI suggestions

### AI Provider Setup

#### xAI (Default)

1. Visit [console.x.ai](https://console.x.ai)
2. Sign in with your X/Twitter account
3. Navigate to API Keys
4. Create a new API key
5. Add to `.env.local` as `XAI_API_KEY`

#### OpenAI

1. Visit [platform.openai.com](https://platform.openai.com/account/api-keys)
2. Create account and add billing information
3. Create a new API key
4. Add to `.env.local` as `OPENAI_API_KEY`

#### Anthropic Claude

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create account and add billing information
3. Go to API Keys section
4. Create a new API key
5. Add to `.env.local` as `ANTHROPIC_API_KEY`

#### Google Gemini

1. Visit [ai.google.dev](https://ai.google.dev)
2. Get an API key for Gemini
3. Add to `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`

### File Storage Setup

#### Vercel Blob Storage (Recommended)

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Go to Storage tab
3. Create a new Blob store
4. Copy the read/write token
5. Add to `.env.local` as `BLOB_READ_WRITE_TOKEN`

### Optional: n8n Integration

If you want to integrate with n8n workflows:

```bash
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com
```

See [N8N_INTEGRATION.md](./N8N_INTEGRATION.md) for detailed setup.

## Development

### Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:generate     # Generate database migrations
pnpm db:migrate      # Run database migrations
pnpm db:studio       # Open Drizzle Studio
pnpm db:push         # Push schema directly to database

# Code Quality
pnpm lint            # Run linter
pnpm lint:fix        # Fix linting issues
pnpm format          # Format code with Biome

# Testing
pnpm test            # Run Playwright tests
```

## Verification

### Test Authentication

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up" or "Login"
3. Create a test account
4. Verify you receive a confirmation email
5. Confirm your account

### Test Chat Functionality

1. After logging in, start a new chat
2. Send a test message
3. Verify the AI responds correctly
4. Test file uploads (if configured)

### Test Database Connection

```bash
pnpm db:studio
```

Check that your tables exist and RLS policies are applied.

## Common Issues

### Environment Variables Not Loading

- Ensure `.env.local` is in the project root
- Restart the development server after changes
- Check for typos in variable names

### Database Migration Errors

```bash
# Reset and retry migrations
pnpm db:push
```

### Supabase Authentication Issues

1. Check that your Supabase URL and keys are correct
2. Verify your Supabase project is active
3. Check the browser console for specific errors

### AI Provider Errors

- Verify API keys are valid and have sufficient credits
- Check rate limits for your chosen provider
- Test with a different provider if available

### File Upload Issues

- Ensure `BLOB_READ_WRITE_TOKEN` is configured
- Check Vercel Blob store is active
- Verify file size limits

## Advanced Configuration

### Custom App Name and Branding

```bash
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_DESCRIPTION="Your app description"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Performance Optimization

#### Redis Caching (Optional)

```bash
REDIS_URL=your_redis_connection_string
```

#### Analytics

```bash
VERCEL_ANALYTICS_ID=your_analytics_id
```

#### Monitoring

```bash
OTEL_SERVICE_NAME="your-app-name"
```

## Next Steps

Once your setup is complete:

1. **Customize the UI**: See [CUSTOMIZATION.md](./CUSTOMIZATION.md)
2. **Deploy to production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)  
3. **Set up n8n workflows**: See [N8N_INTEGRATION.md](./N8N_INTEGRATION.md)
4. **Add custom AI tools**: Modify `lib/ai/tools/`

## Getting Help

- Check the [troubleshooting section](#common-issues) above
- Review the [main README](./README.md)
- Open an issue in the project repository
- Check the [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- Review [Supabase documentation](https://supabase.com/docs)