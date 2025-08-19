<a href="https://homefax.ai/">
  <img alt="HomeFax.ai - AI Insurance Policy Assistant" src="app/(chat)/opengraph-image.png">
  <h1 align="center">HomeFax.ai</h1>
</a>

<p align="center">
    AI-powered insurance policy interpretation and home history platform. Get instant answers about your insurance coverage in plain English.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- **AI Insurance Policy Interpreter**: Converts complex insurance documents into plain English
- **Agent Review Dashboard**: Human-in-the-loop validation for AI responses
- **Home History Archive**: Verifiable maintenance and improvement tracking
- **Communication Registry**: Immutable log of all interactions for compliance
- **24/7 Homeowner Support**: Instant answers about insurance coverage

### Technical Stack

- [Next.js](https://nextjs.org) App Router with React Server Components
- [AI SDK](https://sdk.vercel.ai/docs) for LLM integration and chat interfaces
- [Supabase](https://supabase.com) for authentication and data persistence
- [shadcn/ui](https://ui.shadcn.com) with [Tailwind CSS](https://tailwindcss.com) for modern UI
- [Drizzle ORM](https://orm.drizzle.team) for type-safe database operations

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Development Setup

HomeFax.ai is built for insurance agencies to provide AI-powered policy interpretation to their clients.

## Running Locally

You will need to set up environment variables for Supabase, AI providers, and other services.

> Note: You should not commit your `.env` file or it will expose secrets.

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up your environment variables (see `.env.example`)
4. Run database migrations: `pnpm db:migrate`
5. Start the development server: `pnpm dev`

Your HomeFax.ai application should now be running on [localhost:3000](http://localhost:3000).
