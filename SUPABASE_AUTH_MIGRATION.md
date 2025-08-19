# Supabase Auth Migration Plan for HomeFax

## 🎯 Executive Summary

**Critical Security Issue:** Current NextAuth setup cannot support Row Level Security (RLS) for sensitive insurance data. All database queries run through a single service role connection, making proper multi-tenant security impossible.

**Solution:** Migrate to Supabase Auth to enable database-level RLS policies for compliance with insurance data regulations.

**Timeline:** 4 weeks (complete before Valor Insurance pilot)

---

## 🚨 Why This Migration is Critical

### Current Security Risk

- **No RLS Protection:** All users can potentially access all data
- **Single Point of Failure:** Security only at application level
- **Compliance Risk:** Insurance regulations require defense-in-depth security
- **Multi-tenant Issues:** Cannot properly isolate agency data

### Sensitive Data Requiring Protection

```typescript
// These tables contain PII and sensitive insurance data:
policies: {
  (policyNumber,
    carrier,
    property,
    coverages,
    deductibles,
    premium,
    rawData,
    documents);
}

policyholders: {
  (firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    mailingAddress,
    additionalInfo);
}
```

---

## 📋 Migration Plan Overview

### Phase 1: Setup & Configuration (Week 1)

- [ ] Configure Supabase Auth
- [ ] Set up RLS policies
- [ ] Create user migration scripts
- [ ] Update environment configuration

### Phase 2: Code Migration (Week 2)

- [ ] Replace NextAuth with Supabase Auth
- [ ] Update middleware and session management
- [ ] Migrate server actions and API routes
- [ ] Update client-side components

### Phase 3: Data Migration & Testing (Week 3)

- [ ] Migrate existing users to Supabase Auth
- [ ] Test RLS policies thoroughly
- [ ] Update database queries to use user context
- [ ] Comprehensive security testing

### Phase 4: Deployment & Validation (Week 4)

- [ ] Deploy to staging environment
- [ ] Performance testing
- [ ] Security audit
- [ ] Production deployment

---

## 🔧 Technical Implementation Details

### 1. Supabase Configuration

#### Environment Variables

```bash
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Install Dependencies

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm remove next-auth bcrypt-ts
```

### 2. Database Schema Updates

#### User Management Migration

```sql
-- Supabase automatically creates auth.users table
-- Create profile table to extend user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  user_type TEXT DEFAULT 'regular',
  agency_id UUID REFERENCES agencies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile access policy
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
```

#### Update Existing Tables

```sql
-- Add user_id columns to existing tables
ALTER TABLE policies ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE policyholders ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE chats ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable RLS on sensitive tables
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policyholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
```

### 3. RLS Policies Implementation

#### Agency-Level Data Isolation

```sql
-- Policies: Agency members can access agency policies
CREATE POLICY "agency_policy_access" ON policies
FOR ALL USING (
  agency_id IN (
    SELECT agency_id FROM profiles WHERE id = auth.uid()
  )
);

-- Policyholders: Users can only access their own data
CREATE POLICY "policyholder_own_data" ON policyholders
FOR ALL USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.agency_id = policyholders.agency_id
  )
);

-- Chats: Users can only access their own chats
CREATE POLICY "user_chat_access" ON chats
FOR ALL USING (auth.uid()::text = user_id);
```

#### Admin Override Policies

```sql
-- Super admin access (for HomeFax team)
CREATE POLICY "admin_full_access" ON policies
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);
```

### 4. Code Migration

#### Replace NextAuth Configuration

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

// lib/supabase/server.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};
```

#### Update Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Allow unauthenticated access to login/register
  if (["/login", "/register"].includes(req.nextUrl.pathname)) {
    return res;
  }

  // Redirect to login if no session
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
```

#### Update Server Actions

```typescript
// app/(auth)/actions.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const login = async (formData: FormData) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { status: "failed" };
  }

  return { status: "success" };
};

export const register = async (formData: FormData) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { status: "failed" };
  }

  return { status: "success" };
};
```

#### Update Client Components

```typescript
// components/sidebar-user-nav.tsx
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export function SidebarUserNav() {
  const supabase = useSupabaseClient()
  const user = useUser()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    // Component JSX with user?.email and handleSignOut
  )
}
```

#### Update Database Queries

```typescript
// lib/db/queries.ts - Update to use RLS
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserPolicies() {
  const supabase = createServerSupabaseClient();

  // RLS automatically filters by user context
  const { data, error } = await supabase.from("policies").select("*");

  if (error) throw error;
  return data;
}

export async function saveChat({
  id,
  title,
  visibility,
}: {
  id: string;
  title: string;
  visibility: string;
}) {
  const supabase = createServerSupabaseClient();

  // user_id automatically set by RLS context
  const { error } = await supabase
    .from("chats")
    .insert({ id, title, visibility });

  if (error) throw error;
}
```

### 5. User Migration Script

```typescript
// scripts/migrate-users.ts
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function migrateUsers() {
  // Get existing users from NextAuth
  const existingUsers = await db.select().from(user);

  for (const user of existingUsers) {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: generateTemporaryPassword(), // Force password reset
      email_confirm: true,
    });

    if (error) {
      console.error(`Failed to migrate user ${user.email}:`, error);
      continue;
    }

    // Create profile record
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: user.email,
      user_type: "regular",
    });

    // Update foreign key references
    await db
      .update(chat)
      .set({ user_id: data.user.id })
      .where(eq(chat.userId, user.id));
  }
}
```

---

## 🧪 Testing Strategy

### 1. RLS Policy Testing

```sql
-- Test as different users
SET request.jwt.claims TO '{"sub": "user-id-1", "email": "agent@agency1.com"}';
SELECT * FROM policies; -- Should only see agency1 policies

SET request.jwt.claims TO '{"sub": "user-id-2", "email": "agent@agency2.com"}';
SELECT * FROM policies; -- Should only see agency2 policies
```

### 2. Security Testing Checklist

- [ ] Users cannot access other agencies' data
- [ ] Policyholders can only see their own policies
- [ ] Admin users have appropriate access levels
- [ ] API endpoints respect RLS policies
- [ ] Direct database access is properly restricted

### 3. Performance Testing

- [ ] RLS policies don't significantly impact query performance
- [ ] Proper indexes exist for RLS filter columns
- [ ] Connection pooling works correctly

---

## ⚠️ Important Considerations

### Security

- **Never use service role key in client-side code**
- **Always test RLS policies thoroughly**
- **Implement proper error handling for auth failures**
- **Use HTTPS in production**

### Data Migration

- **Backup all data before migration**
- **Plan for user password resets**
- **Maintain audit trail of migration**
- **Test rollback procedures**

### Performance

- **RLS policies add WHERE clauses to queries**
- **Ensure proper indexing on user_id and agency_id columns**
- **Monitor query performance after migration**

### Compliance

- **Document security measures for insurance regulations**
- **Implement audit logging**
- **Regular security reviews**

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] RLS policies validated
- [ ] User migration script tested
- [ ] Rollback plan prepared
- [ ] Team training completed

### Deployment Day

- [ ] Maintenance window scheduled
- [ ] Database backup completed
- [ ] User migration executed
- [ ] Application deployed
- [ ] Smoke tests passed
- [ ] User notifications sent

### Post-Deployment

- [ ] Monitor error rates
- [ ] Validate security policies
- [ ] Performance monitoring
- [ ] User feedback collection

---

## 📞 Support & Resources

### Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

### Team Contacts

- **Technical Lead:** [Assign team member]
- **Security Review:** [Assign team member]
- **Database Migration:** [Assign team member]
- **Testing Lead:** [Assign team member]

---

## 🎯 Success Criteria

### Security

- ✅ All sensitive data protected by RLS
- ✅ Multi-tenant isolation working correctly
- ✅ No cross-agency data leakage
- ✅ Compliance requirements met

### Functionality

- ✅ All existing features working
- ✅ User authentication seamless
- ✅ Performance within acceptable limits
- ✅ Error handling robust

### Business

- ✅ Ready for Valor Insurance pilot
- ✅ Scalable for multiple agencies
- ✅ Audit trail compliance
- ✅ Team confidence in security

---

**Priority Level:** 🚨 **CRITICAL** - Must complete before Valor Insurance pilot

**Estimated Effort:** 4 weeks (2 developers)

**Risk Level:** Medium (with proper testing and rollback plan)
