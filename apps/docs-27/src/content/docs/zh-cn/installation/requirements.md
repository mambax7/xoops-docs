---
title: “要求”
---

## 软件环境（堆栈）

大多数XOOPS生产站点运行在_LAMP_堆栈上（运行**A**pache、**M**ySQL和**P**HP的**L**inux系统），但是，有很多不同的可能堆栈。

在本地计算机上构建新站点的原型通常是最简单的。对于这种情况，许多 XOOPS 用户选择 _WAMP_ 堆栈（使用 **W**indows 作为操作系统），而其他用户则运行 _LAMP_ 或 _MAMP_ (**M**AC) 堆栈。

### PHP

任何 PHP 版本 >= 8.2.0（强烈建议PHP 8.4 或更高版本）

> **重要提示：** XOOPS 2.7.0 需要 **PHP 8.2 或更高版本**。 PHP 7.x 及更早版本不再受支持。如果您要升级较旧的站点，请在开始之前确认您的主机提供 PHP 8.2+。

### MySQL

MySQL服务器5.7或更高版本（强烈建议MySQL服务器8.4或更高版本。）MySQL9.0也受支持。 MariaDB 是 MySQL 的向后兼容的二进制 drop-in 替代品，并且也可以与 XOOPS 配合使用。

### 网络服务器

支持运行PHP脚本的Web服务器，例如Apache、NGINX、LiteSpeed等。

### 必需的 PHP 扩展

XOOPS 安装程序会在允许安装继续之前验证以下扩展是否已加载：

* `mysqli` — MySQL 数据库驱动程序
* `session` — 会话处理
* `pcre` — Perl-compatible 正则表达式
* `filter` — 输入过滤和验证
* `fileinfo` — MIME-type 上传检测

### 必需的PHP设置

除了上述扩展之外，安装程序还会验证以下 `php.ini` 设置：

* `file_uploads` 必须**打开** - 没有它，XOOPS 无法接受上传的文件

### 推荐 PHP 扩展

安装程序还会检查这些扩展。它们不是严格要求的，但 XOOPS 和大多数模区块依赖它们来实现全部功能。启用主机允许的尽可能多的数量：

* `mbstring` — 多-byte字符串处理
* `intl` — 国际化
* `iconv` — 字符集转换
* `xml` — XML 解析
* `zlib` — 压缩
* `gd` — 图像处理
* `exif` — 图像元数据
* `curl` — HTTP 源和 API 调用客户端

## 服务

### 文件系统访问（用于网站管理员访问）

您将需要某种方法（FTP、SFTP等）将XOOPS分发文件传输到网络服务器。

### 文件系统访问（用于 Web 服务器进程）

要运行XOOPS，需要创建、读取和删除文件和目录的能力。对于正常安装和正常日常-to-day操作，以下路径必须可由 Web 服务器进程写入：

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php`（安装和升级期间可写）
* `XOOPS_data/`
* `XOOPS_data/caches/`
* `XOOPS_data/caches/XOOPS_cache/`
* `XOOPS_data/caches/smarty_cache/`
* `XOOPS_data/caches/smarty_compile/`
* `XOOPS_data/configs/`
* `XOOPS_data/configs/captcha/`
* `XOOPS_data/configs/textsanitizer/`
* `XOOPS_data/data/`
* `XOOPS_data/protector/`

### 数据库

XOOPS将需要创建、修改和查询MySQL中的表。为此，您将需要：

* MySQL用户帐户和密码
* 用户拥有所有权限的MySQL数据库（或者用户有权创建此类数据库）

### 电子邮件

对于实时网站，您需要一个工作电子邮件地址，XOOPS可用于用户通信，例如帐户激活和密码重置。虽然不是严格要求，但如果可能，建议使用与您的 XOOPS 运行所在的域相匹配的电子邮件地址。这有助于避免您的通信最终被拒绝或标记为垃圾邮件。

## 工具

您可能需要一些额外的工具来设置和自定义您的XOOPS安装。这些可能包括：* FTP客户端软件
* 文本编辑器
* 存档软件可处理 XOOPS 版本（_.zip_ 或 _.tar.gz_）文件。

如果需要，请参阅 [Tools of the Trade](../tools/tools.md) 部分，了解有关合适工具和 Web 服务器堆栈的一些建议。

## 专题

某些特定的系统软件组合可能需要一些额外的配置才能与XOOPS配合使用。如果您使用 SELinux 环境，或使用自定义主题升级旧站点，请参阅[Special Topics](specialtopics.md)了解更多信息。