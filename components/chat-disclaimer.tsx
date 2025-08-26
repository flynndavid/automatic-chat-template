import React from 'react';
import { DisclaimerDialog } from './disclaimer-dialog';

export function ChatDisclaimer() {
  return (
    <div className="flex justify-center px-4 pb-2">
      <DisclaimerDialog>
        <button
          type="button"
          className="text-xs text-muted-foreground text-center max-w-md hover:text-foreground transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
        >
          HomeFax can make mistakes. Verify information with your agent.
        </button>
      </DisclaimerDialog>
    </div>
  );
}
