---
title: “安装向导”
description: “XOOPS安装向导的步骤-by-step演练 - 15个屏幕解释。”
---

XOOPS 安装向导将指导您完成 15-step 流程，配置数据库、创建管理员帐户并准备站点以供首次使用。

## 开始之前

- 您拥有[uploaded XOOPS to your server](/XOOPS-docs/2.7/installation/ftp-upload/)或设置了本地环境
- 你有[verified the requirements](/XOOPS-docs/2.7/installation/requirements/)
- 您已准备好数据库凭据

## 向导步骤

|步骤|屏幕|会发生什么 |
|------|--------|--------------|
| 1 | [Language Selection](./step-01/) |选择安装语言 |
| 2 | [Welcome](./step-02/) |权限协议|
| 3 | [Configuration Check](./step-03/) | PHP/服务器环境检查 |
| 4 | [Path Setting](./step-04/) |设置根路径和URL |
| 5 | [Database Connection](./step-05/) |输入数据库主机、用户、密码 |
| 6 | [Database Configuration](./step-06/) |设置数据库名称和表前缀 |
| 7 | [Save Configuration](./step-07/) |写入主文件。php |
| 8 | [Table Creation](./step-08/) |创建数据库架构 |
| 9 | [Initial Settings](./step-09/)|网站名称、管理员电子邮件 |
| 10 | 10 [Data Insertion](./step-10/) |填充默认数据 |
| 11 | 11 [Site Configuration](./step-11/)| URL，时区，语言 |
| 12 | 12 [Select Theme](./step-12/)|选择默认主题 |
| 13 | [Module Installation](./step-13/) |安装捆绑模区块 |
| 14 | 14 [Welcome](./step-14/) |安装完成消息 |
| 15 | 15 [Cleanup](./step-15/) |删除安装文件夹 |

:::注意[安全]
完成向导后，**删除或重命名 `install/` 文件夹** - 步骤 15 将指导您完成此操作。让它可访问会带来安全风险。
:::