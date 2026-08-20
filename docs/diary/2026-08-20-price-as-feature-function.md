# Diary: Price as a function of features

Seventh buildable slice of the EV comparison app, per `PRD.md`'s "Further Notes" (the price-as-a-function-of-features candidate) and `CONSTITUTION.md`. This closes the second of the two explicitly-deferred data-model changes flagged alongside the range-as-a-range iteration: a car's price varies depending on which features/trim are selected, so `Car.price` moves from a single static figure to a `basePrice` plus the sum of its included features' prices (using the existing `feature-pricing.json` map), rather than one fixed number per car.

## Step 1: Model, data, and shared pricing logic

**Author:** main

### Prompt Context

**Verbatim prompt:** `/suggest-next-iteration`, followed by the user picking "Price as a function of features" via `AskUserQuestion` among three options offered (the other two being "Comparison table car images" and a "Data verification pass" on the range windows from the prior iteration).

**Interpretation:** Change `Car.price` from a static final figure to `Car.basePrice` (the price with no optional features fitted), with the displayed/total price for a car computed as `basePrice + sum(featurePricing[f] for f in included features)`, and thread that computed price through browse, detail, and comparison consistently instead of each screen treating price differently.

**Inferred intent:** Close out the second of the two data-model changes explicitly flagged in `PRD.md`'s Further Notes, and — since the comparison screen already had ad hoc feature-toggle pricing logic — consolidate that into a single shared, reusable computation rather than leaving three different notions of "a car's price" across the app.

### What I did

- Found that `ComparisonComponent` (`/app/src/app/features/comparison/comparison.component.ts`) already computed a feature-driven price for the comparison screen: it treated `car.price` as a fixed baseline that already included the car's original features, then added/subtracted `feature-pricing.json` amounts when a feature was toggled on/off relative to that original set. Browse and detail, however, both just displayed the static `car.price` untouched — so "price as a function of features" was half-done and inconsistently modeled.
- Changed `/app/src/app/core/models/car.model.ts`: renamed `Car.price: number` to `Car.basePrice: number` — the price with zero optional features fitted.
- Added `/app/src/app/core/pricing.ts` with two pure functions shared across all three feature components: `carTotalPrice(car, featurePricing, activeFeatures = car.features)` (base price plus the sum of pricing for whichever features are active) and `carFeatureLineItems(car, featurePricing)` (each included feature paired with its price, for breakdown displays).
- Rewrote all 25 entries in `/app/public/data/cars.json` via a one-off Python script: for each car, `basePrice = old price - sum(feature-pricing.json[f] for f in car.features)`, so the total price a user previously saw is unchanged, it's just now decomposed into base + per-feature costs instead of being one opaque number.
- Updated `/app/src/app/features/car-browser/car-browser.component.ts`: added a `featurePricing` signal (fetched via the existing `CarService.getFeaturePricing()`), and a `totalPriceFor(car)` method wrapping `carTotalPrice`. Budget-tolerance matching (`isWithinTolerance`) now compares against `totalPriceFor(car)` instead of the old `car.price`. Updated both `car.price` display spots in `car-browser.component.html` (recommended-cars list and other-cars list) to call `totalPriceFor(car)`.
- Updated `/app/src/app/features/car-detail/car-detail.component.ts`: added a `featurePricing` signal, a `featureLineItems()` computed (via `carFeatureLineItems`), and a `carPrice()` computed (via `carTotalPrice`) replacing the direct `car.price` reference in `totalEstimatedCost`. Updated `car-detail.component.html`'s pricing-breakdown section: renamed "Standard market price" to "Base price" showing `c.basePrice`, added a line item per included feature (mirroring the existing accessories line-item style) showing its price contribution, and updated the header price display and footnote copy to reflect that price now varies by fitted features.
- Simplified `ComparisonComponent`'s `carPrices` computed: it previously iterated `allFeatures()` checking `hadFeature`/`hasFeatureNow` to add or subtract deltas against the old baked-in `car.price`. Now it just calls `carTotalPrice(car, pricing, carActiveFeatures)` per compared car — base price plus whichever features are currently toggled on, with no delta-tracking needed since `basePrice` has no features baked in.
- Ran `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged).

### Why

Kept the computation in one shared `core/pricing.ts` module rather than duplicating the "base + sum of feature prices" logic three times across browse, detail, and comparison — the comparison screen already had its own bespoke version of this idea, and duplicating it a second and third time for browse/detail would have made the three screens drift out of sync on rounding or edge-case handling. Deriving `basePrice` from the old `price` minus its own features' costs (rather than picking arbitrary new base prices) preserved every car's previously-displayed total, so this is a modeling change with no visible price regression for existing cars.

### What worked

The comparison screen's `carPrices` logic actually got *simpler* after the change, not more complex: once `basePrice` has no features priced in, there's no need to compare "did this feature already contribute to the baseline" — every active feature is a plain addition. This confirmed the model change was the right direction rather than just extra machinery.

### What didn't work

Nothing failed in the build/type-check pass. Grepped for `car.price` and `.price` across `src/app` both before and after the edits to confirm no call site was missed; the only remaining `.price` references are `accessory.price`, `item.price` (the new feature line items), and the pure-function internals in `pricing.ts`.

### What I learned

The existing comparison-mode feature toggling (from an earlier iteration) was effectively half of this PRD item already — it just modeled the "no-feature baseline" implicitly via delta-tracking against the original price instead of as an explicit `basePrice` field. Making the base price explicit in the data model let the comparison logic drop the implicit-baseline bookkeeping entirely.

### What was tricky

Regenerating `basePrice` for all 25 cars in `cars.json` had to be done programmatically (base = old price − sum of that car's own features' listed prices) rather than by hand, to guarantee the previously-shown total price didn't silently drift for any car — a manual pass risked arithmetic slips across 25 entries.

### What warrants review

- `/app/public/data/cars.json` — the derived `basePrice` values are arithmetically exact relative to the old `price` figures and the existing `feature-pricing.json` map, but worth a glance to confirm the derivation reads as sensible base prices (e.g., no car ends up with a suspiciously low or negative base price) rather than treating them as independently re-researched figures.
- No unit tests were added for `carTotalPrice`/`carFeatureLineItems` in `/app/src/app/core/pricing.ts` or the updated browse/detail computations — the same standing test-coverage gap flagged in every prior iteration's diary.
- Not verified in an actual browser per the user's standing instruction not to spin up a dev server for this project — worth confirming visually that the detail screen's new per-feature breakdown lines read well alongside the existing accessories section.

### Future work

- The comparison table still doesn't show a car image per column (flagged in two prior diaries as a small polish item); unaffected by this iteration.
- A dedicated data-verification pass on the range windows introduced in the prior iteration remains an open candidate, flagged again as one of the options offered this session.
