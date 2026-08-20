---
name: Volt Index
description: Electric cars, compared honestly — an EV research and comparison tool for the Danish market.
colors:
  voltage-gold: "#f5b700"
  gold-ember: "#7a5400"
  gold-wash: "#fbecb8"
  cockpit-ink: "#17130f"
  warm-smoke: "#6b6459"
  warm-ash: "#a39c8e"
  warm-fog: "#f4f3ef"
  paper: "#ffffff"
  oat-surface: "#efece2"
  hairline-tan: "#e2ded2"
  hairline-on-ink: "rgba(245, 242, 233, 0.14)"
  circuit-green: "#1f5e2d"
  circuit-green-soft: "#e1f0e2"
  amber-warn: "#b5650a"
  amber-warn-soft: "#f7e9d2"
  fault-red: "#c63c24"
  fault-red-soft: "#f8e2db"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 1.2vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.65rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.voltage-gold}"
    textColor: "{colors.cockpit-ink}"
    rounded: "{rounded.lg}"
    padding: "6px 16px"
  button-primary-hover:
    backgroundColor: "{colors.voltage-gold}"
    textColor: "{colors.cockpit-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cockpit-ink}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.cockpit-ink}"
  filter-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.warm-smoke}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  filter-chip-active:
    backgroundColor: "{colors.gold-wash}"
    textColor: "{colors.gold-ember}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.warm-fog}"
    typography: "{typography.data}"
---

# Design System: Volt Index

## Overview

**Creative North Star: "The Instrument Cluster"**

Volt Index treats every screen the way an EV treats its dashboard: numbers you can trust, read at a glance, glowing exactly where they matter and nowhere else. The system is built around a single semicircle "charge gauge" — the one custom-drawn element in the whole app — reused everywhere a range or a percentage needs to be shown, so range windows and battery-retention figures read with the same authority a driver already trusts from the car itself. Everything around that signature stays quiet: a warm graphite-and-paper palette, one disciplined gold accent, and monospaced data set in tabular figures so prices and ranges never jitter as they update.

This is a decision tool for a first-time EV buyer, not a marketing surface, so the system was deliberately built to reject two defaults at once: the cream-paper-and-serif "AI generic" look, and the near-black-plus-neon-green "every EV app" look. Warm graphite ink stands in for near-black without going cold; voltage gold stands in for the neon accent without borrowing the green that every competing EV product already claims for itself — freeing green to mean exactly one thing in this system: a battery or resale rating that is actually good.

**Key Characteristics:**
- One accent color, used sparingly and only for brand/interactive moments — never for status.
- A semicircle SVG gauge, not a flat progress bar, wherever a range or percentage appears.
- Dark "cockpit" ink bands mark the moments where the user is setting or reviewing the numbers that drive a decision (the budget/range hero, the detail page's price strip, the comparison table's header row) — never used as a general content background.
- All numeric data — prices, ranges, percentages, warranty terms — set in JetBrains Mono with tabular figures.

## Colors

Warm graphite and paper carry the system; a single voltage-gold accent is spent deliberately, and status colors are held completely separate from it.

### Primary
- **Voltage Gold** (`#f5b700`): the sole brand/interactive accent — primary buttons, the range-slider fill and its glow, selected filter chips, the "Recommended" card's border and shadow, the charge-gauge fill, focus rings. If gold appears, it means "act here" or "this is the number that matters."
- **Gold Ember** (`#7a5400`): the darkened gold used for accent-colored *text* on light surfaces (eyebrow labels, price-highlight text in the comparison table) — the base voltage-gold fails AA contrast as text on white, so this is the only gold that should ever sit directly on paper as type.
- **Gold Wash** (`#fbecb8`): pale gold fill behind selected chips and the pricing-breakdown total row.

### Neutral
- **Cockpit Ink** (`#17130f`): a warm near-black, never pure black. Used for the header logo badge, the dark cockpit bands, primary body text, and text-on-gold.
- **Warm Smoke** (`#6b6459`): secondary/muted text — captions, helper copy, labels.
- **Warm Ash** (`#a39c8e`): tertiary/faint text — counts, de-emphasized numerals, disabled-adjacent labels.
- **Warm Fog** (`#f4f3ef`): the page background and the inset "readout" wells inside cards (image placeholders, the range/gauge tile).
- **Paper** (`#ffffff`): card and header surfaces.
- **Oat Surface** (`#efece2`): reserved secondary surface (table stripes, deeper insets) — currently defined, lightly used.
- **Hairline Tan** (`#e2ded2`): all borders and dividers on paper surfaces.
- **Hairline on Ink** (`rgba(245, 242, 233, 0.14)`): the equivalent hairline for borders/tracks drawn on a cockpit-ink background (the range-slider track, dark-band dividers).

### Status (semantic only — never used as brand or decoration)
- **Circuit Green** (`#1f5e2d` / soft `#e1f0e2`): strong resale rating, healthy battery retention (≥90%). This is the only green in the system, and it always means "this is good," never "this is electric" — that job belongs to gold.
- **Amber Warn** (`#b5650a` / soft `#f7e9d2`): average resale rating, battery retention 80–89%.
- **Fault Red** (`#c63c24` / soft `#f8e2db`): weak resale rating, battery retention below 80%, recall counts, destructive actions (remove from comparison).

### Named Rules
**The One Gold Rule.** Voltage gold is the system's only accent. It never shares a screen with a second brand hue, and it never carries status meaning (good/warning/bad) — those are always circuit-green / amber-warn / fault-red, kept visually and semantically separate from the brand color.

**The Text-on-Paper Rule.** Gold text on a light surface is always Gold Ember (`#7a5400`), never the base Voltage Gold (`#f5b700`) — the base value is a fill/glow color, not a text color; using it as type fails contrast.

## Typography

**Display Font:** Bricolage Grotesque (with ui-sans-serif, system-ui fallback)
**Body Font:** Inter Tight (with ui-sans-serif, system-ui fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** A geometric, slightly irregular display face carries personality at headline size without turning decorative; a compact, high-legibility body face disappears into dense filter labels and copy; a technical monospace carries every number in the system, so data always reads as data.

### Hierarchy
- **Display** (800, `text-xl`–`text-2xl` / `text-2xl`–`text-3xl` on section heroes, 1.15 line-height, −0.01em tracking): page and section headings, the "Volt Index" wordmark, car names on cards.
- **Data** (600, `text-lg`–`text-4xl` depending on prominence, tabular-nums): every number in the product — prices, ranges, percentages, warranty terms. Always JetBrains Mono, never the body face, regardless of size.
- **Body** (500, `text-sm`, 1.5 line-height): filter labels, copy, button text, table cells.
- **Eyebrow/Label** (500, `0.65rem`–`0.7rem`, 0.2em tracking, uppercase): section kickers ("Set your numbers", "Spec sheet", "Side by side") set in mono, always paired with a display headline directly beneath.

### Named Rules
**The Tabular-Numerals Rule.** Every place a number can change (price as features toggle, range as filters move) uses `tabular-nums` so digits never shift width and cause layout jitter.

## Layout

A single centered column, `max-w-6xl` (browse, comparison) or `max-w-3xl` (detail — narrower because it's a linear spec sheet, not a grid), with responsive horizontal padding (`px-5` mobile, `px-8` ≥sm). The browse page opens with a full-bleed dark cockpit band (budget, range, filters) ahead of the constrained column, so the "set your parameters" moment reads as its own zone before the results grid begins. Card grids step 1 → 2 → 3 columns at `sm` / `xl`. Section rhythm uses generous outer gaps (`gap-8`–`gap-12` between major sections) but tightened internal gaps (`gap-1.5`–`gap-3` between a label and its control, or between chips) — density lives inside a group, air lives between groups. A `sticky top-0` header stays pinned regardless of scroll direction; a floating pill bar (`fixed bottom`) surfaces the comparison selection count once ≥1 car is selected.

## Elevation & Depth

Flat by default with hairline borders (`hairline-tan` on paper, `hairline-on-ink` on cockpit-ink) doing the separation work, not shadows. Shadows are reserved entirely as a *meaning* signal, not a default surface treatment: a gold glow marks the thing that is currently important (the "Recommended" card's border shadow, the range-slider fill, a selected color swatch's ring), and a plain neutral shadow marks the thing that is physically floating above the page (the fixed bottom compare bar, the sticky header once content scrolls beneath it).

### Shadow Vocabulary
- **Recommended glow** (`box-shadow: 0 4px 20px rgba(245,183,0,0.15)`): border-adjacent glow on the "Recommended for you" cards.
- **Slider fill glow** (`box-shadow: 0 0 12px rgba(245,183,0,0.55)`): the active gold segment of the dual-thumb range slider.
- **Selected swatch ring** (`box-shadow: 0 0 0 2px var(--color-surface)`): the white spacer ring around a selected exterior-color swatch, sitting inside its dark selected border.
- **Floating-surface shadow** (`box-shadow: 0 8px 30px rgba(0,0,0,0.35)`): the fixed bottom compare bar — the one place a plain, non-gold shadow is used, because its job is "this is floating," not "this matters."

### Named Rules
**The Glow-Means-Something Rule.** A shadow never appears just to lift a card off the page. Gold glow = this is the important/selected one; neutral shadow = this is physically floating (fixed/sticky chrome only).

## Shapes

Two deliberate registers, chosen by what a form does rather than mixed freely: soft-rounded rectangles (`rounded-lg` 8px for buttons and inputs, `rounded-xl` 12px for image wells and inset tiles, `rounded-2xl` 16px for cards) for anything with content inside it, and full pills/circles (`rounded-full`) for anything that is a control or a status marker — filter chips, the switch track and its thumb, the logo badge, color swatches, the "N selected" bar. The pill vocabulary is a deliberate nod to dashboard knobs and dial markers; it's never used for a content container.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px) for the filled primary action; `rounded-full` for ghost/secondary actions.
- **Primary:** Voltage Gold background, Cockpit Ink text, bold weight, `px-4 py-1.5`. Reserved for the single most consequential action in a given view (open comparison). Disabled state drops to `white/15` background, `white/40` text, on the dark bar it lives on.
- **Ghost:** transparent background, hairline-tan border, cockpit-ink text; hover darkens the border to cockpit-ink. Used for "Back", "Reset", "View details" — anything reversible or secondary.
- **Hover / Focus:** border/text color transitions only (150–200ms), no scale or shadow change; focus uses the global 2px gold `:focus-visible` outline except where a component supplies its own equally-visible focus treatment (see the budget input below).

### Chips (filter chips)
- **Style:** pill, hairline border, `text-xs font-medium`, `px-2.5 py-1`.
- **State:** unselected = paper/transparent background, warm-smoke text, hairline border (or `white/[0.04]` + `white/15` border on the dark cockpit band); selected = Gold Wash background, Gold Ember text, Voltage Gold border. Backed by a visually-hidden native checkbox for correct semantics, not a div with a click handler.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px).
- **Background:** Paper, hairline-tan border (1px default, 2px Voltage Gold for a "Recommended" card).
- **Shadow Strategy:** none at rest; gold glow only on the "Recommended" variant (see Elevation).
- **Internal Padding:** 20px (`p-5`), with a nested `rounded-xl` warm-fog well for the image and a second warm-fog well for the gauge+range readout.

### Inputs / Fields
- **Style (budget input):** no box at all — transparent background, large JetBrains Mono numerals, sitting on a 2px bottom border only. This is deliberate: it reads as a dashboard readout being edited, not a form field.
- **Focus:** the bottom border transitions from `white/15` to Voltage Gold (`focus-within` on the wrapping label). Because that transition *is* the focus indicator, the input explicitly suppresses the browser's default `:focus-visible` outline (`.budget-input:focus-visible { outline: none }`) rather than showing both — two competing focus treatments read as a bug, not emphasis.
- **Error / Disabled:** not yet defined; no form validation exists in the product today.

### Navigation
- **Style:** a single sticky header (`sticky top-0 z-30`, paper background, hairline bottom border) carrying the logo badge, wordmark, and tagline. No nav links exist — the product is single-surface-at-a-time (browse / detail / compare), switched by application state rather than routing, so "navigation" is limited to explicit Back/Compare/View-details actions inside the content itself.

### The Charge Gauge (signature component)
A semicircle SVG arc (`viewBox 0 0 100 54`, radius 40, `M 8 50 A 40 40 0 0 1 92 50`) stands in for every plain progress bar in the system. A neutral-track arc sits underneath; a colored arc segment is drawn on top using a `stroke-dasharray` trick (`0 startLen segmentLen totalLen`) so it can represent either a single value from zero (battery retention) or a band between two values (a car's min–max range window). Track color adapts to context (`hairline-tan` on paper, `hairline-on-ink` on cockpit-ink); the fill color is Voltage Gold by default, or one of the three status colors when the gauge is reporting a rating rather than a neutral spec. This is the one place the system draws custom vector art rather than composing utility classes, and it is reused identically across the browse cards, the detail page, and anywhere a range or a percentage needs to be shown — the repetition is the point.

### Toggle Switch
Pill track (`h-5 w-9`, hairline-tan, `rounded-full`) with a white circular thumb (`h-4 w-4`) that slides via `translate-x-4` when checked. Built on a visually-hidden native checkbox wrapped by a `group`-marked label, with `group-has-checked:` variants driving both the track color (→ Voltage Gold) and the thumb's translate — not `peer-checked:`, which only reaches direct siblings and silently fails to animate a thumb nested inside the track element. Used for per-feature toggling inside the comparison table.

## Do's and Don'ts

### Do:
- **Do** use the semicircle charge gauge, not a flat progress bar, for any range or percentage value — the repetition across cards/detail/comparison is what makes it a signature rather than a one-off.
- **Do** keep Voltage Gold to brand/interactive moments only; if a color needs to mean "good/warning/bad," it's Circuit Green / Amber Warn / Fault Red, never gold.
- **Do** set every number — prices, ranges, percentages, warranty terms — in JetBrains Mono with tabular figures.
- **Do** reserve dark cockpit-ink bands for parameter-setting/summary moments (the browse hero, the detail price strip, the comparison table header) — they mark "these are the numbers that drive the decision," not general content.
- **Do** use Gold Ember (`#7a5400`), never base Voltage Gold, for gold text on a light surface.

### Don't:
- **Don't** introduce a second accent hue — the system deliberately spends its "personality budget" on one color used with discipline, not several used timidly.
- **Don't** use green anywhere except a genuinely good battery/resale rating — it is not a decorative or "electric = green" color in this system.
- **Don't** add a shadow to lift a card at rest; a shadow here always means either "this is the important one" (gold glow) or "this is floating chrome" (neutral shadow), never ambient depth.
- **Don't** build a sliding/toggling nested element with Tailwind's `peer-checked:` — it only matches direct siblings. Use `group` + `group-has-checked:` for anything nested inside the sibling that changes state.
- **Don't** let a custom focus treatment (like the budget input's underline glow) coexist with the browser's default `:focus-visible` outline — pick one visible indicator and suppress the other explicitly.
