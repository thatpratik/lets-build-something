# Diary: Price breakdown (standard price vs. accessory/service charges)

Fourth buildable slice of the EV comparison app, per `PRD.md` (user story 7) and `CONSTITUTION.md`. Builds on the browse/filter screen, comparison mode, and car detail view already shipped; adds a "Pricing breakdown" section to the detail view showing the standard market price separate from typical Danish accessory/service charges, plus an estimated total.

## Step 1: Add accessories data, `getAccessories()`, and the pricing breakdown section

**Author:** main

### Prompt Context

**Verbatim prompt:** "Price breakdown" (chosen via `AskUserQuestion` among three options offered by `/suggest-next-iteration`: price breakdown, car images, and test coverage — after scanning `PRD.md`, `CONSTITUTION.md`, and the existing app to find user story 7 was the one remaining PRD story with zero implementation).

**Interpretation:** Build story 7 — show the car's standard market price separate from additional accessory/service charges, so a buyer understands the true total cost — as a new section on the existing car detail view.

**Inferred intent:** Close the last unaddressed PRD user story with the smallest possible slice, reusing the established fake-data-behind-a-service-layer pattern rather than introducing new mechanics. This is deliberately distinct from the comparison mode's feature-price toggling (`feature-pricing.json`), which answers "what would a different feature set cost," not "what does a buyer still pay on top of today's price."

### What I did

- Added `/app/public/data/accessories.json` — a flat array of four typical Danish-market line items (`Delivery & registration fee`, `Winter tire package`, `Home charger installation`, `Extended service plan (3 years)`) each with a DKK price, applying uniformly to every car (mirroring how `feature-pricing.json` is a flat map rather than per-car).
- Added `/app/src/app/core/models/accessory.model.ts` defining `Accessory { name: string; price: number }`.
- Extended `/app/src/app/core/services/car.service.ts` with `getAccessories(): Observable<Accessory[]>`, following the exact `shareReplay(1)`-cached-fetch pattern already used by `getCars()`/`getFeaturePricing()`/`getRiskIndicators()`.
- Extended `/app/src/app/features/car-detail/car-detail.component.ts`: fetches accessories at construction time (same pattern as the existing `cars`/`riskIndicators` subscriptions), and adds two computed signals — `accessoriesTotal` (sum of accessory prices) and `totalEstimatedCost` (car price + `accessoriesTotal`, or `null` if no car is resolved).
- Added a "Pricing breakdown" section to `/app/src/app/features/car-detail/car-detail.component.html`, placed after the overview section and before the risk-indicators section: a "Standard market price" line, one line per accessory prefixed with `+`, and a bolded "Estimated total" line, plus a short caption clarifying that accessory/service charges aren't included in the standard price.
- Verified with `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged — no new test coverage added, consistent with the gap already flagged in prior iterations' diaries). Also started `ng serve --port 4300` in the background and confirmed via `curl` that both the app shell and `data/accessories.json` serve correctly (200 on both, and the JSON body matches what was written).

### Why

Accessories went through `CarService` rather than being fetched directly in the component, per the constitution's requirement to keep data access behind a clean service interface — the same reason every other data domain in this app (`cars`, `feature-pricing`, `risk-indicators`) is exposed that way. Scoping the new section to the detail view (not touching `Car`, `CarBrowserComponent`, or `ComparisonComponent`) matches how risk indicators and review links were scoped to detail-only in the prior iteration.

### What worked

Reusing the exact `shareReplay(1)` pattern for `accessories$` and the exact construction-time-subscribe pattern for populating `CarDetailComponent`'s signals meant no new architectural decisions were needed — just following what `risk-indicators` already established.

### What didn't work

Nothing failed during implementation. `ng build` and `ng test` both passed on the first run after the changes.

### What I learned

Nothing new technically — this iteration was a straight repetition of an established pattern (flat JSON file → service method with `shareReplay(1)` → component signal populated at construction → template section), which is exactly why it was fast and low-risk.

### What was tricky

Deciding what counts as a "standard vs. extra" split for fake data. Rather than inventing per-car accessory eligibility (which would require deciding, without real data, which cars get which add-ons), every car gets the same four typical Danish-market line items — this keeps the fake data honestly generic (it doesn't pretend to know a specific car's actual optional-extras catalog) while still proving out the UI and total-cost math the PRD story asks for.

### What warrants review

- `/app/public/data/accessories.json` — the DKK figures (4,500–12,000 range) are plausible estimates for demo purposes, not researched figures, same caveat as `cars.json`, `feature-pricing.json`, and `risk-indicators.json`.
- `/app/src/app/features/car-detail/car-detail.component.ts` — `totalEstimatedCost` returns `null` when `car()` is `null`; the template only reads it inside the `@if (car(); as c)` block, so this can't currently render as blank, but it's worth confirming if the component's structure ever changes.
- No unit tests were added for the accessories fetch or the pricing breakdown section — same test-coverage gap already flagged for `ComparisonService`/`ComparisonComponent`/`DetailService`/`CarDetailComponent` in prior diaries.

### Future work

- Mid-task, the user flagged two related data-model gaps to fold into a future iteration (not built in this step): (1) a car's **range** shouldn't be a single fixed number — different trims/models of the same car (e.g. different battery packs for a Tesla Model Y) can have a real range, so the model needs a min–max range and the browse UI should move to a range slider rather than a single desired-range input; (2) similarly, a car's **price** shouldn't be a single fixed number either — it varies with which features/trim are selected, so pricing needs to be modeled as a base price plus feature-driven variation rather than one static figure. Both were added to `PRD.md`'s "Further Notes" as explicit candidates for a future `/suggest-next-iteration` cycle, since they affect the `Car` data model and touch the browse/filter, comparison, and detail screens together — too large to fold into this already-shipped, narrowly-scoped price-breakdown slice.
- Car images (deferred twice already) and test coverage remain unbuilt, per the `/suggest-next-iteration` menu this iteration was chosen from.
