# HomeFax Insurance Chatbot

## Overview

Insurance chatbot that works 24/7, instantly pulls policy info and routes questions to the right person while staying compliant. Customers get faster answers, staff handles fewer calls, agencies sell more without hiring more people.

## Baseline Principles

- **Regulatory Compliance**: Bot must adhere to all regulatory and legal requirements and make clear that any guidance must be confirmed by the agency
- **Supportive Language**: Language will be supportive, recognize policyholder urgency and drive human interaction when appropriate
- **Message Registry**: A message registry will be part of functionality for legal + compliance benefits
  > **Development Note**: Determine required hold period and estimate long-term cost impact
- **Proper Routing**: All bot interactions require routing to appropriate contact person as defined during agency onboarding

## Key Functions

### Claims
The bot can answer basic coverage questions by referencing policy documents (via EZLynx links). Bot routes the interaction to a Licensed Service Representative (LSR) for paper trail and scheduling.

### Endorsements (Policy Changes)
Policy change requests must be handled by an LSR, and the bot will route these requests directly to them.
> **Note**: Is calendar scheduling required for this action?

### New Leads
Any sales lead will be routed to the appropriate Agent using the agent's calendar link for scheduling.

### Billing
For billing questions, the bot will direct the customer to either an LSR or the carrier's billing portal.

### Certificates of Insurance (COI)
Requests will be routed to an LSR and, if available to the carrier, to a specified website (defined during onboarding).
> **Note**: We could make manual follow up an option if policyholder does not want to do the legwork

### ID Cards
The bot can direct customers to obtain their ID cards from the carrier site and/or route the request to an LSR or Service Representative (SR).

### Policy Copies
Requests for policy copies will be routed to an SR. The bot will also retrieve the document via EZLynx if available.

## Technical Setup

During onboarding, the agency will provide:
- Carrier site links
- Document access credentials (e.g., EZLynx)
- Calendar booking links (e.g., Calendly)

**No deep software integration is required** — the system will rely on link-based routing and document lookup.

## Goal

Our goal with this chatbot is to reduce the manual handling of common requests, improve customer response speed, and ensure each request is routed to the right person or system without confusion.