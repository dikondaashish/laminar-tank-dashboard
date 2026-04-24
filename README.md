# Laminar Tank Dashboard

This is my submission for the Laminar frontend coding exercise.

The dataset tracks operation cycles from a fictitious industrial factory — each row is one
tank cycle with a start/end time, tank name, estimated savings, and measured resource usage.

Dataset: https://gist.github.com/anuragmitra4/438023264eeb039fe2e7280176c7a0a3

---

## What I built

A single-page analytics dashboard that covers all the functional requirements. When I first
explored the dataset, I noticed Tank 2 tended to have longer average cycle durations compared
to the others — I considered adding a per-tank breakdown chart for that, but kept the scope
tight and focused on getting the core requirements right.

**KPI cards** — six summary metrics that update live based on the active filters:

- Total Water (gal) and Total Energy (kWh)
- Water Saved (gal) and Energy Saved (kWh)
- Avg Cycle Duration (sec)
- Efficiency (%)

**Filtering** — by tank (All, Tank 1, Tank 2, etc.) and by time range (All, Last 4 Days,
Last 7 Days, or a custom date range with validation).

> **Note on time filters:** The dataset is historical, so "Last 4 Days" and "Last 7 Days"
> will return empty results if run today. Use the **Custom** range or **All** to see actual
> data. The app defaults to "All" for this reason.

**Chart** — a responsive bar chart showing water usage by date across the filtered range.

---

## Why this stack

- **Next.js + React** — this is my primary stack and I can move fastest in it. Honestly,
  for a single-page static dashboard, plain Vite + React would've been the leaner choice
  and I'd probably use that in a greenfield production context. I went with Next.js here
  because I wanted to spend my time on the problem, not on tooling decisions.
- **TypeScript** — the dataset has occasional null and missing fields. Having typed shapes
  made the normalization logic explicit and caught a few edge cases early that I would've
  missed otherwise.
- **Recharts** — straightforward to integrate, composable, and doesn't require a lot of
  configuration to get a clean responsive chart.
- **Tailwind CSS** — fast utility-first styling that keeps things consistent without writing
  custom CSS. The exercise said clean UI over pretty UI, and Tailwind is good for exactly that.

---

## Code structure

```
app/page.tsx              — filter state, filtering logic, chart data prep, page layout
src/utils/fetchData.ts    — fetches the gist on load, normalizes shape, fills missing values
src/utils/calculations.ts — computes all six KPI values from a filtered dataset
src/components/Chart.tsx  — reusable responsive bar chart wrapping Recharts
src/types/index.ts        — TankCycle type definition
```

Most of the logic is in `page.tsx`. For a take-home of this scope I kept it centralized
on purpose — easier to follow and faster to iterate. In a real codebase I'd split this
into smaller hooks and components (see Trade-offs below).

---

## Notes on calculations

**Avg Duration** — mean of `(end_time - start_time)` in seconds across the filtered cycles.

**Efficiency** — `(waterSaved / (totalWater + waterSaved)) * 100`

This is a custom approximation, not an industry standard formula. It treats efficiency as
the fraction of total potential resource use that was actually saved by Laminar's technology.
If there's a domain-specific formula Laminar uses internally, I'd want to align to that.

---

## Trade-offs and what I'd fix with more time

**Typing** — `page.tsx` still has some `any[]` types that should be properly typed. The
filtering and chart data prep sections are the main offenders. I'd tighten these before
shipping to production.

**Tests** — the highest-priority targets would be the filtering logic (especially the custom
date range validation — there are edge cases around timezone handling I haven't fully covered)
and the KPI calculation functions. I'd move calculations out of the component into a fully
tested utility module.

**Component structure** — the page is doing too much. I'd extract the filter bar, KPI grid,
and chart into their own components and push the filtering logic into a custom hook.

**Error and empty states** — error handling exists but it's basic. There's no dedicated
full-page error UI and the empty state when filters return no data could be clearer.

**URL-persisted filters** — being able to share a specific filtered view via URL would be
useful in a real ops context. I'd add this with `next/navigation` and `searchParams`.

---

## Running it locally

Prerequisites: Node.js 18+ and npm. No API keys or environment variables needed — the app
fetches the dataset directly from the public gist on load.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:3000).

```bash
# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## AI usage

I used Cursor during development, but only for small things — autocomplete on
repetitive boilerplate, the occasional syntax nudge, and a few wording suggestions in this
README. Nothing structural came from it. The architecture, the filtering logic, the
efficiency formula, and all the data normalization decisions were things I worked through
myself. Every Copilot suggestion I accepted was something I read, understood, and would've
written myself with a bit more time.

---

## Deployed link

https://laminar-tank-dashboard.vercel.app