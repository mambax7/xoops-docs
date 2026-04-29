---
title：“移动站点”
---

在本地系统或开发服务器上构建新的XOOPS站点原型是一种非常有用的技术。首先在生产站点的副本上测试 XOOPS 升级也是非常谨慎的做法，以防出现问题。为了实现这些目标，您需要能够将您的 XOOPS 网站从一个网站移动到另一个网站。以下是成功移动 XOOPS 网站所需了解的信息。

第一步是建立新的站点环境。第 [Advance Preparations](../installation/preparations/) 节中涵盖的相同项目也适用于此处。

经审查，这些步骤是：

* 获取托管，包括任何域名或电子邮件要求
* 获取MySQL用户帐号和密码
* 获取上述用户拥有所有权限的MySQL数据库

该过程的其余部分与正常安装非常相似，但是：

* 您将从现有站点复制文件，而不是从 XOOPS 分发版复制文件
* 您将导入已填充的数据库，而不是运行安装程序
* 您将更改文件和数据库中以前的答案，而不是在安装程序中输入答案

## 复制现有站点文件

将现有站点的文件完整复制到本地计算机，您可以在其中进行编辑。如果您使用远程主机，则可以使用FTP来复制文件。即使站点在本地计算机上运行，​​您也需要一个副本才能使用，在这种情况下，只需制作站点目录的另一个副本即可。

请务必记住包含 _XOOPS_data_ 和 _XOOPS_lib_ 目录，即使它们被重命名为 and/or 重新定位。

为了使事情更顺利，您应该从副本中消除缓存和Smarty编译的模板文件。这些文件将在您的新环境中重新创建，如果不清除，可能会导致保留旧的不正确信息的问题。为此，请删除所有三个目录中除 _index.html_ 之外的所有文件：

* _XOOPS_data_/caches/smarty_cache
* _XOOPS_data_/caches/smarty_compile
* _XOOPS_data_/caches/XOOPS_cache

> **注意：** 将站点移入或移出 XOOPS 2.7.0 时，清除 `smarty_compile` 尤其重要。 XOOPS 2.7.0 使用 Smarty 4，并且 Smarty 4 编译模板不能与 Smarty 3 编译模板互换。保留过时的编译文件将导致新站点加载首页时出现模板错误。

### `XOOPS_lib` 和 Composer 依赖项

XOOPS 2.7.0 通过 `XOOPS_lib/` 内的 Composer 管理其 PHP 依赖项。 `XOOPS_lib/vendor/`目录包含XOOPS在运行时需要的第三个-party库（Smarty4、PHPMailer、HTMLPurifier等）。移动站点时，您必须将整个 `XOOPS_lib/` 树（包括 `vendor/`）复制到新主机。不要尝试在目标主机上重新生成 `vendor/`，除非您是自定义了 `composer.json` 并且在目标上具有可用 Composer 的开发人员。

## 设置新环境

第 [Advance Preparations](../installation/preparations/) 节中涵盖的相同项目也适用于此处。我们在这里假设您拥有要移动的网站所需的任何托管服务。

### 关键信息（主文件.php 和安全.php）

成功移动站点需要更改对绝对文件和路径名、URL、数据库参数和访问凭据的任何引用。

站点 Web 根目录中的 `mainfile.php` 和站点（已重命名为 and/or 重新定位）_XOOPS_data_ 目录中的 `mainfile.php` 两个文件定义了站点的基本参数，例如 URL，位于主机文件系统中的位置，以及它如何连接到数据库。

您需要知道旧系统中的值是什么以及新系统中的值是什么。

#### 主文件。php|名称 |主文件中的旧值。php |主文件中的新值。php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH|  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

在编辑器中打开_mainfile.php_。将上表中显示的定义值从旧值更改为适合新站点的值。

记下旧值和新值，因为我们需要在后续步骤中的其他地方进行类似的更改。

例如，如果您要将站点从本地 PC 移动到商业托管服务，您的值可能如下所示：

|名称 |主文件中的旧值。php |主文件中的新值。php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/XOOPScore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/XOOPScore27/htdocs/XOOPS_lib | /home8/example/private/XOOPS_lib |
| XOOPS_VAR_PATH | c:/wamp/XOOPScore27/htdocs/XOOPS_data | /home8/example/private/XOOPS_data |
| XOOPS_URL | http://localhost/XOOPS | https://example.com |
| XOOPS_COOKIE_DOMAIN |本地主机 |示例.com |

更改_mainfile.php_后，保存它。

某些其他文件可能包含对您的 URL 甚至路径的硬编码引用。这在自定义主题和菜单中更有可能出现，但是使用编辑器，您可以搜索所有文件，只是为了确保这一点。

在编辑器中，搜索副本中的文件，搜索旧的 XOOPS_URL 值，并将其替换为新值。

对旧的 XOOPS_ROOT_PATH 值执行相同的操作，将所有出现的值替换为新值。

保留您的笔记，因为稍后我们在移动数据库时必须再次使用它们。

#### data/secure.php

|名称 | data/secure.php 中的旧值 | data/secure.php 中的新值 |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

在编辑器中打开重命名的 and/or 重新定位的 _XOOPS_data_ 目录中的 _data/secure.php_。将上表中显示的定义值从旧值更改为适合新站点的值。

#### 其他文件

当您的站点移动时，可能还有其他文件需要注意。一些常见的示例是可能与域绑定的各种服务的 API 密钥，例如：

* 谷歌地图
* 回顾2
* 喜欢按钮
* 链接共享and/or广告，例如 Shareaholic 或 AddThis

更改这些类型的关联不容易自动化，因为与旧域的连接通常是服务端注册的一部分。在某些情况下，这可能只是添加或更改与服务关联的域。

### 将文件复制到新站点

将现在修改的文件复制到新站点。这些技术与[Installation](../installation/installation/)期间使用的技术相同，即使用FTP。

## 复制现有站点数据库

### 从旧服务器备份数据库

对于此步骤，强烈建议使用 _phpMyAdmin_。登录到您现有站点的_phpMyAdmin_，选择您的数据库，然后选择_导出_。

默认设置通常就可以，因此只需选择_Quick_的“导出方法”和_SQL_的“格式”即可。

使用_Go_按钮下载数据库备份。

![Exporting a Database with phpMyAdmin](/XOOPS-docs/2.7/img/installation/phpmyadmin-export-01.png)

如果数据库中的表不是来自 XOOPS 或其模区块，并且 NOT 应该被移动，则应选择 _Custom_ 的“导出方法”，并仅选择数据库中与 XOOPS 相关的表。 （这些以您在安装过程中指定的“前缀”开头。您可以在 `XOOPS_data/data/secure.php` 文件中查找数据库前缀。）

### 将数据库恢复到新服务器

在新主机上，使用新数据库，使用 [tools](../tools/tools.md) 恢复数据库，例如 _phpMyAdmin_ 中的 _Import_ 选项卡（或 _bigdump_ 如果需要）。

### 更新数据库中的 URL 和路径

在数据库中更新指向您站点上资源的所有 http 链接。这可能需要付出巨大的努力，而 [tool](../tools/tools.md) 可以让这一切变得更容易。Interconnect/it 有一个名为“搜索”-Replace-DB 的产品可以帮助解决此问题。它内置了对 WordPress 和 Drupal 环境的感知。按原样，此工具可能非常有用，但当它感知您的XOOPS时，效果会更好。您可以在 [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) 找到 XOOPS 感知版本

按照 README.md 文件中的说明下载此实用程序并将其临时安装在您的站点上。早些时候，我们更改了 XOOPS_URL 定义。当您运行此工具时，您想要用新定义替换原始的 XOOPS_URL 定义，即将 [http://localhost/XOOPS](http://localhost/XOOPS) 替换为 [https://example.com](https://example.com)

![Using Seach and Replace DB](/XOOPS-docs/2.7/img/installation/srdb-01.png)

输入您的旧网址和新网址，然后选择试运行选项。检查更改，如果一切看起来都不错，请选择实时运行选项。此步骤将捕获内容中引用您的网站URL的配置项和链接。

![Reviewing Changes in SRDB](/XOOPS-docs/2.7/img/installation/srdb-02.png)

使用 XOOPS_ROOT_PATH 的旧值和新值重复此过程。

#### 没有 SRDB 的替代方法

在不使用 srdb 工具的情况下完成此步骤的另一种方法是转储数据库，在文本编辑器中编辑转储，更改 URL 和路径，然后从编辑的转储中重新加载数据库。是的，这个过程涉及足够多的内容并且带来足够的风险，以至于人们有动力创建专门的工具，例如搜索-Replace-DB。

## 尝试您搬迁的站点

此时，您的站点应该已准备好在新环境中运行！

当然，问题总是存在的。不要害怕在 [XOOPS.org Forums](https://XOOPS.org/modules/newbb/index.php) 上发布任何问题。