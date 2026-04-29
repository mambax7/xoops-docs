---
title: “附录 3：将 XOOPS 翻译为当地语言”
---

XOOPS 2.7.0 仅附带英文文件。其他语言的翻译由社区维护，并通过 GitHub 和各个本地 XOOPS 支持网站分发。

## 在哪里可以找到现有的翻译

- **GitHub** — 社区翻译越来越多地作为独立存储库在 [XOOPS organization](https://github.com/XOOPS) 下和个人贡献者帐户上发布。在 GitHub 中搜索 `XOOPS-language-<your-language>` 或浏览 XOOPS 组织以获取当前软件包。
- **本地XOOPS支持网站** — 许多地区XOOPS社区在自己的网站上发布翻译。访问 [https://XOOPS.org](https://XOOPS.org) 并点击当地社区的链接。
- **模区块翻译** — 各个社区模区块的翻译通常位于 `XOOPSModules25x` GitHub 组织中的模区块本身旁边（名称中的 `25x` 是历史性的；其中的模区块针对 XOOPS 2.5.x 和 2.7.x 进行维护）。

如果您的语言的翻译已经存在，请将语言目录放入您的XOOPS安装中（请参阅下面的“如何安装翻译”）。

## 需要翻译的内容

XOOPS 2.7.0 将语言文件保留在使用它们的代码旁边。完整的翻译涵盖所有这些位置：

- **核心** — `htdocs/language/english/` — 站点-wide 每个页面使用的常量（登录、常见错误、日期、邮件模板等）。
- **安装程序** — `htdocs/install/language/english/` — 安装向导显示的字符串。如果您想要本地化的安装体验，请在*运行安装程序之前*翻译这些内容。
- **系统模区块** — `htdocs/modules/system/language/english/` — 迄今为止最大的一套；涵盖整个管理控制面板。
- **捆绑模区块** — `htdocs/modules/pm/language/english/`、`htdocs/modules/profile/language/english/`、`htdocs/modules/protector/language/english/` 和 `htdocs/modules/debugbar/language/english/` 中的每一个。
- **主题** — 少数主题提供自己的语言文件；检查`htdocs/themes/<theme>/language/`是否存在。

“仅核心”翻译是最小有用单元，对应于上面的前两个项目符号。

## 如何翻译

1. 复制旁边的 `english/` 目录，并将副本重命名为您的语言。目录名称应为该语言的小写英文名称（`spanish`、`german`、`french`、`japanese`、`arabic`等）。

 
  ```
   htdocs/language/english/    →    htdocs/language/spanish/
 
  ```

2. 打开新目录中的每个 `.php` 文件并翻译 `define()` 调用中的**字符串值**。 **不要**更改常量名称 - 它们是从整个核心的 PHP 代码中引用的。

   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
 
  ```

3. **将每个文件另存为 UTF-8 *不带* BOM.** XOOPS 2.7.0 使用 `utf8mb4` end-to-end（数据库、会话、输出）并拒绝带有字节-order 标记的文件。在 Notepad++ 中，这是 **“UTF-8”** 选项，*不是*“UTF-8-BOM”。在 VS Code 中它是默认值；只需在状态栏中确认编码即可。

4. 更新每个文件顶部的语言和字符集元数据以匹配您的语言：

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
 
  ```

   `_LANGCODE` 应是您的语言的[ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) 代码。在 XOOPS 2.7.0 中，`_CHARSET` 始终为 `UTF-8` — 不再有 ISO-8859-1 变体。

5. 对安装程序、系统模区块以及您需要的任何捆绑模区块重复此操作。

## 如何安装翻译

如果您获得了目录树形式的完成翻译：

1. 将每个 `<language>/` 目录复制到 XOOPS 安装中匹配的 `language/english/` 父目录中。例如，将 `language/spanish/` 复制到 `htdocs/language/`，将 `install/language/spanish/` 复制到 `htdocs/install/language/`，依此类推。
2. 确保 Web 服务器可以读取文件所有权和权限。
3. 在安装时选择新语言（向导会扫描`htdocs/language/`以查找可用语言），或者在现有站点上，在**管理 → 系统 → 首选项 → 常规设置** 中更改语言。

## 分享您的翻译

请将您的翻译贡献给社区。1. 创建一个 GitHub 存储库（如果您的语言存在，则创建一个现有的语言存储库）。
2. 使用清晰的名称，例如 `XOOPS-language-<language-code>`（例如 `XOOPS-language-es`、`XOOPS-language-pt-br`）。
3. 镜像存储库内的 XOOPS 目录结构，使文件与复制的位置对齐：

 
  ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
 
  ```

4. 包含 `README.md` 文档：
   - 语言名称和ISO代码
   - XOOPS版本兼容性（例如`XOOPS 2.7.0+`）
   - 译者和学分
   - 翻译是否是核心-only还是涵盖捆绑模区块
5. 针对 GitHub 上的相关 module/core 存储库提出拉取请求，或在 [https://XOOPS.org](https://XOOPS.org) 上发布公告，以便社区可以找到它。

> **注意**
>
> 如果您的语言需要更改日期或日历格式的核心，请将这些更改也包含在包中。具有正确-to-left脚本的语言（阿拉伯语、希伯来语、波斯语、乌尔都语）在XOOPS 2.7.0中开箱即用 - 此版本中添加了RTL支持，各个主题会自动选择它。