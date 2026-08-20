# Diary: Browse + filter EV screen with fake data (Option A)

First buildable slice of the EV comparison app, per `PRD.md` and `CONSTITUTION.md`: an Angular app with a single browse/filter screen backed by hardcoded sample data, proving the budget/range-with-tolerance recommendation flow plus strict feature/country filters. No backend, no comparison mode, no images, no risk indicators yet — those are later iterations.

## Step 1: Scaffold Angular app and build the browse/filter screen

**Author:** main

### Prompt Context

**Verbatim prompt:** "Let's go with the option A" (choosing among iteration options proposed by `/suggest-next-iteration`), followed by clarifying answers: 15+ sample cars, include the budget/range tolerance-based recommendation logic, plain Angular + SCSS (no UI library), defer car images.

**Interpretation:** Build a real, running Angular app (not a mockup) with a filter form (budget, desired range, feature checkboxes, country-of-origin checkboxes) over a hardcoded `cars.json` dataset, where entering a budget/range surfaces near-matches as "Recommended" rather than excluding them, per PRD user story 1.

**Inferred intent:** Get something visually running end-to-end as fast as possible to validate the core value proposition (recommend + filter) before investing in real data or a backend.

### What I did

Scaffolded a new Angular workspace at `/app` via `ng new app --style=scss --routing=false --ssr=false --skip-git`. Added:

- `/app/public/data/cars.json` — 17 hand-written sample EVs spanning Japan (Toyota, Nissan, Honda, Lexus), Germany (VW, BMW, Audi, Mercedes-Benz, Porsche), South Korea (Hyundai, Kia x2, Genesis), and China (BYD, MG, XPeng, Polestar), each with `id`, `brand`, `model`, `country`, `price` (DKK), `range` (km), `features: string[]`.
- `/app/src/app/core/models/car.model.ts` — the `Car` interface.
- `/app/src/app/core/services/car.service.ts` — `CarService.getCars()` fetches `data/cars.json` via `HttpClient`, kept as the single seam for swapping in a real API later.
- `/app/src/app/features/car-browser/car-browser.component.{ts,html,scss}` — the filter form and results grid, using Angular signals for state (`budget`, `desiredRange`, `selectedFeatures`, `selectedCountries`) and `computed()` for derived `strictlyFiltered`, `recommendedCars`, `otherCars`.
- Wired `provideHttpClient()` into `/app/src/app/app.config.ts`, and swapped the generated `App` component's template for `<app-car-browser />`.
- Rewrote the generated `/app/src/app/app.spec.ts` (the default test asserted on the scaffold's "Hello, app" title, which no longer exists) to assert the car browser renders, adding `provideHttpClient()`/`provideHttpClientTesting()` to the test bed since `CarService` now injects `HttpClient`.

Filtering logic: country and feature selections are strict (a car must match all selected countries/features to appear at all). Budget and range, when entered, don't exclude — instead cars within ±50,000 DKK / ±50 km are split into a "Recommended for you" section, with everything else that still passes the strict filters shown under "Other options". With no budget/range entered, everything is shown under "All cars".

Verified end-to-end: `ng build` succeeds, `ng test --watch=false` passes (2/2), and `ng serve --port 4300` serves both the app shell and `GET /data/cars.json` correctly (checked with `curl`).

### Why

The constitution locks in Angular/TypeScript with no backend for v1 and data behind a service interface — `CarService` is that interface. The tolerance-based recommendation logic is the one piece of "real" product behavior worth proving even in a fake-data iteration, since it's the main thing that differentiates this from a plain filter UI.

### What worked

Angular's new-style `computed()` signals made the three-way split (strict filter → recommended vs. other) fall out naturally as a small chain of `computed()` calls with no manual change-detection wiring. Standalone components (no NgModule) kept the file count low for a one-screen app.

### What didn't work

Two build errors surfaced during `ng build`, both fixed immediately:

1. The system's default Node (v24.14.0, via a pre-existing `nvm` install) is below the Angular CLI's minimum. Running `npx @angular/cli@latest version` failed with: `The Angular CLI requires a minimum Node.js version of v22.22.3 or v24.15.0 or v26.0.0.` Fixed by `nvm install 22`, which pulled Node v22.23.2, and running all subsequent `ng` commands via `nvm use 22` first.
2. The template used `{{ car.price | number }}` without importing `DecimalPipe`, producing `NG8004: No pipe found with name 'number'` at two locations in `car-browser.component.html` (lines 66 and 89 pre-fix). Fixed by importing `DecimalPipe` from `@angular/common` and adding it to the component's `imports` array.

### What I learned

Recent Angular CLI versions (v18+) serve static assets from `/public` at the app root rather than `/src/assets` — `ng new` here generated a `public/` directory with `angular.json`'s asset glob pointing at it, not `src/assets`. Placed `cars.json` at `/app/public/data/cars.json` accordingly, so it's fetched at runtime as `data/cars.json` (relative to the app's base href) rather than `assets/data/cars.json`, which is what most Angular tutorials still assume.

Also, backgrounded `ng serve` emits a "completed" task notification almost immediately even though the dev server process is still alive and serving — the notification reflects the initial build finishing under watch mode, not process exit. Confirmed the process was still running via `ps aux` before treating "completed" as a signal to investigate a crash.

### What was tricky

Getting the tolerance logic's UX right without over-building: rather than a single filtered list, splitting results into "Recommended" (within tolerance) and "Other options" (fails tolerance but passes strict filters) directly encodes PRD story 1 ("don't hide close matches") without needing a numeric scoring/ranking system, which felt like scope creep for this iteration.

### What warrants review

- `/app/src/app/features/car-browser/car-browser.component.ts` — the tolerance constants (`BUDGET_TOLERANCE_DKK = 50000`, `RANGE_TOLERANCE_KM = 50`) and the `isWithinTolerance` logic are the one piece of actual product behavior in this iteration; worth confirming the ±-both-directions interpretation matches what was intended (a cheaper-than-budget car currently still counts as "recommended" as long as it's within 50k of the entered figure).
- `/app/public/data/cars.json` — sample data only; prices/ranges are plausible but not researched/verified, since real data population is explicitly a later iteration per the constitution.

### Future work

- Real data population (replacing the hand-written `cars.json` with researched Danish-market data) is a separate, later task per the constitution — not implied by this iteration's code, but the obvious next dependency for anything beyond this fake-data slice.
- Comparison mode, images, and risk indicators remain out of scope for this iteration per the `/suggest-next-iteration` decision and should be picked up in a fresh session's `/suggest-next-iteration` run, not appended here.
