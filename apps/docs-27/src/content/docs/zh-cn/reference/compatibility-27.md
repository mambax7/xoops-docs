---
title: “XOOPS 2.7.0 本指南的兼容性审查”
---

本文档列出了此存储库中所需的更改，以便安装指南与 XOOPS 2.7.0 相匹配。

审核依据：

- 当前指南存储库：`L:\GitHub\XOOPSDocs\XOOPS-installation-guide`
- XOOPS 2.7.0 核心审核于：`L:\GitHub\MAMBAX7\CORE\XOOPSCore27`
- 检查主要 2.7.0 源：
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## 范围

该存储库当前包含：

- 根-level英语Markdown文件用作主要指南。
- `en/` 的部分副本。
- 完整的`de/`和`fr/`书树及其自己的资产。

根-level文件需要第一遍。之后，等效更改需要反映到 `de/book/` 和 `fr/book/` 中。 `en/` 树也需要清理，因为它似乎只得到了部分维护。

## 1. 全局存储库更改

### 1.1 版本控制和元数据

将所有指南-level引用从XOOPS 2.5.x更新为XOOPS 2.7.0。

受影响的文件：

- `README.md`
- `SUMMARY.md` — 主要实时 TOC 用于根指南；导航标签和章节标题需要与新章节标题和重命名的历史升级注释部分相匹配
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-XOOPS-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-XOOPS-installation.md`
- 本地化`de/book/*.md`和`fr/book/*.md`

所需更改：

- 将`for XOOPS 2.5.7.x`更改为`for XOOPS 2.7.0`。
- 将版权年份从 `2018` 更新为 `2026`。
- 替换描述当前版本的旧 XOOPS 2.5.x 和 2.6.0 参考文献。
- 将 SourceForge-era 下载指南替换为 GitHub 版本：
  - `https://github.com/XOOPS/XOOPSCore27/releases`

### 1.2 链接刷新

`about-XOOPS-cms.md` 和本地化的 `10aboutXOOPS.md` 文件仍然指向旧的 2.5.x 和 2.6.0 GitHub 位置。这些链接需要更新到当前的 2.7.x 项目位置。

### 1.3 截图刷新

显示安装程序、升级 UI、管理仪表板、主题选择器、模区块选择器和帖子-install屏幕的所有屏幕截图均已过时。

受影响的资产树：

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

这是一次全面的刷新，而不是部分刷新。 2.7.0 安装程序使用不同的 Bootstrap-based 布局和不同的视觉结构。

## 2. 第 2 章：简介

文件：

- `chapter-2-introduction.md`

### 2.1 系统要求必须重写

当前章节仅提及 Apache、MySQL 和 PHP。 XOOPS 2.7.0 有明确的最低要求：

|组件|最低 2.7.0 | 2.7.0推荐|
| --- | --- | --- |
| PHP| 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
|网络服务器|任何支持所需PHP的服务器 |推荐Apache或Nginx |

需要添加的注释：

- IIS 仍尽可能列在安装程序中，但推荐使用 Apache 和 Nginx。
- 发行说明还提到了 MySQL 9.0 兼容性。

### 2.2 添加必需和推荐的 PHP 扩展清单

2.7.0 安装程序现在将硬性要求与推荐的扩展分开。

安装程序显示的所需检查：

-MySQLi
- 会议
- PCRE
- 过滤器
- `file_uploads`
- 文件信息

推荐扩展：

- mbstring
- 国际
- 图标
- XML
-zlib
-gd
-exif
- 卷曲

### 2.3 删除校验和指令

当前步骤 5 描述了 `checksum.php` 和 `checksum.mdi`。这些文件不属于 XOOPS 2.7.0 的一部分。

行动：

- 完全删除校验和验证部分。

### 2.4 更新包及上传说明

保留 `docs/`、`extras/`、`htdocs/`、`upgrade/` 包布局描述，但更新上传和准备文本以反映当前可写-path 期望：- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `XOOPS_data/caches/`
- `XOOPS_data/caches/XOOPS_cache/`
- `XOOPS_data/caches/smarty_cache/`
- `XOOPS_data/caches/smarty_compile/`
- `XOOPS_data/configs/`
- `XOOPS_data/configs/captcha/`
- `XOOPS_data/configs/textsanitizer/`
- `XOOPS_data/data/`
- `XOOPS_data/protector/`

该指南目前低估了这一点。

### 2.5 替换 SourceForge translation/download 语言

当前文本仍然显示要访问 SourceForge 上的 XOOPS 来获取其他语言包。这需要替换为当前的 project/community 下载指南。

## 3. 第 3 章：服务器配置检查

文件：

- `chapter-3-server-configuration-check.md`

所需更改：

- 围绕当前的两个-block布局重写页面描述：
  - 要求
  - 推荐的扩展
- 替换旧的屏幕截图。
- 明确记录上面列出的要求检查。

## 4. 第 4 章：走正确的道路

文件：

- `chapter-4-take-the-right-path.md`

所需更改：

- 添加新的 `Cookie Domain` 字段。
- 更新路径字段的名称和描述以匹配 2.7.0：
  - XOOPS根路径
  - XOOPS数据路径
  - XOOPS图书馆路径
  - XOOPSURL
  - Cookie 域
- 添加注释，更改库路径现在需要 `vendor/autoload.php` 处的有效 Composer 自动加载器。

这是 2.7.0 中真正的兼容性检查，应该清楚地记录下来。当前的指南根本没有提到 Composer。

## 5. 第 5 章：数据库连接

文件：

- `chapter-5-database-connections.md`

所需更改：

- 保留仅支持 MySQL 的声明。
- 更新数据库配置部分以反映：
  - 默认字符集现在为`utf8mb4`
  - 当字符集更改时，排序规则选择会动态更新
- 替换数据库连接和配置页面的屏幕截图。

当前的文字说明字符集和排序规则不需要注意，对于 2.7.0 来说太弱了。它至少应该提及新的 `utf8mb4` 默认值和动态排序选择器。

## 6. 第 6 章：最终系统配置

文件：

- `chapter-6-final-system-configuration.md`

### 6.1 生成的配置文件已更改

该指南目前表示安装程序会写入 `mainfile.php` 和 `secure.php`。

在 2.7.0 中，它还将配置文件安装到 `XOOPS_data/configs/` 中，包括：

- `XOOPSconfig.php`
- 验证码配置文件
- textsanitizer 配置文件

### 6.2 `XOOPS_data/configs/`中的现有配置文件不会被覆盖

非-overwrite行为是**范围**的，而不是全局的。 `page_configsave.php`中的两个不同的代码路径写入配置文件：

- `writeConfigurationFile()`（在第 59 和 66 行调用）**总是**从向导输入重新生成 `XOOPS_data/data/secure.php` 和 `mainfile.php`。没有存在性检查；现有副本被替换。
- `copyConfigDistFiles()`（在第 62 行调用，在第 317 行定义）仅复制`XOOPS_data/configs/` 文件（`XOOPSconfig.php`、验证码配置、textsanitizer 配置）**如果目标尚不存在**。

章节重写必须清楚地反映这两种行为：

- 对于`mainfile.php`和`secure.php`：警告当安装程序重新-run时，对这些文件的任何手-edits都将被覆盖。
- 对于 `XOOPS_data/configs/` 文件：说明本地自定义内容在 re-runs 和升级中保留，并且恢复出厂默认设置需要删除文件和 re-running（或手动复制相应的 `.dist.php`）。

不要在所有安装程序-written配置文件中概括“保留现有文件”——这是不正确的，并且会误导管理员编辑`mainfile.php`或`secure.php`。

### 6.3 HTTPS 和反向代理处理已更改

生成的`mainfile.php`现在支持更广泛的协议检测，包括反向-proxy标头。指南应提及这一点，而不是暗示仅直接进行 `http` 或 `https` 检测。

### 6.4 表计数错误

当前章节称新站点创建 `32` 表。

XOOPS 2.7.0 创建`33` 表。缺少的表是：

- `tokens`

行动：

- 将计数从 32 更新为 33。
- 将`tokens`添加到表格列表中。

## 7. 第 7 章：管理设置

文件：

- `chapter-7-administration-settings.md`### 7.1 密码 UI 描述已过时

安装程序仍然包括密码生成，但现在还包括：

- zxcvbn-based密码强度计
- 视觉强度标签
- 16-character生成器和复制流程

更新文本和屏幕截图以描述当前密码面板。

### 7.2 现已强制执行电子邮件验证

管理员电子邮件已通过 `FILTER_VALIDATE_EMAIL` 进行验证。本章应提及无效的电子邮件值将被拒绝。

### 7.3 权限证密钥部分错误

这是最重要的事实修复之一。

当前指南说：

- 有一个`License System Key`
- 它存储在`/include/license.php`中
- `/include/license.php`在安装过程中必须是可写的

这不再准确。

2.7.0 实际做了什么：

- 安装将权限证数据写入`XOOPS_data/data/license.php`
- `htdocs/include/license.php` 现在只是一个已弃用的包装器，用于从 `XOOPS_VAR_PATH` 加载文件
- 关于使`/include/license.php`可写的旧措辞应被删除

行动：

- 重写此部分而不是删除它。
- 将路径从`/include/license.php`更新为`XOOPS_data/data/license.php`。

### 7.4 主题列表已过时

当前指南仍然引用 Zetagenesis 和较旧的 2.5-era 主题集。

XOOPS 2.7.0 中存在的主题：

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

另请注意：

- `xswatch4` 是安装程序数据插入的当前默认主题。
- Zetagenesis 不再是打包主题列表的一部分。

### 7.5 模区块列表已过时

2.7.0 包中存在的模区块：

- `system` — 在表格-fill/数据-insertion步骤中自动安装。始终存在，在选择器中永远不可见。
- `debugbar` — 可在安装程序步骤中选择。
- `pm` — 可在安装步骤中选择。
- `profile` — 可在安装程序步骤中选择。
- `protector` — 可在安装程序步骤中选择。

重要提示：模区块安装程序页面（`htdocs/install/page_moduleinstaller.php`）通过迭代`XOOPSLists::getModulesList()`并**过滤掉模区块表中已有的任何内容**来构建其候选列表（第95-102行收集`$listed_mods`；第116行跳过该列表中存在的任何目录）。由于 `system` 是在此步骤运行之前安装的，因此它永远不会显示为复选框。

需要修改的指南：

- 别再说只有三个捆绑模区块了。
- 将安装程序步骤描述为显示**四个可选模区块**（`debugbar`、`pm`、`profile`、`protector`），而不是五个。
- 将`system`单独记录为始终-installed核心模区块，不会出现在选择器中。
- 将 `debugbar` 添加到捆绑的-module 描述中，作为 2.7.0 中的新描述。
- 请注意，安装程序的默认模区块预选现在为空；模区块可供选择，但不能通过安装程序配置预先-checked。

## 8. 第 8 章：准备开始

文件：

- `chapter-8-ready-to-go.md`

### 8.1 安装清理过程需要重写

当前指南称安装程序将安装文件夹重命名为唯一的名称。

实际上这仍然是正确的，但机制发生了变化：

- 在 Web 根目录中创建外部清理脚本
- 最终页面通过AJAX触发清理
- 安装文件夹重命名为`install_remove_<unique suffix>`
- `cleanup.php`的回退仍然存在

行动：

- 更新说明。
- 保持用户-facing指令简单：安装后删除重命名的安装目录。

### 8.2 管理仪表板附录参考已过时

第 8 章仍然将读者引向旧的 Oxygen-era 管理体验。这需要与当前的管理主题保持一致：

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 帖子-install路径编辑指导需要修正

当前文本告诉读者用路径定义更新 `secure.php`。在 2.7.0 中，这些路径常量在 `mainfile.php` 中定义，而 `secure.php` 则保存安全数据。本章中的示例区块应进行相应更正。

### 8.4 应添加生产设置该指南应明确提及 `mainfile.dist.php` 中现在存在的生产默认值：

- `XOOPS_DB_LEGACY_LOG` 应保留 `false`
- `XOOPS_DEBUG` 应保留 `false`

## 9. 第 9 章：升级现有 XOOPS 安装

文件：

- `chapter-9-upgrade-existing-XOOPS-installation.md`

本章需要最大程度的重写。

### 9.1 添加强制性 Smarty 4 预检步骤

XOOPS 2.7.0 升级流程现在强制在升级完成之前执行预检过程。

新的所需流程：

1. 将`upgrade/`目录复制到站点根目录。
2. 运行`/upgrade/preflight.php`。
3. 扫描 `/themes/` 和 `/modules/` 查找旧的 Smarty 语法。
4. 在适当的情况下使用可选的修复模式。
5. 重新-run直至干净。
6. 继续进入`/upgrade/`。

当前章节根本没有提到这一点，这使得它与 2.7.0 指南不兼容。

### 9.2 替换手册2.5.2-era合并叙述

本章仍然描述了手动 2.5.2-style 升级，包括框架合并、AltSys 注释和手动-managed 文件重组。应将其替换为 `release_notes.txt` 和 `upgrade/README.md` 中的实际 2.7.x 升级序列。

推荐章节大纲：

1. 备份文件和数据库。
2. 关闭站点。
3. 将`htdocs/`复制到活动根目录上。
4. 将`htdocs/XOOPS_lib`复制到活动库路径中。
5. 将`htdocs/XOOPS_data`复制到活动数据路径中。
6. 将`upgrade/`复制到网络根目录。
7. 运行`preflight.php`。
8. 运行`/upgrade/`。
9. 完成更新程序提示。
10.更新`system`模区块。
11. 更新 `pm`、`profile` 和 `protector`（如果已安装）。
12.删除`upgrade/`。
13. 重新打开站点。

### 9.3 记录真正的 2.7.0 升级更改

2.7.0 的更新程序至少包括以下具体更改：

- 创建`tokens`表
- 扩大现代密码哈希的`bannerclient.passwd`
- 添加会话 cookie 首选项设置
- 删除过时的捆绑目录

该指南不需要公开每个实现细节，但它应该停止暗示升级只是文件副本加模区块更新。

## 10. 历史升级页面

文件：

- `upgrading-from-XOOPS-2.4.5-easy-way.md`
- `upgrading-from-XOOPS-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-XOOPS-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-XOOPSeditor-package.md`

**状态：** 结构决策已经解决 - 根 `SUMMARY.md` 将这些内容移至专用的 **历史升级说明** 部分，每个文件都带有一个“历史参考”标注，将读者引向第 9 章以进行 2.7.0 升级。它们不再是第-class升级指南。

**剩余工作（仅一致性）：**

- 确保`README.md`（根）在相同的“历史升级说明”标题下列出这些内容，而不是在通用的“升级”标题下。
- 在`de/README.md`、`de/SUMMARY.md`、`fr/README.md`、`fr/SUMMARY.md`和`en/SUMMARY.md`中镜像相同的分隔。
- 确保每个历史升级页面（根和本地化的 `de/book/upg*.md` / `fr/book/upg*.md` 副本）都带有链接回第 9 章的陈旧-content 标注。

## 11. 附录 1：管理GUI

文件：

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

本附录与氧气管理GUI相关，需要重写。

所需更改：

- 替换所有氧气参考
- 替换旧的icon/menu屏幕截图
- 记录当前的管理主题：
  - 默认
  - 黑暗
  - 现代
  - 过渡
- 提及发行说明中提到的当前 2.7.0 管理功能：
  - 系统管理主题中的模板重载功能
  - 更新了管理主题集

## 12. 附录2：通过FTP上传XOOPS

文件：

- `appendix-2-uploading-XOOPS-via-ftp.md`

所需更改：

- 删除 HostGator-specific 和 cPanel-specific 假设
- 使文件-upload措辞现代化
- 请注意，`XOOPS_lib` 现在包含 Composer 依赖项，因此上传较大，不应有选择地修剪

## 13. 附录 5：安全性

文件：

- `appendix-5-increase-security-of-your-XOOPS-installation.md`

所需更改：- 完全删除`register_globals`讨论
- 删除过时的主机-ticket语言
- 正确的权限文本从`404`到`0444`，其中只读
- 更新 `mainfile.php` 和 `secure.php` 讨论以匹配 2.7.0 布局
- 添加新的cookie-domain安全性-related常量上下文：
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- 添加生产指南：
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. 交叉-Language维护影响

root-level 英文文件修复后，需要进行等效更新：

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

`en/`树也需要审查，因为它包含单独的README和资产集，但似乎只有部分`book/`树。

## 15. 优先顺序

### 发布前至关重要

1. 将 repo/version 引用更新为 2.7.0。
2.围绕真实的2.7.0升级流程和Smarty4预检重写第9章。
3. 将系统要求更新为 PHP 8.2+ 和 MySQL 5.7.8+。
4. 更正第 7 章权限证-key 文件路径。
5. 正确的主题和模区块清单。
6. 将第 6 章表格计数从 32 更正为 33。

### 对于准确性很重要

7. 重写可写-path指南。
8. 将 Composer 自动加载器要求添加到路径设置中。
9. 将数据库字符集指南更新为`utf8mb4`。
10. 修复第 8 章路径-editing 指南，以便常量记录在正确的文件中。
11. 删除校验和指令。
12. 删除 `register_globals` 和其他无效的 PHP 指南。

### 发布-quality清理

13. 替换所有安装程序和管理屏幕截图。
14. 将历史升级页面移出主流程。
15. 英文修正后同步德文和法文副本。
16. 清理过时的链接和重复的 README 行。