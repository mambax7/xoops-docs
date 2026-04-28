---
title: "Spezielle Themen"
---

Einige spezifische Systemsoftware-Kombinationen erfordern möglicherweise einige zusätzliche Konfigurationen, um zu funktionieren
 with XOOPS. Here are some details of known issues and guidance for dealing with them.

## SELinux Environments

Certain files and directories need to be writable during install, upgrade and normal operation
of XOOPS. In a traditional Linux environment, this is accomplished by ensuring that the
system user that the web server runs under has permissions on the XOOPS directories, usually by 
setting the appropriate group for those directories.

SELinux enabled systems (such as CentOS and RHEL) have an additional, a security context, that
can restrict a processes ability to change the file system. These systems may require 
changes to the security context for XOOPS to function correctly.

XOOPS expects to be able to freely write to certain directories during normal operation. 
Additionally, during XOOPS installs and upgrades, certain files must be writable as well.
 
During normal operation, XOOPS expects to be able to write files and create sub directories 
in these directories:

- `uploads` in the main XOOPS web root
- `xoops_data` wherever it is relocated during the install

During an install or upgrade process XOOPS will need to write to this file:

- `mainfile.php` in the main XOOPS web root

For a typical CentOS Apache based system, the security context changes might be 
accomplished with these commands:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

You can make mainfile.php writable with:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Note: When installing, you can copy an empty mainfile.php from the *extras* directory.

You should also allow httpd to send mail:

```
setsebool -P httpd_can_sendmail=1
```

Other settings you might need include:

Allow httpd to make network connections, i.e. fetch rss feeds or make an API calls:

```
setsebool -P httpd_can_network_connect 1
```

Enable network connection to a database with:

```
setsebool -P httpd_can_network_connect_db=1
```

For more information consult your system documentation and/or systems administrator.

## Smarty 4 and Custom Themes

XOOPS 2.7.0 upgraded its templating engine from Smarty 3 to **Smarty 4**. Smarty 4 is stricter
about template syntax than Smarty 3, and a few patterns that were tolerated in older templates
will now cause errors. If you are installing a fresh copy of XOOPS 2.7.0 using only the themes
and modules shipped with the release, there is nothing to worry about — every shipped template
has been updated for Smarty 4 compatibility.

The concern applies when you are:

- upgrading an existing XOOPS 2.5.x site that has custom themes, or
- installing custom themes or older third-party modules into XOOPS 2.7.0.

Before switching live traffic to an upgraded site, run the preflight scanner that ships in the
`/upgrade/` directory. It scans `/themes/` and `/modules/` looking for Smarty 4 incompatibilities
and can automatically repair many of them. See the
[Preflight Check](../upgrading/upgrade/preflight.md) page for details.

If you hit template errors after an install or upgrade:

1. Re-run `/upgrade/preflight.php` and address any reported issues.
2. Clear the compiled template cache by removing everything except `index.html` from
   `xoops_data/caches/smarty_compile/`.
3. Temporarily switch to a shipped theme such as `xbootstrap5` or `default` to confirm the problem
   is theme-specific rather than site-wide.
4. Validate any custom theme or module template changes before returning the site to production.
