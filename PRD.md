# PRD

## Problem Statement

First-time EV buyers in Denmark face a fragmented, time-consuming research process — juggling YouTube reviews, forum posts, and word-of-mouth — to answer basic questions: which cars fit my budget, what range/features do I get, where is it made, and what happens to cost and reliability years down the line (battery degradation, recalls, resale value). There's no single place to see pricing, specs, and real-world risk side by side.

## Solution

A web application, initially scoped to the Danish market, that presents curated EV data in one place. Buyers enter their budget and desired range and get recommended cars within a tolerance window (not a strict cutoff), can filter further by features and country of manufacture, compare cars side-by-side with full feature breakdowns, dynamically add/remove features within a comparison to see the resulting price difference across brands, review risk indicators (recalls, battery degradation, resale value), see accurate car images, and jump to external reviews/forums for deeper research. All data is sourced through an offline data-population process — the running app never scrapes at runtime; it only serves from its own database.

## User Stories

1. As a first-time EV buyer, I want to enter my budget and desired range and get recommended cars within a reasonable tolerance (e.g., ±50 km range, ±50,000 DKK), so I don't miss close matches that fall just outside my exact numbers.
2. As a first-time EV buyer, I want to filter by country of manufacture (Japanese, German, Korean, Chinese, etc.), so I can prioritize brands I trust.
3. As a first-time EV buyer, I want to compare multiple cars side-by-side with their full feature sets (e.g., security features, head-up display, adaptive cruise control), so I can see meaningful differences at a glance.
4. As a first-time EV buyer, I want to add or remove specific features within a comparison, so I can see how each choice shifts the price across the brands I'm comparing.
5. As a first-time EV buyer, I want to see risk indicators for each car (recall history, battery degradation, resale value), so I understand its long-term reliability and value.
6. As a first-time EV buyer, I want links to external reviews and forums for each car, so I can do deeper research without hunting for sources myself.
7. As a first-time EV buyer, I want to see the standard market price separate from additional accessory/service charges, so I understand the true total cost.
8. As a first-time EV buyer, I want to see accurate images of the car model I'm considering, so I know what I'm actually looking at.

## Implementation Decisions

- Scoped to the Danish market for v1.
- Data (specs, pricing, features, images, risk indicators, review links) is populated offline ahead of time — the running app never fetches or scrapes live; it only reads from its own database.
- Database updates happen on demand, at whatever cadence is decided (daily/weekly/monthly) — not on a fixed automated schedule.
- Range/budget-based recommendations use tolerance windows (e.g., ±50 km, ±50,000 DKK) rather than strict cutoffs.
- Comparison mode supports adding/removing features live to see the price delta across the brands being compared, covering feature categories like security, head-up display, adaptive cruise control, sunroof, sound system, etc.
- Reviews are not authored in-app; they are curated links to external forums/review sites, identified during data population.
- No in-app computed rating/score for v1 — ratings stay external; the app only links out.
- Pricing is shown as standard market price plus a separate breakdown of additional accessory/service costs.

## Out of Scope

- "Future potential" score for newer/rising-star cars.
- Warranty/free-service period info and paid service-extension purchasing.
- Test-drive booking links / dealer booking integration.
- In-app user-submitted reviews or ratings.
- Any runtime web scraping by the app itself.
- Exterior color customization/preview (deferred to v2).

## Further Notes

- Markets beyond Denmark may be considered later.
- Deferred features (future-potential score, warranty info, test-drive links, color customization) are explicit candidates for later iterations, not permanently excluded.
- The exact list of comparable features (security suite, HUD, ACC, etc.) will be finalized during data population rather than fixed now.
