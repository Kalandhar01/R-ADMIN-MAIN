# Ractysh Construction Site

Next.js construction website workspace prepared for Aceternity UI components.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn CLI registry setup
- Aceternity UI registry alias
- Motion for React

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Add Aceternity Components

Install components one by one as the page is designed:

```bash
npx shadcn@latest add @aceternity/[component]
```

Example:

```bash
npx shadcn@latest add @aceternity/3d-marquee
```
