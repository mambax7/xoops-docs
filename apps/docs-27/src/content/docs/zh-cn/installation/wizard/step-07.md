---
title: “保存配置”
---

此页面显示您迄今为止输入的配置信息的保存结果。

检查并纠正任何问题后，选择“继续”按钮继续。

## 关于成功

_保存系统配置_部分显示已保存的信息。设置保存在两个文件之一中。 Web 根目录中的一个文件是 _mainfile.php_。另一个是 _XOOPS_data_ 目录中的 _data/secure.php_。

![XOOPS Installer Save Configuration](/XOOPS-docs/2.7/img/installation/installer-07.png)

这两个文件都是从 XOOPS 2.7.0 附带的模板文件生成的：

* `mainfile.php` 是从网络根目录中的 `mainfile.dist.php` 生成的。
* `XOOPS_data/data/secure.php` 是从 `XOOPS_data/data/secure.dist.php` 生成的。

除了您输入的路径和 URL 之外，`mainfile.php` 现在还包含 XOOPS 2.7.0 中新增的几个常量：

* `XOOPS_TRUST_PATH` — 保留为`XOOPS_PATH`的向后-compatible别名；您不需要单独配置它。
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — 默认为 `true`；使用公共后缀列表来派生正确的 cookie 域。
* `XOOPS_DB_LEGACY_LOG` — 默认为 `false`；在开发中设置为 `true` 以记录旧数据库 API 的使用情况。
* `XOOPS_DEBUG` — 默认为 `false`；在开发中设置为`true`以启用额外的错误报告。

您无需在安装过程中手动编辑这些内容 - 默认值适用于生产站点。此处提到了它们，以便您知道稍后打开 `mainfile.php` 时要查找什么。

## 错误

如果XOOPS检测到写入配置文件时出现错误，它将显示消息，详细说明错误所在。

![XOOPS Installer Save Configuration Errors](/XOOPS-docs/2.7/img/installation/installer-07-errors.png)

在许多情况下，在 Apache 中使用 mod_php 的 Debian-derived 系统的默认安装是错误的根源。大多数托管提供商的配置不存在这些问题。

### 组权限问题

PHP进程是使用某些用户的权限运行的。文件也归某些用户所有。如果这两个用户不是同一用户，则可以使用组权限来允许 PHP 进程与您的用户帐户共享文件。这通常意味着您需要更改 XOOPS 需要写入的文件和目录组。

对于上面提到的默认配置，这意味着需要将 _www-data_ 组指定为文件和目录的组，并且这些文件和目录需要按组可写。

您应该仔细检查您的配置，并仔细选择如何解决开放互联网上可用的盒子的这些问题。

示例命令可以是：

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### 无法创建主文件。php

在 Unix-like 系统中，创建新文件的权限取决于父文件夹授予的权限。在某些情况下，该权限不可用，授予该权限可能会引起安全问题。

如果您的配置有问题，您可以在 XOOPS 发行版的 _extras_ 目录中找到一个虚拟 _mainfile.php_。将该文件复制到 Web 根目录并设置该文件的权限：

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux 环境

SELinux 安全上下文可能是问题的根源。如果这可能适用，请参阅[Special Topics](../specialtopics.md)了解更多信息。