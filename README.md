# Pattern Vault

A living knowledge base for capturing, connecting, and resurfacing insights. Built with Next.js, Neon, and Prisma.

## Features

- **Quick Capture** — Capture thoughts, decisions, and insights with structured tagging
- **PARA Organization** — Projects, Areas, Resources, Archive classification
- **Connection Engine** — Link related notes and discover patterns
- **Daily Prompts** — Guided reflection with automatic note creation
- **Full-text Search** — Find anything instantly

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon (PostgreSQL)
- **ORM:** Prisma
- **Auth:** NextAuth.js with Google
- **Styling:** Tailwind CSS + custom design system
- **Animations:** Framer Motion

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/LearningEverythingFirstTIme/ai-pattern-vault.git
cd ai-pattern-vault
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `DATABASE_URL` — Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — From Google Cloud Console

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT
