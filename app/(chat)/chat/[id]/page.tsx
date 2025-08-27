import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { convertToUIMessages } from '@/lib/utils';
import type { VisibilityType } from '@/components/visibility-selector';

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Validate that the ID is a proper UUID
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (chat.visibility === 'private') {
    if (!user) {
      return notFound();
    }

    if (user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={uiMessages}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType={chat.visibility as VisibilityType}
          isReadonly={user?.id !== chat.userId}
          user={user}
          autoResume={true}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={chatModelFromCookie.value}
        initialVisibilityType={chat.visibility as VisibilityType}
        isReadonly={user?.id !== chat.userId}
        user={user}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}
