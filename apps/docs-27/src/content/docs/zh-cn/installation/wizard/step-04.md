---
title：“路径设置”
---

此页面收集XOOPS运行所需的文件系统和网址的信息。安装程序将尝试根据您用于访问它的URL以及正在运行的PHP脚本的位置来猜测此信息。

检查并纠正任何问题后，选择“继续”按钮继续。

![XOOPS Installer Path Settings](/XOOPS-docs/2.7/img/installation/installer-04-02.png)

## 本步骤收集的数据

### XOOPS 物理路径

#### XOOPS文档根物理路径

XOOPS文档（提供）目录的物理路径WITHOUT尾部斜杠

#### XOOPS数据文件目录

XOOPS数据文件（可写）目录的物理路径WITHOUT尾部斜杠。找到 XOOPS 文档根目录之外的文件夹以确保其安全。

#### XOOPS库目录

XOOPS库目录的物理路径WITHOUT尾部斜杠。找到 XOOPS 文档根目录之外的文件夹以确保其安全。

### 网站位置

#### 网站位置 (URL)

主URL将用于访问您的XOOPS安装。 XOOPS将使用它来构建XOOPS内的所有URL。如果您想要一个 _https_ 站点，请务必指定它。如果您want/don不想在您的网站域上出现前导 _www._，请务必按照您的意愿指定。

这将默认为用于启动安装程序的URL。

#### 网站的 Cookie 域

设置 cookie 的域。可以为空、来自 URL (www.example.com) 的完整主机，或没有子域 (example.com) 的注册域以跨子域共享（www.example.com 和 blog.example.com）。

## 错误

如果找不到任何输入的路径，将显示错误。在继续之前纠正所有问题。

![XOOPS Installer Path Settings Error](/XOOPS-docs/2.7/img/installation/installer-04-01.png)

## 帮助

您可以在安装过程中查看扩展说明。选择页面右上角的“救生圈”图标可切换扩展描述的显示。

![XOOPS Installer Path Settings Help](/XOOPS-docs/2.7/img/installation/installer-04-03.png)