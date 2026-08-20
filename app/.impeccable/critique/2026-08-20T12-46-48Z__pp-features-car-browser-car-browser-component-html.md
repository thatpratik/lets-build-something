---
target: "car-browser (Volt Index primary flow: browse/detail/compare)"
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-20T12-46-48Z
slug: pp-features-car-browser-car-browser-component-html
---
Method: dual-agent (A: ab8e57ea90e47172a · B: a1fdfd1738f20caa4)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The tolerance-window recommendation logic (±50k DKK / ±50km, the product's core thesis) is invisible — no card explains why it's "Recommended" vs. an "Other option," or by how much it missed. |
| 2 | Match System / Real World | 3 | Danish-market grounding (DKK, WLTP-style ranges, real warranty conventions) is solid; docked for the invisible tolerance logic. |
| 3 | User Control and Freedom | 3 | Back/Reset/remove affordances exist everywhere; "Reset" wipes all state instantly with no confirm/undo. |
| 4 | Consistency and Standards | 3 | Gauge/mono/card patterns repeat consistently; recall count renders as plain unstyled text despite DESIGN.md naming it a Fault Red case. |
| 5 | Error Prevention | 2 | Range slider clamps low/high correctly; budget number input has no min/max guard against negative or absurd values. |
| 6 | Recognition Rather Than Recall | 2 | Comparison table gives no visual cue distinguishing a car's standard features from hypothetically-toggled ones — user must remember from an earlier screen. |
| 7 | Flexibility and Efficiency | 2 | No numeric alternative to the range slider, no sort, no persisted/shareable filter state, no keyboard shortcuts. |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely disciplined — flat surfaces, hairline borders, one accent hue, no stray shadows found anywhere in the templates. |
| 9 | Error Recovery | 1 | No handling for data-fetch failure or an unbounded loading state; only empty state is a generic "No cars match your filters." |
| 10 | Help and Documentation | 1 | Zero in-app help — no explanation of the tolerance window, no glossary for domain terms like "battery retention." |
| **Total** | | **23/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** Grounded in the visual layer, generic in the interaction layer. The semicircle "charge gauge" is a real, repeated signature (browse cards, detail, battery-retention) — genuine specificity, not decoration. The warm-graphite/gold/JetBrains-Mono system is distinctive and deliberately avoids the "EV green + near-black" default. But the interaction vocabulary underneath the skin — pill filter chips, a sticky compare bar, a spec-sheet detail page, a table-based comparison — is standard comparison-tool furniture that would look at home in any SaaS product finder. Distinctive skin over a conventional skeleton.

**Deterministic scan:** `detect.mjs --json src public` exited 2 with 7 advisory findings, all `quality` category:
- 4x `design-system-color`: `rgb(0, 0, 0)` text color flagged as "outside DESIGN.md colors" on `app.html`, `car-browser.component.html`, `car-detail.component.html`, `comparison.component.html`. **Likely false positive** — the app's `body { color: var(--color-ink) }` global rule should cascade `#17130f`, not literal black; this reads like the detector sampled computed style without resolving the Tailwind-emitted CSS custom property chain, or caught an un-styled wrapper before inheritance applied. Worth a quick manual visual check, but not treated as a real color-token violation here.
- 3x `design-system-font-size`: `0.6rem` (`car-browser.component.html:156`, the gauge-tile "Range" caption) and `0.7rem` (×2, the `car-detail.component.html:4` and `comparison.component.html:4` eyebrow labels) fall outside DESIGN.md's documented type ramp. These are real — DESIGN.md documents the eyebrow token at `0.65rem`–`0.7rem`, so `0.6rem` is a genuine drift point (see Minor Observations), and the two `0.7rem` hits are at the boundary of the documented range rather than clearly inside it.

Supplementary greps (Assessment B): zero raw hex colors outside `styles.css` (tokens are respected everywhere else), 3 `rgba()` shadow values all matching the documented Shadow Vocabulary exactly, only 5 distinct `rounded-*` values in use (matches DESIGN.md's md/lg/xl/2xl/full scale precisely — a real consistency win), and zero stray `console.*`/`debugger` statements. One genuine `outline: none` suppression at `car-browser.component.scss:19` (`.budget-input:focus-visible`) whose replacement focus treatment is real but not co-located in the same file — only referenced in a comment, defined via Tailwind utilities in the template. Not a bug, but a locatability nit for future maintainers.

**Visual overlays:** not available. Browser visualization was skipped per your standing preference against launching a dev server for this project — Assessment B ran source-only.

## Overall Impression

A visually disciplined, on-brand shell wrapped around interaction patterns that don't yet carry the same rigor. The gauge motif and token discipline are real craft; the product's actual thesis — tolerance-based recommendation, a decision aid for someone who doesn't yet know Danish EV norms — is currently invisible in the UI that's supposed to deliver it. The biggest opportunity is closing that gap: making the "why" behind Recommended/Other visible, since that's the one thing no competitor (raw spec databases, YouTube, dealer sites) can offer and this product currently doesn't surface either.

## What's Working

1. **The charge gauge is a genuine signature, not decoration** (`meter.component.ts`) — one SVG arc reused identically for range bands and single-value battery retention, with tone swapping to status color only when reporting a rating. This is exactly what makes a signature stick rather than read as a one-off flourish.
2. **Image loading state is done properly** (`car-image.component.ts`) — distinct loaded/failed signals, a branded pulsing-bolt "charging" placeholder instead of a generic spinner, and a readable brand+model fallback instead of a broken-image icon.
3. **Tabular-numerals discipline is actually implemented, not just documented** — every price/range/percentage across all three views carries `font-mono` + `tabular-nums`, a detail that's easy to let slip and wasn't.

## Priority Issues

**[P0] Recommendation tolerance logic is invisible to the user it's designed for**
**Why it matters:** This is the product's stated core differentiator (tolerance over strict cutoffs, surfaced not hidden) aimed at a buyer who by definition doesn't know Danish EV pricing norms yet. Silently bucketing a car as "Recommended" when it's actually 45,000 DKK over budget — with zero explanation — erodes trust in the exact word ("Recommended") this persona is relying on most.
**Fix:** Add a per-card delta badge on "Other options" cards ("+45,000 DKK over budget" / "60km short of range") and a one-line explainer under "Recommended for you" ("includes cars within ±50,000 DKK / ±50 km of your numbers").
**Suggested command:** `$impeccable clarify`

**[P0] Recall count carries no risk color despite being the highest-stakes safety metric**
**Why it matters:** `batteryTone()` and `resaleToneClasses()` exist and work well for the other two risk metrics; recall count renders as plain text with no equivalent function, despite DESIGN.md explicitly naming "recall counts" as a Fault Red use case. The one risk number with zero interpretive ambiguity is the one the UI's own color grammar skips.
**Fix:** Add a `recallTone(count)` function mirroring `batteryTone`, applying Fault Red / Fault Red Soft when count > 0.
**Suggested command:** `$impeccable colorize`

**[P1] Comparison table gives no visual distinction between a car's standard features and hypothetically-toggled ones**
**Why it matters:** This is the product's flagship interaction ("dynamically add/remove features... see the resulting price delta"), but nothing in the table tells a buyer, at a glance, whether they're looking at what the car actually ships with or a hypothetical addition — forcing recall from the browse-card feature chips seen earlier.
**Fix:** Give originally-included features a distinct "standard" marker separate from toggled-on hypothetical additions.
**Suggested command:** `$impeccable distill`

**[P1] Range slider's keyboard focus outline highlights the wrong element**
**Why it matters:** `.range-thumb` in `range-slider.component.scss` is a full-width (`inset-inline:0; width:100%`), transparent, absolutely-positioned native `<input type=range>`. The global `:focus-visible` rule draws its 2px gold outline around whatever has focus — this invisible full-width input, not the visible circular thumb — so a keyboard user tabbing to the slider sees a rectangle spanning the entire control rather than a ring around the actual thumb position.
**Fix:** Suppress the default outline on `.range-thumb` and draw a focus ring on the `::-webkit-slider-thumb` / `::-moz-range-thumb` pseudo-elements instead — the budget input already establishes this exact "suppress default, supply component-owned focus treatment" pattern; extend it here.
**Suggested command:** `$impeccable harden`

**[P2] Budget number input has no numeric fallback friction, and range is slider-only**
**Why it matters:** A first-timer with a specific number in mind ("I need 350km of range") has no way to type it — only drag a 6px-tall dual-thumb slider — which is also a precision problem on touchscreens for a distracted mobile user.
**Fix:** Pair the slider with two small numeric inputs, mirroring the budget input's dashboard-readout style, synced bidirectionally with the slider model.
**Suggested command:** `$impeccable adapt`

## Persona Red Flags

**Jordan (first-timer — literally the target persona):** Sets budget/range and is immediately confronted with four simultaneous live controls (budget, range, country, features) before seeing a single result. Reads "Other options" as "worse cars" rather than "near-misses," the opposite of the product's intended message, because nothing explains the bucket split. At detail, sees "Recalls: 2" in plain black text next to a color-coded battery gauge — the inconsistent visual grammar leaves Jordan unsure whether 2 recalls is something to worry about.

**Sam (accessibility/keyboard/screen-reader):** Tabs to the budget input cleanly (well-documented focus treatment). Tabs to the range slider and gets a focus outline around the entire invisible track rather than the thumb (P1 above) — misleading. Comparison-table toggle switches carry correct per-cell `aria-label`s, and detail-page color swatches use `aria-pressed` + descriptive labels including price delta — genuinely solid semantic work in both places. Recall count's missing color isn't a colorblind-specific failure (no color-only meaning exists there at all) but is an inconsistency failure that affects Sam equally with everyone else.

**Riley (edge-case stress tester):** Types a negative or absurdly large budget — no input validation, flows silently into the tolerance math. Drags both range thumbs to the same value — correctly prevented from crossing, but the ±50km tolerance padding silently widens a zero-width intent into a 100km-wide search with no indication that happened. Clicks "Reset" — instantly wipes budget, range, and every filter with no confirmation or undo.

## Minor Observations

- Gauge-tile "Range" caption uses `text-[0.6rem]` (`car-browser.component.html:156`), narrower than DESIGN.md's documented `0.65rem`–`0.7rem` eyebrow token — a real, small drift the detector caught correctly.
- The sticky "N selected" comparison bar has no `aria-live` region — a screen reader user adding a car to comparison gets no announcement that the count changed.
- `warrantyLabel()` explicitly formats with `da-DK` locale for km figures, but prices elsewhere use `DecimalPipe` with no explicit locale — worth confirming the app's default locale is actually `da-DK` throughout rather than this being a one-off.
- Budget input has no thousands-separator formatting while typing raw digits — a mild tension against the brand's own "numbers you can trust, read at a glance" positioning.
- The `.budget-input:focus-visible { outline: none }` override's replacement focus treatment (the border-bottom glow) is real but lives in the template's Tailwind classes, not co-located with the override in the SCSS file — fine today, but a future maintainer touching the SCSS in isolation could remove the suppression without realizing a replacement exists elsewhere.

## Questions to Consider

1. If the tolerance window is the product's actual thesis, why is it the least visible thing in the UI — what would the browse page look like if "near-miss, here's why" were the headline interaction instead of a silent Recommended/Other split?
2. Is a spreadsheet-style table the right shape for comparison, or just the shape that was fastest to build — what would a comparison view look like that used the gauge/dashboard language directly (stacked gauges per car) instead of reverting to a generic table the moment the flow gets complex?
3. Should "Reset" really be one silent, unconfirmed click for a tool whose whole premise is helping someone through a financially significant decision?
