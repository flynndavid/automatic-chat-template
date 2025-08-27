# Troubleshooting Guide

Common issues and solutions for local Supabase development.

## Quick Diagnostics

### Check System Status

```bash
# Check if Docker is running
docker --version
docker ps

# Check Supabase status
pnpm supabase:status

# Check environment variables
echo $POSTGRES_URL
```

### Test Connections

```bash
# Test database connection
psql "postgresql://postgres:postgres@localhost:54322/postgres" -c "SELECT version();"

# Test Supabase API
curl http://localhost:54321/rest/v1/ -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

## Common Issues

### 1. Docker Issues

#### Problem: "Cannot connect to the Docker daemon"
```bash
Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solution:**
- Ensure Docker Desktop is installed and running
- Restart Docker Desktop if needed
- Check Docker permissions: `sudo usermod -aG docker $USER` (Linux)

#### Problem: "Port already in use"
```bash
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using the port
lsof -i :54321  # or :54322, :54323

# Kill the process
kill -9 <PID>

# Or use different ports in supabase/config.toml
[api]
port = 54325
```

### 2. Supabase CLI Issues

#### Problem: "Command not found: supabase"
**Solution:**
```bash
# Install locally
pnpm install supabase --save-dev

# Or install globally
npm install -g supabase
```

#### Problem: "Project not linked"
```bash
Error: Cannot find project ref. Have you run supabase link?
```

**Solution:**
```bash
# For local development, this is expected
# Use local commands instead:
pnpm supabase:status  # Not: npx supabase migration list
```

### 3. Database Issues

#### Problem: "SSL connection error"
```bash
Error: Client network socket disconnected before secure TLS connection
```

**Solution:**
Verify your SSL configuration is correct:

```typescript
// Should be in lib/db/migrate.ts and lib/db/queries.ts
const isLocal = process.env.POSTGRES_URL!.includes('localhost') || 
                process.env.POSTGRES_URL!.includes('127.0.0.1');
const ssl = isLocal ? false : 'require';
```

#### Problem: "Database migration fails"
```bash
Error: cannot drop table "User" because other objects depend on it
```

**Solution:**
```bash
# Reset the database completely
pnpm supabase:reset

# If that fails, stop and restart
pnpm supabase:stop
docker system prune -f  # Warning: removes all unused Docker objects
pnpm supabase:start
```

#### Problem: "POSTGRES_URL is not defined"
**Solution:**
- Check your `.env.local` file exists
- Verify POSTGRES_URL is set correctly
- Ensure no typos in variable name

### 4. Environment Issues

#### Problem: "Environment variables not loading"
**Solution:**
```bash
# Check file exists and has correct name
ls -la .env.local

# Check Next.js is loading it
# Add to next.config.ts:
console.log('POSTGRES_URL:', process.env.POSTGRES_URL);
```

#### Problem: "Wrong Supabase keys"
**Solution:**
```bash
# Get fresh keys from local instance
pnpm supabase:status
# Copy the anon key and service_role key to .env.local
```

### 5. Application Issues

#### Problem: "Build fails with Supabase imports"
```bash
Error: Unable to resolve path to module '@supabase/ssr'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Problem: "Auth not working locally"
**Solution:**
- Check `site_url` in `supabase/config.toml` matches your app URL
- Verify `AUTH_SECRET` is set in `.env.local`
- Ensure auth tables exist in local database

### 6. Performance Issues

#### Problem: "Slow container startup"
**Solution:**
```bash
# Allocate more resources to Docker Desktop
# Settings > Resources > Advanced
# Increase Memory to 4GB+ and CPU to 4+

# Or reduce Supabase services in config.toml
[inbucket]
enabled = false
[analytics]  
enabled = false
```

#### Problem: "High disk usage"
**Solution:**
```bash
# Clean up Docker
docker system prune -a

# Remove old Supabase volumes
docker volume ls --filter label=com.supabase.cli.project
docker volume rm <volume_name>
```

## Reset Procedures

### Soft Reset (Keep Data)
```bash
pnpm supabase:restart
```

### Hard Reset (Fresh Start)
```bash
pnpm supabase:stop
pnpm supabase:start
# Re-apply your schema manually or via migrations
```

### Nuclear Reset (Clean Everything)
```bash
pnpm supabase:stop
docker system prune -a -f
docker volume prune -f
rm .env.local
pnpm supabase:start
cp .env.local.example .env.local
# Edit .env.local with new values from supabase:start
```

## Port Reference

| Service | Default Port | Alternative | Purpose |
|---------|--------------|-------------|---------|
| Supabase API | 54321 | 54325 | REST API, Auth, Realtime |
| PostgreSQL | 54322 | 54326 | Database server |
| Studio | 54323 | 54327 | Web admin interface |
| Inbucket | 54324 | 54328 | Email testing |
| Analytics | 54327 | 54329 | Analytics server |

## Log Files

### View Supabase Logs
```bash
# All services
docker logs supabase_db_automatic-chat-template

# Specific service
docker logs supabase_studio_automatic-chat-template
docker logs supabase_kong_automatic-chat-template
```

### Application Logs
```bash
# Next.js development logs
pnpm dev 2>&1 | tee app.log

# Database connection logs
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM pg_stat_activity;"
```

## Environment Validation

Create a simple test script:

```javascript
// test-env.js
require('dotenv').config({ path: '.env.local' });

const required = [
  'POSTGRES_URL',
  'NEXT_PUBLIC_SUPABASE_URL', 
  'SUPABASE_ANON_KEY',
  'AUTH_SECRET'
];

required.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing: ${key}`);
  } else {
    console.log(`✅ Found: ${key}`);
  }
});
```

Run with: `node test-env.js`

## Getting Help

### Community Resources
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Documentation](https://supabase.com/docs)

### Debugging Information to Include
When asking for help, include:

```bash
# System info
uname -a                    # OS version
docker --version           # Docker version
node --version             # Node.js version
pnpm --version             # Package manager

# Supabase info
pnpm supabase --version    # CLI version
pnpm supabase:status       # Service status
docker ps                  # Running containers

# Error logs
docker logs supabase_db_automatic-chat-template 2>&1 | tail -50
```

### Common Error Patterns

| Error Pattern | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `ECONNREFUSED` | Service not running | `pnpm supabase:start` |
| `EADDRINUSE` | Port conflict | Change ports in config |
| `SSL: WRONG_VERSION_NUMBER` | SSL misconfiguration | Check local SSL settings |
| `POSTGRES_URL is not defined` | Missing env vars | Check `.env.local` |
| `Cannot find module '@supabase/*'` | Missing dependencies | `pnpm install` |

## Prevention Tips

1. **Always check Docker first** - 90% of issues stem from Docker not running
2. **Use version control** - Commit working configurations
3. **Document changes** - Note custom configurations in your README
4. **Regular cleanup** - Run `docker system prune` weekly
5. **Environment consistency** - Use the same Node.js/Docker versions across your team