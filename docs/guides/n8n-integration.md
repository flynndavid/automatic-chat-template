# n8n Integration Guide

This guide explains how to integrate n8n workflows with the Automatic Chat Template, enabling powerful automation and complex business logic in your AI chat application.

## Overview

The template includes built-in n8n integration that allows you to:

- **Trigger workflows** from chat conversations
- **Process data** through complex automation pipelines
- **Integrate with external APIs** and services seamlessly
- **Create custom business logic** flows
- **Handle complex multi-step processes** that go beyond simple AI responses

## How It Works

The integration uses a dedicated API endpoint (`/api/chat/simple-n8n`) that:

1. **Receives user messages** from the chat interface
2. **Enriches the context** with user data and session information
3. **Sends structured data** to your n8n webhook
4. **Streams the response** back to the chat interface
5. **Saves the conversation** to the database

## Setup Requirements

### 1. n8n Instance

You need a running n8n instance. Options include:

#### n8n Cloud (Recommended)
- Visit [n8n.cloud](https://n8n.cloud)
- Create an account and workspace
- No server management required

#### Self-hosted n8n
```bash
# Using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Using npm
npm install n8n -g
n8n start
```

#### n8n Desktop
- Download from [n8n.io/desktop](https://n8n.io/desktop)
- Install and run locally

### 2. Environment Configuration

Add n8n configuration to your `.env.local`:

```bash
# n8n Integration
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_ID=your_webhook_id
```

## Creating Your First Workflow

### Step 1: Create a Chat Workflow

1. **Open n8n** and create a new workflow
2. **Add a Webhook node** as the trigger:
   - **HTTP Method**: POST
   - **Path**: `/chat` (this creates your webhook ID)
   - **Response Mode**: Stream response
   - **Enable**: Binary Data

### Step 2: Configure the Webhook

The webhook will receive this structured payload:

```json
{
  "chatInput": "User's message text",
  "sessionId": "unique-session-id",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "profile_id": "profile-uuid"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "ai-chat",
  "context": {
    "chat_history_length": 0,
    "user_preferences": {}
  }
}
```

### Step 3: Add Processing Nodes

Example workflow structure:

```
Webhook → Switch (Route Logic) → AI Tool → HTTP Request → Response
```

#### Switch Node Example
Route different types of requests:

```javascript
// Switch on chatInput content
if ($('Webhook').first().json.chatInput.toLowerCase().includes('weather')) {
  return 0; // Weather branch
} else if ($('Webhook').first().json.chatInput.toLowerCase().includes('email')) {
  return 1; // Email branch  
} else {
  return 2; // Default AI branch
}
```

#### AI Processing Node
Add an OpenAI or other AI node:

- **Model**: gpt-4 or your preferred model
- **Input**: `{{ $('Webhook').first().json.chatInput }}`
- **System Message**: Your custom instructions

#### Response Format
Ensure your final node outputs data in this format:

```json
{
  "type": "item",
  "content": "Your response text here"
}
```

## Advanced Workflow Examples

### 1. Customer Support Workflow

```
Webhook 
  → Extract Intent (AI)
    → Switch (ticket/faq/escalate)
      → Create Support Ticket (Database)
      → Search Knowledge Base (Vector DB)
      → Notify Support Team (Email/Slack)
  → Generate Response
```

### 2. Data Analysis Workflow

```
Webhook
  → Parse Request (Code)
  → Fetch Data (Database/API)
  → Process Data (Python/Pandas)  
  → Generate Charts (Chart.js)
  → Format Response (Template)
```

### 3. Multi-step Automation

```
Webhook
  → Validate Input (Function)
  → Call External API (HTTP Request)
  → Transform Data (JSON)
  → Update Database (Supabase)
  → Send Notification (Email)
  → Generate Summary (AI)
```

## Integration Code Reference

The integration is implemented in `/app/(chat)/api/chat/simple-n8n.ts`:

### Key Features

1. **Rich Context**: Automatically includes user information and session data
2. **Error Handling**: Graceful fallback if n8n is unavailable  
3. **Streaming Response**: Real-time response streaming to the chat interface
4. **Database Integration**: Automatically saves conversations
5. **Security**: User context passed securely without exposing tokens

### Payload Structure

```typescript
const requestPayload = {
  // Core message - n8n Chat Trigger expects 'chatInput'
  chatInput: userMessage,
  sessionId: id,
  
  // User context (when available)  
  user: user ? {
    id: user.id,
    email: user.email,
    profile_id: user.id
  } : null,
  
  // Request metadata
  timestamp: new Date().toISOString(),
  source: 'ai-chat',
  
  // Extensible context
  context: {
    chat_history_length: 0,
    user_preferences: {}
  }
};
```

## Authentication & Security

### API Key Setup

1. **Generate API Key** in your n8n instance:
   - Go to Settings → API Keys
   - Create a new API key
   - Add to `N8N_API_KEY` in your environment

### Webhook Security

- n8n webhooks are publicly accessible by design
- Implement additional validation in your workflow if needed:

```javascript
// Validate source in your n8n workflow
const source = $('Webhook').first().json.source;
if (source !== 'ai-chat') {
  return { error: 'Unauthorized source' };
}
```

### User Context Security

- User information is passed directly in the payload
- No JWT tokens are transmitted
- User data is limited to ID, email, and profile ID

## Testing Your Integration

### 1. Test the Webhook

```bash
curl -X POST "https://your-n8n-instance.com/webhook/your-webhook-id/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "chatInput": "Hello, test message",
    "sessionId": "test-session",
    "user": {
      "id": "test-user-id",
      "email": "test@example.com"
    },
    "timestamp": "2024-01-01T12:00:00.000Z",
    "source": "ai-chat"
  }'
```

### 2. Test Through Chat Interface

1. Start your development server: `pnpm dev`
2. Log in to your application
3. Send a test message in chat
4. Monitor your n8n workflow execution
5. Verify the response appears in chat

### 3. Debug Common Issues

#### Webhook Not Triggering
- Check the webhook URL format: `{N8N_BASE_URL}/webhook/{WEBHOOK_ID}/chat`
- Verify the webhook node is active in n8n
- Check n8n execution logs

#### No Response in Chat
- Ensure your workflow returns data in the correct format
- Check the response mode is set to "Stream"
- Verify the final node outputs `{ type: "item", content: "..." }`

#### User Context Missing
- Verify user is logged in
- Check Supabase authentication is working
- Review the payload in n8n execution logs

## Workflow Templates

### Basic AI Responder

```json
{
  "name": "Basic AI Chat",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [0, 0],
      "parameters": {
        "httpMethod": "POST",
        "path": "chat",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi", 
      "position": [200, 0],
      "parameters": {
        "resource": "chat",
        "operation": "create",
        "model": "gpt-4",
        "messages": [
          {
            "role": "user",
            "content": "={{ $('Webhook').first().json.chatInput }}"
          }
        ]
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.function",
      "position": [400, 0], 
      "parameters": {
        "functionCode": "return [{ json: { type: 'item', content: items[0].json.choices[0].message.content } }];"
      }
    }
  ],
  "connections": {
    "Webhook": { "main": [["OpenAI"]] },
    "OpenAI": { "main": [["Format Response"]] }
  }
}
```

### Customer Data Lookup

```json
{
  "name": "Customer Lookup",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Extract Email", 
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "const email = $('Webhook').first().json.user?.email; return [{ json: { email } }];"
      }
    },
    {
      "name": "Supabase Query",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "select",
        "table": "customer_data",
        "filterType": "manual",
        "conditions": [
          {
            "field": "email",
            "operator": "eq", 
            "value": "={{ $('Extract Email').first().json.email }}"
          }
        ]
      }
    },
    {
      "name": "Generate Response",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "messages": [
          {
            "role": "system",
            "content": "You are a customer service agent. Use the customer data to provide personalized assistance."
          },
          {
            "role": "user", 
            "content": "Customer question: {{ $('Webhook').first().json.chatInput }}\n\nCustomer data: {{ JSON.stringify($('Supabase Query').first().json) }}"
          }
        ]
      }
    }
  ]
}
```

## Best Practices

### 1. Workflow Design

- **Keep workflows focused**: One workflow per specific use case
- **Use descriptive names**: Clear node and workflow naming
- **Add error handling**: Include error nodes and fallbacks
- **Test thoroughly**: Test with various input types and edge cases

### 2. Response Formatting

- Always return responses in the required format:
```json
{ "type": "item", "content": "Your response text" }
```
- Keep responses conversational and helpful
- Include relevant context from the workflow execution

### 3. Performance

- **Cache frequently accessed data** in n8n or external cache
- **Use pagination** for large dataset operations
- **Implement timeouts** for external API calls
- **Monitor workflow execution times**

### 4. Security

- **Validate inputs** in your n8n workflows
- **Use environment variables** for sensitive data
- **Limit user context** to necessary information only
- **Implement rate limiting** if needed

## Troubleshooting

### Common Issues

#### "n8n webhook failed" Error
- Check your `N8N_BASE_URL` and `N8N_WEBHOOK_ID` configuration
- Verify the webhook is active in n8n
- Test the webhook URL directly

#### "No response from AI agent" Error  
- Ensure your workflow returns data in the correct format
- Check n8n execution logs for errors
- Verify all nodes in your workflow are properly configured

#### Workflow Not Executing
- Check webhook configuration (POST method, correct path)
- Verify n8n instance is running and accessible
- Review webhook authentication settings

### Getting Help

- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **n8n Documentation**: [docs.n8n.io](https://docs.n8n.io)
- **Template Issues**: Check the project repository issues
- **AI SDK Help**: [sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)

## Next Steps

1. **Create your first workflow** using the examples above
2. **Test the integration** with simple use cases
3. **Build complex automations** for your specific needs
4. **Monitor and optimize** workflow performance
5. **Scale your deployment** as usage grows

For more advanced customization, see [Customization Guide](./customization.md).