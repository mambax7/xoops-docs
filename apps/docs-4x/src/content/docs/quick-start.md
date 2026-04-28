---
title: Quick Start — XOOPS 4.x
description: Get XOOPS 4.x running. Requires PHP 8.3+ and Composer.
---

## Requirements

| Component  | Minimum  |
|------------|----------|
| PHP        | 8.3      |
| MySQL      | 8.0      |
| Composer   | 2.x      |

## Install via Composer

```bash
composer create-project xoops/xoops4 mysite
cd mysite
cp xoops_data/configs/xoops.php.dist xoops_data/configs/xoops.php
php -S localhost:8080 -t public/
```

Open `http://localhost:8080/install/` and follow the wizard.

## Next Steps

- [Full Installation Guide](./installation/)
- [Module Development](./module-guide/introduction/)
- [Migrating from XOOPS 2.7](./migration/from-2-7/)
