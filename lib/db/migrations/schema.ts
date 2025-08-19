import { pgTable, index, unique, uuid, text, jsonb, timestamp, integer, foreignKey, boolean, varchar, date, numeric, primaryKey, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const contactType = pgEnum("contact_type", ['agent', 'lsr', 'sr', 'adjuster', 'manager'])



export const insuranceCarriers = pgTable("insurance_carriers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	carrierCode: text("carrier_code").notNull(),
	billingPortalUrl: text("billing_portal_url"),
	claimsPortalUrl: text("claims_portal_url"),
	coiPortalUrl: text("coi_portal_url"),
	idCardPortalUrl: text("id_card_portal_url"),
	contactInfo: jsonb("contact_info").default({}),
	supportedStates: text("supported_states").array().default([""]),
	ezlynxIntegration: jsonb("ezlynx_integration").default({}),
	apiEndpoints: jsonb("api_endpoints").default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxCarriersCode: index("idx_carriers_code").using("btree", table.carrierCode.asc().nullsLast()),
		idxCarriersStates: index("idx_carriers_states").using("gin", table.supportedStates.asc().nullsLast()),
		insuranceCarriersCarrierCodeKey: unique("insurance_carriers_carrier_code_key").on(table.carrierCode),
	}
});

export const agencies = pgTable("agencies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	agencyCode: text("agency_code").notNull(),
	subscriptionTier: text("subscription_tier").default('basic'),
	subscriptionStatus: text("subscription_status").default('active'),
	onboardingConfig: jsonb("onboarding_config").default({}),
	routingPreferences: jsonb("routing_preferences").default({}),
	activePoliciesCount: integer("active_policies_count").default(0),
	billingInfo: jsonb("billing_info").default({}),
	primaryContactEmail: text("primary_contact_email"),
	primaryContactPhone: text("primary_contact_phone"),
	address: jsonb().default({}),
	ezlynxCredentials: jsonb("ezlynx_credentials").default({}),
	calendarIntegration: jsonb("calendar_integration").default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxAgenciesCode: index("idx_agencies_code").using("btree", table.agencyCode.asc().nullsLast()),
		idxAgenciesSubscription: index("idx_agencies_subscription").using("btree", table.subscriptionStatus.asc().nullsLast()),
		agenciesAgencyCodeKey: unique("agencies_agency_code_key").on(table.agencyCode),
	}
});

export const insuranceContacts = pgTable("insurance_contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	agencyId: uuid("agency_id"),
	contactType: contactType("contact_type").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	phone: text(),
	licenseNumber: text("license_number"),
	statesLicensed: text("states_licensed").array().default([""]),
	calendarLink: text("calendar_link"),
	specializations: text().array().default([""]),
	availabilitySchedule: jsonb("availability_schedule").default({}),
	routingPriority: integer("routing_priority").default(1),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxContactsActive: index("idx_contacts_active").using("btree", table.isActive.asc().nullsLast()),
		idxContactsAgency: index("idx_contacts_agency").using("btree", table.agencyId.asc().nullsLast()),
		idxContactsEmail: index("idx_contacts_email").using("btree", table.email.asc().nullsLast()),
		idxContactsType: index("idx_contacts_type").using("btree", table.contactType.asc().nullsLast()),
		insuranceContactsAgencyIdFkey: foreignKey({
			columns: [table.agencyId],
			foreignColumns: [agencies.id],
			name: "insurance_contacts_agency_id_fkey"
		}).onDelete("cascade"),
	}
});

export const policies = pgTable("policies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	policyNumber: text("policy_number").notNull(),
	carrier: text().notNull(),
	policyType: text("policy_type").default('homeowners').notNull(),
	policyPeriod: jsonb("policy_period").notNull(),
	status: text().default('active').notNull(),
	property: jsonb().notNull(),
	coverages: jsonb().notNull(),
	deductibles: jsonb(),
	endorsements: jsonb().default([]),
	premium: jsonb().notNull(),
	mortgagees: jsonb().default([]),
	agent: jsonb(),
	documents: jsonb().default([]),
	stateSpecific: jsonb("state_specific").default({}),
	rawData: jsonb("raw_data"),
	dataSource: text("data_source"),
	ingestionMetadata: jsonb("ingestion_metadata").default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	policyholderId: uuid("policyholder_id"),
	carrierId: uuid("carrier_id"),
	agencyId: uuid("agency_id"),
},
(table) => {
	return {
		idxPoliciesAgency: index("idx_policies_agency").using("btree", table.agencyId.asc().nullsLast()),
		idxPoliciesCarrier: index("idx_policies_carrier").using("btree", table.carrier.asc().nullsLast()),
		idxPoliciesCoveragesGin: index("idx_policies_coverages_gin").using("gin", table.coverages.asc().nullsLast()),
		idxPoliciesDataSource: index("idx_policies_data_source").using("btree", table.dataSource.asc().nullsLast()),
		idxPoliciesEffectiveDate: index("idx_policies_effective_date").using("btree", sql`(policy_period ->> 'effective_date'::text)`),
		idxPoliciesEndorsementsGin: index("idx_policies_endorsements_gin").using("gin", table.endorsements.asc().nullsLast()),
		idxPoliciesPolicyNumber: index("idx_policies_policy_number").using("btree", table.policyNumber.asc().nullsLast()),
		idxPoliciesPolicyType: index("idx_policies_policy_type").using("btree", table.policyType.asc().nullsLast()),
		idxPoliciesPolicyholderId: index("idx_policies_policyholder_id").using("btree", table.policyholderId.asc().nullsLast()),
		idxPoliciesPremiumGin: index("idx_policies_premium_gin").using("gin", table.premium.asc().nullsLast()),
		idxPoliciesPropertyGin: index("idx_policies_property_gin").using("gin", table.property.asc().nullsLast()),
		idxPoliciesState: index("idx_policies_state").using("btree", sql`((property -> 'address'::text) ->> 'state'::text)`),
		idxPoliciesStatus: index("idx_policies_status").using("btree", table.status.asc().nullsLast()),
		policiesAgencyIdFkey: foreignKey({
			columns: [table.agencyId],
			foreignColumns: [agencies.id],
			name: "policies_agency_id_fkey"
		}),
		policiesCarrierIdFkey: foreignKey({
			columns: [table.carrierId],
			foreignColumns: [insuranceCarriers.id],
			name: "policies_carrier_id_fkey"
		}),
		policiesPolicyholderIdFkey: foreignKey({
			columns: [table.policyholderId],
			foreignColumns: [policyholders.id],
			name: "policies_policyholder_id_fkey"
		}).onDelete("cascade"),
		policiesPolicyNumberKey: unique("policies_policy_number_key").on(table.policyNumber),
	}
});

export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
});

export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	userId: uuid().notNull(),
	visibility: varchar().default('private').notNull(),
},
(table) => {
	return {
		chatUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_fkey"
		}),
	}
});

export const policyholders = pgTable("policyholders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	holderId: text("holder_id").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	dateOfBirth: date("date_of_birth").notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	mailingAddress: jsonb("mailing_address").notNull(),
	additionalInfo: jsonb("additional_info").default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxPolicyholdersEmail: index("idx_policyholders_email").using("btree", table.email.asc().nullsLast()),
		idxPolicyholdersHolderId: index("idx_policyholders_holder_id").using("btree", table.holderId.asc().nullsLast()),
		idxPolicyholdersLastName: index("idx_policyholders_last_name").using("btree", table.lastName.asc().nullsLast()),
		idxPolicyholdersMailingAddress: index("idx_policyholders_mailing_address").using("gin", table.mailingAddress.asc().nullsLast()),
		policyholdersHolderIdKey: unique("policyholders_holder_id_key").on(table.holderId),
	}
});

export const policySummary = pgTable("policy_summary", {
	id: uuid(),
	policyNumber: text("policy_number"),
	carrier: text(),
	policyType: text("policy_type"),
	status: text(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	holderId: text("holder_id"),
	propertyAddress: text("property_address"),
	propertyCity: text("property_city"),
	propertyState: text("property_state"),
	propertyZip: text("property_zip"),
	effectiveDate: date("effective_date"),
	expirationDate: date("expiration_date"),
	annualPremium: numeric("annual_premium"),
	dwellingCoverage: text("dwelling_coverage"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const policySearch = pgTable("policy_search", {
	id: uuid(),
	policyNumber: text("policy_number"),
	carrier: text(),
	status: text(),
	holderId: text("holder_id"),
	searchableText: text("searchable_text"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text(),
	mailingAddress: jsonb("mailing_address"),
	property: jsonb(),
	coverages: jsonb(),
	endorsements: jsonb(),
	premium: jsonb(),
	rawData: jsonb("raw_data"),
});

export const message = pgTable("Message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	content: jsonb().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		messageChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_chatId_fkey"
		}),
	}
});

export const messageV2 = pgTable("Message_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	parts: jsonb().notNull(),
	attachments: jsonb().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		messageV2ChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_v2_chatId_fkey"
		}),
	}
});

export const suggestion = pgTable("Suggestion", {
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
			name: "Suggestion_documentId_documentCreatedAt_fkey"
		}),
		suggestionUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Suggestion_userId_fkey"
		}),
	}
});

export const stream = pgTable("Stream", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		streamChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Stream_chatId_fkey"
		}),
	}
});

export const vote = pgTable("Vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
},
(table) => {
	return {
		voteChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Vote_chatId_fkey"
		}),
		voteMessageIdFkey: foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "Vote_messageId_fkey"
		}),
		votePkey: primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_pkey"}),
	}
});

export const voteV2 = pgTable("Vote_v2", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
},
(table) => {
	return {
		voteV2ChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Vote_v2_chatId_fkey"
		}),
		voteV2MessageIdFkey: foreignKey({
			columns: [table.messageId],
			foreignColumns: [messageV2.id],
			name: "Vote_v2_messageId_fkey"
		}),
		voteV2Pkey: primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_v2_pkey"}),
	}
});

export const document = pgTable("Document", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	content: text(),
	kind: varchar().default('text').notNull(),
	userId: uuid().notNull(),
},
(table) => {
	return {
		documentUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Document_userId_fkey"
		}),
		documentPkey: primaryKey({ columns: [table.id, table.createdAt], name: "Document_pkey"}),
	}
});