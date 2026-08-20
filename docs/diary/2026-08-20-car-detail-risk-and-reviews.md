# Diary: Car detail view with risk indicators and external review links

Third buildable slice of the EV comparison app, per `PRD.md` (user stories 5 & 6) and `CONSTITUTION.md`. Builds on the browse/filter screen (`/docs/diary/2026-08-20-browse-filter-fake-data.md`) and the comparison mode (`/docs/diary/2026-08-20-comparison-mode.md`); adds a per-car detail screen showing recall history, battery degradation, resale value, and curated external review/forum links. Still no backend, no images, no price breakdown.

## Step 1: Add risk-indicators data, DetailService, and CarDetailComponent

**Author:** main

### Prompt Context

**Verbatim prompt:** "lets build option A next." (choosing among iteration options proposed by `/suggest-next-iteration`: A — car detail view with risk indicators + external links, B — car images, C — price breakdown).

**Interpretation:** Build a per-car detail view surfacing recall history, battery degradation, and resale value, plus curated external review/forum links, reachable from the existing browse screen.

**Inferred intent:** Close out the PRD's trust/risk user stories (5 & 6), which are the app's other major differentiator besides comparison mode, while keeping the iteration to one new fake-data domain (risk indicators) rather than touching the existing `Car` model.

### What I did

- Added `/app/public/data/risk-indicators.json` — a flat map from each of the 25 existing car IDs (confirmed via `python3` against `cars.json`) to a `recalls` count/summary, a `batteryDegradation` estimated-retention-at-100k-km figure with a note, a `resaleValue` rating (`Strong`/`Average`/`Weak`) with a note, and two `reviewLinks`. The review links are generated YouTube/Reddit *search* URLs (e.g. `https://www.youtube.com/results?search_query=Toyota+bZ4X+review`) rather than fabricated specific article URLs, so every link actually resolves to real, relevant content instead of a fake or dead page.
- Added `/app/src/app/core/models/risk-indicator.model.ts` defining the `RiskIndicator` shape.
- Extended `/app/src/app/core/services/car.service.ts` with `getRiskIndicators()`, following the same `shareReplay(1)`-cached-Observable pattern as `getCars()`/`getFeaturePricing()`.
- Added `/app/src/app/core/services/detail.service.ts` — a small signal store (`openCarId: string | null`) with `openDetail(id)`/`closeDetail()` and an `isOpen` computed, mirroring `ComparisonService`'s shape since this app still has no router.
- Added `/app/src/app/features/car-detail/car-detail.component.{ts,html,scss}` — fetches cars and risk indicators, resolves the active car via `DetailService.carId()`, and renders the car's overview (brand/model/country/price/range/features) plus a risk-indicators section and a "Further reading" list of external links (`target="_blank" rel="noopener"`).
- Wired `/app/src/app/app.ts` / `app.html` into a three-way `@if`/`@else if`/`@else` chain: detail view takes priority over comparison, which takes priority over browse. Closing the detail view just clears `DetailService`'s state, so the user lands back wherever they were (browse or comparison) without needing to track a return destination.
- Added a "View details" button to each car card in `/app/src/app/features/car-browser/car-browser.component.html` (both the "Recommended" and "Other options" sections), calling `detailService.openDetail(car.id)`.
- Verified with `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged — no new test coverage added for the detail view). Also started `ng serve --port 4300` in the background and confirmed via `curl` that the app shell and `data/risk-indicators.json` both serve correctly.

### Why

Risk indicators went through `CarService` rather than being fetched directly in the component, per the constitution's requirement to keep data access behind a clean service interface. `DetailService` exists for the same reason `ComparisonService` does: there's no router in this app, so switching between browse/compare/detail "screens" needs some shared, injectable state, and a small signal store is the smallest thing that works.

### What worked

Reusing the exact `ComparisonService` shape (signal + computed `isOpen`) for `DetailService` made it a fast, low-risk addition — no new patterns introduced. Making the detail view take priority in the `@if`/`@else if` chain (over comparison, which is itself over browse) meant no extra state was needed to remember "where did the user come from" — the underlying screen's own open/closed state was untouched the whole time.

### What didn't work

Nothing failed during implementation. `ng build` and `ng test` both passed on the first run after the changes.

### What I learned

Using search-query URLs (YouTube/Reddit search results) instead of fabricated specific article links was a deliberate choice to avoid the failure mode of the earlier fake-data files: `cars.json` and `feature-pricing.json` are internally-consistent fake numbers that never claim to point anywhere, but a fabricated *review link* with a specific fake title would look like a real citation and could mislead. Search-query URLs give a functioning, genuinely relevant destination without pretending a specific article exists.

### What was tricky

Deciding where the "View details" entry point should live. The comparison table was also a candidate (each column could link to its own detail view), but I scoped this iteration to the browse screen only, matching how the PRD frames stories 5 and 6 around browsing/evaluating a car, not the comparison flow specifically. Adding detail links from the comparison table is a reasonable follow-up if the user wants it.

### What warrants review

- `/app/public/data/risk-indicators.json` — the recall counts, battery retention percentages, and resale ratings are plausible estimates for demo purposes, not researched figures, same caveat as `cars.json` and `feature-pricing.json`.
- `/app/src/app/features/car-detail/car-detail.component.ts` — the `risk` computed does a plain object lookup (`this.riskIndicators()[this.detailService.carId() ?? '']`) and returns `null` if missing; worth confirming that's the desired behavior if a future car is added to `cars.json` without a matching risk-indicators entry (the detail view still renders the overview but silently omits the risk/review sections in that case).
- No unit tests were added for `DetailService` or `CarDetailComponent` — same gap as `ComparisonService`/`ComparisonComponent` from the previous iteration.

### Future work

- Test coverage for the detail flow (opening from a card, rendering risk data, closing back to the prior screen) is an obvious gap, same as the comparison flow before it.
- "View details" links from the comparison table are a natural follow-up if useful during a comparison session.
- Car images (option B) and the price breakdown (option C) from the last `/suggest-next-iteration` menu remain unbuilt.
