# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular + TypeScript (fixed by CONSTITUTION.md). No backend/API for v1 — the app reads pre-populated JSON data files directly, kept behind a data-access service layer so a real API can be swapped in later without touching consuming components.

## Users

First-time EV buyers in Denmark. They are early in their research process, juggling YouTube reviews, forum posts, and word-of-mouth, and want a single place to compare pricing, specs, and real-world risk before committing to a purchase.

## Product Purpose

A curated EV research and comparison tool for the Danish market. It lets a buyer enter a budget and desired range and get recommended cars within a tolerance window (not a strict cutoff), filter by features and country of manufacture, compare cars side-by-side with full feature breakdowns, dynamically add/remove features in a comparison to see the resulting price delta across brands, review risk indicators (recalls, battery degradation, resale value), see accurate car images, and jump out to external reviews/forums for deeper research. Success means a buyer can go from "what fits my budget" to a shortlist with real risk and cost context, without hunting across scattered sources.

## Positioning

No single existing source puts Danish EV pricing, specs, and long-term risk indicators (recalls, battery degradation, resale value) side by side with a live, feature-driven price comparison across brands. Competitors are either raw spec databases, YouTube/forum opinion, or dealer sites — none combine tolerance-based recommendation, cross-brand feature-price comparison, and risk indicators in one place scoped to the Danish market.

## Operating Context

- Data is populated offline (researched and written into JSON files ahead of time); the running app never scrapes or fetches live data at runtime.
- Database/data-file updates happen on demand, at whatever cadence is decided later — not a fixed automated schedule.
- Reviews are curated external links (forums/review sites) identified during data population, not authored in-app.

## Capabilities and Constraints

- Budget/range-based recommendations use tolerance windows (e.g. ±50 km, ±50,000 DKK) rather than strict cutoffs.
- Filtering by country of manufacture (Japanese, German, Korean, Chinese, etc.).
- Side-by-side comparison with live feature add/remove and resulting cross-brand price delta; feature categories include security, head-up display, adaptive cruise control, sunroof, sound system, etc. (exact list finalized during data population).
- Risk indicators per car: recall history, battery degradation, resale value.
- Pricing shown as standard market price plus a separate breakdown of additional accessory/service costs.
- No in-app computed rating/score for v1 — ratings stay external, app only links out.
- Out of scope for v1: future-potential score, warranty/service-extension info and purchasing, test-drive booking integration, in-app user-submitted reviews, any runtime scraping, exterior color customization/preview (candidates for a later iteration, not permanently excluded).
- Scoped to the Danish market for v1; other markets may be considered later.

## Brand Commitments

None yet — no product name, tagline, logo, voice, or visual reference has been locked in. Future design work is free to propose these.

## Evidence on Hand

All car data, images, and pricing currently in the codebase are placeholder/fake, added to unblock UI work (see commit "Add browse/filter EV screen with fake data"). None of it is real sourced Danish EV data yet — future work must not treat current values, images, or copy as factual evidence, and must not carry them into any final deliverable as if real.

## Product Principles

- Tolerance over strict cutoffs: near-misses on budget/range are surfaced, not hidden, because a rigid filter can exclude the best-fit car for an arbitrary reason.
- Total cost transparency: standard price and add-on costs are always shown separately, never blended into one number.
- Risk is core content, not an afterthought: recall history, battery degradation, and resale value sit alongside specs, not buried in a separate section.
- Curate, don't fabricate: the app links to external reviews/ratings rather than inventing its own score, and offline-populated data must be real by launch, not placeholder.
- Comparison is interactive, not static: buyers can reshape a comparison (add/remove features) and immediately see the cross-brand price consequence.

## Accessibility & Inclusion

No specific requirement established beyond general good accessibility practice.
