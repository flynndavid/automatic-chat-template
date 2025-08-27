'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo, useMemo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { VisibilityType } from './visibility-selector';
import type { ChatMessage } from '@/lib/types';

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>['sendMessage'];
  selectedVisibilityType: VisibilityType;
}

// Pool of 10 generic suggestions for general assistance
const ALL_SUGGESTIONS: Array<{ title: string; label: string; action: string }> =
  [
    {
      title: 'Help me write',
      label: 'a professional email',
      action: 'Help me write a professional email',
    },
    {
      title: 'Create a document',
      label: 'for my project',
      action: 'Create a document to help organize my project',
    },
    {
      title: 'Explain a concept',
      label: 'in simple terms',
      action: 'Explain a complex concept in simple terms',
    },
    {
      title: 'Generate ideas',
      label: 'for my presentation',
      action: 'Generate creative ideas for my presentation',
    },
    {
      title: 'What should I know',
      label: 'about this topic?',
      action: 'What should I know about this topic?',
    },
    {
      title: 'Help me organize',
      label: 'my thoughts and plans',
      action: 'Help me organize my thoughts and create a plan',
    },
    {
      title: 'Summarize information',
      label: 'from multiple sources',
      action: 'Summarize key information from multiple sources',
    },
    {
      title: 'Create a checklist',
      label: 'for my tasks',
      action: 'Create a checklist to help me stay organized',
    },
    {
      title: 'Research and compare',
      label: 'different options',
      action: 'Help me research and compare different options',
    },
    {
      title: 'Check the weather',
      label: 'for my location',
      action: 'What is the weather like today?',
    },
  ];

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  // Deterministically select 4 suggestions based on chatId to avoid hydration mismatch
  const suggestedActions = useMemo(() => {
    // Create a simple hash from chatId for consistent pseudo-random behavior
    const hash = chatId.split('').reduce((acc, char) => {
      const result = (acc << 5) - acc + char.charCodeAt(0);
      return result & result; // Convert to 32bit integer
    }, 0);

    // Use the hash to create a deterministic shuffle
    const shuffled = [...ALL_SUGGESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Generate deterministic "random" index based on hash and position
      const pseudoRandom = Math.abs((hash + i) * 9301 + 49297) % 233280;
      const j = pseudoRandom % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 4);
  }, [chatId]); // Re-shuffle when chatId changes (new chat)

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              sendMessage({
                role: 'user',
                parts: [{ type: 'text', text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  },
);
