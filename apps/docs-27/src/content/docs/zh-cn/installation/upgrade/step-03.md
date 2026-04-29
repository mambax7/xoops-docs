---
title: “故障排除”
---

## Smarty 4 模板错误

从 XOOPS 2.5.x 升级到 2.7.0 时最常见的问题是 Smarty 4 模板不兼容。如果您跳过或未完成[Preflight Check](preflight.md)，升级后您可能会在前端或管理区域中看到模板错误。

恢复：

1. **Re-run 预检扫描仪**，位于`/upgrade/preflight.php`。应用它提供的任何自动修复，或手动修复标记的模板。
2. **清除已编译的模板缓存。** 从 `XOOPS_data/caches/smarty_compile/` 中删除除 `index.html` 之外的所有内容。 Smarty 3 编译模板与Smarty 4 不兼容，过时的文件可能会导致混乱的错误。
3. **暂时切换到已发布的主题。** 从管理区域中，选择 `xbootstrap5` 或 `default` 作为活动主题。这将确认问题是否仅限于自定义主题或站点-wide。
4. **在重新打开生产流量之前验证任何自定义主题和模区块模板**。请特别注意使用 `{php}` 区块、已弃用的修饰符或非-standard 分隔符语法的模板 - 这些是最常见的 Smarty 4 损坏。

另请参见 [Special Topics](../../installation/specialtopics.md) 中的 Smarty 4 部分。

## 权限问题

XOOPS升级可能需要写入之前已读取-only的文件。如果是这种情况，您将看到如下消息：

![XOOPS Upgrade Make Writable Error](/XOOPS-docs/2.7/img/installation/upgrade-03-make-writable.png)

解决方案是更改权限。如果您没有更直接的访问权限，可以使用FTP更改权限。以下是使用 FileZilla 的示例：

![FileZilla Change Permission](/XOOPS-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## 调试输出

您可以通过将调试参数添加到用于启动升级的URL来在记录器中启用额外的调试输出：

```text
http://example.com/upgrade/?debug=1
```