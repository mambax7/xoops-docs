---
title：“运行升级”
---

在运行主升级程序之前，请确保您已完成[Preflight Check](preflight.md)。升级 UI 要求预检至少运行一次，如果未运行，则会引导您进行预检。

通过将浏览器指向站点的 _upgrade_ 目录来启动升级：

```text
http://example.com/upgrade/
```

这应该显示这样的页面：

![XOOPS Upgrade Startup](/XOOPS-docs/2.7/img/installation/upgrade-01.png)

选择“继续”按钮继续。

每个“继续”都会推进另一个补丁。继续操作，直到应用所有补丁并显示“系统模区块更新”页面。

![XOOPS Upgrade Applied Patch](/XOOPS-docs/2.7/img/installation/upgrade-05-applied.png)

## 2.5.11 → 2.7.0 升级适用什么

从 XOOPS 2.5.11 升级到 2.7.0 时，升级者应用以下补丁。每个步骤都作为向导中的单独步骤呈现，以便您可以确认正在更改的内容：

1. **删除过时的捆绑 PHPMailer。** Protector 模区块内的 PHPMailer 捆绑副本将被删除。 PHPMailer 现在通过 `XOOPS_lib/vendor/` 中的 Composer 提供。
2. **删除过时的 HTMLPurifier 文件夹。** 同样，Protector 模区块内的旧 HTMLPurifier 文件夹也将被删除。 HTMLPurifier 现在通过 Composer 提供。
3. **创建 `tokens` 表。** 添加新的 `tokens` 表用于通用范围令牌存储。该表包含令牌 id、用户 id、范围、哈希和 issued/expires/used 时间戳列，并由 XOOPS 2.7.0 中的令牌-based 功能使用。
4. **加宽`bannerclient.passwd`.** `bannerclient.passwd`列被加宽为`VARCHAR(255)`，因此它可以存储现代密码哈希（bcrypt、argon2），而不是传统的窄列。
5. **添加会话 cookie 首选项。** 插入两个新首选项：`session_cookie_samesite`（用于 SameSite cookie 属性）和 `session_cookie_secure`（强制使用 HTTPS-only cookie）。请参阅[After the Upgrade](ustep-04.md)，了解如何在升级完成后查看这些内容。

这些步骤都不会触及您的内容数据。您的用户、帖子、图像和模区块数据保持不变。

## 选择语言

主要的 XOOPS 发行版附带英语支持。对其他语言环境的支持由 [XOOPS Local support sites](https://XOOPS.org/modules/XOOPSpartners/) 提供。这种支持可以以定制发行版的形式出现，也可以以添加到主发行版的附加文件的形式出现。

XOOPS 翻译保留在 [transifex](https://www.transifex.com/XOOPS/public/) 上

如果您的XOOPS升级程序有其他语言支持，您可以通过选择顶部菜单中的语言图标并选择其他语言来更改语言。

![XOOPS Upgrade Language](/XOOPS-docs/2.7/img/installation/upgrade-02-change-language.png)