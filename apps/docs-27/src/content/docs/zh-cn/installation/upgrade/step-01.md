---
title: “升级准备”
---

## 关闭站点

在开始XOOPS升级过程之前，您应该设置“关闭您的网站？”在首选项 -> 中选择“是”系统选项->管理菜单中的常规设置页面。

这可以防止用户在升级过程中遇到损坏的站点。它还可以将资源争用降至最低，以确保更顺利的升级。

您的访问者将看到如下内容，而不是错误和损坏的网站：

![Site Closed on Mobile](/XOOPS-docs/2.7/img/installation/mobile-site-closed.png)

## 备份

在对站点文件进行完整备份之前，最好使用XOOPS管理_维护_部分对所有缓存进行_清理缓存文件夹_。在站点关闭的情况下，还建议使用_清空会话表_，以便在需要恢复时，过时的会话将不会成为其中的一部分。

### 文件

可以使用FTP进行文件备份，将所有文件复制到本地计算机。如果您可以直接通过 shell 访问服务器，那么在那里制作副本（或存档副本）会更快。

### 数据库

要进行数据库备份，您可以使用XOOPS管理_维护_部分中的内置功能。您还可以使用 _phpMyAdmin_ 中的 _Export_ 功能（如果可用）。如果您有 shell 访问权限，则可以使用 _mysql_ 命令转储数据库。

熟练地备份和恢复数据库是一项重要的网站管理员技能。您可以使用许多在线资源来了解有关适合您的安装的这些操作的更多信息，例如[http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/XOOPS-docs/2.7/img/installation/phpmyadmin-export-01.png)

## 将新文件复制到站点

将新文件复制到您的站点实际上与安装过程中的[Preparations](../../installation/preparations/)步骤相同。您应该将 _XOOPS_data_ 和 _XOOPS_lib_ 目录复制到安装过程中重新定位的位置。然后，将发行版 _htdocs_ 目录的其余内容（下一节中介绍的一些例外情况）复制到 Web 根目录中的现有文件和目录上。

在XOOPS 2.7.0 中，在现有站点上复制新发行版**不会覆盖现有配置文件**，例如`mainfile.php` 或`XOOPS_data/data/secure.php`。与早期版本相比，这是一个值得欢迎的更改，但您仍然应该在开始之前进行完整备份。

将整个 _upgrade_ 目录从发行版复制到您的 Web 根目录，并在那里创建一个 _upgrade_ 目录。

## 运行 Smarty 4 飞行前检查

在启动主 `/upgrade/` 工作流程之前，您必须运行 `upgrade/` 目录中附带的预检扫描仪。它会检查您现有的主题和模区块模板是否存在 Smarty 4 兼容性问题，并可以自动修复其中的许多问题。

1. 将浏览器指向_your-site-url_/upgrade/preflight.php
2. 使用管理员帐户登录
3. 运行扫描并查看报告
4.应用提供的任何自动修复，或手动修复标记的模板
5. 重新-run扫描，直至干净为止
6.然后才继续主升级

有关完整演练，请参阅[Preflight Check](preflight.md)页面。

### 你可能不想复制的东西

您不应将 _install_ 目录重新复制到正在运行的 XOOPS 系统中。将安装文件夹保留在 XOOPS 安装中会使您的系统面临潜在的安全问题。安装程序会随机重命名它，但您应该将其删除并确保不要复制到另一个名称中。

您可能已经编辑了一些文件来自定义您的网站，并且您需要保留这些文件。以下是常见自定义的列表。

* _XOOPS_data/configs/XOOPSconfig.php_（如果自站点安装后已更改）
* _themes_ 中的任何目录（如果为您的网站定制）。在这种情况下，您可能需要比较文件来识别有用的更新。
* _class/captcha/_中以“config”开头的任何文件（如果自站点安装后已更改）
* _class/textsanitizer_中的任何定制
* _class/XOOPSeditor_中的任何定制如果您在升级后意识到某些内容被意外覆盖，请不要惊慌 - 这就是您开始进行完整备份的原因。 _（你确实做了备份，对吧？）_

## 检查主文件。php（从 Pre-2.5 XOOPS 升级）

仅当您从旧的 XOOPS 版本（2.3 或更早版本）升级时，此步骤才适用。如果您从 XOOPS 2.5.x 升级，则可以跳过此部分。

XOOPS 的旧版本需要在`mainfile.php` 中进行一些手动更改才能启用保护器模区块。在您的网络根目录中，您应该有一个名为 `mainfile.php` 的文件。在编辑器中打开该文件并查找以下行：

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

和

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

如果找到这些行，请将其删除，并在继续之前保存文件。