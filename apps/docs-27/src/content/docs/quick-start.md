---
title: Quick Start
description: Get XOOPS 2.7 running in under 5 minutes.
---

## Requirements

| Component  | Minimum                 | Recommended   |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Web server | Apache 2.4 / Nginx 1.20 | Latest stable |

## Download

Download the latest release from [GitHub Releases](https://github.com/XOOPS/XoopsCore25/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore25.git mysite
cd mysite
```

## Installation Steps

1. **Upload files** to your web server document root (e.g. `public_html/`).
2. **Create a MySQL database** and a user with full privileges on it.
3. **Open your browser** and navigate to your domain — the XOOPS installer starts automatically.
4. **Follow the 5-step wizard** — it configures paths, creates tables, and sets up your admin account.
5. **Delete the `install/` folder** when prompted. This is mandatory for security.

## Verify the Installation

After setup, visit:

- **Front page:** `https://yourdomain.com/`
- **Admin panel:** `https://yourdomain.com/xoops_data/` *(path you chose during install)*

## Next Steps

- [Full Installation Guide](./installation/) — server config, permissions, troubleshooting
- [Module Guide](./module-guide/introduction/) — build your first module
- [Theme Guide](./theme-guide/introduction/) — create or customize a theme
