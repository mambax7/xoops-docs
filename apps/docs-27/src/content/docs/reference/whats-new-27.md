---
title: "What's New in XOOPS 2.7.0"
---

XOOPS 2.7.0 is a significant update from the 2.5.x series. Before installing or upgrading, review the changes on this page so you know what to expect. The list below is focused on items that affect installation and site administration — for a complete list of changes, see the release notes that ship with the distribution.

## PHP 8.2 is the new minimum

XOOPS 2.7.0 requires **PHP 8.2 or newer**. PHP 7.x and earlier are no longer supported. PHP 8.4 or higher is strongly recommended.

**Action:** Confirm your host offers PHP 8.2+ before you start. See [Requirements](installation/requirements.md).

## MySQL 5.7 is the new minimum

The new minimum is **MySQL 5.7** (or a compatible MariaDB). MySQL 8.4 or higher is strongly recommended. MySQL 9.0 is also supported.

The old warnings about PHP/MySQL 8 compatibility problems no longer apply, because the affected PHP versions are no longer supported by XOOPS.

## Smarty 4 replaces Smarty 3

This is the single biggest change for existing sites. XOOPS 2.7.0 uses **Smarty 4** as its templating engine. Smarty 4 is stricter about template syntax than Smarty 3, and some custom themes and module templates may need adjustments before they will render correctly.

To help you identify and repair these issues, XOOPS 2.7.0 ships a **preflight scanner** in the `upgrade/` directory that examines your existing templates for known Smarty 4 incompatibilities and can automatically repair many of them.

**Action:** If you are upgrading from 2.5.x and have custom themes or older modules, run the [Preflight Check](upgrading/upgrade/preflight.md) _before_ running the main upgrader.

## Composer-managed dependencies

XOOPS 2.7.0 uses **Composer** to manage its PHP dependencies. These live in `xoops_lib/vendor/`. Third-party libraries that were previously bundled into the core or into modules — PHPMailer, HTMLPurifier, Smarty, and others — are now supplied through Composer.

**Action:** Most site operators do not need to do anything — release tarballs ship with `vendor/` already populated. If you are moving or upgrading a site, copy the entire `xoops_lib/` tree, including `vendor/`. Developers cloning the git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## New hardened session cookie preferences

Two new preferences are added during upgrade:

* **`session_cookie_samesite`** — controls the SameSite attribute on session cookies (`Lax`, `Strict`, or `None`).
* **`session_cookie_secure`** — when enabled, session cookies are only sent over HTTPS.

**Action:** After upgrading, review these under System Options → Preferences → General Settings. See [After the Upgrade](upgrading/upgrade/ustep-04.md).

## New `tokens` table

XOOPS 2.7.0 adds a `tokens` database table for generic scoped token storage. The upgrader creates this table automatically as part of the 2.5.11 → 2.7.0 upgrade.

## Modernized password storage

The `bannerclient.passwd` column has been widened to `VARCHAR(255)` so it can hold modern password hashes (bcrypt, argon2). The upgrader widens the column automatically.

## Updated theme and module lineup

XOOPS 2.7.0 ships with updated front-end themes:

* `default`, `xbootstrap` (legacy), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

A new **Modern** admin theme is included alongside the existing Transition theme.

A new **DebugBar** module based on Symfony VarDumper ships as one of the optional installable modules. It is useful for development and staging, but is typically not installed on public production sites.

See [Select Theme](installation/installation/step-12.md) and [Modules Installation](installation/installation/step-13.md).

## Copying in a new release no longer overwrites configuration

Previously, copying a new XOOPS distribution on top of an existing site required care to avoid overwriting `mainfile.php` and other configuration files. In 2.7.0, the copy process leaves existing configuration files intact, which makes upgrades noticeably safer.

You should still make a full backup before any upgrade.

## Template overload capability in system admin themes

Admin themes in XOOPS 2.7.0 can now override individual system admin templates, making it easier to customize the administration UI without forking the entire system module.

## What has not changed

For reassurance, these parts of XOOPS work the same way in 2.7.0 as they did in 2.5.x:

* The installer page order and overall flow
* The `mainfile.php` plus `xoops_data/data/secure.php` configuration split
* The recommended practice of relocating `xoops_data` and `xoops_lib` outside the web root
* The module installation model and `xoops_version.php` manifest format
* The site-move workflow (backup, edit `mainfile.php`/`secure.php`, use SRDB or similar)

## Where to go next

* Starting fresh? Continue to [Requirements](installation/requirements.md).
* Upgrading from 2.5.x? Start with [Upgrading](upgrading/upgrade/README.md), then run the [Preflight Check](upgrading/upgrade/preflight.md).
