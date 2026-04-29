---
title: “附录 2：通过 FTP 上传XOOPS”
---

本附录介绍如何使用 FTP 或 SFTP 将 XOOPS 2.7.0 部署到远程主机。任何控制面板（cPanel、Plesk、DirectAdmin 等）都会公开相同的底层步骤。

## 1.准备数据库

通过主机的控制面板：

1. 为 XOOPS 创建一个新的 MySQL 数据库。
2. 创建一个具有强密码的数据库用户。
3. 授予用户对新创建的数据库的完全权限。
4. 记录数据库名称、用户名、密码和主机 - 您将把它们输入到XOOPS安装程序中。

> **提示**
>
> 现代控制面板为您生成强密码。由于应用程序将密码存储在 `XOOPS_data/data/secure.php` 中，因此您无需经常键入密码 - 更喜欢随机生成的长值。

## 2.创建管理员邮箱

创建一个将接收站点管理通知的电子邮件邮箱。 XOOPS 安装程序在网站管理员帐户设置期间要求提供此地址，并使用 `FILTER_VALIDATE_EMAIL` 进行验证。

## 3.上传文件

XOOPS 2.7.0 附带其第三个-party依赖项，位于`XOOPS_lib/vendor/`中的-installed之前（Composer 包、Smarty 4、HTMLPurifier、PHPMailer、Monolog、TCPDF 等）。这使得 `XOOPS_lib/` 比 2.5.x 中的大很多——预计有几十兆字节。

**不要有选择地跳过 `XOOPS_lib/vendor/`.** 中的文件。** 跳过 Composer 供应商树中的文件将中断自动加载，并且安装将失败。

上传结构（假设`public_html`是文档根）：

1. 将 `XOOPS_data/` 和 `XOOPS_lib/` **上传到** `public_html` 旁边，而不是在其中。将它们放置在 Web 根目录之外是 2.7.0 的建议安全态势。

 
  ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
 
  ```

   ![](/XOOPS-docs/2.7/img/installation/img_66.jpg)
   ![](/XOOPS-docs/2.7/img/installation/img_67.jpg)

2. 将分发`htdocs/`目录的剩余内容上传至`public_html/`。

   ![](/XOOPS-docs/2.7/img/installation/img_68.jpg)

> **如果您的主机不允许文档根目录之外的目录**
>
> 上传 `XOOPS_data/` 和 `XOOPS_lib/` **在** `public_html/` 内，并**将它们重命名为非-obvious 名称**（例如 `xdata_8f3k2/` 和 `xlib_7h2m1/`）。当安装程序要求 XOOPS 数据路径和 XOOPS 库路径时，您将在安装程序中输入重命名的路径。

## 4. 使可写目录可写

通过FTP客户端的CHMOD对话框（或SSH），使第2章中列出的目录可由Web服务器写入。在大多数共享主机上，目录上的 `0775` 和 `mainfile.php` 上的 `0664` 就足够了。如果您的主机在 FTP 用户以外的用户下运行 PHP，则在安装期间，`0777` 是可以接受的，但在安装完成后收紧权限。

## 5.启动安装程序

将您的浏览器指向网站的公共URL。如果所有文件均已就位，则 XOOPS 安装向导将启动，您可以按照本指南从 [Chapter 2](chapter-2-introduction.md) 开始的其余部分进行操作。