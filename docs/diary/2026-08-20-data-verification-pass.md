# Diary: Data verification pass across warranty.json, colors.json, and car range/warranty figures

Prior diary entries (warranty/service info, exterior color customization, range-as-a-range) each flagged the same open item: the offline-populated EV data was "plausible estimates based on general knowledge," never independently verified. This task closes that gap — a dedicated verification pass across `cars.json` (range, basePrice), `warranty.json`, and `colors.json` for all 25 cars, chosen by the user from three candidate next-iterations (`/suggest-next-iteration`) alongside "unit test coverage" and "test-drive/dealer links."

## Step 1: Research and apply corrections

**Author:** main

### Prompt Context

**Verbatim prompt:** "Data verification pass" (selected via AskUserQuestion from three next-iteration options presented after running `/suggest-next-iteration`)
**Interpretation:** Review and tighten confidence on the previously-flagged unverified data (warranty terms, paint pricing, range windows) rather than build new UI surface.
**Inferred intent:** This is a Danish first-time-EV-buyer decision tool per the PRD — stale or fabricated-looking specs directly undermine the product's core value proposition (trustworthy side-by-side comparison), so correctness of the data itself matters as much as any feature.

### What I did

Split the 25-car dataset into three regional clusters (Japan/Germany — 9 cars; Korea/China — 8 cars; USA/Sweden/France/Italy — 8 cars) and ran three parallel research subagents with web-search access against each cluster, asking each to verify range (WLTP, Danish-market trims), warranty terms, and basePrice plausibility, and to flag any car no longer purchasable new in Denmark in 2026.

Applied the findings with a Python script (`json` module, `OrderedDict` to preserve key order) rather than hand-editing, since ~20 of 25 cars needed at least one field touched:

- **Removed Honda e entirely** from `/app/public/data/cars.json`, `/app/public/data/warranty.json`, `/app/public/data/colors.json`, `/app/public/data/car-images.json`, and `/app/public/data/risk-indicators.json`. Honda e ended production in January 2024 and is not purchasable new anywhere; its nominal successor (e:Ny1) is itself being wound down across European markets. Presenting either as a current Danish buying option would be actively misleading for a buyer-decision tool, so removal (not a "discontinued" flag — the data model has no such field, and adding one was out of scope for a data-correction pass) was the honest fix.
- **Widened range windows** for `toyota-bz4x`, `lexus-rz`, `vw-id4`, `audi-q4`, `mercedes-eqa`, `porsche-taycan`, `hyundai-ioniq5`, `tesla-model3`, `tesla-modely`, `ford-mache`, `volvo-ex30`, `volvo-ex90`, `renault-megane`, and `polestar-2` — all previously understated relative to current WLTP figures for their 2025/2026 Danish-market trims (e.g. Porsche Taycan's 2026 lineup standardized on the 97kWh Performance Battery Plus, pushing WLTP from the old 400–630 km figure to roughly 597–700 km).
- **Corrected `basePrice`** for `porsche-taycan` (853,000 → 930,000 DKK, below the actual current DK starting price), `volvo-ex90` (653,000 → 710,000 DKK, same issue), `peugeot-e2008` (306,000 → 235,000 DKK, above the actual 2026 post-price-cut list), and `renault-megane` (307,000 → 260,000 DKK, above current list pricing).
- **Corrected warranty terms** for eight cars. The most consequential finding: Denmark saw a "warranty war" through 2025 where Ford, Volvo, Renault, Peugeot, and Fiat all moved from short 2–3 year factory warranties to automatic 5-year combined warranties (100,000–200,000 km) bundled at no cost on new EVs — our data still had these at the old 2–3 year figures. Also fixed `vw-id4` (VW Denmark's 5yr/150,000km combined warranty, live since December 2024, vs. the 3yr/100,000km we had), `xpeng-g6` (EU warranty manual specifies 4yr/**120,000km**, not unlimited mileage as previously recorded), and `polestar-2` (extended to 5yr/150,000km in October 2025, up from 3 years). Updated each entry's `note` field to explain the correction and cite the effective date, rather than silently changing numbers.
- Ran `python3 -c "import json; ..."` to confirm all five touched JSON files still parse, then `npx tsc --noEmit -p tsconfig.app.json` from `/app` to confirm no TypeScript consumer broke (it was already clean — nothing in the component/service layer references car IDs by literal string, so the Honda removal didn't require any code changes).

### Why

Removing/correcting data beats leaving flagged-but-unverified estimates in a tool whose entire value proposition (per the PRD problem statement) is being a trustworthy alternative to "fragmented... word-of-mouth" research. A buyer comparing a discontinued Honda e against 24 live-production cars, or seeing a Taycan's real-world range understated by 200km, is exactly the kind of gap this app exists to close.

### What worked

Delegating the research to three parallel agents split by region kept each agent's scope tight enough to search efficiently (each did 15–31 tool calls, ~50–66k tokens) while covering all 25 cars faster than a single sequential pass would have. Applying the corrections via a Python script rather than manual `Edit` calls avoided the risk of a typo across ~20 touched records and made the removal of Honda e (which needed coordinated deletion across 5 files) straightforward — a single `dict.pop(car_id, None)` per file rather than five separate manual edits.

### What didn't work

Nothing failed outright. One early friction point: my first two `git diff HEAD -- app/public/data/...` checks came back empty even though `git status` showed the files as modified — I was running the diff commands with `app/` as the working directory (a leftover `cd` from an earlier step) while still prefixing paths with `app/`, so I was asking git to diff a nonexistent `app/app/public/data/...` path. Running `pwd` and `git rev-parse --show-toplevel` surfaced the mismatch immediately; switching to `public/data/...` (relative to the actual cwd) fixed it.

### What I learned

- Real Danish EV warranty terms shifted materially in 2025 in a way that's easy to miss without deliberate re-verification: a wave of non-Tesla brands introduced 5-year combined warranties specifically to compete on trust/reliability signaling, which is precisely the axis PRD user story 2 ("filter by country of manufacture... brands I trust") cares about — so this data was actively working against the product's own value proposition until corrected.
- BYD Atto 3 is mid-transition to an "Atto 3 EVO" on a new platform with a substantially larger battery, first Danish deliveries expected June 2026 — flagged by the research but *not* corrected in this pass, since the outgoing model's current figures aren't wrong today, just due to become wrong later. Recorded here rather than silently reflected in data, per the "no silent caps/changes" principle — see Future work.
- Polestar's "country of manufacture" is genuinely ambiguous for a trust-filter feature: manufactured in China (Geely's Luqiao plant) but Swedish-headquartered/branded. The current `China` value in `cars.json` is the technically defensible choice for a literal "manufacture" filter, but a Danish buyer skimming brand names is very likely assuming brand origin. Left unchanged this pass (data is not "wrong," just a modeling ambiguity) but worth a product decision, not a silent data fix — see Future work.

### What was tricky

Deciding how far to let this pass drift into new-field territory. Several findings (BYD's model transition, Polestar's country ambiguity, Mercedes EQA's flagged-but-not-yet-discontinued status, Fiat 500e's production-continuity risk) are real and useful, but encoding them properly would mean adding new fields/flags to the `Car` or `WarrantyInfo` models — which is a feature-shaped change, not a data-correction one. Scoped this pass strictly to correcting values that are wrong *today*, and captured everything else as flagged-for-later in this diary instead of inventing ad-hoc note fields under time pressure.

### What warrants review

- `/app/public/data/cars.json` — 14 range windows and 4 basePrice figures changed; worth spot-checking a few against current manufacturer configurators, since the research agents' web searches (not a Danish-market API) are themselves a step removed from ground truth.
- `/app/public/data/warranty.json` — 8 cars corrected, `honda-e` removed. The "warranty war" finding (Ford/Volvo/Renault/Peugeot/Fiat all moving to 5yr combined warranties in 2025) is the single highest-leverage correction in this pass and is worth independently confirming given how much it changes the comparative picture between brands.
- Honda e removal — confirmed no code references the literal `'honda-e'` string anywhere in `/app/src`, and `tsc --noEmit` passed clean, but worth a quick visual check (per the user's standing instruction, not by spinning up a dev server here) that the browse/comparison views don't show an off-by-one car count or stale cached reference anywhere.
- Not verified in an actual browser, per the user's standing instruction not to spin up a dev server for this project.
- No unit tests were touched or added — the standing test-coverage gap flagged in every prior diary remains, and was explicitly *not* the option picked this session (the user chose data verification over the test-coverage candidate).

### Future work

- Unit test coverage remains the standing, ever-growing gap — flagged again, still not picked, now flagged in eleven consecutive diary entries.
- BYD Atto 3 → Atto 3 EVO transition (Danish deliveries expected June 2026): candidate for a dedicated data-update pass closer to that date rather than now, since current figures aren't wrong yet.
- Polestar's country-of-manufacture-vs-brand-origin ambiguity is a product decision (keep `China` as a strict manufacturing-country filter, or introduce a separate brand-origin concept) rather than a pure data fix — worth raising with the user directly rather than deciding unilaterally in a data pass.
- Mercedes EQA is flagged by research as likely to be discontinued/replaced by an electric GLA within the 2026–2027 model cycle, and Fiat 500e has a history of Stellantis production pauses — neither is wrong today, but both are candidates for the next verification pass.
- The exact color/paint pricing figures in `colors.json` could not be independently confirmed per-brand via search (the research agents could only sanity-check the pricing *tiers*, ~3,500–9,500 DKK for premium colors, as broadly plausible); a future pass with access to live manufacturer configurators would tighten this further.
