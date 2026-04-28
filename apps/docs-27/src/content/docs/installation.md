---
title: Installation
description: Full XOOPS 2.7 installation guide — server setup, permissions, and troubleshooting.
---

## Server Preparation

### Apache

Enable `mod_rewrite` and allow `.htaccess` overrides:

```apache
<Directory /var/www/html>
  AllowOverride All
</Directory>
```

### Nginx

Add a `try_files` directive to your server block:

```nginx
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

### PHP Extensions Required

```
pdo_mysql   gd   xml   curl   json   mbstring   zip
```

Check with: `php -m | grep -E "pdo_mysql|gd|xml|curl|mbstring"`

## Directory Permissions

XOOPS needs write access to three directories:

```bash
chmod 777 uploads/
chmod 777 xoops_data/
chmod 777 xoops_lib/
```

:::caution
Use `chmod 755` + correct ownership (`www-data` or `apache`) on production servers.
`chmod 777` is acceptable only for development.
:::

## Database Setup

```sql
CREATE DATABASE xoops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'xoops_user'@'localhost' IDENTIFIED BY 'StrongPassword!';
GRANT ALL PRIVILEGES ON xoops.* TO 'xoops_user'@'localhost';
FLUSH PRIVILEGES;
```

## Running the Installer

Navigate to `https://yourdomain.com/install/` and follow the five steps:

| Step | What happens |
|------|-------------|
| 1 – Requirements | Server check: PHP version, extensions, directory permissions |
| 2 – Database | Enter host, database name, username, password, table prefix |
| 3 – Configuration | Set XOOPS paths and URL |
| 4 – Data | Creates all database tables |
| 5 – Admin | Choose admin username, email, and password |

## Post-Install Security

After the wizard completes:

1. **Delete or rename** the `install/` directory.
2. Move `xoops_data/` and `xoops_lib/` **above** the web root if your host allows it.
3. Set `XOOPS_DB_PASS` via an environment variable instead of hard-coding it in `mainfile.php`.

## Troubleshooting

**Blank page / 500 error**
- Enable PHP error display temporarily: `ini_set('display_errors', 1);` at the top of `mainfile.php`
- Check `xoops_data/logs/` for error messages

**"Database connection failed"**
- Verify credentials with `mysql -u xoops_user -p xoops`
- Check if MySQL/MariaDB is running: `systemctl status mysql`

**File permission errors**
- Run `ls -la uploads/` — owner should match your web server user
