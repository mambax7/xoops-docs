---
title: “附录 5：提高 XOOPS 安装的安全性”
---

安装XOOPS 2.7.0后，请执行以下步骤来加固站点。每个步骤单独是可选的，但它们一起显着提高了安装的基线安全性。

## 1.安装并配置Protector模区块

捆绑的`protector`模区块是XOOPS防火墙。如果您在初始向导期间没有安装它，请立即从管理→模区块屏幕安装它。

![](/XOOPS-docs/2.7/img/installation/img_73.jpg)

打开 Protector 的管理面板并查看它显示的警告。旧版 PHP 指令（例如 `register_globals`）不再存在（PHP 8.2+ 已删除它们），因此您将不会再看到这些警告。当前的警告通常与目录权限、会话设置和信任-path配置有关。

## 2. 锁定 `mainfile.php` 和 `secure.php`

安装程序完成后，它会尝试将这两个文件标记为已读-only，但某些主机会恢复权限。如果需要，请验证并重新-apply：

- `mainfile.php` → `0444`（所有者、团体、其他阅读-only）
- `XOOPS_data/data/secure.php` → `0444`

`mainfile.php`定义路径常量（`XOOPS_ROOT_PATH`、`XOOPS_PATH`、`XOOPS_VAR_PATH`、`XOOPS_URL`、`XOOPS_COOKIE_DOMAIN`、`XOOPS_COOKIE_DOMAIN_USE_PSL`）和生产标志。 `secure.php` 持有数据库凭证：

- 在 2.5.x 中，数据库凭据过去位于 `mainfile.php` 中。它们现在存储在 `XOOPS_data/data/secure.php` 中，由 `mainfile.php` 在运行时加载。将 `secure.php` 保留在 `XOOPS_data/` 内（鼓励您将其重新定位到文档根目录之外的目录）使得攻击者更难通过 HTTP 获取凭据。

## 3. 将 `XOOPS_lib/` 和 `XOOPS_data/` 移至文档根目录之外

如果您尚未这样做，请将这两个目录移至 Web 根目录上方一级并重命名。然后更新`mainfile.php`中对应的常量：

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

将这些目录放置在文档根目录之外可以防止直接访问 Composer 的 `vendor/` 树、缓存的模板、会话文件、上传的数据以及 `secure.php` 中的数据库凭据。

## 4.Cookie域配置

XOOPS 2.7.0 在`mainfile.php`中引入了两个 cookie-domain 常量：

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

指南：

- 如果您从单个主机名或 IP 提供 XOOPS，请将 `XOOPS_COOKIE_DOMAIN` 留空。
- 使用完整主机（例如 `www.example.com`）将 cookie 范围仅限制到该主机名。
- 当您希望在 `www.example.com`、`blog.example.com` 等之间共享 Cookie 时，请使用可注册域（例如 `example.com`）。
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` 让 XOOPS 正确拆分复合 TLD（`co.uk`、`com.au`、...），而不是意外地在有效的 TLD 上设置 Cookie。

## 5. `mainfile.php`中的生产标志

`mainfile.dist.php` 出厂时将这两个标志设置为 `false` 进行生产：

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

让它们停止生产。当您想要执行以下操作时，可以在开发或暂存环境中临时启用它们：

- 追查挥之不去的遗留数据库调用（`XOOPS_DB_LEGACY_LOG = true`）；
- 表面`E_USER_DEPRECATED`通知和其他调试输出（`XOOPS_DEBUG = true`）。

## 6.删除安装程序

安装完成后：

1. 从 Web 根目录中删除任何重命名的 `install_remove_*` 目录。
2. 删除向导在清理过程中创建的所有 `install_cleanup_*.php` 脚本。
3. 确认无法再通过 HTTP 访问 `install/` 目录。

保留禁用但存在的安装程序目录是低-severity但可以避免的风险。

## 7. 保持 XOOPS 和模区块最新

XOOPS遵循常规的补丁节奏。订阅 XOOPSCore27 GitHub 存储库以获取发布通知，并在新版本发布时更新您的站点和任何第三-party模区块。 2.7.x 的安全更新通过存储库的发布页面发布。