-- Enable RLS on Message_v2 table
ALTER TABLE "Message_v2" ENABLE ROW LEVEL SECURITY;

-- Allow users to insert messages in their own chats
CREATE POLICY "Users can insert messages in own chats" ON "Message_v2"
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Chat" 
      WHERE "Chat"."id" = "Message_v2"."chatId" 
      AND "Chat"."userId" = auth.uid()
    )
  );

-- Allow users to view messages in their own chats
CREATE POLICY "Users can view messages in own chats" ON "Message_v2"
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM "Chat" 
      WHERE "Chat"."id" = "Message_v2"."chatId" 
      AND "Chat"."userId" = auth.uid()
    )
  );

-- Allow users to view messages in public chats
CREATE POLICY "Users can view messages in public chats" ON "Message_v2"
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM "Chat" 
      WHERE "Chat"."id" = "Message_v2"."chatId" 
      AND "Chat"."visibility" = 'public'
    )
  );
