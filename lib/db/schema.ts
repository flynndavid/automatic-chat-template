import {
  pgTable,
  index,
  uuid,
  text,
  jsonb,
  timestamp,
  foreignKey,
  boolean,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

// Essential profiles table for user management with Supabase
export const profiles = pgTable(
  'profiles',
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => {
    return {
      idxProfilesEmail: index('idx_profiles_email').using(
        'btree',
        table.email.asc().nullsLast(),
      ),
    };
  },
);

// Chat conversation tracking
export const chat = pgTable('Chat', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  title: text().notNull(),
  userId: uuid().notNull(),
  visibility: varchar().default('private').notNull(),
});

// Chat messages (using v2 as primary)
export const messageV2 = pgTable(
  'Message_v2',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatId: uuid().notNull(),
    role: varchar().notNull(),
    parts: jsonb().notNull(),
    attachments: jsonb().notNull(),
    sessionId: varchar('session_id'),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      messageV2ChatIdFkey: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: 'Message_v2_chatId_fkey',
      }),
    };
  },
);

// Generated artifacts (code, documents, etc.)
export const document = pgTable(
  'Document',
  {
    id: uuid().defaultRandom().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    title: text().notNull(),
    content: text(),
    kind: varchar().default('text').notNull(),
    userId: uuid().notNull(),
  },
  (table) => {
    return {
      documentPkey: primaryKey({
        columns: [table.id, table.createdAt],
        name: 'Document_pkey',
      }),
    };
  },
);

// User feedback on messages
export const vote = pgTable(
  'Vote_v2',
  {
    chatId: uuid().notNull(),
    messageId: uuid().notNull(),
    isUpvoted: boolean().notNull(),
  },
  (table) => {
    return {
      voteV2ChatIdFkey: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: 'Vote_v2_chatId_fkey',
      }),
      voteV2MessageIdFkey: foreignKey({
        columns: [table.messageId],
        foreignColumns: [messageV2.id],
        name: 'Vote_v2_messageId_fkey',
      }),
      voteV2Pkey: primaryKey({
        columns: [table.chatId, table.messageId],
        name: 'Vote_v2_pkey',
      }),
    };
  },
);

// AI suggestions for improvements
export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    documentId: uuid().notNull(),
    documentCreatedAt: timestamp({ mode: 'string' }).notNull(),
    originalText: text().notNull(),
    suggestedText: text().notNull(),
    description: text(),
    isResolved: boolean().default(false).notNull(),
    userId: uuid().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      suggestionDocumentIdDocumentCreatedAtFkey: foreignKey({
        columns: [table.documentId, table.documentCreatedAt],
        foreignColumns: [document.id, document.createdAt],
        name: 'Suggestion_documentId_documentCreatedAt_fkey',
      }),
    };
  },
);

// Streaming data for real-time features
export const stream = pgTable(
  'Stream',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatId: uuid().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      streamChatIdFkey: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: 'Stream_chatId_fkey',
      }),
    };
  },
);

// Type exports for TypeScript integration
export type DBMessage = typeof messageV2.$inferSelect;
export type Chat = typeof chat.$inferSelect;
export type Document = typeof document.$inferSelect;
export type Suggestion = typeof suggestion.$inferSelect;
export type Vote = typeof vote.$inferSelect;
