# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **Iglesia Bautista Valle De Josafat (IBVJ)**, a Baptist church in Bogotá, Colombia. The site is a single-page static frontend (`web/`) alongside a Local by Flywheel WordPress environment used to manage and source assets.

## Architecture

```
IBVJ/
├── web/                    # Static site (the deliverable)
│   ├── index.html          # Single-page site (Spanish, lang="es")
│   ├── css/styles.css      # All styles
│   ├── js/main.js          # All JavaScript
│   ├── assets/images/      # Images copied from WordPress uploads
│   ├── assets/videos/      # Videos copied from WordPress uploads
│   └── copy-assets.sh      # Script to sync assets from WordPress → web/assets/
├── conf/                   # Local by Flywheel server config templates (.hbs)
├── logs/                   # PHP, Apache, MySQL, Nginx, Mailpit logs
└── local-site.json         # Local environment metadata (ports, versions)
```

The static site is **self-contained** — `index.html` loads `css/styles.css` and `js/main.js` with no build step. Open `web/index.html` directly in a browser to preview.

## Copying Assets from WordPress

Media files live in `app/public/wp-content/uploads/2026/03/` (WordPress uploads). Run from the project root to sync them into `web/assets/`:

```bash
bash web/copy-assets.sh
```

This copies videos (`church-banner-*.mp4`), the logo, congregation photo, pastor photo, ministry photos, doctrine images, and missions images into `web/assets/images/` and `web/assets/videos/`.

## Local WordPress Environment

Managed via the [Local by Flywheel](https://localwp.com/) desktop app — start/stop from the app UI, not CLI.

| Service | Version | Port  |
|---------|---------|-------|
| Apache  | 2.4.43  | 10003 |
| PHP     | 8.2.27  | 10002 |
| MySQL   | 8.0.35  | 10004 |
| Mailpit | 1.24.1  | 10000 (web) / 10001 (SMTP) |

- **Site URL:** `http://test2.local`
- **DB:** `local`, user/password: `root`/`root`

## Frontend Stack

- Plain HTML/CSS/JS — no framework, no bundler
- Fonts: Inter + Jost via Google Fonts
- Icons: Font Awesome 6.5 (CDN)
- Single page with anchor-based navigation sections: `#inicio`, `#bienvenida`, `#ministerios`, `#sana-doctrina`, `#evangelismo`, `#contacto`
