# LLM Pricing Tracker

A static LLM API pricing tracker. The page reads from `data/prices.json`, displays date-versioned prices, and supports search, provider filtering, and selected model comparison.

## Directory

```text
.
├── index.html
├── styles.css
├── src/
│   └── app.js
├── data/
│   └── prices.json
├── assets/
│   ├── favicon.svg
│   └── providers/
├── docs/
│   ├── assets.md
│   └── data-schema.md
├── CHANGELOG.md
├── _headers
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Local Preview

Browsers usually block `file://` pages from fetching local JSON. Preview with any static server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Do not open `index.html` directly from Finder or a `file://` URL. The page fetches `data/prices.json`, and browsers block that request for local files.

## Deployment

Recommended: Cloudflare Pages direct upload from GitHub Actions.

This project is a public static site with no build step. GitHub Actions deploys the repository root to the Cloudflare Pages project `openllmprices` after every push to `master`, so Cloudflare does not need GitHub App access to the repository.

One-time Cloudflare setup:

1. Create a Cloudflare Pages project named `openllmprices`.
2. Add `openllmprices.com` as a custom domain in the Pages project.
3. Let Cloudflare create or update the DNS records.
4. Create a Cloudflare API token that can deploy Pages projects.
5. Add these GitHub repository secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
6. Merge to `master` or run the `Deploy to Cloudflare Pages` workflow manually.

The `_headers` file keeps `/`, `index.html`, and `data/prices.json` revalidated. Versioned CSS and JavaScript use long browser cache lifetimes; provider icons use a shorter cache because their URLs are not versioned.

Before pushing a release, run:

```bash
node scripts/validate-data.mjs
node --check src/app.js
```

When changing `styles.css` or `src/app.js`, bump the query version in `index.html` so browsers request the updated asset.

## Updating Prices

1. Add a new date snapshot at the top of `versions` in `data/prices.json`.
2. Keep an official source URL for every model price.
3. Run validation:

```bash
node scripts/validate-data.mjs
```

The default unit is USD / 1M tokens. Use `pricingItems` for each distinct billable rule, including context tiers, cache read/write pricing, cache storage duration, and modality-specific pricing.

The date selector only lists dates that have snapshots. If a URL requests a date that does not exist, the app falls back to the latest snapshot on or before that date, or the earliest snapshot if the requested date predates the dataset.
