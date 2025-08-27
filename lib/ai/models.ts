export const DEFAULT_CHAT_MODEL: string = 'n8n-agent';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'n8n-agent',
    name: 'AI Agent',
    description:
      'Specialized AI assistant with database access and workflow routing',
  },
];
