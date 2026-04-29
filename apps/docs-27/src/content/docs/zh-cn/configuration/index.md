---
title: “基本配置”
description: “初始XOOPS设置，包括主文件。php设置、站点名称、电子邮件和时区配置”
---

# 基本XOOPS配置

本指南涵盖了使您的XOOPS站点在安装后正常运行的基本配置设置。

## 主文件.php 配置

`mainfile.php` 文件包含 XOOPS 安装的关键配置。它是在安装过程中创建的，但您可能需要手动编辑它。

### 地点

```
/var/www/html/xoops/mainfile.php
```

### 文件结构

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### 关键设置解释

|设置|目的|示例|
|---|---|---|
| `XOOPS_DB_TYPE` |数据库系统| `mysqli`、`mysql`、`pdo`|
| `XOOPS_DB_HOST` |数据库服务器位置| `localhost`、`192.168.1.1`|
| `XOOPS_DB_USER` |数据库用户名| `XOOPS_user` |
| `XOOPS_DB_PASS` |数据库密码| [安全密码] |
| `XOOPS_DB_NAME` |数据库名称| `XOOPS_db` |
| `XOOPS_DB_PREFIX` |表名前缀| `XOOPS_`（允许一个数据库上有多个XOOPS）|
| `XOOPS_ROOT_PATH` |物理文件系统路径| `/var/www/html/XOOPS` |
| `XOOPS_URL` |可通过网络访问URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` |可信路径（Web 根目录之外）| `/var/www/XOOPS_var` |

### 编辑主文件。php

在文本编辑器中打开 mainfile.php：

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### 通用主文件。php 更改

**更改站点URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**启用调试模式（仅限开发）：**
```php
define('XOOPS_DEBUG', 1);
```

**更改表前缀（如果需要）：**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**将信任路径移至 Web 根目录之外（高级）：**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## 管理面板配置

通过XOOPS管理面板配置基本设置。

### 访问系统设置

1. 登录管理面板：`http://your-domain.com/XOOPS/admin/`
2. 导航至：**系统 > 首选项 > 常规设置**
3.修改设置（见下文）
4.点击底部的“保存”

### 站点名称和描述

配置您的网站的显示方式：

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### 联系信息

设置站点联系方式：

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### 语言和地区

设置默认语言和区域：

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## 电子邮件配置

配置通知和用户通信的电子邮件设置。

### 电子邮件设置位置

**管理面板：** 系统 > 首选项 > 电子邮件设置

### SMTP 配置

为了可靠地发送电子邮件，请使用 SMTP 而不是 PHP mail()：

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail 配置示例

设置XOOPS以通过 Gmail 发送电子邮件：

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**注意：** Gmail 需要应用程序密码，而不是您的 Gmail 密码：
1. 前往https://myaccount.google.com/apppasswords
2. 为“邮件”和“Windows计算机”生成应用程序密码
3. 使用XOOPS中生成的密码

### PHP mail() 配置（更简单但不太可靠）

如果 SMTP 不可用，请使用 PHP mail()：

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

确保您的服务器已配置 sendmail 或 postfix：

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### 电子邮件功能设置

配置触发电子邮件的内容：

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## 时区配置

设置正确的时区以获得正确的时间戳和日程安排。

### 在管理面板中设置时区

**路径：**系统 > 首选项 > 常规设置

```
Default Timezone: [Select your timezone]
```

**常见时区：**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### 验证时区

检查当前服务器时区：

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### 设置系统时区 (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL 配置

### 启用干净 URL（友好 URL）

对于像 `/page/about` 而不是 `/index.php?page=about` 这样的 URL

**要求：**
- 启用 mod_rewrite 的 Apache
- `.htaccess` 文件位于 XOOPS 根目录中

**在管理面板中启用：**

1. 转至：**系统 > 首选项 > URL 设置**
2. 勾选：“启用友好 URL”
3. 选择：“URL类型”（路径信息或查询）
4. 保存**验证 .htaccess 是否存在：**

```bash
cat /var/www/html/xoops/.htaccess
```

示例 .htaccess 内容：

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**干净 URL 故障排除：**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### 配置站点URL

**管理面板：**系统 > 首选项 > 常规设置

为您的域设置正确的 URL：

```
Site URL: http://your-domain.com/xoops/
```

或者如果 XOOPS 是根：

```
Site URL: http://your-domain.com/
```

## 搜索引擎优化 (SEO)

配置SEO设置以获得更好的搜索引擎可见性。

### 元标签

设置全局元标记：

**管理面板：**系统 > 首选项 > SEO 设置

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

这些出现在页面`<head>`中：

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### 网站地图

为搜索引擎启用XML站点地图：

1. 转到：**系统 > 模区块**
2.找到“站点地图”模区块
3.点击安装并启用
4. 访问站点地图：`/XOOPS/sitemap.xml`

### 机器人.txt

控制搜索引擎抓取：

创建`/var/www/html/XOOPS/robots.txt`：

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## 用户设置

配置默认用户-related设置。

### 用户注册

**管理面板：**系统 > 首选项 > 用户设置

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### 用户个人资料

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### 用户电子邮件显示

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## 缓存配置

通过适当的缓存提高性能。

### 缓存设置

**管理面板：**系统 > 首选项 > 缓存设置

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### 清除缓存

清除旧的缓存文件：

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## 初始设置清单

安装后，配置：

- [ ] 站点名称和描述设置正确
- [ ] 管理员电子邮件已配置
- [ ] SMTP 已配置和测试电子邮件设置
- [ ] 时区设置为您所在的地区
- [ ] URL配置正确
- [ ] 如果需要，启用干净 URL（友好 URL）
- [ ] 配置用户注册设置
- [ ] 已配置 SEO 的元标记
- [ ] 选择默认语言
- [ ] 缓存设置已启用
- [ ] 管理员用户密码强度较高（16 个以上字符）
- [ ] 测试用户注册
- [ ] 测试电子邮件功能
- [ ] 测试文件上传
- [ ] 访问主页并验证外观

## 测试配置

### 测试电子邮件

发送测试电子邮件：

**管理面板：** 系统 > 电子邮件测试

或者手动：

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### 测试数据库连接

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**重要：**测试后删除测试文件！

```bash
rm /var/www/html/xoops/test-*.php
```

## 配置文件汇总

|文件 |目的|编辑方法|
|---|---|---|
|主文件。php |数据库和核心设置|文本编辑器 |
|管理面板 |大多数设置|网页界面|
| .htaccess | URL重写|文本编辑器 |
|机器人.txt |搜索引擎抓取|文本编辑器 |

## 后续步骤

基本配置后：

1. 详细配置系统设置
2. 强化安全性
3. 探索管理面板
4. 创建您的第一个内容
5. 设置用户帐户

---

**标签：** #configuration #setup #email #timezone #seo

**相关文章：**
- ../Installation/Installation
- 系统-Settings
- 安全-Configuration
- 性能-Optimization