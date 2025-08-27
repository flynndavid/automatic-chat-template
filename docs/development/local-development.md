# Local Development with Supabase

This guide shows you how to set up and run the application with local Supabase for development.

## Why Local Supabase?

- **Faster Development**: No network latency for database operations
- **Offline Development**: Work without internet connectivity  
- **Cost Savings**: No database usage charges during development
- **Safe Testing**: Isolated environment for experiments
- **Version Control**: Database schema managed via migrations

## Prerequisites

Before starting, ensure you have:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Node.js and pnpm installed
- The project dependencies installed (`pnpm install`)

## Quick Start

### 1. Start Local Supabase Stack

```bash
# Start all Supabase services locally
pnpm supabase:start
```

This will:
- Download and start Docker containers for PostgreSQL, Auth, API, and Studio
- Create a local database at `localhost:54322`  
- Start the Supabase API at `localhost:54321`
- Launch Supabase Studio at `localhost:54323`

### 2. Configure Environment Variables

Copy the local environment template:

```bash
cp .env.local.example .env.local
```

After running `pnpm supabase:start`, you'll see output like this:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Update your `.env.local` with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=<anon key from output>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from output>
POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

### 3. Run Database Migrations

Apply your database schema to the local database:

```bash
pnpm db:migrate
```

This will create all the necessary tables and relationships in your local PostgreSQL instance.

### 4. Start the Application

```bash
# Start the Next.js development server
pnpm dev

# OR start both Supabase and Next.js together
pnpm dev:local
```

Your application will be available at `http://localhost:3000`.

## Development Workflow

### Daily Development

1. **Start your day**:
   ```bash
   pnpm supabase:start  # Start Supabase stack
   pnpm dev            # Start Next.js app
   ```

2. **End your day**:
   ```bash
   pnpm supabase:stop   # Stop Supabase stack to free resources
   ```

### Database Changes

When you make database changes:

```bash
# Generate a new migration
npx supabase migration new your_migration_name

# Edit the generated SQL file in supabase/migrations/

# Apply the migration locally
pnpm supabase:reset

# Test your changes
pnpm dev
```

### Viewing Your Database

- **Supabase Studio**: http://localhost:54323 (Web-based GUI)
- **Direct PostgreSQL**: Use any PostgreSQL client with:
  - Host: `localhost`
  - Port: `54322`
  - Database: `postgres`
  - Username: `postgres`
  - Password: `postgres`

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm supabase:start` | Start local Supabase stack |
| `pnpm supabase:stop` | Stop local Supabase stack |
| `pnpm supabase:restart` | Restart Supabase stack |
| `pnpm supabase:status` | Show status of running services |
| `pnpm supabase:reset` | Reset database and apply all migrations |
| `pnpm supabase:studio` | Open Supabase Studio in browser |
| `pnpm dev:local` | Start Supabase + Next.js together |

## Switching Between Local and Hosted

### To use Local Supabase:
1. Use `.env.local` with local URLs and keys
2. Ensure Docker is running
3. Run `pnpm supabase:start`

### To use Hosted Supabase:
1. Update `.env.local` with your hosted project URLs and keys (from your Supabase dashboard)
2. No need to run local Supabase

## Architecture Notes

`★ Insight ─────────────────────────────────────`
**Hybrid Database Setup**: This application uses both Supabase Auth/client libraries AND direct PostgreSQL connections. This makes local development easier because most database operations go directly to PostgreSQL, while auth and real-time features use Supabase's APIs.
`─────────────────────────────────────────────────`

- **Authentication**: Uses Supabase Auth (works seamlessly with local instance)
- **Database Operations**: Direct PostgreSQL via Drizzle ORM  
- **Real-time Features**: Supabase Realtime (if using subscriptions)
- **File Storage**: Supabase Storage (local file system when running locally)

## Troubleshooting

### Docker Issues
- Ensure Docker Desktop is running
- Check available disk space (Supabase needs ~1GB)
- Try `docker system prune` to free up space

### Port Conflicts
- Default ports: 54321 (API), 54322 (DB), 54323 (Studio)
- Modify ports in `supabase/config.toml` if needed

### Database Connection Issues
- Verify `.env.local` has correct `POSTGRES_URL`
- Check that migrations have been applied with `pnpm db:migrate`
- Try resetting with `pnpm supabase:reset`

### Starting Fresh
If you need to completely reset:

```bash
pnpm supabase:stop
docker system prune -f
pnpm supabase:start
pnpm db:migrate
```

## Production Deployment

When ready to deploy:

1. Create a hosted Supabase project
2. Use `.env.example` as template for production environment variables  
3. Run migrations against production: `npx supabase db push`
4. Deploy your application with production environment variables

The local development setup is completely isolated from production, so you can develop safely without affecting live data.

## Configuration Details

### Environment Variable Reference

| Variable | Local Value | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` | Public Supabase API endpoint |
| `SUPABASE_URL` | `http://127.0.0.1:54321` | Server-side Supabase URL |
| `SUPABASE_ANON_KEY` | From CLI output | Public API key for client requests |
| `SUPABASE_SERVICE_ROLE_KEY` | From CLI output | Admin API key for server operations |
| `POSTGRES_URL` | `postgresql://postgres:postgres@localhost:54322/postgres` | Direct database connection |
| `AUTH_SECRET` | Your generated secret | NextAuth session encryption |

### SSL Configuration

The application automatically detects local vs hosted environments:

```typescript
// Auto-detection logic in lib/db/migrate.ts and lib/db/queries.ts
const isLocal = process.env.POSTGRES_URL.includes('localhost') || 
                process.env.POSTGRES_URL.includes('127.0.0.1');
const ssl = isLocal ? false : 'require';
```

### File Structure After Setup

```
your-project/
├── supabase/
│   ├── config.toml          # Supabase configuration
│   └── migrations/          # Auto-generated migrations
├── .env.local              # Your local environment variables
├── .env.local.example      # Template for local development
├── .env.example           # Template for production
└── LOCAL_DEVELOPMENT.md   # This file
```

## Advanced Configuration

### Custom Supabase Services

Edit `supabase/config.toml` to customize local services:

```toml
# Change default ports if needed
[api]
port = 54321

[db] 
port = 54322

[studio]
port = 54323

# Enable additional features
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_SECRET)"
```

### Database Seeding

Create `supabase/seed.sql` to populate your local database:

```sql
-- Example seed data
INSERT INTO public.profiles (id, email, full_name) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'test@example.com', 'Test User'),
  ('22222222-2222-2222-2222-222222222222', 'demo@example.com', 'Demo User');
```

### Performance Tuning

For faster startup times:

```toml
# In supabase/config.toml
[db]
# Reduce memory usage
shared_preload_libraries = ""

[auth]
# Disable unused features  
enable_signup = false
enable_anonymous_sign_ins = false
```