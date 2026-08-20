## Language & Runtime

TypeScript, using Angular for the frontend.

## Architecture Principles

- No backend/API layer for v1 — the Angular app reads pre-populated JSON data files directly. A real backend/API can be introduced later if data volume or dynamic features force it.
- Data is populated offline (researched and written into JSON files ahead of time) — the running app never fetches or scrapes live.
- Keep data access behind a clean interface/service layer in the Angular app, so swapping static JSON for a real API later doesn't require touching consuming components.

## Fixed Dependencies

Angular (frontend framework), TypeScript.
