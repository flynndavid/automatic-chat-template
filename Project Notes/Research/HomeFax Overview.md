# HomeFax (formerly HomeHub) — Business Plan (Updated July 2025)

## Executive Summary

**Problem:**  
Homeowners and insurance agents lack a centralized, verifiable, and accessible way to understand insurance policies, track home maintenance, and document improvements. This leads to poor claims documentation, limited transparency, and missed opportunities for risk reduction and pricing accuracy.

**Solution:**  
HomeFax is an AI-powered tool that reads and interprets insurance policies, answers customer questions, and stores a persistent history of home maintenance, improvements, and communication. Think of it as "Carfax for homes" — combining AI, property history, and agent-integrated tools to streamline service, improve claims, and enhance trust.

---

## Product Overview

### Core Features (Phase 1)

1. **Policy Interpreter + AI Chatbot**  
   - Automatically extracts and interprets insurance policy documents.  
   - Provides plain-language answers to homeowner questions 24/7 via website widget or app.  
   - Includes agent review queue before answers are shared externally.

2. **Persistent Communication Log**  
   - Immutable registry of all homeowner-agent interactions and AI responses.  
   - Useful for compliance, claims documentation, and dispute prevention.

3. **Policy Ingestion Options**  
   - Agents can forward policy emails (CC HomeFax) or upload documents.  
   - Future: API sync with agency management systems.

4. **Home History Archive** (Phase 2)  
   - Verified contractor-submitted repairs and improvements.  
   - AI-validated homeowner uploads (photos, receipts, service dates).  
   - Generates shareable "HomeFax Report" for insurers, buyers, and adjusters.

5. **Insurance API & Adjuster Toolkit**  
   - API access to structured data for underwriting insights.  
   - Optional module for photo/video claim submission with timestamped logs.

---

## Market Opportunity

- **US homeowners**: 80M+
- **Home insurance market**: $173B+/year
- **Independent insurance agencies**: 39,000+
- **Comparable Models**: Carfax, Lemonade, Notion, Certificial

---

## Monetization Strategy

### 1. Agency SaaS Pricing
- $10/year per policy (tiered bulk pricing)
- Free trial for first 100 policies

### 2. Real Estate & Contractor Channels
- HomeFax Reports as add-on during listings ($25/report)
- Verified contractor submissions (free to homeowner, upsell for contractors)

### 3. Insurance Partnerships
- B2B API access for underwriting
- Referral partnerships with insurtech and regional carriers

---

## Go-To-Market Strategy

### Phase 1: Agency Adoption
- Pilot with Valor Insurance (Easton) in August
- Deploy widget on agency websites
- Market as service differentiator and workload reducer

### Phase 2: Property Data Expansion
- Onboard verified contractors to add repairs and maintenance data
- Begin homeowner data import from emails/photos

### Phase 3: Insurance + Real Estate
- API integrations with carrier systems
- Add HomeFax Reports to Zillow, Redfin listings

---

## Competitive Advantage

- **AI + Human Review:** Reduces risk of hallucination while saving time
- **Always-On Interface:** Agents sleep, HomeFax doesn’t
- **Property-Level Memory:** Maintains a structured history of the property, not just the policy
- **Flexible Delivery:** Widget, app, or backend API — fits agency workflows

---

## Technical Architecture

- **API-first backend** with role-based permissions
- **LLM-based retrieval** with citation logic from chunked policy PDFs
- **Frontend:** React (web widget), React Native (mobile app)
- **Database:** Supabase/Postgres
- **AI stack:** OpenAI / Claude, plus vision models for image/video verification
- **Security:** SOC 2 roadmap, PII redaction, encrypted storage

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| AI inaccuracy | Agent approval queue; confidence threshold gating |
| Agency tech stack limitations | Provide email-based or CSV fallback |
| Regulatory complexity | Partner with legal/compliance advisors; follow GLBA + state privacy laws |
| Adoption inertia | Free trial and real ROI demo; leverage contractor referrals |

---

## Roadmap & Milestones

| Date | Milestone |
|------|-----------|
| Aug 2025 | Valor pilot (live chatbot + ingestion test) |
| Nov 2025 | Public MVP + 10 pilot agencies onboarded |
| Q1 2026 | Add verified contractor logging + HomeFax Passport reports |
| Q3 2026 | Launch insurance API + adjuster toolkit |
| 2027 | Series A + property data marketplace (MLS/permit APIs) |

---

## Team
- **Founder**: David Flynn — Full-stack dev with real estate + insurtech experience
- **Co-Founder**: Rathi Niyogi — Product strategist with background in enterprise SaaS and AI
- **Advisors (target)**: Insurance exec, legal compliance lead, senior adjuster

---

## Funding Ask

- **$500K seed round**
- Covers 12-month runway: MVP build, pilot support, SOC 2 planning, and compliance groundwork
- Goal: Validate traction with 10+ agencies, begin API discussions with insurance carriers

---

## Summary
HomeFax is reinventing how insurance agencies and homeowners interact with policy information and home data. By creating an always-on, trusted layer of AI-assisted service and verifiable history, HomeFax brings clarity, efficiency, and modern UX to a legacy industry. The long-term opportunity is a cross-industry data network for homes—backed by verified events, trusted agents, and intelligent software.

