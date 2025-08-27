# API Integration Guide

Learn how to integrate additional APIs and services with your chat application.

## Overview

The Automatic Chat Template is designed to be extensible. You can easily add new AI providers, external APIs, and custom integrations to enhance your chat experience.

## Adding New AI Providers

### Step 1: Install Provider Package

Most AI providers have SDK packages you can install:

```bash
# Examples of popular AI SDKs
pnpm add @ai-sdk/cohere        # Cohere
pnpm add @ai-sdk/mistral       # Mistral AI
pnpm add @ai-sdk/perplexity    # Perplexity
pnpm add ollama-ai-provider    # Ollama (local models)
```

### Step 2: Configure Environment Variables

Add the provider's API key to your environment files:

```bash
# In .env.local and .env.example
COHERE_API_KEY=your_cohere_api_key
MISTRAL_API_KEY=your_mistral_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

### Step 3: Update Models Configuration

Edit `lib/ai/models.ts` to add your new provider:

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { google } from '@ai-sdk/google';
import { cohere } from '@ai-sdk/cohere';  // ← Add your import

export const models = [
  // Existing models...
  
  // Cohere models
  {
    id: 'cohere:command-r-plus',
    label: 'Command R+',
    provider: 'Cohere',
    providerId: 'cohere',
  },
  {
    id: 'cohere:command-r',
    label: 'Command R',
    provider: 'Cohere', 
    providerId: 'cohere',
  },
];

export function getModel(id: string) {
  const [providerId, modelId] = id.split(':');
  
  switch (providerId) {
    // Existing cases...
    
    case 'cohere':
      return cohere(modelId, {
        apiKey: process.env.COHERE_API_KEY,
      });
      
    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}
```

### Step 4: Test Your Integration

Start your development server and test the new provider:

```bash
pnpm dev
```

1. Open the chat interface
2. Select your new model from the dropdown  
3. Send a test message
4. Verify the response

## Custom API Integrations

### Creating Custom Tools

You can add custom tools that the AI can use during conversations. Tools are defined in `lib/ai/tools/`.

#### Example: Weather API Tool

1. **Create the tool file** `lib/ai/tools/weather.ts`:

```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get current weather for a location',
  parameters: z.object({
    location: z.string().describe('The city and state/country'),
  }),
  execute: async ({ location }) => {
    try {
      // Example using OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      
      return {
        location: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      return {
        error: 'Unable to fetch weather data',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
```

2. **Add environment variable**:

```bash
# In .env.local and .env.example  
OPENWEATHER_API_KEY=your_openweather_api_key
```

3. **Register the tool** in `app/(chat)/api/chat/route.ts`:

```typescript
import { weatherTool } from '@/lib/ai/tools/weather';

// In your chat route handler
const result = await streamText({
  model: getModel(model),
  messages,
  tools: {
    weather: weatherTool,  // ← Add your tool here
    // ... other existing tools
  },
  maxSteps: 5,
});
```

### Database Integration Tools

Create tools that interact with your database:

#### Example: User Preferences Tool

```typescript
// lib/ai/tools/user-preferences.ts
import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const userPreferencesTool = tool({
  description: 'Get or update user preferences',
  parameters: z.object({
    action: z.enum(['get', 'set']),
    preference: z.string().optional(),
    value: z.string().optional(),
  }),
  execute: async ({ action, preference, value }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }
    
    if (action === 'get') {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();
        
      return { preferences: data?.preferences || {} };
    }
    
    if (action === 'set' && preference && value) {
      const { error } = await supabase
        .from('profiles')  
        .update({ 
          preferences: { [preference]: value }
        })
        .eq('id', user.id);
        
      return error 
        ? { error: 'Failed to update preference' }
        : { success: true, preference, value };
    }
    
    return { error: 'Invalid parameters' };
  },
});
```

## External Service Integrations

### Webhook Integrations

Create API routes to receive webhooks from external services:

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  
  // Verify webhook signature
  // Process the webhook data
  // Update your database
  
  return NextResponse.json({ received: true });
}
```

### Third-party API Wrappers

Create reusable API clients for external services:

```typescript
// lib/integrations/notion.ts
export class NotionClient {
  private apiKey: string;
  private baseUrl = 'https://api.notion.com/v1';
  
  constructor() {
    this.apiKey = process.env.NOTION_API_KEY!;
  }
  
  async searchPages(query: string) {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        filter: { property: 'object', value: 'page' },
      }),
    });
    
    return response.json();
  }
}
```

## Authentication & Security

### API Key Management

Store sensitive API keys securely:

```typescript
// lib/config/api-keys.ts
export const getApiKey = (provider: string): string => {
  const key = process.env[`${provider.toUpperCase()}_API_KEY`];
  
  if (!key) {
    throw new Error(`Missing API key for ${provider}`);
  }
  
  return key;
};

// Usage
const apiKey = getApiKey('openai'); // Gets OPENAI_API_KEY
```

### Rate Limiting

Implement rate limiting for your APIs:

```typescript
// lib/middleware/rate-limit.ts
import { NextRequest } from 'next/server';

const requests = new Map<string, number[]>();

export function rateLimit(request: NextRequest, limit = 100, window = 3600000) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowStart = now - window;
  
  const userRequests = requests.get(ip) || [];
  const recentRequests = userRequests.filter(time => time > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return true; // Allow request
}
```

### Request Validation

Validate incoming requests:

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
});

// Usage in API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);
    // Process request...
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
```

## Error Handling

### Graceful API Failures

Handle API failures gracefully:

```typescript
// lib/utils/api-error-handler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public provider?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw new APIError(
      'External API temporarily unavailable',
      503
    );
  }
}
```

### User-friendly Error Messages

Provide helpful error messages to users:

```typescript
// lib/utils/error-messages.ts
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      case 401:
        return 'API authentication failed. Please check your configuration.';
      default:
        return 'An error occurred while processing your request.';
    }
  }
  
  return 'An unexpected error occurred.';
};
```

## Testing Your Integrations

### Unit Tests

Test your API integrations:

```typescript
// __tests__/weather-tool.test.ts
import { weatherTool } from '@/lib/ai/tools/weather';

// Mock the fetch function
global.fetch = jest.fn();

describe('Weather Tool', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  
  it('should return weather data for valid location', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'New York',
        main: { temp: 22, humidity: 65 },
        weather: [{ description: 'clear sky' }],
        wind: { speed: 3.5 },
      }),
    });
    
    const result = await weatherTool.execute({ location: 'New York' });
    
    expect(result.location).toBe('New York');
    expect(result.temperature).toBe(22);
  });
});
```

### Integration Tests

Test full API workflows:

```typescript
// __tests__/chat-api.integration.test.ts
import { POST } from '@/app/(chat)/api/chat/route';
import { NextRequest } from 'next/server';

describe('Chat API Integration', () => {
  it('should handle chat requests with custom tools', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What\'s the weather in NYC?' }],
        model: 'gpt-3.5-turbo',
      }),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(200);
    
    // Test streaming response
    const reader = response.body?.getReader();
    // ... test streaming data
  });
});
```

## Best Practices

1. **Environment Variables**: Always use environment variables for API keys
2. **Error Handling**: Implement comprehensive error handling with user-friendly messages
3. **Rate Limiting**: Respect API rate limits and implement your own limits
4. **Caching**: Cache API responses when appropriate to improve performance
5. **Logging**: Log API calls for debugging and monitoring
6. **Testing**: Write tests for all custom integrations
7. **Documentation**: Document your custom APIs and tools

## Examples Repository

For more integration examples, check out:
- **Weather API**: Real-time weather data
- **Calendar Integration**: Google Calendar API
- **Email Integration**: SendGrid/Resend integration
- **Database Tools**: Custom database queries
- **File Processing**: PDF/document analysis tools

Each example includes complete implementation with error handling, tests, and documentation.

## Need Help?

- 📖 **AI SDK Documentation**: [https://sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)
- 🔧 **Custom Tools Guide**: [https://sdk.vercel.ai/docs/ai-sdk-core/tools](https://sdk.vercel.ai/docs/ai-sdk-core/tools)
- 💬 **Community**: Join our Discord for integration help