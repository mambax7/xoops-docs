---
title: “开发人员须知”
---

虽然用于开发用途的 XOOPS 的实际安装与已经描述的正常安装类似，但在构建开发人员就绪系统时存在关键差异。

开发人员安装的一大区别是，开发人员安装不只关注 _htdocs_ 目录的内容，而是保留所有文件，并使用 git 将它们置于源代码控制之下。

另一个区别是 _XOOPS_data_ 和 _XOOPS_lib_ 目录通常可以保留在原处而无需重命名，只要您的开发系统无法在开放互联网上直接访问（即在专用网络上，例如在路由器后面）。

大多数开发人员在 _localhost_ 系统上工作，该系统具有源代码、Web 服务器堆栈以及使用代码和数据库所需的任何工具。

您可以在第 [Tools of the Trade](../tools/tools.md) 章中找到更多信息。

## Git 和虚拟主机

大多数开发人员希望能够及时了解当前来源，并将更改贡献给上游[XOOPS/XOOPSCore27 repository on GitHub](https://github.com/XOOPS/XOOPSCore27)。这意味着您不需要下载发布存档，而是需要 [fork](https://help.github.com/articles/fork-a-repo/) XOOPS 的副本，并使用 **git** 将该存储库[clone](https://help.github.com/categories/bootcamp/) 保存到您的开发盒中。

由于存储库具有特定的结构，因此最好将您的 Web 服务器指向本地克隆存储库内的 htdocs 文件夹，而不是从 _htdocs_ 目录_复制_ 文件到您的 Web 服务器。为了实现这一点，我们通常创建一个新的 _Virtual Host_ 或 _vhost_ 指向我们的 git 控制的源代码。

在 [WAMP](http://www.wampserver.com/) 环境中，默认的 [localhost](http://localhost/) 页面在_工具_部分中有一个指向_添加虚拟主机_的链接，该链接指向此处：

![WAMP Add Virtual Host](/XOOPS-docs/2.7/img/installation/wamp-vhost-03.png)

使用它，您可以设置一个 VirtualHost 条目，该条目将直接放入您的（仍然）git 控制的存储库中。

以下是 `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf` 中的示例条目

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

您可能还需要在 `Windows/System32/drivers/etc/hosts` 中添加条目：

```text
127.0.0.1    xoops.localhost
```

现在，您可以安装在 `http://XOOPS.localhost/` 上进行测试，同时保持存储库完好无损，并使用简单的URL 将网络服务器保留在 htdocs 目录中。另外，您可以随时将 XOOPS 的本地副本更新为最新的主版本，而无需重新安装或复制文件。而且，您可以对代码进行增强和修复，以通过 GitHub 回馈 XOOPS。

## Composer依赖

XOOPS 2.7.0 使用[Composer](https://getcomposer.org/) 来管理其PHP 依赖项。依赖关系树位于源存储库内的`htdocs/XOOPS_lib/`中：

* `composer.dist.json` 是随版本一起提供的依赖项的主列表。
* `composer.json` 是本地副本，您可以根据需要针对您的开发环境进行自定义。
* `composer.lock` 引脚精确版本，因此安装可重复。
* `vendor/`包含已安装的库（Smarty 4、PHPMailer、HTMLPurifier、firebase/php-jwt、monolog、symfony/var-dumper、XOOPS/xmf、XOOPS/regdom、和其他）。

对于 XOOPS 2.7.0 的新 git 克隆，从存储库根目录开始，运行：

```text
cd htdocs/xoops_lib
composer install
```

请注意，存储库根目录中没有 `composer.json` — 该项目位于 `htdocs/XOOPS_lib/` 下，因此您必须在运行 Composer 之前将 `cd` 放入该目录。

发布 tarball 时附带 `vendor/` pre-populated，但 git 克隆可能不会。在开发安装中保持 `vendor/` 完好无损 - XOOPS 将在运行时从那里加载其依赖项。

[XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) 库作为 2.7.0 中的 Composer 依赖项提供，因此您可以在模区块代码中使用 `XMF\Request`、`XMF\Database\TableLoad` 和相关类，而无需任何额外安装。

## 调试栏模区块XOOPS 2.7.0 附带了一个基于 Symfony VarDumper 的 **DebugBar** 模区块。它将调试工具栏添加到呈现的页面中，以公开请求、数据库和模板信息。从开发和暂存站点上的模区块管理区域安装它。除非您知道自己愿意，否则请勿将其安装在公共-facing生产站点上。