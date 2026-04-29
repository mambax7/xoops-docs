---
title：“配置电子邮件”
---

![XOOPS Email Configuration](/XOOPS-docs/2.7/img/installation/XOOPS-04-email-setup.png)

XOOPS 依赖电子邮件进行许多关键的用户交互，例如验证注册或重置密码。因此，正确设置它很重要。

在某些情况下，配置站点电子邮件可能非常容易，而在其他情况下则非常困难。

以下是一些有助于您成功设置的提示。

## 电子邮件发送方式

此部分配置有 4 个可能的值

* **PHP Mail()** - 最简单的方法（如果可用）。取决于系统_sendmail_程序。
* **sendmail** - 一种工业强度选项，但通常通过利用其他软件的弱点来针对SPAM。
* **SMTP** - 由于安全问题和滥用的可能性，简单邮件传输协议通常在新的托管帐户中不可用。它已大部分被 SMTP Auth 取代。
* **SMTP Auth** - 带有授权的SMTP通常优于普通的SMTP。在这种情况下，XOOPS以更安全的方式直接连接到邮件服务器。

## SMTP 主机

如果您需要使用 SMTP，无论是否带有“Auth”，您都需要在此处指定服务器名称。该名称可以是简单的主机名或 IP 地址，也可以包括其他端口和协议信息。最简单的情况是 `localhost`，SMTP（无身份验证）服务器与 Web 服务器运行在同一台计算机上。

使用 SMTP 身份验证时，始终需要 SMTP 用户名和 SMTP 密码。可以指定 TLS 或 SSL，以及 XOOPS 配置字段 SMTP 主机中的端口。

这可用于连接到 Gmail 的 SMTP：`tls://smtp.gmail.com:587`

使用 SSL 的另一个示例：`ssl://mail.example.com:465`

## 故障排除提示

有时，事情并不像我们希望的那么顺利。以下是一些可能有帮助的建议和资源。

### 检查您的托管提供商的文档

当您与提供商建立托管服务时，他们应该提供有关如何访问电子邮件服务器的信息。您希望在为 XOOPS 系统配置电子邮件时使其可用。

### XOOPS 使用 PHPMailer

XOOPS 使用[PHPMailer](https://github.com/PHPMailer/PHPMailer) 库发送电子邮件。 wiki 中的 [troubleshooting](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) 部分提供了一些见解。