---
title: “XOOPS 2.7.0 中的新增功能”
---

XOOPS 2.7.0 是 2.5.x 系列的重大更新。在安装或升级之前，请查看此页面上的更改，以便您了解会发生什么。下面的列表重点关注影响安装和站点管理的项目 - 有关更改的完整列表，请参阅发行版附带的发行说明。

## PHP 8.2 是新的最小值

XOOPS 2.7.0 需要 **PHP 8.2 或更高版本**。 PHP 7.x 及更早版本不再受支持。强烈建议使用PHP8.4 或更高版本。

**操作：** 在开始之前确认您的主机提供 PHP 8.2+。参见[Requirements](installation/requirements.md)。

## MySQL 5.7 是新的最小值

新的最小值为**MySQL 5.7**（或兼容的MariaDB）。强烈建议使用 MySQL 8.4 或更高版本。还支持MySQL9.0。

有关 PHP/MySQL 8 兼容性问题的旧警告不再适用，因为 XOOPS 不再支持受影响的 PHP 版本。

## Smarty 4 替换 Smarty 3

这是现有站点的最大变化。 XOOPS 2.7.0 使用 **Smarty 4** 作为其模板引擎。 Smarty 4 的模板语法比 Smarty 3 更严格，并且某些自定义主题和模区块模板可能需要调整才能正确呈现。

为了帮助您识别和修复这些问题，XOOPS 2.7.0 在 `upgrade/` 目录中提供了一个 **预检扫描仪**，它会检查您现有的模板是否存在已知的 Smarty 4 不兼容性，并可以自动修复其中的许多问题。

**操作：** 如果您要从 2.5.x 升级并具有自定义主题或较旧的模区块，请在运行主升级程序之前运行 [Preflight Check](upgrading/upgrade/preflight.md) 。

## Composer-managed依赖项

XOOPS 2.7.0 使用 **Composer** 来管理其 PHP 依赖项。这些住在`XOOPS_lib/vendor/`。之前捆绑到核心或模区块中的第三个-party库——PHPMailer、HTMLPurifier、Smarty等——现在通过Composer提供。

**操作：** 大多数站点运营商不需要执行任何操作 - 发布已填充 `vendor/` 的 tarball。如果您要移动或升级站点，请复制整个 `XOOPS_lib/` 树，包括 `vendor/`。克隆 git 存储库的开发人员应在 `htdocs/XOOPS_lib/` 内运行 `composer install`。参见[Notes for Developers](notes-for-developers/developers.md)。

## 新的强化会话 cookie 首选项

升级期间添加了两个新的首选项：

* **`session_cookie_samesite`** — 控制会话 cookie 上的 SameSite 属性（`Lax`、`Strict` 或 `None`）。
* **`session_cookie_secure`** — 启用后，会话 cookie 仅通过 HTTPS 发送。

**操作：** 升级后，请在“系统选项”→“首选项”→“常规设​​置”下查看这些内容。参见[After the Upgrade](upgrading/upgrade/ustep-04.md)。

## 新`tokens`表

XOOPS 2.7.0 添加了 `tokens` 数据库表用于通用范围令牌存储。升级程序会在 2.5.11 → 2.7.0 升级过程中自动创建此表。

## 现代化的密码存储

`bannerclient.passwd` 列已扩展为 `VARCHAR(255)`，因此它可以保存现代密码哈希（bcrypt、argon2）。升级程序会自动加宽列。

## 更新了主题和模区块阵容

XOOPS 2.7.0 附带更新的前-end 主题：

* `default`、`xbootstrap`（旧版）、`xbootstrap5`、`xswatch4`、`xswatch5`、`xtailwind`、`xtailwind2`

一个新的 **现代** 管理主题与现有的 Transition 主题一起包含在内。

基于 Symfony VarDumper 的新 **DebugBar** 模区块作为可选可安装模区块之一提供。它对于开发和登台很有用，但通常不安装在公共生产站点上。

参见[Select Theme](installation/installation/step-12.md)和[Modules Installation](installation/installation/step-13.md)。

## 在新版本中复制不再覆盖配置以前，在现有站点之上复制新的 XOOPS 发行版需要小心避免覆盖 `mainfile.php` 和其他配置文件。在 2.7.0 中，复制过程会完整保留现有配置文件，这使得升级明显更安全。

在任何升级之前，您仍然应该进行完整备份。

## 系统管理主题中的模板重载功能

XOOPS 2.7.0 中的管理主题现在可以覆盖各个系统管理模板，从而更轻松地自定义管理 UI，而无需分叉整个系统模区块。

## 没有改变的地方

为了保证您的安全，XOOPS 的这些部分在 2.7.0 中的工作方式与在 2.5.x 中的工作方式相同：

* 安装程序页面顺序和整体流程
* `mainfile.php` 加上 `XOOPS_data/data/secure.php` 配置拆分
* 建议将 `XOOPS_data` 和 `XOOPS_lib` 重新定位到网络根目录之外
* 模区块安装型号和`XOOPS_version.php`清单格式
* 站点-move工作流程（备份、编辑`mainfile.php`/`secure.php`、使用SRDB或类似内容）

## 下一步去哪里

* 重新开始？继续至[Requirements](installation/requirements.md)。
* 从 2.5.x 升级？从 [Upgrading](upgrading/upgrade/README.md) 开始，然后运行 ​​[Preflight Check](upgrading/upgrade/preflight.md)。