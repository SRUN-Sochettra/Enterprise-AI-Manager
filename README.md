# Test-Next

A full-stack internal management dashboard built with **Next.js 16**, featuring employee & product CRUD, AI-powered tools (Gemini), authentication, and a polished UI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI, shadcn/ui, Framer Motion
- **AI:** Google Generative AI (Gemini) — chat, vision, sentiment analysis, translation
- **Auth:** NextAuth.js v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Features

- **Authentication** — Login page with protected routes via NextAuth and a custom `AuthContext`
- **Dashboard** — Overview page with data visualizations
- **Employee Management** — Full CRUD (create, read, update, delete), search by ID, sortable table
- **Product Management** — Full CRUD, search by ID, AI-assisted image generation, sortable table
- **AI Tools** — Gemini chatbot, smart search, sentiment analyzer, text translator, AI dashboard
- **Responsive Layout** — Collapsible sidebar, top bar, and mobile-friendly navigation
- **Loading States** — Skeleton components for pages, tables, cards, and headers

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.js               # Root layout (Navbar, Providers)
│   ├── page.js                 # Home / landing page
│   ├── login/                  # Login page
│   ├── dashboard/              # Dashboard page
│   ├── employees/              # Employee management (with loading state)
│   ├── products/               # Product management (with loading state)
│   ├── ai/                     # AI tools page
│   ├── search/                 # Search page
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   └── api/                    # API routes
│       ├── auth/               # NextAuth endpoints
│       ├── dashboard/          # Dashboard data API
│       ├── gemini/             # Gemini chat API
│       ├── gemini-models/      # Gemini model listing API
│       ├── search/             # Search API
│       ├── sentiment/          # Sentiment analysis API
│       ├── translate/          # Translation API
│       └── vision/             # Vision/image analysis API
├── components/
│   ├── Navbar.jsx              # Global navigation bar
│   ├── Providers.js            # Client-side providers wrapper
│   ├── ProtectedAction.js      # Auth-gated action wrapper
│   ├── ChatBot.js              # Chatbot widget
│   ├── GeminiChat.js           # Gemini chat interface
│   ├── AIDashboard.js          # AI tools dashboard
│   ├── SmartSearch.js          # AI-powered search component
│   ├── SentimentAnalyzer.js    # Text sentiment analysis tool
│   ├── TranslateText.js        # Text translation component
│   ├── layouts/                # Sidebar & TopBar layout components
│   ├── skeletons/              # Loading skeleton components
│   ├── employee_components/    # Employee CRUD components
│   └── product_components/     # Product CRUD + AI image components
├── context/
│   └── AuthContext.js          # Authentication context provider
└── lib/
    ├── config.js               # App configuration
    ├── utils.js                # Utility functions
    └── api/                    # API helper modules
        ├── auth.js             # Auth helpers
        ├── authHelper.js       # Auth token utilities
        ├── categories.js       # Category API helpers
        ├── employees.js        # Employee API helpers
        └── products.js         # Product API helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root with the required keys (NextAuth secret, Google Generative AI API key, etc.).

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Google Generative AI](https://ai.google.dev/docs)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Recharts](https://recharts.org/en-US/)

## Deploy on Vercel

The easiest way to deploy this app is on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
