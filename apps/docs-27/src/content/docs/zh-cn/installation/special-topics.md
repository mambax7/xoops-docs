---
title: “特殊主题”
---

某些特定的系统软件组合可能需要一些额外的配置才能工作
 与XOOPS。以下是已知问题的一些详细信息以及处理这些问题的指南。

## SELinux 环境

安装、升级和正常操作期间某些文件和目录需要可写
XOOPS。在传统的 Linux 环境中，这是通过确保
Web 服务器运行的系统用户拥有 XOOPS 目录的权限，通常通过 
为这些目录设置适当的组。

支持 SELinux 的系统（例如 CentOS 和RHEL）有一个额外的安全上下文，
可以限制进程更改文件系统的能力。这些系统可能需要 
更改安全上下文以使 XOOPS 正常运行。

XOOPS期望能够在正常操作期间自由写入某些目录。 
此外，在XOOPS安装和升级期间，某些文件也必须是可写的。
 
在正常操作期间，XOOPS期望能够写入文件并创建子目录 
在这些目录中：

- `uploads`在主XOOPS网络根目录中
- `XOOPS_data` 安装过程中重新定位的位置

在安装或升级过程中，XOOPS 需要写入此文件：

- `mainfile.php`在主XOOPS网络根目录中

对于典型的基于 CentOS Apache 的系统，安全上下文更改可能是 
使用这些命令完成：

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

您可以使用以下命令使 mainfile.php 可写：

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

注意：安装时，您可以从 *extras* 目录复制一个空的主文件.php。

您还应该允许 httpd 发送邮件：

```
setsebool -P httpd_can_sendmail=1
```

您可能需要的其他设置包括：

允许 httpd 建立网络连接，即获取 rss feed 或进行 API 调用：

```
setsebool -P httpd_can_network_connect 1
```

使用以下命令启用与数据库的网络连接：

```
setsebool -P httpd_can_network_connect_db=1
```

有关更多信息，请咨询您的系统文档and/or系统管理员。

## Smarty 4 和自定义主题

XOOPS 2.7.0 将其模板引擎从 Smarty 3 升级到 **Smarty 4**。 Smarty 4 更严格
关于 Smarty 3 的模板语法，以及旧模板中可以容忍的一些模式
现在会导致错误。如果您仅使用主题安装 XOOPS 2.7.0 的全新副本
以及随版本一起提供的模区块，无需担心 - 每个提供的模板
已针对 Smarty 4 兼容性进行了更新。

当您属于以下情况时，就会出现这种担忧：

- 升级具有自定义主题的现有 XOOPS 2.5.x 网站，或者
- 将自定义主题或较旧的第三-party模区块安装到XOOPS2.7.0中。

在将实时流量切换到升级站点之前，请运行预检扫描程序
`/upgrade/`目录。它扫描 `/themes/` 和 `/modules/` 查找 Smarty 4 个不兼容性
并且可以自动修复其中的许多问题。请参阅
[Preflight Check](../upgrading/upgrade/preflight.md)页面了解详情。

如果您在安装或升级后遇到模板错误：

1. Re-run `/upgrade/preflight.php` 并解决任何报告的问题。
2. 通过删除除 `index.html` 之外的所有内容来清除已编译的模板缓存
   `XOOPS_data/caches/smarty_compile/`。
3. 暂时切换到已发布的主题（例如`xbootstrap5`或`default`）以确认问题
   是主题-specific，而不是网站-wide。
4. 在将站点返回生产之前验证任何自定义主题或模区块模板更改。