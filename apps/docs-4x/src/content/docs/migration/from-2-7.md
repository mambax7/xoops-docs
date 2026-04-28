---
title: Migrating from XOOPS 2.7 to 4.x
description: What changed between XOOPS 2.7 and 4.x, and how to migrate your modules and themes.
---

:::caution[Work in progress]
XOOPS 4.x migration documentation is being written. Check back soon.
:::

## Breaking Changes Overview

| Area | 2.7 | 4.x |
|------|-----|-----|
| PHP requirement | 8.1+ | 8.3+ |
| Autoloading | Custom `include/` paths | PSR-4 via Composer |
| Module classes | `XoopsObject` extend | Same + typed properties |
| Admin UI | Bootstrap 3 | Bootstrap 5 |
| Template engine | Smarty 3 | Smarty 4 |

More detailed migration steps coming soon.
