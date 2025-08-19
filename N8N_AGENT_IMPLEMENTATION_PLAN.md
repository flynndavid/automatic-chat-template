# n8n Agent Chat Mode Implementation Plan

## Overview

This document outlines the implementation plan for adding a "HomeFax Agent" chat mode to the model selector that routes chat messages to the n8n workflow instead of the native AI functionality. This enables users to interact with the specialized HomeFax insurance policy AI agent with database access and smart routing capabilities.

## Current Architecture Analysis

### Existing Chat Flow

1. User selects model in `ModelSelector` → saves to cookie
2. `Chat` component sends messages to `/api/chat`
3. Chat API uses `selectedChatModel` to route to appropriate AI provider
4. Native models use `streamText()` with local tools and providers

### n8n Workflow Details ✅ VERIFIED

- **Workflow ID**: `uJ2pbqxhY8BFpKOr`
- **Name**: "HomeFax 2.0 - Enhanced with Routing"
- **Status**: `active: true` ✅
- **Webhook ID**: `ec674109-b4f7-405b-91df-1d1ed574e87d`
- **Webhook URL**: `https://n8n.automatic.so/webhook/ec674109-b4f7-405b-91df-1d1ed574e87d/chat`

## Implementation Requirements

### Environment Variables

Add to `.env.local`:

```bash
N8N_BASE_URL=https://n8n.automatic.so
N8N_WEBHOOK_ID=ec674109-b4f7-405b-91df-1d1ed574e87d
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NTYxMDc1Ny1kNjZjLTQ5NTItOWMzYy05MTk4ZjBmMTFiZjUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU1NTc5MDQ5LCJleHAiOjE3NjMyNzI4MDB9.IxN9KZUe921KnQ4KmrnGQfaK5KkFA-qcYCdEhoI-gMM
```

### n8n API Communication Details ✅ TESTED

**Request Format:**

```json
{
  "chatInput": "user message text",
  "sessionId": "unique-session-id"
}
```

**Response Format (Streaming JSON):**

```json
{"type":"begin","metadata":{"nodeId":"...","nodeName":"CLAUDE AGENT",...}}
{"type":"item","content":"AI response text","metadata":{...}}
{"type":"end","metadata":{"nodeId":"...","nodeName":"CLAUDE AGENT",...}}
```

## Implementation Tasks

### Task 1: Update Models Configuration

**File**: `lib/ai/models.ts`

Add the new model to the `chatModels` array:

```typescript
export const chatModels: Array<ChatModel> = [
  {
    id: "chat-model",
    name: "Chat model",
    description: "Primary model for all-purpose chat",
  },
  {
    id: "chat-model-reasoning",
    name: "Reasoning model",
    description: "Uses advanced reasoning",
  },
  {
    id: "n8n-agent",
    name: "HomeFax Agent",
    description:
      "Specialized insurance policy AI with database access and routing",
  },
];
```

### Task 2: Create n8n API Client

**New File**: `lib/n8n/client.ts`

```typescript
interface N8nStreamResponse {
  type: "begin" | "item" | "end";
  content?: string;
  metadata: {
    nodeId: string;
    nodeName: string;
    itemIndex: number;
    runIndex: number;
    timestamp: number;
  };
}

interface N8nClientConfig {
  baseUrl: string;
  webhookId: string;
}

export class N8nClient {
  private config: N8nClientConfig;

  constructor(config: N8nClientConfig) {
    this.config = config;
  }

  async streamChat(
    message: string,
    sessionId: string
  ): Promise<ReadableStream<string>> {
    const webhookUrl = `${this.config.baseUrl}/webhook/${this.config.webhookId}/chat`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `n8n webhook failed: ${response.status} ${response.statusText}`
      );
    }

    if (!response.body) {
      throw new Error("No response body from n8n webhook");
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data: N8nStreamResponse = JSON.parse(line);
                  if (data.type === "item" && data.content) {
                    controller.enqueue(data.content);
                  }
                } catch (parseError) {
                  console.error(
                    "Failed to parse n8n response line:",
                    parseError
                  );
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });
  }
}

export const n8nClient = new N8nClient({
  baseUrl: process.env.N8N_BASE_URL!,
  webhookId: process.env.N8N_WEBHOOK_ID!,
});
```

### Task 3: Update Chat API Route

**File**: `app/(chat)/api/chat/route.ts`

Add n8n integration to the main POST handler. Insert this logic after the existing validation and before the current `streamText` call:

```typescript
// Add import at top
import { n8nClient } from "@/lib/n8n/client";
import { generateUUID } from "@/lib/utils";

// Add this logic in the POST function after line 147 (after saveMessages call)
// and before line 149 (const streamId = generateUUID())

// Check if using n8n agent
if (selectedChatModel === "n8n-agent") {
  const streamId = generateUUID();
  await createStreamId({ streamId, chatId: id });

  const stream = createUIMessageStream({
    execute: async ({ writer: dataStream }) => {
      try {
        const userMessage = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(" ");

        const n8nStream = await n8nClient.streamChat(userMessage, id);
        const reader = n8nStream.getReader();

        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullResponse += value;

          // Stream the response chunk to the UI
          dataStream.writeData({
            type: "text-delta",
            textDelta: value,
          });
        }

        // Send final message
        dataStream.writeMessageAnnotation({
          messageId: generateUUID(),
          type: "finish",
        });
      } catch (error) {
        console.error("n8n streaming error:", error);
        dataStream.writeData({
          type: "error",
          error: "HomeFax agent temporarily unavailable. Please try again.",
        });
      }
    },
    generateId: generateUUID,
    onFinish: async ({ messages }) => {
      await saveMessages({
        messages: messages.map((message) => ({
          id: message.id,
          role: message.role,
          parts: message.parts,
          createdAt: new Date(),
          attachments: [],
          chatId: id,
        })),
      });
    },
    onError: () => {
      return "HomeFax agent encountered an error. Please try again.";
    },
  });

  const streamContext = getStreamContext();

  if (streamContext) {
    return new Response(
      await streamContext.resumableStream(streamId, () =>
        stream.pipeThrough(new JsonToSseTransformStream())
      )
    );
  } else {
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  }
}

// Continue with existing streamText logic for other models...
```

### Task 4: Update Entitlements

**File**: `lib/ai/entitlements.ts`

Add `'n8n-agent'` to the available models:

```typescript
export const entitlementsByUserType: Record<UserType, Entitlements> = {
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning", "n8n-agent"],
  },
};
```

### Task 5: Update API Schema Validation

**File**: `app/(chat)/api/chat/schema.ts`

Update the schema to include the new model:

```typescript
export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(["user"]),
    parts: z.array(partSchema),
  }),
  selectedChatModel: z.enum([
    "chat-model",
    "chat-model-reasoning",
    "n8n-agent",
  ]),
  selectedVisibilityType: z.enum(["public", "private"]),
});
```

## Testing Strategy

### Unit Testing

1. **n8n Client Testing**
   - Test successful webhook calls
   - Test error handling for network failures
   - Test streaming response parsing

2. **Chat API Integration**
   - Test model routing logic
   - Test response transformation
   - Test error scenarios

### Integration Testing

1. **End-to-End Flow**
   - Select "HomeFax Agent" in model selector
   - Send test message
   - Verify streaming response
   - Check message persistence

2. **Error Scenarios**
   - n8n webhook unavailable
   - Invalid responses
   - Network timeouts
   - Malformed JSON responses

### Test Cases

```typescript
// Example test cases
describe("n8n Agent Integration", () => {
  test("should route to n8n webhook when n8n-agent selected", async () => {
    // Test implementation
  });

  test("should handle n8n webhook failures gracefully", async () => {
    // Test implementation
  });

  test("should maintain session continuity", async () => {
    // Test implementation
  });
});
```

## Error Handling Strategy

### Failure Scenarios & Responses

1. **n8n Webhook Down**
   - Response: "HomeFax agent temporarily unavailable. Please try again."
   - Fallback: Log error, return user-friendly message

2. **Workflow Inactive**
   - Response: "HomeFax agent is currently offline. Contact support."
   - Fallback: Check workflow status via API

3. **Invalid Response Format**
   - Response: "Unable to process request. Please rephrase."
   - Fallback: Log error details, return generic error

4. **Timeout (>30s)**
   - Response: "Request taking longer than expected. Please try again."
   - Fallback: Implement request timeout handling

### Error Logging

```typescript
// Add comprehensive error logging
console.error("n8n integration error:", {
  error: error.message,
  chatId: id,
  userMessage: userMessage,
  timestamp: new Date().toISOString(),
  sessionId: id,
});
```

## Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] n8n workflow active and tested
- [ ] All code changes implemented
- [ ] Unit tests passing
- [ ] Integration tests passing

### Post-Deployment

- [ ] Model selector shows "HomeFax Agent"
- [ ] Test message routing works
- [ ] Streaming responses display correctly
- [ ] Error handling works as expected
- [ ] Session continuity maintained
- [ ] Performance within acceptable limits (<5s response time)

## Monitoring & Maintenance

### Key Metrics

1. **Response Times**
   - Target: <5 seconds for typical queries
   - Monitor: Average, 95th percentile

2. **Error Rates**
   - Target: <1% error rate
   - Monitor: n8n webhook failures, parsing errors

3. **Usage Patterns**
   - Monitor: n8n-agent vs other model usage
   - Track: Session lengths, message counts

### Health Checks

```typescript
// Add health check endpoint
export async function GET() {
  try {
    const response = await fetch(
      `${process.env.N8N_BASE_URL}/webhook/${process.env.N8N_WEBHOOK_ID}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: "health check",
          sessionId: "health",
        }),
      }
    );

    return Response.json({
      status: response.ok ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Benefits Summary

### For Users

- Access to specialized insurance AI with database integration
- Smart routing to appropriate insurance contacts
- Professional insurance agent persona and compliance
- Same familiar chat interface

### For Development

- Clean integration with existing architecture
- No breaking changes to current functionality
- Comprehensive error handling
- Easy to test and maintain

### For Business

- Differentiated AI capabilities for insurance vertical
- Professional compliance and regulatory adherence
- Scalable architecture for additional n8n workflows
- Real-time policy data access and routing

## Implementation Timeline

**Phase 1: Core Implementation (2-3 hours)**

- n8n client creation: 1 hour
- Chat API route modification: 1 hour
- Schema/entitlements updates: 30 minutes

**Phase 2: Testing & Refinement (1-2 hours)**

- End-to-end testing: 1 hour
- Error scenario testing: 1 hour

**Phase 3: Deployment & Monitoring (30 minutes)**

- Environment configuration: 15 minutes
- Health checks and monitoring: 15 minutes

**Total Estimated Time: 3-5 hours**

## Support & Troubleshooting

### Common Issues

1. **"Model not available" error**
   - Check entitlements configuration
   - Verify model ID matches exactly

2. **"n8n webhook failed" error**
   - Check n8n workflow is active
   - Verify webhook URL and credentials
   - Check network connectivity

3. **Streaming not working**
   - Verify response transformation logic
   - Check for JSON parsing errors
   - Test with curl directly

### Debug Commands

```bash
# Test n8n webhook directly
curl -X POST "https://n8n.automatic.so/webhook/ec674109-b4f7-405b-91df-1d1ed574e87d/chat" \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "test message", "sessionId": "debug-123"}'

# Check workflow status
curl -X GET "https://n8n.automatic.so/api/v1/workflows/uJ2pbqxhY8BFpKOr" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}"
```

---

**Contact**: For questions about this implementation, contact the development team lead or refer to the n8n API integration documentation in the project rules.
