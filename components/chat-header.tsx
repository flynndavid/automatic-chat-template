'use client';

import { useRouter } from 'next/navigation';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, FileTextIcon, CodeIcon } from './icons';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { PolicySheet } from './policy-sheet';
import type { User } from '@supabase/supabase-js';

function PureChatHeader({
  user,
}: {
  user: User;
}) {
  const router = useRouter();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

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
          <PolicySheet user={user}>
            <Button
              variant="outline"
              className="order-1 md:order-2 px-2 h-[34px] flex items-center gap-2"
            >
              <FileTextIcon />
              <span className="hidden sm:inline">Policies</span>
            </Button>
          </PolicySheet>
        </TooltipTrigger>
        <TooltipContent>View My Policies</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="order-2 md:order-3 px-2 h-[34px]"
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
