import { relations } from "drizzle-orm/relations";
import { agencies, insuranceContacts, policies, insuranceCarriers, policyholders, user, chat, message, messageV2, document, suggestion, stream, vote, voteV2 } from "./schema";

export const insuranceContactsRelations = relations(insuranceContacts, ({one}) => ({
	agency: one(agencies, {
		fields: [insuranceContacts.agencyId],
		references: [agencies.id]
	}),
}));

export const agenciesRelations = relations(agencies, ({many}) => ({
	insuranceContacts: many(insuranceContacts),
	policies: many(policies),
}));

export const policiesRelations = relations(policies, ({one}) => ({
	agency: one(agencies, {
		fields: [policies.agencyId],
		references: [agencies.id]
	}),
	insuranceCarrier: one(insuranceCarriers, {
		fields: [policies.carrierId],
		references: [insuranceCarriers.id]
	}),
	policyholder: one(policyholders, {
		fields: [policies.policyholderId],
		references: [policyholders.id]
	}),
}));

export const insuranceCarriersRelations = relations(insuranceCarriers, ({many}) => ({
	policies: many(policies),
}));

export const policyholdersRelations = relations(policyholders, ({many}) => ({
	policies: many(policies),
}));

export const chatRelations = relations(chat, ({one, many}) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
	messages: many(message),
	messageV2s: many(messageV2),
	streams: many(stream),
	votes: many(vote),
	voteV2s: many(voteV2),
}));

export const userRelations = relations(user, ({many}) => ({
	chats: many(chat),
	suggestions: many(suggestion),
	documents: many(document),
}));

export const messageRelations = relations(message, ({one, many}) => ({
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
	votes: many(vote),
}));

export const messageV2Relations = relations(messageV2, ({one, many}) => ({
	chat: one(chat, {
		fields: [messageV2.chatId],
		references: [chat.id]
	}),
	voteV2s: many(voteV2),
}));

export const suggestionRelations = relations(suggestion, ({one}) => ({
	document: one(document, {
		fields: [suggestion.documentId],
		references: [document.id]
	}),
	user: one(user, {
		fields: [suggestion.userId],
		references: [user.id]
	}),
}));

export const documentRelations = relations(document, ({one, many}) => ({
	suggestions: many(suggestion),
	user: one(user, {
		fields: [document.userId],
		references: [user.id]
	}),
}));

export const streamRelations = relations(stream, ({one}) => ({
	chat: one(chat, {
		fields: [stream.chatId],
		references: [chat.id]
	}),
}));

export const voteRelations = relations(vote, ({one}) => ({
	chat: one(chat, {
		fields: [vote.chatId],
		references: [chat.id]
	}),
	message: one(message, {
		fields: [vote.messageId],
		references: [message.id]
	}),
}));

export const voteV2Relations = relations(voteV2, ({one}) => ({
	chat: one(chat, {
		fields: [voteV2.chatId],
		references: [chat.id]
	}),
	messageV2: one(messageV2, {
		fields: [voteV2.messageId],
		references: [messageV2.id]
	}),
}));