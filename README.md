<a href="#">
  <!-- TODO: Update image and alt text -->
  <img alt="AI Health Assessment and Doctor Referral Chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">AI Health Assistant Chatbot</h1>
</a>

<p align="center">
    An AI-powered chatbot designed to help users assess their health symptoms, understand potential conditions (without diagnosing), gauge urgency, and find relevant doctors or clinics based on location, insurance, and needs.
</p>

<p align="center">
  <!-- Optional: Add links to specific sections if needed -->
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- **Symptom Assessment:** Engages users conversationally to understand symptoms.
- **General Health Information:** Provides information on potential conditions (educational purposes only).
- **Urgency Guidance:** Helps users understand the potential urgency of their symptoms.
- **Doctor/Clinic Referral:** Suggests healthcare providers based on user-provided location, insurance (optional), and specialty needs using a mock database.
- **Disclaimer:** Emphasizes that it's not a substitute for professional medical advice.
- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence (Optional - Currently uses mock data)
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) can be integrated for saving chat history and user data.
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage.
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication.

## Model Providers

This template ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the AI Health Assistant Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Generate%20a%20random%20secret%20to%20use%20for%20authentication&envLink=https%3A%2F%2Fgenerate-secret.vercel.app%2F32&project-name=my-health-chatbot&repository-name=my-health-chatbot&demo-title=AI%20Health%20Assistant&demo-description=An%20AI-powered%20chatbot%20for%20health%20assessment%20and%20doctor%20referral.&demo-url=https%3A%2F%2Fyour-deployment-url.vercel.app&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D) 

*Note: Replace the placeholder URLs in the deploy button link if you fork this repository.*

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run the chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).
