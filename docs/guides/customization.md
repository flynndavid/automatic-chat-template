# Customization Guide

This guide shows you how to customize and extend the Automatic Chat Template to fit your specific needs, from UI modifications to adding new AI providers and custom functionality.

## Overview

The template is designed to be highly customizable with a modular architecture:

- **UI Components**: Modern shadcn/ui components with Tailwind CSS
- **AI Providers**: Pluggable AI providers via Vercel AI SDK
- **Database Schema**: Extendable with Drizzle ORM
- **Custom Tools**: Extensible AI tool system
- **Workflows**: n8n integration for complex automation

## UI Customization

### Theme and Branding

#### 1. App Branding

Update your app's identity in environment variables:

```bash
# .env.local
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_DESCRIPTION="Your custom description"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

#### 2. Color Scheme

Customize colors in `app/globals.css`:

```css
@layer base {
  :root {
    /* Light mode colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    
    /* Add your custom colors */
    --brand: 200 100% 50%;
    --brand-foreground: 0 0% 100%;
  }
  
  .dark {
    /* Dark mode colors */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    /* Custom dark mode colors */
    --brand: 200 100% 40%;
    --brand-foreground: 0 0% 100%;
  }
}
```

Then use in your Tailwind classes:
```html
<button className="bg-brand text-brand-foreground">
  Custom Button
</button>
```

#### 3. Typography

Add custom fonts in `app/layout.tsx`:

```tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      {/* ... */}
    </html>
  );
}
```

Update `tailwind.config.ts`:
```ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      }
    }
  }
};
```

### Component Customization

#### 1. Chat Interface

Customize the main chat component in `components/chat.tsx`:

```tsx
// Add custom message types
type CustomMessageType = 'system' | 'user' | 'assistant' | 'custom';

// Customize message rendering
function MessageRenderer({ message }: { message: Message }) {
  if (message.role === 'custom') {
    return <CustomMessageComponent message={message} />;
  }
  
  return <DefaultMessageComponent message={message} />;
}

// Add custom toolbar actions
function CustomChatToolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={() => handleCustomAction()}
      >
        Custom Action
      </Button>
      {/* Add more custom tools */}
    </div>
  );
}
```

#### 2. Sidebar Customization

Modify `components/app-sidebar.tsx`:

```tsx
// Add custom navigation items
const customNavItems = [
  {
    title: "Custom Feature",
    icon: CustomIcon,
    href: "/custom-feature",
  },
  // Add more items
];

// Custom user menu options
function CustomUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Custom Option 1</DropdownMenuItem>
        <DropdownMenuItem>Custom Option 2</DropdownMenuItem>
        {/* Add more options */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### 3. Welcome/Greeting Customization

Update `components/greeting.tsx`:

```tsx
export function CustomGreeting() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <p className="leading-normal text-muted-foreground">
          Your custom welcome message here.
        </p>
        
        {/* Custom quick actions */}
        <div className="mt-4 flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('action1')}
          >
            Quick Action 1
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('action2')}
          >
            Quick Action 2
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Layout Customization

#### 1. Main Layout

Modify `app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {/* Add custom header */}
          <CustomHeader />
          
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Add custom footer */}
          <CustomFooter />
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 2. Chat Layout

Customize `app/(chat)/layout.tsx`:

```tsx
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Custom sidebar */}
      <CustomSidebar />
      
      <div className="flex-1">
        {/* Custom header bar */}
        <CustomChatHeader />
        
        {/* Main content */}
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Adding AI Providers

### 1. Configure New Provider

Add to `lib/ai/providers.ts`:

```tsx
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const myProvider = customProvider({
  languageModels: {
    // Add new providers
    'claude-3-haiku': anthropic('claude-3-haiku-20240307'),
    'gpt-4-turbo': openai('gpt-4-turbo'),
    'gemini-pro': google('gemini-pro'),
    
    // Keep existing
    'chat-model': xai('grok-2-vision-1212'),
    'title-model': xai('grok-2-1212'),
    'artifact-model': xai('grok-2-1212'),
  },
  imageModels: {
    'dall-e-3': openai.imageModel('dall-e-3'),
    'small-model': xai.imageModel('grok-2-image'),
  },
});
```

### 2. Model Selection UI

Create a model selector component:

```tsx
// components/model-selector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AVAILABLE_MODELS = [
  { id: 'grok-2-vision', name: 'Grok 2 Vision', provider: 'xAI' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

export function ModelSelector({ 
  value, 
  onValueChange 
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col items-start">
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground">
                {model.provider}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 3. Provider-Specific Configuration

Add environment variables and configuration:

```bash
# .env.local - Add new provider keys
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key
```

Update model configuration based on provider:

```tsx
// lib/ai/config.ts
export const getModelConfig = (modelId: string) => {
  const configs = {
    'claude-3-haiku': {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1,
    },
    'gpt-4-turbo': {
      temperature: 0.8,
      maxTokens: 4096,
      topP: 1,
    },
    'gemini-pro': {
      temperature: 0.9,
      maxTokens: 2048,
      topK: 40,
    },
  };
  
  return configs[modelId] || {};
};
```

## Database Schema Extensions

### 1. Add New Tables

Create migration files in `lib/db/migrations/`:

```sql
-- 0006_add_custom_features.sql
CREATE TABLE IF NOT EXISTS "user_preferences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "theme" varchar DEFAULT 'system',
  "language" varchar DEFAULT 'en',
  "ai_model" varchar DEFAULT 'grok-2-vision',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own preferences" ON "user_preferences"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON "user_preferences"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON "user_preferences"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2. Update Schema Definition

Add to `lib/db/schema.ts`:

```ts
export const userPreferences = pgTable(
  'user_preferences',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => profiles.id, {
      onDelete: 'cascade'
    }),
    theme: varchar().default('system'),
    language: varchar().default('en'),
    aiModel: varchar('ai_model').default('grok-2-vision'),
    createdAt: timestamp('created_at', { 
      withTimezone: true, 
      mode: 'string' 
    }).defaultNow(),
    updatedAt: timestamp('updated_at', { 
      withTimezone: true, 
      mode: 'string' 
    }).defaultNow(),
  }
);

// Add relations
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  profile: one(profiles, {
    fields: [userPreferences.userId],
    references: [profiles.id],
  }),
}));
```

### 3. Create Database Queries

Add to `lib/db/queries.ts`:

```ts
export async function getUserPreferences(userId: string) {
  return await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
}

export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<typeof userPreferences.$inferSelect>
) {
  return await db
    .update(userPreferences)
    .set({ 
      ...preferences, 
      updatedAt: new Date().toISOString() 
    })
    .where(eq(userPreferences.userId, userId));
}

export async function createUserPreferences(
  userId: string, 
  preferences: Partial<typeof userPreferences.$inferSelect>
) {
  return await db
    .insert(userPreferences)
    .values({ 
      userId, 
      ...preferences 
    })
    .returning();
}
```

## Custom AI Tools

### 1. Create Custom Tools

Add new tools in `lib/ai/tools/`:

```ts
// lib/ai/tools/custom-calculator.ts
import { tool } from 'ai';
import { z } from 'zod';

export const customCalculator = tool({
  description: 'Perform complex mathematical calculations',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
    precision: z.number().optional().describe('Decimal precision (default: 2)'),
  }),
  execute: async ({ expression, precision = 2 }) => {
    try {
      // Use a safe math evaluator (e.g., mathjs)
      const math = await import('mathjs');
      const result = math.evaluate(expression);
      
      return {
        result: Number(result).toFixed(precision),
        expression,
        success: true,
      };
    } catch (error) {
      return {
        error: 'Invalid mathematical expression',
        expression,
        success: false,
      };
    }
  },
});
```

```ts
// lib/ai/tools/external-api.ts
import { tool } from 'ai';
import { z } from 'zod';

export const externalApiTool = tool({
  description: 'Query external API for data',
  parameters: z.object({
    endpoint: z.string().describe('API endpoint to query'),
    method: z.enum(['GET', 'POST']).default('GET'),
    params: z.record(z.string()).optional(),
  }),
  execute: async ({ endpoint, method, params }) => {
    try {
      const url = new URL(endpoint);
      if (params && method === 'GET') {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify(params) : undefined,
      });
      
      const data = await response.json();
      
      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});
```

### 2. Register Tools

Update your chat route to include custom tools:

```ts
// app/(chat)/api/chat/route.ts
import { customCalculator } from '@/lib/ai/tools/custom-calculator';
import { externalApiTool } from '@/lib/ai/tools/external-api';

export async function POST(request: Request) {
  // ... existing code ...
  
  const result = streamText({
    model: myProvider('chat-model'),
    messages: coreMessages,
    tools: {
      // Existing tools
      createDocument,
      updateDocument,
      requestSuggestions,
      getWeather,
      
      // Custom tools
      customCalculator,
      externalApiTool,
    },
    // ... rest of config
  });
  
  // ... rest of handler
}
```

## Adding Custom Pages

### 1. Create New Routes

Add pages in the `app/` directory:

```tsx
// app/settings/page.tsx
import { getUserPreferences } from '@/lib/db/queries';
import { SettingsForm } from '@/components/settings-form';

export default async function SettingsPage() {
  // Get user from auth
  const user = await getCurrentUser();
  const preferences = await getUserPreferences(user.id);
  
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingsForm 
        initialPreferences={preferences[0]} 
        userId={user.id}
      />
    </div>
  );
}
```

### 2. Create Custom Components

```tsx
// components/settings-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SettingsForm({ initialPreferences, userId }) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences }),
      });
      
      if (response.ok) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select 
          value={preferences.theme} 
          onValueChange={(value) => setPreferences(p => ({ ...p, theme: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="aiModel">Default AI Model</Label>
        <Select 
          value={preferences.aiModel} 
          onValueChange={(value) => setPreferences(p => ({ ...p, aiModel: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grok-2-vision">Grok 2 Vision</SelectItem>
            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
}
```

### 3. Add API Routes

```ts
// app/api/user/preferences/route.ts
import { updateUserPreferences, createUserPreferences } from '@/lib/db/queries';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const { preferences } = await request.json();
    
    // Try to update, create if doesn't exist
    let result;
    try {
      result = await updateUserPreferences(user.id, preferences);
    } catch {
      result = await createUserPreferences(user.id, preferences);
    }
    
    return Response.json({ success: true, preferences: result });
  } catch (error) {
    console.error('Settings update error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

## Advanced Customizations

### 1. Custom Authentication

Extend the authentication system:

```tsx
// lib/auth/custom-providers.ts
import { Provider } from '@supabase/supabase-js';

export const customAuthProviders: Provider[] = [
  'google',
  'github',
  'discord', // Add custom OAuth providers
  'microsoft',
];

// Custom auth handling
export async function signInWithCustomProvider(provider: Provider) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // Custom OAuth parameters
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  return { data, error };
}
```

### 2. Custom Middleware

Add custom request processing:

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // ... existing auth middleware ...
  
  // Add custom middleware logic
  const customHeader = request.headers.get('x-custom-header');
  if (customHeader) {
    // Process custom requests
    return NextResponse.redirect('/custom-handler');
  }
  
  // Rate limiting
  const clientIP = request.ip || request.headers.get('x-forwarded-for');
  if (await isRateLimited(clientIP)) {
    return new Response('Rate limited', { status: 429 });
  }
  
  return response;
}
```

### 3. Custom File Handling

Extend file upload capabilities:

```ts
// lib/files/custom-handlers.ts
export async function processCustomFile(file: File) {
  const fileType = file.type;
  
  switch (fileType) {
    case 'application/pdf':
      return await processPDF(file);
    case 'text/csv':
      return await processCSV(file);
    case 'application/json':
      return await processJSON(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function processPDF(file: File) {
  // Use pdf-parse or similar
  const pdfParse = await import('pdf-parse');
  const buffer = await file.arrayBuffer();
  const data = await pdfParse(Buffer.from(buffer));
  
  return {
    type: 'pdf',
    content: data.text,
    pages: data.numpages,
    metadata: data.info,
  };
}

async function processCSV(file: File) {
  // Use papaparse
  const Papa = await import('papaparse');
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        resolve({
          type: 'csv',
          data: results.data,
          errors: results.errors,
          meta: results.meta,
        });
      },
      error: reject,
    });
  });
}
```

## Testing Custom Features

### 1. Unit Testing

Create tests for custom components:

```ts
// tests/components/custom-component.test.ts
import { render, screen } from '@testing-library/react';
import { CustomComponent } from '@/components/custom-component';

describe('CustomComponent', () => {
  it('renders correctly', () => {
    render(<CustomComponent />);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    render(<CustomComponent />);
    const button = screen.getByRole('button');
    
    await userEvent.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

Test custom API routes:

```ts
// tests/api/custom-route.test.ts
import { POST } from '@/app/api/custom/route';
import { createMocks } from 'node-mocks-http';

describe('/api/custom', () => {
  it('handles valid requests', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: { data: 'test' },
    });
    
    const response = await POST(req as any);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

### 3. E2E Testing

Add Playwright tests for custom features:

```ts
// tests/e2e/custom-feature.test.ts
import { test, expect } from '@playwright/test';

test.describe('Custom Feature', () => {
  test('completes custom workflow', async ({ page }) => {
    await page.goto('/custom-feature');
    
    await page.fill('[data-testid=custom-input]', 'test data');
    await page.click('[data-testid=submit-button]');
    
    await expect(page.locator('[data-testid=result]')).toHaveText('Success');
  });
});
```

## Performance Optimization

### 1. Component Optimization

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});

// Use Suspense for code splitting
const LazyComponent = lazy(() => import('./CustomComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2. Database Optimization

```ts
// Add indexes for custom queries
export const customIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_custom_table_user_id ON custom_table(user_id);',
  'CREATE INDEX IF NOT EXISTS idx_custom_table_created_at ON custom_table(created_at);',
];

// Use prepared statements
const getUserDataQuery = db
  .select()
  .from(customTable)
  .where(eq(customTable.userId, placeholder('userId')))
  .prepare();

export async function getUserData(userId: string) {
  return await getUserDataQuery.execute({ userId });
}
```

## Deployment Considerations

### 1. Environment-Specific Configuration

```ts
// lib/config.ts
export const getConfig = () => {
  const env = process.env.NODE_ENV;
  
  return {
    development: {
      apiUrl: 'http://localhost:3000',
      debug: true,
      rateLimits: {
        requests: 1000,
        window: '1h',
      },
    },
    production: {
      apiUrl: process.env.NEXT_PUBLIC_APP_URL,
      debug: false,
      rateLimits: {
        requests: 100,
        window: '1h',
      },
    },
  }[env] || {};
};
```

### 2. Feature Flags

```ts
// lib/features.ts
export const featureFlags = {
  customFeature: process.env.ENABLE_CUSTOM_FEATURE === 'true',
  betaFeatures: process.env.ENABLE_BETA === 'true',
  advancedTools: process.env.ENABLE_ADVANCED_TOOLS === 'true',
};

// Use in components
function CustomFeature() {
  if (!featureFlags.customFeature) {
    return null;
  }
  
  return <div>Custom feature content</div>;
}
```

## Best Practices

### 1. Code Organization

- **Separate concerns**: Keep components, utilities, and business logic separate
- **Use TypeScript**: Leverage type safety for better development experience
- **Follow naming conventions**: Use consistent naming across your codebase
- **Document complex logic**: Add comments and documentation for custom features

### 2. State Management

```tsx
// Use Zustand for complex state management
import { create } from 'zustand';

interface CustomState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  updateData: (id: string, updates: any) => void;
}

export const useCustomStore = create<CustomState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/custom-data');
      const data = await response.json();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateData: (id, updates) => {
    const { data } = get();
    const newData = data.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    set({ data: newData });
  },
}));
```

### 3. Error Handling

```tsx
// Create custom error boundary
class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Custom feature error:', error, errorInfo);
    // Send to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <CustomErrorFallback />;
    }
    
    return this.props.children;
  }
}

// Use try-catch in async operations
async function handleCustomAction() {
  try {
    await performCustomOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    toast.error('Operation failed. Please try again.');
  }
}
```

## Getting Help

- **Template Documentation**: Review other documentation files
- **Component Library**: [ui.shadcn.com](https://ui.shadcn.com)
- **AI SDK**: [sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

For deployment of your customized template, see [Production Deployment Guide](../deployment/production.md).