// Enhanced n8n integration with rich context
export async function handleN8nAgent(
  message: any,
  id: string,
  saveMessages: any,
  generateUUID: any,
  user?: any, // Add user context
) {
  try {
    // Extract user message text
    const userMessage = message.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text || '')
      .join(' ')
      .trim();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Empty message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare rich context for n8n webhook
    const requestPayload = {
      // Core message data - n8n Chat Trigger expects 'chatInput' field
      chatInput: userMessage,
      sessionId: id,

      // User context (when available)
      user: user
        ? {
            id: user.id,
            email: user.email,
            profile_id: user.id, // Since profile.id = auth.user.id
          }
        : null,

      // Request metadata
      timestamp: new Date().toISOString(),
      source: 'ai-chat',

      // Future extensibility
      context: {
        chat_history_length: 0, // Could be populated
        user_preferences: {}, // Could be populated
      },
    };

    // Call n8n webhook with enhanced payload
    const webhookUrl = `${process.env.N8N_BASE_URL}/webhook/${process.env.N8N_WEBHOOK_ID}/chat`;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Remove JWT header since we're passing user context directly
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok || !response.body) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    // Collect the complete response from n8n
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'item' && data.content) {
              fullResponse += data.content;
            }
          } catch (e) {
            console.error('Failed to parse n8n response:', e);
          }
        }
      }
    }

    if (!fullResponse) {
      throw new Error('No response from AI agent');
    }

    // Save the assistant message
    const assistantMessageId = generateUUID();
    await saveMessages({
      messages: [
        {
          id: assistantMessageId,
          role: 'assistant',
          parts: [{ type: 'text', text: fullResponse }],
          createdAt: new Date().toISOString(),
          attachments: [],
          chatId: id,
          sessionId: id,
        },
      ],
    });

    // Prepare UI message stream parts for the AI SDK on the frontend
    const uiParts = [
      { type: 'start' },
      { type: 'start-step' },
      { type: 'text-start', id: 'text-1' },
      { type: 'text-delta', id: 'text-1', delta: fullResponse },
      { type: 'text-end', id: 'text-1' },
      { type: 'finish-step' },
      { type: 'finish' },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const part of uiParts) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(part)}\n\n`),
          );
        }
        // Signal the end of the stream
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'x-vercel-ai-ui-message-stream': 'v1',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    } as const;

    return new Response(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('n8n integration error:', error);
    return new Response(
      JSON.stringify({ error: 'AI agent temporarily unavailable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
