# Diary: Car images (real photos via Wikimedia Commons)

Fifth buildable slice of the EV comparison app, per `PRD.md` (user story 8) and `CONSTITUTION.md`. Builds on the browse/filter screen, comparison mode, car detail view, and price breakdown already shipped; adds a real photo per car to the browse cards and detail view, with a graceful text fallback if an image ever fails to load. Car images had been explicitly deferred twice across prior iterations (once in the original scaffold, once at the end of comparison mode).

## Step 1: Research real, verified photo URLs and wire them into the app

**Author:** main

### Prompt Context

**Verbatim prompt:** "Car images" (chosen via `AskUserQuestion` among three options offered by `/suggest-next-iteration`: range-as-a-range + slider, variable price by features, and car images — after scanning `PRD.md`/`CONSTITUTION.md` and confirming user story 8 was the last remaining PRD story with zero implementation). Followed by a second `AskUserQuestion` choosing "Research real photo URLs" over "Illustrative placeholders" for how to source the images, since the PRD explicitly asks for *accurate* images and the constitution forbids runtime scraping (so any image source has to be curated offline, ahead of time, same as the review-link URLs in `risk-indicators.json`).

**Interpretation:** Give each of the 25 cars in `cars.json` a real photo, sourced offline and stored as data (not fetched/scraped at runtime), surfaced on both the browse-screen cards and the car detail view.

**Inferred intent:** Close the last unaddressed PRD user story, but do it honestly — a specific, fabricated-looking image URL that turns out broken or wrong would be worse than no image at all, so the sourcing method needed to guarantee (as much as reasonably possible) that each URL is real and correctly matched before it ever ships.

### What I did

- Chose Wikimedia Commons as the image source: its `Special:FilePath/<file-name>` URLs are stable, freely-licensed, and redirect (301) to the actual current file on `upload.wikimedia.org`, which makes them verifiable ahead of time rather than a guess.
- Split the 25 cars into three batches and ran three `general-purpose` agents in parallel (in the background, so I could scaffold the app code at the same time) with instructions to: search Commons for each brand+model, fetch the candidate file/category page to confirm brand *and* model match (explicitly warned about model-variant confusions like Volvo EX30 vs EX90, Tesla Model 3 vs Model Y, and Honda e vs the unrelated Honda e:NP1), construct the `Special:FilePath` URL, verify it actually resolves to an image, and omit (not fabricate) any car it couldn't verify.
- All three batches returned a verified match for all 25 cars, with zero omissions. Merged their results into a new `/app/public/data/car-images.json` — a flat `Record<carId, imageUrl>`, matching the existing flat-map pattern used by `feature-pricing.json`/`risk-indicators.json`.
- Extended `/app/src/app/core/services/car.service.ts` with `getAccessories()`'s sibling, `getCarImages(): Observable<Record<string, string>>`, following the same `shareReplay(1)`-cached-fetch pattern as every other data domain in this service.
- Extended `/app/src/app/features/car-browser/car-browser.component.ts` with a `carImages` signal (populated at construction, same pattern as `cars`) and a `failedImageIds` signal (a `Set<string>`, populated via a new `markImageFailed(carId)` method). Added a `(error)` handler on the `<img>` element in both card sections of `car-browser.component.html` (the "Recommended" cards and the "Other options"/"All cars" cards) so that if a photo URL ever breaks at runtime, the card falls back to a simple text tile (brand + model) instead of a broken-image icon.
- Extended `/app/src/app/features/car-detail/car-detail.component.ts` with the same pattern: a `carImages` signal, an `imageUrl` computed (looked up by the active `detailService.carId()`), and an `imageFailed` boolean signal with a `markImageFailed()` method. Added a photo section at the top of the detail overview in `car-detail.component.html`, above the brand/model heading, with the same error-triggered fallback tile.
- While waiting on the three research agents (each took 130–180s), verified the scaffolding independently first with a placeholder `car-images.json` of `{}` — `ng build` and `ng test --watch=false` both passed with no images present, confirming the fallback-tile path works before any real data existed.
- After merging the real URLs, re-ran `nvm use 22 && npx ng build` (succeeds) and `npx ng test --watch=false` (2/2 passing, unchanged). Cross-checked with `python3` that `car-images.json`'s 25 keys exactly match `cars.json`'s 25 ids (no missing or extra entries). Started `ng serve --port 4300` in the background and confirmed via `curl` that both the app shell and `data/car-images.json` (25 entries) serve correctly. Also spot-verified two of the merged URLs directly with `curl -sIL` (Toyota bZ4X and Tesla Model 3 both returned `200` after redirecting to a real `upload.wikimedia.org` image); a third check (Fiat 500e) initially returned `429` from curl itself (rate-limiting my own rapid successive requests, not a broken link) and resolved cleanly to `200` on retry a few seconds later.

### Why

Images went through `CarService` rather than being hardcoded in the components, per the constitution's data-behind-a-service-layer rule — the same reason `cars`, `feature-pricing`, `risk-indicators`, and `accessories` are all exposed that way. Running the research as three parallel background agents (rather than one agent doing all 25 sequentially, or fabricating plausible-looking URLs myself) was a deliberate choice to keep the "offline data population, never fabricate a citation-like URL" principle established in the risk-indicators iteration, while not blocking the code scaffolding work on the research finishing first.

### What worked

Splitting the research into three agents of ~8-9 cars each meant the whole 25-car research pass finished in under 3 minutes of wall-clock time (each batch ran 130-180s concurrently) rather than five-plus minutes sequentially, and let me build/verify the component and service code against a placeholder empty data file in the meantime — so by the time the real URLs landed, only the JSON file itself needed writing, and `ng build`/`ng test` had already been proven to pass around it.

### What didn't work

Nothing failed in the app code itself. The only hiccup was cosmetic: my own verification `curl` calls in quick succession triggered a `429` from Wikimedia's rate limiting on one URL, which looked like a broken link at first glance until a retry a few seconds later returned a clean `200` — a reminder to space out verification requests rather than reading a rate-limit response as a data problem.

### What I learned

Wikimedia Commons' `Special:FilePath` endpoint is a good fit for this kind of offline-curated-but-verifiable data need: unlike a normal Commons file-description-page URL, `Special:FilePath/<name>` redirects straight to the binary image and is stable even if the file gets renamed on Commons (the redirect handles it), so it behaves like a real "point at this photo" API without needing to hardcode `upload.wikimedia.org` hash-bucket paths (which do change).

### What was tricky

Making sure the three background agents didn't quietly substitute a wrong-but-plausible model for a hard-to-find one — brand+model confusion is the exact failure mode a fabricated URL would produce silently. Explicitly calling out the known confusable pairs (Model 3/Model Y, EX30/EX90, Honda e/Honda e:NP1) in the agent prompts up front, rather than trusting general instructions to "get it right," was worth the extra prompt length; one agent's own report confirmed it had in fact hit and correctly avoided the Honda e:NP1 trap.

### What warrants review

- `/app/public/data/car-images.json` — all 25 URLs were verified to resolve to a real image at research time, but Commons file names/paths can theoretically change or be deleted later; if a photo ever goes missing, the app degrades gracefully to the brand/model text tile rather than breaking, but it's worth an occasional manual re-check rather than assuming these links are permanent.
- `/app/src/app/features/car-browser/car-browser.component.ts` and `/app/src/app/features/car-detail/car-detail.component.ts` — the `(error)`-driven fallback (`markImageFailed`/`imageFailed`) is the one piece of new runtime behavior; worth confirming in a real browser (not just `curl`) that a genuinely broken image actually fires the `error` event and swaps to the fallback tile as intended.
- No unit tests were added for the image fetch/fallback behavior in either component — same test-coverage gap flagged in every prior iteration's diary (`ComparisonService`, `ComparisonComponent`, `DetailService`, `CarDetailComponent`, and now the image-loading paths too).

### Future work

- The comparison table (`/app/src/app/features/comparison/comparison.component.ts`) still doesn't show a car image per column — out of scope for this iteration (scoped to browse + detail, matching how risk indicators/review links were scoped before it), but a reasonable follow-up.
- Test coverage remains the standing, ever-growing gap across every feature built so far.
- The range-as-a-range + slider and variable-price-by-features data-model changes (recorded in `PRD.md`'s Further Notes from the previous session) remain unbuilt and are the two other candidates that were on the table before car images was picked this session.
