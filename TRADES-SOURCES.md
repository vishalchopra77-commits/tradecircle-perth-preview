# Australian trades and local business types — sources

**Updated in v1.6.0 (19 November 2026, Australia/Perth):** the picker now covers all physical / local businesses, not only trades. The research master list, sources, and judgement calls are in `/workspace/fb-marketing/business-categories/` (`SOURCES.md`, `business-categories.json`). The in-app list is `trades.js` (`window.TC_TRADES`, `window.TC_BUSINESS_CATEGORIES`, `window.TC_TRADE_ALIASES`).

# Australian trades list — sources

This note records how the TradeCircle Perth trade list was built for prototype v1.5 (16 November 2026, Australia/Perth). The list is a **deduplicated set of occupation and service names** for the in-app trade picker and search. It is not a copy of any site’s full category tree, and it is not an official directory.

**Count:** 241 unique names, in `trades.js` (`window.TC_TRADES`).

## What was consulted

Public category and service pages (checked 16 November 2026):

- **hipages** — [hipages.com.au/find](https://hipages.com.au/find) (featured categories), [hipages.com.au/business/categories](https://hipages.com.au/business/categories) (licensed trades, building and renovation, home services, outdoor, design and consultants, installation and servicing, supplies and equipment), and [hipages.com.au/content/llm-information](https://hipages.com.au/content/llm-information) (examples of top home-improvement categories). hipages describes 900+ household job categories. This prototype uses **occupation-level names**, not every job subtype.
- **Oneflare** — public app and help material listing common Australian service types (builder, carpenter, electrician, plumber, painter, tiler, concreter, fencer, gas fitter, handyman, landscaper, gardener, removalist, roofer, cleaner, bathroom renovations, and some professional services such as architect and interior designer).
- **Airtasker Australia** — [airtasker.com/au/services](https://www.airtasker.com/au/services/) and related trades / property-maintenance / building pages (plumbing, electrical, painting, plastering, carpentry, cleaning specialisms, heating and cooling, windows and doors, removals, and other home services).
- **ServiceSeeking** and **Yellow Pages** style Australian trade directories — used as a cross-check for standard occupation names (for example gas fitter, roof plumber, stonemason, surveyor, termite inspector, waterproofing).

## How names were chosen

- Prefer a **trade or service a person would put on a profile** (for example “Electrician”, “Pest Control”, “Solar Installer”), not a single job type (“Samsung fridge repair”).
- Keep names used in the earlier prototype (Pest Control, Carpenter, Painter, Plumber, Electrician, Landscaper, Roofer, Air Conditioning, Tiler, Fencer, Handyman, Locksmith, Plasterer).
- Deduplicate close repeats (for example one “Carpet Cleaner”, not every cleaning subtype).
- Include consultants and installers that hipages groups under design, inspection, and installation (architect, structural engineer, building inspector, home automation, EV charger installer).
- Lifestyle-only Airtasker categories (for example copywriting or personal styling) were **left out**, because this app is a Perth tradie referral circle.

The list can be edited later in the admin Trades screen (prototype only) and in `trades.js`.
