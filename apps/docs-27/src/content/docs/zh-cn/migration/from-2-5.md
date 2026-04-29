---
title：从XOOPS 2.5 升级到 2.7
description：将XOOPS安装从 2.5.x 安全升级到 2.7.x 的步骤-by-step指南。
---

:::注意[先备份]
升级前务必备份数据库和文件。没有例外。
:::

## 2.7 中发生了什么变化

- **PHP 8.2+ 必需** — PHP 7.x 不再受支持
- **Composer-managed 依赖项** — 通过`composer.json` 管理的核心库
- **PSR-4 自动加载** — 模区块类可以使用命名空间
- **改进了 XOOPSObject** — 新的 `getVar()` 类型安全，已弃用 `obj2Array()`
- **Bootstrap 5 admin** — 使用 Bootstrap 5 重建管理面板

## Pre-Upgrade 清单

- [ ] PHP 8.2+ 在您的服务器上可用
- [ ] 完整数据库备份 (`mysqldump -u user -p XOOPS_db > backup.sql`)
- [ ] 安装的完整文件备份
- [ ] 已安装模区块及其版本列表
- [ ] 自定义主题单独备份

## 升级步骤

### 1. 将站点置于维护模式

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2.下载XOOPS2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3.替换核心文件

上传新文件，**不包括**：
- `uploads/` — 您上传的文件
- `XOOPS_data/` — 您的配置
- `modules/` — 您安装的模区块
- `themes/` — 你的主题
- `mainfile.php` — 您的站点配置

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4.运行升级脚本

在浏览器中导航至`https://yourdomain.com/upgrade/`。
升级向导将应用数据库迁移。

### 5.更新模区块

XOOPS 2.7 模区块必须兼容 PHP 8.2。
检查[Module Ecosystem](/XOOPS-docs/2.7/module-guide/introduction/)以获取更新版本。

在管理 → 模区块中，针对每个已安装的模区块单击“**更新**”。

### 6.删除维护模式并测试

从 `mainfile.php` 中删除 `XOOPS_MAINTENANCE` 行并
验证所有页面加载正确。

## 常见问题

**升级后出现“找不到类”错误**
- 在 XOOPS 根目录中运行 `composer dump-autoload`
- 清除`XOOPS_data/caches/`目录

**更新后模区块损坏**
- 检查模区块的 GitHub 版本是否有 2.7-compatible 版本
- 模区块可能需要针对 PHP 8.2 进行代码更改（不推荐使用的函数、类型化属性）

**管理面板CSS损坏**
- 清除浏览器缓存
- 确保`XOOPS_lib/`在文件上传期间被完全替换