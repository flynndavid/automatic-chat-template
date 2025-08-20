import { DataStreamProvider } from '@/components/data-stream-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataStreamProvider>
      <TooltipProvider>
        <div className="h-screen w-full">{children}</div>
      </TooltipProvider>
    </DataStreamProvider>
  );
}
