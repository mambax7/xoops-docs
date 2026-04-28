---
title: "Requirements​"
---

## Software Environment (the Stack)

Most XOOPS production sites run on a _LAMP_ stack (a **L**inux system running **A**pache, **M**ySQL and **P**HP) but, there are a lot of different possible stacks.

It is often easiest to prototype a new site on a local machine. For this case, many XOOPS users choose a _WAMP_ stack (using **W**indows as the OS,) while others run _LAMP_ or _MAMP_ (**M**AC) stacks.

### PHP

Any PHP version &gt;= 8.2.0 (PHP 8.4 or higher is strongly recommended)

> **Important:** XOOPS 2.7.0 requires **PHP 8.2 or newer**. PHP 7.x and earlier are no longer supported. If you are upgrading an older site, confirm your host offers PHP 8.2+ before starting.

### MySQL

MySQL server 5.7 or higher (MySQL Server 8.4 or higher is strongly recommended.) MySQL 9.0 is also supported. MariaDB is a backward compatible, binary drop-in replacement of MySQL, and also works fine with XOOPS.

### Web server

A web server that supports running PHP scripts, such as Apache, NGINX, LiteSpeed, etc.

### Required PHP Extensions

The XOOPS installer verifies the following extensions are loaded before allowing installation to proceed:

* `mysqli` — MySQL database driver
* `session` — session handling
* `pcre` — Perl-compatible regular expressions
* `filter` — input filtering and validation
* `fileinfo` — MIME-type detection for uploads

### Required PHP Settings

In addition to the extensions above, the installer verifies the following `php.ini` setting:

* `file_uploads` must be **On** — without it, XOOPS cannot accept uploaded files

### Recommended PHP Extensions

The installer also checks for these extensions. They are not strictly required, but XOOPS and most modules rely on them for full functionality. Enable as many as your host allows:

* `mbstring` — multi-byte string handling
* `intl` — internationalization
* `iconv` — character set conversion
* `xml` — XML parsing
* `zlib` — compression
* `gd` — image processing
* `exif` — image metadata
* `curl` — HTTP client for feeds and API calls

## Services

### File System Access (for Webmaster Access)

You will need some method (FTP, SFTP, etc.) to transfer the XOOPS distribution files to the web server.

### File System Access (for Web Server Process)

To run XOOPS, the ability to create, read and delete files and directories is needed. The following paths must be writable by the web server process for a normal installation and for normal day-to-day operation:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (writable during install and upgrade)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Database

XOOPS will need to create, modify and query tables in MySQL. For this you will need:

* a MySQL user account and password
* a MySQL database that user has all privileges on (or alternately, the user can have privilege to create such a database)

### Email

For a live site, you will need a working email address that XOOPS can use for user communication, such as account activations and password resets. While not strictly required, it is recommended if possible to use an email address that matches the domain that your XOOPS runs on. That helps to avoid your communications ending up being rejected or marked as spam.

## Tools

You may need some additional tools to setup and customize your XOOPS installation. These may include:

* FTP Client Software
* Text Editor
* Archive Software to work with XOOPS release (_.zip_ or _.tar.gz_) files.

See the [Tools of the Trade](../tools/tools.md) section for some suggestions for suitable tools and web server stacks if needed.

## Special Topics

Some specific system software combinations may require some additional configurations to work with XOOPS. If you are using an SELinux environment, or upgrading an older site with custom themes, please refer to [Special Topics](specialtopics.md) for more information.
