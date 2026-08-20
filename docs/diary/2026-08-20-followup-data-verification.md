# Diary: Follow-up data verification (EQA discontinuation, Fiat 500e status, car images)

The 2026-08-20 data-verification-pass diary flagged three items as "not wrong today, but worth another look": Mercedes EQA's likely 2026–2027 discontinuation, Fiat 500e's Stellantis production-pause risk, and the fact that no car image in the dataset had ever been independently checked against the correct model generation/trim. Selected via AskUserQuestion from three next-iteration options after `/suggest-next-iteration`, alongside unit test coverage and the Polestar country-of-manufacture decision (neither picked).

## Step 1: Research EQA and Fiat 500e status, verify a sample of car images

**Author:** main

### Prompt Context

**Verbatim prompt:** "Follow-up data verification (EQA / Fiat 500e / images)" (selected via AskUserQuestion)
**Interpretation:** Re-check the two flagged discontinuation risks against current (2026-08-20) reality, and do a first real image-verification pass rather than continuing to assume image URLs resolving to *a* photo means they resolve to the *right* photo.
**Inferred intent:** Same trust proposition as every prior data pass in this project — a buyer-decision tool is only as good as its data, and both flagged risks were time-sensitive enough that "not wrong when we last checked" doesn't mean "still not wrong now."

### What I did

**Mercedes EQA:** `WebSearch` found that Mercedes has actually already retired the EQA — the new electric GLA (branded simply "GLA 200 electric" / "GLA 350 4MATIC electric", no separate EQ nameplate) debuted around 2026-07-29/30, with European order books open and first deliveries from November 2026 (sources: techtimes.com "Mercedes GLA Debuts Today: EQA Retired", tarantas.news "Mercedes buries the EQA and the EQ badge"). This is materially different from the prior pass's "flagged as likely, not yet wrong" assessment — it's now actually happened. Followed the same precedent as the Honda e removal in the 2026-08-20 verification pass: removed `mercedes-eqa` entirely (rather than inventing a "discontinued" flag the data model doesn't have) from `/app/public/data/cars.json` (24 → 23 cars), `/app/public/data/warranty.json`, `/app/public/data/colors.json`, `/app/public/data/car-images.json`, and `/app/public/data/risk-indicators.json`, via the same short Python `json.load`/`pop`/`json.dump` pattern used last time. Confirmed via `grep -rn "mercedes-eqa\|Mercedes-Benz\|EQA" src/` that no component/service references it by literal string.

**Fiat 500e:** `WebSearch` found the 2024 Stellantis production-pause coverage the prior diary was reacting to, but also current 2026 sources (fiatusa.com "What's New for 2026: Fiat 500e", Edmunds' 2026 FIAT 500e listings) showing the car is still in active production and on sale for the 2026 model year — the 2024 pause resolved and didn't recur. No data change needed; the risk flagged last time didn't materialize.

**Car images:** Rather than trying to eyeball-verify all 23 remaining images (no ground-truth reference photos to diff against, and no budget for that), picked three cars with the highest a priori risk of a stale image — ones that underwent a significant, well-documented exterior redesign — and checked those concretely: downloaded each current image via `curl` with a descriptive `User-Agent` (Wikimedia's rate limiter returns HTTP 429 without one under back-to-back requests — hit this on a naive bulk HEAD-check across all 23 URLs before adding the descriptive UA and 1.5s spacing, after which all resolved 200), inspected the JPEG's embedded EXIF `DateTimeOriginal`, and viewed a downscaled thumbnail with the `Read` tool:
- `byd-atto3` — already flagged in the prior diary as unverified for the EVO facelift (see the BYD Atto 3 EVO data refresh, earlier today). EXIF dated 2024-06-13, well before the EVO's 2026 launch — confirmed stale. Replaced with `BYD Atto 3 Evo IMG 6069.jpg` from Commons' dedicated "BYD Atto 3 Evo" subcategory (EXIF dated 2026-04-04), a clean front-three-quarter parking-lot shot showing the EVO's redesigned front bumper.
- `polestar-2` — filename literally said "Genf 2019" (Geneva 2019 motor show). Viewed the thumbnail and confirmed it shows the pre-2024 black mesh grille design. `WebSearch` confirmed Polestar 2 got a significant front-end facelift for MY2024 (the "SmartZone" body-colored panel replacing the fake grille, per notebookcheck.com and kbb.com coverage). Replaced with `Polestar 2 Long Range Dual Motor (Facelift) – f 05072025.jpg`, a clean outdoor front-three-quarter shot visibly showing the SmartZone panel.
- `tesla-model3` — generic filename "Tesla_Model_3_Front_View.jpg" gave no date signal. EXIF showed 2019-10-09, and the thumbnail confirmed the pre-"Highland" front design (separate rounded headlight/indicator cluster). Tesla's Model 3 "Highland" refresh (2023, codenamed and marketed as such) redesigned the front and rear lighting substantially. Replaced with `Tesla_Model_3_Highland_RWD_Pearl_White_Multi-Coat_01.jpg` from Commons' "Tesla Model 3 (2023–)" category, showing the Highland's slim continuous LED front strip.

All three of the cars checked turned out to have stale images — a 3-for-3 hit rate on a sample chosen specifically for redesign risk, not a random sample, so this isn't a claim that ~13% of the whole dataset is wrong; see Future work.

Ran `python3 -c "import json; json.load(open(...))"` against all five touched files, then `npx tsc --noEmit -p tsconfig.app.json` from `/app` — both clean, consistent with every prior data-only pass in this project (nothing in the component/service layer touches car data by literal ID or feature-array contents).

### Why

Same rationale as every data-correction diary in this project: the tool's entire value proposition (per the PRD problem statement) is being a trustworthy alternative to fragmented, stale word-of-mouth research, so a discontinued car still listed as buyable, or a photo showing the wrong model generation, actively works against that.

### What worked

Using EXIF `DateTimeOriginal` as a cheap, objective staleness signal before spending effort on visual inspection was efficient — it immediately told me two of the three flagged images predated their car's documented redesign date, before I'd even looked at the pictures. Picking the three highest-redesign-risk cars to check (rather than trying to eyeball all 23) kept this pass tractable while still surfacing real, concrete fixes rather than a vague "seems fine" pass over everything.

### What didn't work

The first bulk image-URL check (a Python loop doing `HEAD` requests against all 23 `car-images.json` URLs back-to-back with no delay) hit `HTTP 429: Too many requests` from Wikimedia on roughly half the URLs, including one response explicitly asking me to "contact noc@wikimedia.org... or instead use thumbnail images." Wikimedia's default rate limiting doesn't tolerate rapid anonymous requests. Fixed by adding a descriptive `User-Agent` header (`VoltIndexDataVerification/1.0 (prsa@foss.dk; ...)`, per Wikimedia's user-agent policy for tools) and a 1.5s delay between requests with a 3-attempt retry — the retried run resolved all 23 URLs at HTTP 200 with no further rate-limiting. Worth remembering for any future bulk Commons-fetching pass in this project.

### What I learned

- This dataset's images have apparently never been checked against the car's actual model-year/facelift status since the images were first populated — the 3-for-3 hit rate on cars with well-documented redesigns strongly suggests this is a systemic gap, not a one-off. EXIF date + a quick "when was this car last redesigned" search is a fast, repeatable check that could be applied to the rest of the dataset.
- Wikimedia Commons often maintains dedicated subcategories for facelifted variants (e.g. "Category:BYD Atto 3 Evo", "Category:Tesla Model 3 (2023–)") separate from the base model's category — searching for those directly is faster than trying to filter the base category by date.

### What was tricky

Deciding how far to extend the image-verification effort within this pass. Checking all 23 remaining images individually (download, EXIF check, visual read, cross-reference against that car's redesign history) would have been a much larger and more expensive undertaking than the scope implied by "follow-up data verification" — so scoped this pass to the highest-risk sample plus the two explicitly-named discontinuation checks, and explicitly flagged the rest as future work rather than silently implying full coverage.

### What warrants review

- `/app/public/data/cars.json`, `/app/public/data/warranty.json`, `/app/public/data/colors.json`, `/app/public/data/car-images.json`, `/app/public/data/risk-indicators.json` — all lost the `mercedes-eqa` entry; worth a quick visual check (per the user's standing instruction not to spin up a dev server) that browse/comparison views show 23 cars with no stale reference anywhere.
- `/app/public/data/car-images.json` — three image URLs changed (`byd-atto3`, `polestar-2`, `tesla-model3`); worth spot-checking that they render in the actual UI, since `curl`+EXIF+thumbnail verification confirms the *file itself* is right but not that Angular's `<img>` binding handles the URL-encoded en dash in the Polestar filename cleanly (it's the same `Special:FilePath` pattern already used throughout the dataset, so this should be a non-issue, but flagging it since it's the one filename in this batch with an unusual character).
- Not verified in a browser, per the user's standing instruction.

### Future work

- Unit test coverage remains the standing gap — flagged again, now in thirteen consecutive diary entries, and again not picked this session.
- The Polestar country-of-manufacture-vs-brand-origin product decision, raised two verification passes ago, is still open and unaddressed.
- A full image-verification pass across the remaining ~20 cars (not just the 3 sampled here) is a real candidate for a dedicated future iteration, given this pass's 3-for-3 hit rate on redesign-risk cars — this sample was deliberately chosen to be high-risk, not representative, so it's not evidence the other ~20 are fine, just evidence the risk is real enough to be worth systematically checking.
- The new Mercedes electric GLA (replacing the EQA) is a candidate for addition as a fresh dataset entry — but that's a new-car-addition task (full research: Danish DKK pricing, standard features, warranty terms, risk indicators, a verified image), not a data-correction one, so intentionally left out of this pass rather than added half-researched.
