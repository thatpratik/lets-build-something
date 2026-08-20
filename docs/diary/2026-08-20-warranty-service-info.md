# Diary: Warranty / free-service period info

Ninth buildable slice of the EV comparison app, per `PRD.md`'s Out of Scope section — which lists "Warranty/free-service period info" as explicitly deferred for v1 but calls out (in Further Notes) that deferred features are "explicit candidates for later iterations, not permanently excluded." Adds vehicle warranty, battery warranty, and included free-service period per car to the detail view.

## Step 1: New data domain, service wiring, and detail-view section

**Author:** main

### Prompt Context

**Verbatim prompt:** `/suggest-next-iteration`, followed by the user picking "Warranty / free-service period info" via `AskUserQuestion` among three options offered (the other two being "Unit test coverage" and "Exterior color customization/preview").

**Interpretation:** Surface warranty length (vehicle and battery, in years and km) and included free scheduled-service period for each car, alongside the existing pricing breakdown and risk indicators on the detail view — as an offline-curated data domain, not a paid service-extension purchase flow (that half of the original Out of Scope bullet stays out of scope; only the informational half was picked).

**Inferred intent:** Close one of the PRD's explicitly-flagged "candidate for later" deferred features now that all original v1 user stories and both flagged data-model changes are shipped, while being careful not to touch any of the JSON files another Claude session is mid-flight on overhauling with real researched data.

### What I did

- Added `/app/src/app/core/models/warranty.model.ts` defining `WarrantyInfo { vehicleWarrantyYears, vehicleWarrantyKm, batteryWarrantyYears, batteryWarrantyKm, freeServiceYears, note }`, using `km: 0` as the sentinel for "unlimited mileage" (several EU brands' statutory 2-year warranty is unlimited-km) rather than a separate boolean field.
- Created a brand-new `/app/public/data/warranty.json` — a flat `Record<carId, WarrantyInfo>` matching the existing flat-map pattern used by `feature-pricing.json`/`risk-indicators.json` — populated for all 25 cars in `cars.json` using known public EU-market manufacturer warranty terms (e.g., Kia/MG's 7-year/150,000 km vehicle+battery warranty, Hyundai's 5-year unlimited-km vehicle warranty, most legacy EU brands' 2-year unlimited-km statutory minimum plus an 8-year/160,000 km battery warranty, Tesla's 4-year/80,000 km vehicle warranty with battery km caps that vary by trim). Deliberately created as a new, separate file rather than adding fields to `cars.json`, so this iteration has zero overlap with the files the other in-flight session is rewriting.
- Extended `/app/src/app/core/services/car.service.ts` with `getWarranty(): Observable<Record<string, WarrantyInfo>>`, following the same `shareReplay(1)`-cached-fetch pattern as every other data domain in the service.
- Extended `/app/src/app/features/car-detail/car-detail.component.ts` with a `warranty` signal (populated at construction) and a `warrantyInfo` computed (looked up by the active `detailService.carId()`, same pattern as `risk`). Added a `warrantyLabel(years, km)` helper method that formats each stat as `"<n> yr / <km> km"` or `"<n> yr / unlimited km"`, using `toLocaleString('da-DK')` for thousands separators consistent with the Danish-market scope.
- Added a "Warranty & service" section to `/app/src/app/features/car-detail/car-detail.component.html`, positioned between the pricing breakdown and risk-indicators sections, with a three-stat grid (vehicle warranty, battery warranty, free service years) matching the existing risk-indicators section's card layout, plus the per-car freeform `note` underneath.
- Ran `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged). Cross-checked with `python3` that `warranty.json`'s 25 keys exactly match `cars.json`'s 25 ids (no missing or extra entries).

### Why

Kept warranty data behind `CarService` and out of `cars.json` itself, per the constitution's data-behind-a-service-layer rule and to sidestep any merge collision with the other Claude session's data overhaul (which is rewriting `cars.json`, `risk-indicators.json`, `car-images.json`, `feature-pricing.json`, and `accessories.json`, but not introducing a warranty file). Scoped strictly to the informational half of the original Out of Scope bullet — no paid service-extension purchase flow was built, since that remains explicitly out of scope per the PRD.

### What worked

Initially tried writing the km-or-unlimited fallback inline in the template as a mixed `{{ }}` interpolation with an embedded `@if`/`@else` block for the km suffix. Recognized before building that mixing Angular's block-level `@if` control flow with inline text interpolation inside a single `<p>` was an unnecessary risk to template parsing, and moved the formatting into a plain `warrantyLabel()` TypeScript method instead — simpler, and matches how `resaleToneClasses`/`batteryTone` already handle presentation logic in this same component.

### What didn't work

Nothing failed in the build/type-check pass. No `.price`-style call-site sweep was needed here since this is a purely additive new data domain with no renamed fields.

### What I learned

Real EU EV warranty terms vary in a specific, recognizable way: legacy European brands (VW, BMW, Audi, Mercedes, Porsche, Renault, Peugeot, Fiat) mostly rely on the 2-year unlimited-mileage EU statutory minimum without a distinct extended vehicle warranty, while Korean and Chinese entrants (Hyundai, Kia, Genesis, BYD, MG) compete partly on longer stated warranties (5–7 years) as a market-entry differentiator — a genuine, useful signal for the "which brands I trust" comparison PRD user story 2 asks for, not just filler data.

### What was tricky

Nothing structurally tricky. The only judgment call was the `km: 0` sentinel for "unlimited" rather than adding a separate `unlimited: boolean` field — chose the sentinel to keep the model shape minimal, since `WarrantyInfo` is a small, single-purpose interface and a car's warranty km figure realistically never needs to be exactly zero for any other reason.

### What warrants review

- `/app/public/data/warranty.json` — like the range windows from an earlier iteration, these are plausible estimates based on general knowledge of each brand's public EU warranty terms, not independently re-verified against a manufacturer source or Danish-specific dealer terms (which can differ slightly from EU-wide baseline warranties). The `freeServiceYears` figures in particular are lower-confidence guesses (mostly 0–1, with Genesis's bundled ownership program at 3) since free-service-inclusion practices are less publicly standardized than warranty length/mileage. Worth a dedicated data-verification pass alongside the range-windows one already flagged.
- `xpeng-g6`'s entry is flagged in its own `note` field as lower-confidence than the rest, since XPeng is newer to the Danish market and its warranty terms are less publicly established than legacy or Korean competitors.
- Not verified in an actual browser per the user's standing instruction not to spin up a dev server for this project — worth a visual check that the new three-stat grid reads well between the pricing breakdown and risk-indicators sections on the detail view.
- No unit tests were added for the new `warrantyLabel()` formatting logic or the `warrantyInfo` computed — the same standing test-coverage gap flagged in every prior iteration's diary (raised again this session as an alternative option, not picked this time).

### Future work

- Unit test coverage remains the standing, ever-growing gap across every feature built so far.
- Exterior color customization/preview remains the other PRD-flagged deferred-to-v2 candidate not yet picked.
- Once the other Claude session's real-data overhaul lands, `warranty.json` is untouched by that effort and should compose cleanly with it — but a joint data-verification pass across both `warranty.json` and the overhauled files would be a reasonable next-session candidate.
