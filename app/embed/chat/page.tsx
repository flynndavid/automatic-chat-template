import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmbedChat } from '@/components/embed-chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import type { VisibilityType } from '@/components/visibility-selector';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function EmbedChatPage({
  searchParams,
}: {
  searchParams: Promise<{ agency?: string }>;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { agency } = await searchParams;

  // If no user, create guest session
  if (!user) {
    const redirectUrl = `/embed/chat${agency ? `?agency=${agency}` : ''}`;
    redirect(`/api/auth/guest?redirectUrl=${encodeURIComponent(redirectUrl)}`);
  }

  const chatId = generateUUID();
  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  return (
    <div className="h-screen w-full bg-background">
      <EmbedChat
        id={chatId}
        initialMessages={[]}
        initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialVisibilityType={'private' as VisibilityType}
        isReadonly={false}
        user={user}
        autoResume={false}
      />
      <DataStreamHandler />
    </div>
  );
}
