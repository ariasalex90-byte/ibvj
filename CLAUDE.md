# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **WordPress local development environment** managed by [Local by Flywheel](https://localwp.com/). The site runs at `test2.local` and is not a custom application — it is a WordPress site with a custom child theme.

## Environment

| Service  | Version   | Port  |
|----------|-----------|-------|
| Apache   | 2.4.43    | 10003 |
| PHP      | 8.2.27    | 10002 |
| MySQL    | 8.0.35    | 10004 |
| Mailpit  | 1.24.1    | 10000 (web), 10001 (SMTP) |

- **Database:** `local`, user `root`, password `root`, host `localhost`
- **Site URL:** `http://test2.local`
- **WP_DEBUG:** disabled (`wp-config.php`)
- **Xdebug:** disabled (`local-site.json`)

Start/stop the environment through the Local by Flywheel desktop app — there are no CLI build or test commands.

## Custom Theme: IBVJ

The only custom code in this repository lives in:

```
app/public/wp-content/themes/IBVJ/
├── style.css       # Child theme header; imports ../mesmerize/style.css
└── functions.php   # Enqueues parent (Mesmerize) stylesheet
```

This is a **child theme** of the **Mesmerize** parent theme. All theme logic, templates, and customizer settings are inherited from:

```
app/public/wp-content/themes/mesmerize/
```

To extend the child theme, add template overrides, hooks, or styles directly into `IBVJ/`. WordPress child theme loading rules apply: files in `IBVJ/` shadow files of the same name in `mesmerize/`.

## Key Files

- `local-site.json` — Local by Flywheel site configuration (ports, service versions, DB credentials)
- `app/public/wp-config.php` — WordPress database connection and environment settings
- `app/sql/local.sql` — Full MySQL database dump (4.4 MB); import this to restore site data
- `conf/php/php.ini.hbs` — PHP configuration template (memory: 256MB, upload limit: 1GB)
- `conf/mysql/my.cnf.hbs` — MySQL configuration template
- `conf/nginx-1.26.1/` — Nginx configuration templates
- `logs/` — PHP, MySQL, Apache, Nginx, and Mailpit logs

## Installed Plugins

- **Elementor** — full page builder installation at `app/public/wp-content/plugins/elementor/`

## Database

To restore from the SQL dump:

```bash
mysql -u root -proot local < app/sql/local.sql
```

To export a fresh dump:

```bash
mysqldump -u root -proot local > app/sql/local.sql
```

The database host and port depend on how Local exposes MySQL (typically via socket or `127.0.0.1:10004`).

## Logs

```
logs/php/        # PHP errors
logs/apache/     # Apache access/error logs
logs/mysql/      # MySQL logs
logs/nginx/      # Nginx logs
logs/mailpit/    # Email capture logs
```
