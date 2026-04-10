This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Auto Deploy

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that deploys to the VPS on every push to `main`.

Configure these GitHub Actions secrets before using it:

- `VPS_HOST`: VPS public IP or hostname
- `VPS_PORT`: SSH port, for example `22`
- `VPS_USER`: SSH user, for example `root`
- `VPS_SSH_KEY`: private key contents for the VPS deploy key

The workflow deploys to `/www/wwwroot/winner`, rebuilds the app, and restarts the PM2 process `winner` on port `3002`.

## Supabase Trigger Flow

The app is being aligned to this architecture:

- Dashboard creates the `article_sessions` row only
- Supabase trigger or Edge Function sends `{ "id": "<session_id>" }` to n8n
- n8n reads the full dataset from Supabase, runs AI agents, sends WAHA notifications, and writes results back

For the SaaS user model, store login-related profile data in `profiles`, including `whatsapp_number` and `whatsapp_opt_in`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
