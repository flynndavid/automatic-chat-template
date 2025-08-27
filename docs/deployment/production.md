# Deployment Guide

This guide covers deploying the Automatic Chat Template to production environments, with detailed instructions for Vercel (recommended), Docker, and other platforms.

## Pre-deployment Checklist

Before deploying to production:

- [ ] **Environment variables configured** in your deployment platform
- [ ] **Database migrations run** and tested
- [ ] **AI provider API keys** are valid and have sufficient credits
- [ ] **File storage** (Vercel Blob) is configured
- [ ] **Custom domain** (optional) is ready
- [ ] **Analytics and monitoring** tools are set up

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments, edge functions, and integrated services.

### Step 1: Prepare Your Repository

1. **Push code to Git**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Ensure your repository is public or accessible** to Vercel

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. **Visit [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build` (or leave default)
   - **Output Directory**: `.next` (default)

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel --prod
```

### Step 3: Configure Environment Variables

In your Vercel dashboard:

1. **Go to Project Settings** → **Environment Variables**
2. **Add all required variables**:

#### Required Variables
```bash
# Authentication
AUTH_SECRET=your_secure_auth_secret

# Database - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider (at least one)
XAI_API_KEY=your_xai_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# File Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

#### Optional Variables
```bash
# n8n Integration
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_ID=your_webhook_id

# Analytics
VERCEL_ANALYTICS_ID=your_analytics_id

# App Branding
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_DESCRIPTION="Your app description"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Performance
REDIS_URL=your_redis_url

# Monitoring
OTEL_SERVICE_NAME="your-app-name"
```

### Step 4: Production Database Setup

#### Run Migrations in Production

1. **Set up local environment** with production database URL:
   ```bash
   # Temporarily use production database
   SUPABASE_URL=https://your-production-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   
   pnpm db:migrate
   ```

2. **Or run migrations directly in Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Run your migration SQL files manually

#### Verify RLS Policies

Ensure Row Level Security policies are properly configured:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Verify policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Step 5: Domain Configuration (Optional)

1. **Add custom domain** in Vercel dashboard
2. **Configure DNS** records as instructed
3. **Update environment variables**:
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ```

### Step 6: Final Verification

1. **Test authentication flow**
2. **Verify chat functionality** 
3. **Test file uploads**
4. **Check database connections**
5. **Monitor application logs**

## Docker Deployment

For self-hosted environments or container orchestration platforms.

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AUTH_SECRET=${AUTH_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - XAI_API_KEY=${XAI_API_KEY}
      - BLOB_READ_WRITE_TOKEN=${BLOB_READ_WRITE_TOKEN}
    env_file:
      - .env.production
    depends_on:
      - redis
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
```

### Build and Run

```bash
# Build the image
docker build -t automatic-chat-template .

# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -p 3000:3000 --env-file .env.production automatic-chat-template
```

## Alternative Deployments

### Railway

1. **Connect your GitHub repository**
2. **Configure environment variables**
3. **Deploy automatically on push**

```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway link
railway up
```

### Netlify

1. **Build command**: `pnpm build`
2. **Publish directory**: `.next`
3. **Environment variables**: Configure in Netlify dashboard

### DigitalOcean App Platform

1. **Create new app** from GitHub repository
2. **Configure build settings**:
   - **Build command**: `pnpm build`
   - **Run command**: `pnpm start`
3. **Set environment variables**

### AWS/Azure/GCP

Use container services (ECS, Container Apps, Cloud Run) with the Docker setup above.

## Database Considerations

### Supabase Production Setup

#### 1. Upgrade to Pro Plan (Recommended)

- **Automatic daily backups**
- **Point-in-time recovery**
- **Compute optimizations**
- **Priority support**

#### 2. Connection Pooling

For high-traffic applications:

```bash
# Use connection pooling URL
SUPABASE_URL=https://your-project.supabase.co
# Instead of direct database URL
```

#### 3. Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON "Message"(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON "Message"(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON "Document"(user_id);

-- Analyze table statistics
ANALYZE;
```

### Alternative: Vercel Postgres

If not using Supabase:

1. **Create Vercel Postgres database**
2. **Update connection string**:
   ```bash
   POSTGRES_URL=your_vercel_postgres_url
   ```
3. **Run migrations**:
   ```bash
   pnpm db:migrate
   ```

## Performance Optimization

### 1. Caching

#### Redis Setup (Recommended)

```bash
# Vercel Redis
REDIS_URL=rediss://username:password@hostname:port

# Or Upstash Redis
REDIS_URL=redis://username:password@hostname:port
```

#### Application-level Caching

The template includes built-in caching for:
- **User sessions**
- **Chat history**
- **Generated artifacts**

### 2. CDN and Static Assets

Vercel automatically handles:
- **Global CDN** for static assets
- **Image optimization**
- **Automatic compression**

For other platforms, configure:
- **CloudFront** (AWS)
- **Azure CDN** (Azure)  
- **Cloud CDN** (GCP)

### 3. Database Performance

```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check connection usage
SELECT count(*) as connections 
FROM pg_stat_activity;
```

## Monitoring and Analytics

### 1. Vercel Analytics

```bash
VERCEL_ANALYTICS_ID=your_analytics_id
```

Automatically tracks:
- **Page views**
- **User sessions** 
- **Performance metrics**

### 2. Application Monitoring

#### OpenTelemetry (Built-in)

```bash
OTEL_SERVICE_NAME="your-app-name"
OTEL_EXPORTER_OTLP_ENDPOINT="https://your-monitoring-service.com"
```

#### Custom Monitoring

Add monitoring services:
- **Sentry** for error tracking
- **DataDog** for APM
- **New Relic** for performance monitoring

### 3. Database Monitoring

Supabase provides built-in:
- **Query performance insights**
- **Connection monitoring**  
- **Resource usage tracking**

## Security Considerations

### 1. Environment Variables

- **Never commit** `.env.local` to version control
- **Use secure secrets** for AUTH_SECRET
- **Rotate API keys** regularly
- **Limit permissions** on service accounts

### 2. Database Security

- **Row Level Security (RLS)** is enabled by default
- **Regular security updates** via Supabase
- **Monitor access logs** for suspicious activity

### 3. API Security

- **Rate limiting** is built into the AI SDK
- **Input validation** on all endpoints
- **CORS protection** configured

### 4. Content Security

```javascript
// next.config.ts - Add security headers
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Backup and Recovery

### 1. Database Backups

#### Supabase (Automatic)
- **Daily automated backups** (Pro plan)
- **Point-in-time recovery** up to 7 days
- **Manual backup creation** available

#### Manual Backup
```bash
# Export schema and data
pg_dump "postgresql://user:pass@host:port/db" > backup.sql

# Restore from backup  
psql "postgresql://user:pass@host:port/db" < backup.sql
```

### 2. Application Backups

- **Git repository** contains all source code
- **Environment variables** backed up securely
- **File storage** handled by Vercel Blob (durable by default)

## Scaling Considerations

### 1. Horizontal Scaling

- **Vercel automatically scales** based on traffic
- **Database connection pooling** handles concurrent users
- **Edge functions** provide global performance

### 2. Vertical Scaling

- **Supabase compute scaling** available
- **Vercel Pro/Enterprise** for higher limits
- **Redis scaling** for caching needs

### 3. Cost Optimization

- **Monitor usage** regularly
- **Optimize database queries** 
- **Use caching** effectively
- **Right-size infrastructure**

## Troubleshooting Production Issues

### Common Issues

#### 1. Build Failures

```bash
# Check build logs
vercel logs your-deployment-url

# Common fixes:
# - Check TypeScript errors
# - Verify all dependencies are installed
# - Ensure environment variables are set
```

#### 2. Database Connection Issues

```bash
# Test connection manually
psql "YOUR_SUPABASE_URL"

# Check connection limits
SELECT count(*) FROM pg_stat_activity;
```

#### 3. API Rate Limits

- **Monitor API usage** in provider dashboards
- **Implement rate limiting** if needed
- **Add retry logic** for transient failures

#### 4. Memory Issues

- **Monitor Vercel function memory usage**
- **Optimize data processing**
- **Use streaming** for large responses

### Getting Help

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)  
- **AI SDK Issues**: [github.com/vercel/ai](https://github.com/vercel/ai)
- **Template Issues**: Check project repository

## Post-deployment Checklist

After successful deployment:

- [ ] **Test all functionality** in production
- [ ] **Monitor performance metrics**
- [ ] **Set up alerts** for errors and downtime  
- [ ] **Configure backups** and recovery procedures
- [ ] **Document deployment process** for team
- [ ] **Plan regular updates** and maintenance

## Next Steps

1. **Monitor application performance** using built-in tools
2. **Set up CI/CD pipeline** for automated deployments
3. **Implement additional monitoring** as needed
4. **Plan for scaling** based on usage patterns
5. **Regular security reviews** and updates

For customizing your deployed application, see [Customization Guide](../guides/customization.md).