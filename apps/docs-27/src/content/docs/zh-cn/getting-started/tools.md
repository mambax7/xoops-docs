---
title：“行业工具”
---

定制和维护 XOOPS 网站需要做很多事情，这些事情需要在 XOOPS 之外进行，或者在那里更容易完成。

这是您可能想要使用的工具类型的列表，以及 XOOPS 网站管理员认为有用的特定工具的一些建议。

## 编辑

编辑器是一个非常个人化的选择，人们可能会对自己喜欢的东西充满热情。我们将仅介绍众多可能性中的一小部分。

对于 XOOPS 使用，您将需要一个编辑器来调整一些配置选项并为您的网站自定义主题。对于这些用途，拥有一个可以同时处理多个文件、能够在多个文件中搜索和替换并提供语法突出显示的编辑器会非常有帮助。您可以使用非常简单、没有任何装饰的编辑器，但是您将更加努力地完成某些任务。

_JetBrains_ 的 **PhpStorm** 是专门为 PHP Web 开发量身定制的 IDE（集成开发环境）。 _JetBrains_ 在赞助 XOOPS 方面提供了很大帮助，其产品深受许多开发者的喜爱。它是一种商业产品，对于一些新的网站管理员来说可能成本过高，但它可以节省的时间使其对经验丰富的开发人员有吸引力。

**Visual Studio Code** 是 Microsoft 提供的免费、多-platform源代码编辑器。它内置或通过扩展支持 HTML、JavaScript 和 PHP 等核心 Web 技术，非常适合 XOOPS 使用。

**Notepad++** 是 Windows 类别中历史悠久的免费竞争者，拥有忠实的用户。

**Meld** 不是编辑器，但它会比较显示差异的文本文件，并允许有选择地合并更改并进行少量编辑。在比较配置文件、主题模板，当然还有 PHP 代码时，它非常有用。

|名称 |链接 |权限证|平台|
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) |商业|任何 |
| Visual Studio 代码 | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT|任何 |
|记事本++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL |赢 |
|梅尔德 | [https://meldmerge.org/](https://meldmerge.org/) | GPL |任何 |

## FTP 客户端

文件传输协议（FTP）或其变体用于将文件从一台计算机移动到另一台计算机。大多数XOOPS安装需要FTP客户端将来自XOOPS发行版的文件移动到将部署站点的主机系统。

**FileZilla** 是一款免费且功能强大的 FTP 客户端，适用于大多数平台。 -platform 的交叉一致性使其成为本书中FTP 示例的选择。

**PuTTY** 是一款免费的 SSH 客户端，可用于通过 Shell 访问服务器，并通过 SCP 提供文件传输功能

**WinSCP** 是适用于 Windows 系统的 FTP/SFTP/SCP 客户端。

|名称 |链接 |权限证|平台|
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL |任何 |
|腻子 | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD |赢/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL |窗户 |

## MySQL/MariaDB

该数据库包含站点的所有内容、自定义站点的配置、有关站点用户的信息等等。使用一些专门处理数据库的额外工具可以更轻松地保护和维护该信息。

**phpMyAdmin** 是最流行的网络-based工具，用于处理MySQL数据库，包括制作-off备份。

**BigDump** 是有限托管帐户的天赐之物，它有助于恢复大型数据库备份转储，同时避免超时和大小限制。**srdb**，XOOPS 的搜索替换数据库是 XOOPS 改编自 interconnect/it. 的 [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB)，当您移动站点时，更改 MySQL 数据中的 URL 和文件系统引用特别有用。

|名称 |链接 |权限证|平台|
| :--- | :--- | :--- | :--- |
| phpMyAdmin | phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL |任何 |
|大转储| [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL |任何 |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 |任何 |

## 开发者堆栈

某些平台（例如 Ubuntu）内置了运行 XOOPS 所需的整个堆栈，而其他平台则需要一些补充。

**WAMP** 和 **统一服务器零** 都是适用于 Windows 的-in-one 堆栈。

**XAMPP**，来自 Apache Friends 的全-in-one堆栈，可用于多个平台。

**bitnami** 提供广泛的预构建应用程序堆栈，包括虚拟机和容器映像。他们的产品可以成为快速试用应用程序（包括XOOPS）或各种网络技术的宝贵资源。它们适用于生产和开发用途。

**Docker** 是一个应用程序容器平台，用于创建和运行容器以实现自定义环境。 

**Devilbox** 是一个易于配置的基于 Docker 的开发堆栈。它为所有堆栈组件提供了广泛的版本，并允许开发人员在可重复和可共享的环境中进行测试。 

|名称 |链接 |权限证|平台|
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) |多个|赢 |
|统一服务器零| [http://www.uniformserver.com/](http://www.uniformserver.com/)|多个|赢 |
| XAMPP| [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) |多个|任何 |
|比特纳米| [https://bitnami.com/](https://bitnami.com/)|多个|任何 |
|码头工人 | [https://www.docker.com/](https://www.docker.com/)|多个|任何 |
|恶魔盒 | [http://devilbox.org/](http://devilbox.org/) | MIT |任何 |