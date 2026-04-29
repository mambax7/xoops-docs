---
title：“升级后”
---

## 更新系统模区块

应用所有需要的补丁后，选择_继续_将设置所有内容以更新**系统**模区块。这是非常重要的步骤，是正确完成升级所必需的。

![XOOPS Update System Module](/XOOPS-docs/2.7/img/installation/upgrade-06-update-system-module.png)

选择_更新_以执行系统模区块的更新。

## 更新其他 XOOPS 提供的模区块

XOOPS 附带三个可选模区块 - pm（私人消息）、配置文件（用户配置文件）和保护器（保护器） 您应该对已安装的任何这些模区块进行更新。

![XOOPS Update Other Modules](/XOOPS-docs/2.7/img/installation/upgrade-07-update-modules.png)

## 更新其他模区块

其他模区块可能有更新，这些更新可能使这些模区块能够在您现在更新的XOOPS下更好地工作。您应该调查并应用任何适当的模区块更新。

## 查看新的 Cookie 强化首选项

XOOPS 2.7.0 升级添加了两个新的首选项来控制会话 cookie 的发出方式：

* **`session_cookie_samesite`** — 控制 SameSite cookie 属性。 `Lax` 是大多数网站的安全默认值。如果您的网站不依赖交叉-origin导航，请使用`Strict`获得最大程度的保护。 `None` 仅在您知道需要时才适用。
* **`session_cookie_secure`** — 启用后，会话 cookie 仅通过 HTTPS 连接发送。如果您的网站在 HTTPS 上运行，请打开此选项。

您可以在系统选项 → 首选项 → 常规设置下查看这些设置。

## 验证自定义主题

如果您的网站使用自定义主题，请浏览前端和管理区域以确认页面正确呈现。即使预检扫描通过，升级到 Smarty 4 也可能会影响自定义模板。如果您发现渲染问题，请重新访问[Troubleshooting](ustep-03.md)。

## 清理安装和升级文件

为了安全起见，一旦确认升级有效，请从您的 Web 根目录中删除这些目录：

* `upgrade/` — 升级工作流程目录
* `install/` — 如果存在，作为 `install/` 或重命名的 `installremove*` 目录

将这些保留在适当的位置会将升级和安装脚本公开给任何可以访问您站点的人。

## 打开您的网站

如果您遵循_关闭网站_的建议，则应在确定其正常工作后将其重新打开。