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

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  // Pool of 10 HomeFax-specific suggestions for policyholders
  const allSuggestions = [
    {
      title: 'Does my policy cover',
      label: 'water damage from burst pipes?',
      action: 'Does my policy cover water damage from burst pipes?',
    },
    {
      title: 'How do I file a claim',
      label: 'for storm damage?',
      action: 'How do I file a claim for storm damage?',
    },
    {
      title: 'What home improvements',
      label: 'affect my coverage?',
      action: 'What home improvements affect my coverage?',
    },
    {
      title: 'Explain my deductible',
      label: 'options and amounts',
      action: 'Explain my deductible options and how they work',
    },
    {
      title: 'What documentation',
      label: 'do I need for claims?',
      action: 'What documentation do I need when filing a claim?',
    },
    {
      title: 'Does my policy cover',
      label: 'liability for injuries?',
      action:
        'Does my policy cover liability if someone gets injured on my property?',
    },
    {
      title: "How does my home's age",
      label: 'affect my premium?',
      action:
        "How does my home's age and condition affect my insurance premium?",
    },
    {
      title: "What's not covered",
      label: "by my homeowner's insurance?",
      action: "What's not covered by my homeowner's insurance policy?",
    },
    {
      title: 'How do I update coverage',
      label: 'after renovations?',
      action:
        'How do I update my coverage after home renovations or improvements?',
    },
    {
      title: 'How should I prepare',
      label: 'for hurricane season?',
      action:
        'What should I do to prepare my home and insurance for hurricane season?',
    },
  ];

  // Deterministically select 4 suggestions based on chatId to avoid hydration mismatch
  const suggestedActions = useMemo(() => {
    // Create a simple hash from chatId for consistent pseudo-random behavior
    const hash = chatId.split('').reduce((acc, char) => {
      const result = (acc << 5) - acc + char.charCodeAt(0);
      return result & result; // Convert to 32bit integer
    }, 0);

    // Use the hash to create a deterministic shuffle
    const shuffled = [...allSuggestions];
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
