# Diary: Exterior color customization/preview

Tenth buildable slice of the EV comparison app, per `PRD.md`'s Out of Scope section — which lists "Exterior color customization/preview (deferred to v2)" as the one remaining explicitly-flagged deferred candidate not yet picked, now that warranty/service info (the other flagged candidate) shipped earlier this session. Adds a per-car color swatch selector to the detail view that affects the displayed and total price.

## Step 1: Color data domain, service wiring, and detail-view swatch selector

**Author:** main

### Prompt Context

**Verbatim prompt:** `/suggest-next-iteration`, followed by the user picking "Exterior color customization/preview" via `AskUserQuestion` among three options offered (the other two being "Unit test coverage" and "Data verification pass").

**Interpretation:** Let a buyer pick an exterior color per car and see how that choice affects price — premium/metallic paints commonly cost extra in the Danish EV market — rather than a literal photorealistic color-swapped render of the car.

**Inferred intent:** Close the last PRD-flagged "candidate for later" deferred feature now that warranty info is also done, while working within the real constraint that `car-images.json` holds a single stock Wikimedia photo per car rather than per-color renders, so a true photo preview isn't achievable from the existing data source.

### What I did

- Added `/app/src/app/core/models/color.model.ts` defining `ColorOption { name, hex, priceDelta }`.
- Created `/app/public/data/colors.json` — a flat `Record<carId, ColorOption[]>` matching the existing flat-map pattern — populated for all 25 cars in `cars.json` with 3–5 plausible colors each: one free base color (`priceDelta: 0`) plus 2–4 metallic/pearl paid options in a realistic Danish-market range (3,500–12,900 DKK, with Tesla's "Ultra Red" and other halo colors priced highest, matching how real EV configurators price premium paint).
- Extended `/app/src/app/core/services/car.service.ts` with `getColors(): Observable<Record<string, ColorOption[]>>`, following the same `shareReplay(1)`-cached-fetch pattern as every other data domain.
- Extended `/app/src/app/features/car-detail/car-detail.component.ts` with a `colors` signal, a `selectedColorByCarId` signal (`Record<carId, colorName>` so the pick persists per car if you navigate away and back), a `carColors` computed, and a `selectedColor` computed that defaults to the car's first (free) color when nothing has been explicitly picked yet. Folded `selectedColor()?.priceDelta` into the existing `carPrice` computed so it flows through to `totalEstimatedCost` automatically without touching `pricing.ts`.
- Added a swatch row to the hero section of `/app/src/app/features/car-detail/car-detail.component.html`, below the existing feature chips: circular color-swatch buttons (`background-color` set inline from each color's hex), a selected-state ring, and a label showing the active color's name plus "included" or its price delta. Added a matching conditional line item to the pricing breakdown section so the paint surcharge (when non-zero) shows up alongside the feature and accessory line items, ahead of the estimated total.
- Ran `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged). Cross-checked with `python3` that `colors.json`'s 25 keys exactly match `cars.json`'s 25 ids.

### Why

Kept color data behind `CarService` as its own JSON file rather than adding fields to `cars.json`, per the constitution's data-behind-a-service-layer rule and consistent with how `warranty.json` was kept separate earlier this session. Priced most base colors at 0 DKK and premium finishes higher, mirroring how EV manufacturers actually structure paint pricing — makes the feature double as a small, honest illustration of PRD user story 7 (standard price vs. add-on costs) rather than a decorative-only picker.

### What worked

Routing the color price delta through the existing `carPrice` computed (rather than introducing a parallel `colorPrice` computed and updating every downstream consumer) meant `totalEstimatedCost` picked it up for free, with no changes needed to `pricing.ts` or the comparison view. This mirrors how `accessoriesTotal` was already layered on top of `carTotalPrice` — same additive-composition pattern applied one level earlier.

### What didn't work

Nothing failed in the build/type-check pass. Deliberately did not attempt a per-color image swap or CSS-based recoloring overlay on the existing car photo — `car-images.json` has one stock Wikimedia photo per car, and neither swapping in nonexistent per-color image URLs (there is no such data available offline) nor faking a tint filter over a photo of a specific real color would produce an accurate preview; a swatch-only picker was the honest scope given the data available.

### What I learned

Real EV color pricing in the Danish/EU market clusters distinctly: legacy manufacturers (BMW, Audi, Mercedes, Porsche) charge some of the highest premiums for exclusive metallics (7,000–9,500 DKK), Tesla treats black and white as both free (a departure from most brands, which charge for black too) but prices its halo color (Ultra Red) far above everyone else (12,900 DKK), and budget-oriented entrants (Fiat, BYD, MG) keep every paid color under 5,000 DKK — a genuine, if secondary, signal about a brand's pricing philosophy that fits the PRD's country/brand-trust angle (user story 2) reasonably well.

### What was tricky

Nothing structurally tricky. The only judgment call was keying `selectedColorByCarId` by car id in a single signal (rather than resetting to the default color every time the detail view opens a different car) — chose per-car persistence since it's a near-zero-cost way to avoid a mildly annoying UX papercut (losing your pick when you tab between two cars you're comparing) and it follows the same "remember state across navigation" spirit as `ComparisonService`'s selection set.

### What warrants review

- `/app/public/data/colors.json` — like the warranty and range-window data before it, these are plausible estimates based on general knowledge of each brand's real-world color lineups and typical EU paint-surcharge pricing, not independently re-verified against manufacturer configurators or Danish-specific dealer pricing. Worth folding into the data-verification pass already flagged in the warranty diary (also raised again this session as an alternative option, not picked this time).
- Not verified in an actual browser per the user's standing instruction not to spin up a dev server for this project — worth a visual check that the swatch row reads well under the feature chips, that the selected-state ring is visible against light and dark swatch colors alike (e.g. white swatches on a light theme), and that the aria-label/aria-pressed wiring on the swatch buttons behaves sensibly with a screen reader.
- No unit tests were added for the `selectedColor` computed's default-to-first-color / per-car-persistence logic — same standing test-coverage gap flagged in every prior iteration's diary (raised again this session as an alternative option, not picked this time).

### Future work

- Unit test coverage remains the standing, ever-growing gap across every feature built so far — flagged again, still not picked.
- A joint data-verification pass across `warranty.json`, `colors.json`, and the earlier-flagged range windows is a reasonable next-session candidate now that all three PRD-deferred/flagged items have accumulated.
- If a future iteration wants per-color photo previews for real, that would require sourcing actual per-color car images during the offline data-population step — out of reach for this iteration given only single stock photos are available per car.
