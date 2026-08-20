# Diary: Side-by-side comparison mode with live feature toggling

Second buildable slice of the EV comparison app, per `PRD.md` (user stories 3 & 4) and `CONSTITUTION.md`: let a user select multiple cars from the browse screen and compare them side-by-side, with the ability to add/remove individual features per car and see the resulting price delta. Builds on the browse/filter screen from `/docs/diary/2026-08-20-browse-filter-fake-data.md`; still no backend, no images, no risk indicators.

## Step 1: Add comparison selection, comparison view, and live feature-price toggling

**Author:** main

### Prompt Context

**Verbatim prompt:** "Let's go with option A" (choosing among iteration options proposed by `/suggest-next-iteration`, having been shown a summary of the browse/filter screen already built and offered: A — comparison mode, B — car detail view with risk indicators/external links, C — car images).

**Interpretation:** Build the comparison feature described in the PRD: select 2+ cars from the existing browse screen, view them side-by-side with full feature breakdowns, and dynamically add/remove features within the comparison to see how price shifts per car/brand.

**Inferred intent:** Ship the app's most distinctive feature (per the PRD, the thing that differentiates it from a plain filter UI) while staying inside the constitution's no-backend, fake-data constraints — this iteration only needed one new fake-data file (feature price deltas), no new domain of information like risk indicators would require.

### What I did

- Added `/app/public/data/feature-pricing.json` — a flat map of the six existing feature names (drawn from the current `cars.json` vocabulary: Adaptive Cruise Control, Advanced Security Suite, Head-Up Display, Heated Seats, Premium Sound System, Sunroof) to a plausible DKK price delta each (verified the vocabulary was exactly these six via `python3 -c "... set of car['features'] ..."` over `cars.json`'s 25 cars before writing the file).
- Extended `/app/src/app/core/services/car.service.ts` with `getFeaturePricing()`, and added `shareReplay(1)` to both it and the existing `getCars()` so that the browse screen and the comparison screen (which both need the car list) share one HTTP fetch instead of issuing it twice.
- Added `/app/src/app/core/services/comparison.service.ts` — a small signal-based store (`selectedCarIds: Set<string>`, `comparisonOpen: boolean`) with `toggle()`, `clearSelection()`, `openComparison()`/`closeComparison()`, and a `selectionCount` computed. This is the shared seam between the browse screen and the comparison screen; there's no router in this app (per the original `ng new --routing=false`), so switching views is a plain `@if`/`@else` in the root `App` component driven by `comparisonService.isOpen()`.
- Modified `/app/src/app/features/car-browser/car-browser.component.{ts,html,scss}`: each car card now has a "Compare" checkbox bound to `comparisonService`, and a sticky bottom bar appears once at least one car is selected, showing the count plus "Clear" and "Compare" buttons (the latter disabled below 2 selections, since comparing a single car isn't meaningful).
- Added `/app/src/app/features/comparison/comparison.component.{ts,html,scss}`: fetches the full car list and feature pricing on construction, filters to the selected IDs, and renders a table with rows for country, range, price, and one row per feature (union of the fixed feature vocabulary) with a checkbox per car. Feature state per car is tracked locally as a `Map<carId, Set<string>>` seeded from each car's actual `features` array; price for a car is computed as its base `price` plus deltas for features toggled on that weren't originally included, minus deltas for features toggled off that were. A "Remove" button per column drops that car from the comparison (delegating to `comparisonService.toggle()`), and "Back to browse" calls `closeComparison()`.
- Wired `/app/src/app/app.ts` / `app.html` to switch between `<app-car-browser />` and `<app-comparison />` based on `comparisonService.isOpen()`.
- Verified with `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged from before — no test coverage was added for the new components in this step). Also started `ng serve --port 4300` in the background and confirmed via `curl` that it serves the app shell and the new `data/feature-pricing.json` file correctly.

### Why

The constitution requires data access behind a clean service interface, so feature pricing went through `CarService` like car data does, rather than being fetched ad hoc from the comparison component. The `ComparisonService` signal store exists because this app deliberately has no router (an earlier constraint, not revisited here) — sharing selection state across the two "screens" needed some mechanism, and an injectable signal store is the smallest thing that works without introducing routing.

### What worked

Reusing the same `Set`-toggle pattern already established in `car-browser.component.ts` (`toggleInSet`) for `ComparisonService.toggle()` kept the new service consistent with existing code style. Deriving `allFeatures()` in the comparison table from the feature-pricing file's keys (rather than from the selected cars' features) meant every comparison row is guaranteed to have a price delta available — no risk of a feature appearing in the table with no known cost.

### What didn't work

Nothing failed during implementation. `ng build` and `ng test` both passed on the first run after the changes.

### What I learned

Because `CarService.getCars()` didn't have `shareReplay(1)` before this step, opening the comparison view while the browse screen was still mounted would have triggered a second, redundant fetch of `cars.json`. Adding `shareReplay(1)` to the underlying `Observable` (rather than, say, caching in a signal) keeps `CarService`'s public shape (`Observable<Car[]>`) unchanged, so nothing consuming it needed to change.

### What was tricky

Deciding where "the currently active feature set for a car" should live. It's not part of the underlying `Car` data (that's the fixed catalog) and it's not part of `ComparisonService` either (that only tracks *which cars* are selected, not per-car feature toggles) — it's ephemeral UI state specific to one comparison session. It ended up local to `ComparisonComponent`, re-seeded from each car's real `features` array whenever the component is constructed (i.e., each time the user opens the comparison view fresh via the `@if`/`@else` swap, which destroys and recreates the component). This means toggled features are intentionally *not* preserved if a user backs out to browse and reopens the comparison — that felt like the right default (comparisons start from each car's real spec) but is worth confirming against user expectations.

### What warrants review

- `/app/src/app/features/comparison/comparison.component.ts` — the price computation in `carPrices` (add delta if a feature was toggled on but wasn't originally included, subtract if toggled off but was) is the one piece of real product logic here; worth double-checking the direction of the math against PRD user story 4 ("see how each choice shifts the price").
- `/app/public/data/feature-pricing.json` — the DKK deltas (8,000–12,000 range) are estimates for demo purposes, not researched figures, same caveat as `cars.json` itself.
- No unit tests were added for `ComparisonService` or `ComparisonComponent` in this step — the existing `app.spec.ts` only exercises the default (browse) view, so the comparison flow currently has zero automated coverage.

### Future work

- Test coverage for the comparison flow (selecting cars, opening the view, toggling a feature, verifying the price math) is an obvious gap left by this step.
- Car images and risk indicators remain out of scope for this iteration, per the options presented in `/suggest-next-iteration` (this session chose option A; options B and C were not pursued).
