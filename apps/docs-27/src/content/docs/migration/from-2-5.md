---
title: Upgrading from XOOPS 2.6 to 2.7
description: Step-by-step guide to safely upgrade your XOOPS installation from 2.6.x to 2.7.x.
---

:::caution[Back up first]
Always back up your database and files before upgrading. No exceptions.
:::

## What Changed in 2.7

- **PHP 8.2+ required** — PHP 7.x is no longer supported
- **Composer-managed dependencies** — Core libraries managed via `composer.json`
- **PSR-4 autoloading** — Module classes can use namespaces
- **Improved XoopsObject** — New `getVar()` type safety, deprecated `obj2Array()`
- **Bootstrap 5 admin** — Admin panel rebuilt with Bootstrap 5

## Pre-Upgrade Checklist

- [ ] PHP 8.2+ available on your server
- [ ] Full database backup (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Full file backup of your installation
- [ ] List of installed modules and their versions
- [ ] Custom theme backed up separately

## Upgrade Steps

### 1. Put the site in maintenance mode

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Download XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore25/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Replace core files

Upload the new files, **excluding**:
- `uploads/` — your uploaded files
- `xoops_data/` — your configuration
- `modules/` — your installed modules
- `themes/` — your themes
- `mainfile.php` — your site config

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Run the upgrade script

Navigate to `https://yourdomain.com/upgrade/` in your browser.
The upgrade wizard will apply database migrations.

### 5. Update modules

XOOPS 2.7 modules must be PHP 8.2 compatible.
Check the [Module Ecosystem](/xoops-docs/2.7/module-guide/introduction/) for updated versions.

In Admin → Modules, click **Update** for each installed module.

### 6. Remove maintenance mode and test

Remove the `XOOPS_MAINTENANCE` line from `mainfile.php` and
verify all pages load correctly.

## Common Issues

**"Class not found" errors after upgrade**
- Run `composer dump-autoload` in the XOOPS root
- Clear the `xoops_data/caches/` directory

**Module broken after update**
- Check the module's GitHub releases for a 2.7-compatible version
- The module may need code changes for PHP 8.2 (deprecated functions, typed properties)

**Admin panel CSS broken**
- Clear your browser cache
- Ensure `xoops_lib/` was fully replaced during the file upload
