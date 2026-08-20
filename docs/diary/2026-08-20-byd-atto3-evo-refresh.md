# Diary: BYD Atto 3 → Atto 3 EVO data refresh

Prior diary entry (data verification pass, 2026-08-20) flagged that BYD Atto 3 was mid-transition to an "Atto 3 EVO" facelift on a new platform/battery, with Danish deliveries "expected June 2026" — noted as not wrong *yet*, so deliberately left uncorrected at the time. Today's date is 2026-08-20, past that expected date, so this pass closes that gap. Selected via AskUserQuestion from three next-iteration options presented after `/suggest-next-iteration` (unit tests and a country-of-manufacture-vs-brand-origin product decision were the other two, not picked).

## Step 1: Research and apply the EVO refresh

**Author:** main

### Prompt Context

**Verbatim prompt:** "BYD Atto 3 → Atto 3 EVO data refresh" (selected via AskUserQuestion)
**Interpretation:** Verify whether the EVO transition has actually happened in the Danish market by now, and if so, update `cars.json`, `warranty.json`, and `risk-indicators.json` for `byd-atto3` to reflect current reality rather than the outgoing model.
**Inferred intent:** Same as the prior verification pass — this is a buyer-decision tool per the PRD, so a stale entry for a car that's since been superseded in-market directly undermines the product's trust proposition.

### What I did

Used `WebSearch`/`WebFetch` directly (single car, didn't warrant spawning research subagents) to confirm the Atto 3 EVO is now the car actually sold in Denmark — BYD Denmark's own pricing page (bydauto.dk) and Danish EV sites (elbilguide.dk, mobilsiden.dk) confirm Design (RWD, 279,995 DKK, 510km WLTP) and Excellence (AWD, 299,995 DKK, 470km WLTP) trims are live, alongside a UK-sourced spec sheet giving 76kWh gross LFP battery and confirming feature gating: adaptive cruise control + heated front seats standard across trims, with head-up display, panoramic sunroof, and heated rear seats reserved for Excellence only.

Updated `/app/public/data/cars.json` for `byd-atto3`: renamed model from "Atto 3" to "Atto 3 EVO", widened `range` from 420–480 to 470–510 (min = Excellence AWD, max = Design RWD, per the two confirmed trims), and changed `features` from `["Heated Seats", "Premium Sound System"]` to `["Adaptive Cruise Control", "Heated Seats"]` to match what's actually standard (Premium Sound System was not supported by any source found). Recomputed `basePrice`: since this app's pricing model (`/app/src/app/core/pricing.ts`) is `basePrice + sum(featurePricing[f] for f in features)`, and the Design trim's all-in price is 279,995 DKK with Adaptive Cruise Control (8,000 DKK) and Heated Seats (4,000 DKK) baked in per `/app/public/data/feature-pricing.json`, basePrice became 268,000 DKK (279,995 − 8,000 − 4,000, rounded to match this dataset's round-thousands convention).

Updated `/app/public/data/warranty.json` for `byd-atto3`: `batteryWarrantyKm` raised from 160,000 to 200,000, matching BYD Denmark's own pricing page. Rewrote the `note` to record that BYD announced a global extension to 250,000km in January 2026 (per electrive.com), applied retroactively to existing owners, but that bydauto.dk itself still states 200,000km as of this pass — flagged as worth reconfirming rather than silently taking the more generous global figure.

Updated `/app/public/data/risk-indicators.json` for `byd-atto3`: left `batteryDegradation.estimatedRetentionAt100kKm` (92) and `resaleValue.rating` ("Weak") unchanged, since no EVO-specific data exists yet, but rewrote both notes to explicitly say the figures are carried over from the outgoing model pending real EVO-specific data, rather than silently implying they're EVO-verified.

Deliberately left `/app/public/data/colors.json` and `/app/public/data/car-images.json` untouched: the four colors already on file (Ski White, Parkour Grey, Surf Blue, Boulder Grey) matched what search results showed across markets (allowing for some region-specific naming drift, e.g. UK's "Parkour Red"/"Climbing Grey"), so there was no confirmed-wrong value to correct — inventing a new color lineup without a directly confirmed Danish source would have been guessing, not correcting. The car image (a generic Wikimedia Commons "BYD Atto 3.jpg") is unverified either way — not confirmed wrong, but also not confirmed to be the EVO facelift's face — and picking a different unverified image wouldn't have been a real improvement, so left as-is and flagged below instead.

Ran `python3 -c "import json; json.load(open(...))"` against all three touched files to confirm valid JSON, then `npx tsc --noEmit -p tsconfig.app.json` from `/app` to confirm nothing in the component/service layer broke (it didn't — same as the Honda e removal in the prior pass, nothing references car data by literal feature-array contents).

### Why

The whole point of flagging-instead-of-guessing in the prior pass was to revisit this once the transition date passed rather than leave a stale entry indefinitely. Per the PRD's problem statement, buyers use this tool specifically to avoid fragmented, out-of-date research — an EV listing built entirely on next-February's already-superseded specs (smaller battery, shorter range, cheaper price, old warranty terms) is exactly the kind of gap the tool exists to close.

### What worked

Since this touched exactly one car, going straight to `WebSearch`/`WebFetch` instead of spawning parallel research subagents (as the prior 25-car pass did) kept overhead low while still cross-checking multiple independent sources (BYD's own Danish pricing page, two independent Danish EV outlets, and a UK spec-sheet source for the feature-gating detail Danish sources didn't spell out).

### What didn't work

The first `WebFetch` attempt at `bydauto.dk/modeller/byd-atto-3/pris-og-detaljer` (BYD Denmark's official page) returned an HTTP 403 — the site appears to block the fetch tool's request. Fell back to `WebSearch`, which surfaced the same page's content indirectly via Danish EV outlets that had already scraped/summarized it (elbilguide.dk, mobilsiden.dk), so the underlying figures were still corroborated by the manufacturer's own numbers, just not fetched directly.

### What I learned

- This dataset's implicit invariant — `basePrice` is the *sum minus included feature costs*, not the sticker price itself — isn't written down anywhere (no comment in `pricing.ts`, no README note), so reconstructing it required reading `carTotalPrice()` and reverse-engineering the outgoing Atto 3 entry's numbers (266,000 base + 4,000 Heated Seats + 9,000 Premium Sound System ≈ 279,000, close to the real outgoing sticker price) before trusting that basePrice = sticker − included-feature-costs was the right formula to apply to the new figures too. Worth a one-line comment in `pricing.ts` or a note in `CONSTITUTION.md`/data-population docs for the next person (or agent) doing a data pass, so this doesn't have to be re-derived every time.
- BYD's warranty terms are a live-moving target even within 2026 — the global battery-warranty extension (January 2026, retroactive) hadn't yet propagated to BYD Denmark's own pricing page as of this pass, meaning "the manufacturer's own regional page" and "the manufacturer's own global press release" can genuinely disagree at a point in time. Worth treating the DK-facing page as the source of truth for what a Danish buyer is actually promised today, even when a more generous global figure exists.

### What was tricky

Deciding what to do with `colors.json` and `car-images.json` given imperfect color-name corroboration and an unverifiable image. Followed the same principle as the prior verification pass: only change values confirmed wrong today, not values merely unconfirmed — swapping in unverified colors or a different unverified image would trade one unverified state for another, not an improvement.

### What warrants review

- `/app/public/data/cars.json` — the `basePrice` figure (268,000 DKK) is derived arithmetically (sticker − included-feature-pricing) rather than a manufacturer-quoted "base" figure, so worth a sanity check that this derivation approach is actually what's wanted for this field long-term, especially as more trims/features get involved.
- `/app/public/data/warranty.json` — the note explicitly flags a 200,000km (DK page) vs 250,000km (global press release) discrepancy as unresolved; worth deciding which one to trust before this becomes a comparison point a buyer relies on.
- Not verified in a browser, per the user's standing instruction not to spin up a dev server for this project — worth a visual check that "Atto 3 EVO" renders correctly wherever `model` is displayed (browse cards, comparison table, detail view) and that the range slider bounds still make sense with the widened 470–510km window.

### Future work

- Unit test coverage remains the standing, ever-growing gap — flagged again, now in twelve consecutive diary entries, and explicitly not picked again this session.
- `car-images.json`'s `byd-atto3` entry (a generic Wikimedia Commons "BYD Atto 3.jpg") is unverified as depicting the EVO facelift specifically — candidate for a future image-verification pass across the dataset, not just this one car.
- The Polestar country-of-manufacture-vs-brand-origin product decision, raised in the prior verification pass, is still open and unaddressed.
- The BYD battery-warranty-km discrepancy (200,000 DK page vs 250,000 global announcement) should be resolved with a follow-up check once BYD Denmark's page has had time to catch up to the global figure, rather than left flagged indefinitely.
