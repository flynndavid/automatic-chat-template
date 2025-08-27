'use client';

import { useRouter } from 'next/navigation';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, CodeIcon } from './icons';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ModelSelector } from '@/components/model-selector';
import type { User } from '@supabase/supabase-js';

function PureChatHeader({
  user,
  selectedModelId,
}: {
  user: User;
  selectedModelId: string;
}) {
  const router = useRouter();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      <ModelSelector
        user={user}
        selectedModelId={selectedModelId}
        className="order-2 md:order-1"
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="order-4 ml-auto px-2 h-fit flex items-center gap-2"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <PlusIcon />
            <span>New Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="order-3 md:order-2 px-2 h-[34px]"
            onClick={() => window.open('/embed', '_blank')}
          >
            <CodeIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Embed Widget</TooltipContent>
      </Tooltip>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
