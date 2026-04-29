---
title: “创建您的第一页”
description: “在XOOPS中创建和发布内容的步骤-by-step指南，包括格式、媒体嵌入和发布选项”
---

# 在 XOOPS 中创建您的第一页

在XOOPS中了解如何创建、格式化和发布您的第一个内容。

## 了解XOOPS内容

### 什么是 Page/Post？

在XOOPS中，内容通过模区块进行管理。最常见的内容类型是：

|类型 |描述 |使用案例|
|---|---|---|
| **页面** |静态内容|关于我们、联系方式、服务 |
| **Post/Article** |时间-stamped内容|新闻、博客文章 |
| **类别** |内容组织 |群组相关内容 |
| **评论** |用户反馈|允许访客互动 |

本指南介绍了使用 XOOPS' 默认内容模区块创建基本的 page/article。

## 访问内容编辑器

### 来自管理面板

1. 登录管理面板：`http://your-domain.com/XOOPS/admin/`
2. 导航到**内容 > 页面**（或您的内容模区块）
3. 点击“添加新页面”或“新帖子”

### 前端（如果启用）

如果您的XOOPS配置为允许前端内容创建：

1. 以注册用户身份登录
2. 前往您的个人资料
3.寻找“提交内容”选项
4. 按照以下相同步骤操作

## 内容编辑器界面

内容编辑器包括：

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## 步骤-by-Step指南：创建您的第一页

### 第 1 步：访问内容编辑器

1. 在管理面板中，单击 **内容 > 页面**
2. 单击**“添加新页面”**或**“创建”**
3.您将看到内容编辑器

### 第 2 步：输入页面标题

在“标题”字段中，输入您的页面名称：

```
Title: Welcome to Our Website
```

标题的最佳实践：
- 清晰且具有描述性
- 如果可能的话，包括关键词
- 理想长度为 50-60 个字符
- 避免 ALL CAPS（难以阅读）
- 具体（不是“第 1 页”）

### 第 3 步：选择类别

选择组织此内容的位置：

```
Category: [Dropdown ▼]
```

选项可能包括：
- 一般
- 新闻
- 博客
- 公告
- 服务

如果类别不存在，请要求管理员创建它们。

### 第 4 步：编写您的内容

单击内容编辑器区域并输入文本。

#### 基本文本格式

使用编辑器工具栏：

|按钮|行动|结果 |
|---|---|---|
| **B** |大胆| **粗体文字** |
| *我* |斜体 | *斜体文字* |
| <u>你</u> |下划线 | <u>带下划线的文本</u> |

#### 使用HTML

XOOPS允许安全的HTML标签。常见示例：

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### 安全 HTML 示例

**推荐标签：**
- 段落：`<p>`、`<br>`
- 标题：`<h1>` 至 `<h6>`
- 文本：`<strong>`、`<em>`、`<u>`
- 列表：`<ul>`、`<ol>`、`<li>`
- 链接：`<a href="">`
- 区块引用：`<blockquote>`
- 表格：`<table>`、`<tr>`、`<td>`

**避免使用这些标签**（出于安全考虑可能会被禁用）：
- 脚本：`<script>`
- 款式：`<style>`
- Iframe：`<iframe>`（除非配置）
- 表格：`<form>`、`<input>`

### 步骤 5：添加图像

#### 选项 1：插入图像 URL

使用编辑器：

1. 单击 **插入图像** 按钮（图像图标）
2. 输入图片URL：`https://example.com/image.jpg`
3. 输入替代文本：“图像描述”
4. 单击“插入”

HTML等效：

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### 选项 2：上传图像

1. 首先将图片上传至XOOPS：
   - 转到**内容 > 媒体管理器**
   - 上传您的图片
   - 复制图像URL

2. 在内容编辑器中，使用 URL 插入（上述步骤）

#### 图像最佳实践

- 使用适当的文件大小（优化图像）
- 使用描述性文件名
- 始终包含替代文本（辅助功能）
- 支持的格式：JPG、PNG、GIF、WebP
- 建议宽度：内容 600-800 像素

### 第 6 步：嵌入媒体

#### 嵌入 YouTube 中的视频

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

将 `VIDEO_ID` 替换为 YouTube 视频 ID。

**要查找 YouTube 视频 ID：**
1. 在 YouTube 上打开视频
2. URL 为：`https://www.youtube.com/watch?v=VIDEO_ID`
3. 复制 ID（`v=` 后面的字符）#### 嵌入 Vimeo 中的视频

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### 步骤 7：添加元描述

在“描述”字段中，添加简短摘要：

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**元描述最佳实践：**
- 150-160 个字符
- 包括主要关键词
- 应该准确总结内容
- 用于搜索引擎结果
- 使其引人注目（用户看到这一点）

### 步骤 8：配置发布选项

#### 发布状态

选择发布状态：

```
Status: ☑ Published
```

选项：
- **发布：** 公众可见
- **草稿：** 仅对管理员可见
- **待审核：** 等待批准
- **存档：** 隐藏但保留

#### 可见性

设置谁可以看到此内容：

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### 出版日期

设置内容何时可见：

```
Publish Date: [Date Picker] [Time]
```

保留为“现在”以立即发布。

#### 允许评论

启用或禁用访客评论：

```
Allow Comments: ☑ Yes
```

如果启用，访问者可以添加反馈。

### 步骤 9：保存您的内容

多个保存选项：

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **立即发布：** 立即可见
- **另存为草稿：** 暂时保持私密
- **时间表：** 将来发布 date/time
- **预览：**在保存之前查看它的外观

单击您的选择：

```
Click [Publish Now]
```

### 第 10 步：验证您的页面

发布后，验证您的内容：

1. 进入您的网站主页
2. 导航至您的内容区域
3. 寻找您新创建的页面
4.点击查看
5. 检查：
   - [ ] 内容正确显示
   - [ ] 图像出现
   - [ ] 格式看起来不错
   - [ ] 链接有效
   - [ ] 标题和描述正确

## 示例：完整页面

### 标题
```
Getting Started with XOOPS
```

### 内容
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### 元描述
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## 高级内容功能

### 使用WYSIWYG编辑器

如果安装了富文本编辑器：

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

单击按钮可设置不带 HTML 的文本格式。

### 插入代码区块

显示代码示例：

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### 创建表

在表中组织数据：

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### 行内引号

突出显示重要文本：

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## SEO 内容最佳实践

针对搜索引擎优化您的内容：

### 标题
- 包括主要关键字
- 50-60 个字符
- 每页唯一

### 元描述
- 自然地包含关键字
- 150-160 个字符
- 引人注目且准确

### 内容
- 自然书写，避免关键词堆砌
- 适当使用标题（h2、h3）
- 包括其他页面的内部链接
- 在所有图像上使用替代文本
- 文章字数目标为 300 字以上

### URL 结构
- 保持 URL 简短且具有描述性
- 使用连字符分隔单词
- 避免特殊字符
- 示例：`/about-our-company`

## 管理您的内容

### 编辑现有页面

1. 转到 **内容 > 页面**
2. 在列表中找到您的页面
3. 单击“**编辑**”或页面标题
4. 做出改变
5. 单击“**更新**”

### 删除页面

1. 转到 **内容 > 页面**
2. 找到您的页面
3. 单击**删除**
4. 确认删除

### 更改发布状态

1. 转到 **内容 > 页面**
2.找到页面，点击**编辑**
3. 更改下拉菜单中的状态
4. 单击“**更新**”

## 内容创建疑难解答

### 内容未出现

**症状：** 已发布的页面未显示在网站上

**解决方案：**
1. 检查发布状态：应为“已发布”
2. 检查发布日期：应该是当前还是过去
3. 检查可见性：应为“公开”
4.清除缓存：管理>工具>清除缓存
5.检查权限：用户组必须有访问权限

### 格式化不起作用

**症状：** HTML标签或格式显示为文本

**解决方案：**
1. 验证模区块设置中启用了HTML
2. 使用正确的HTML语法
3.关闭所有标签：`<p>Text</p>`
4. 仅使用允许的标签
5. 使用HTML实体：`&lt;`对应`<`，`&amp;`对应`&`

### 图像不显示

**症状：** 图像显示损坏的图标**解决方案：**
1. 验证图像URL是否正确
2.检查镜像文件是否存在
3. 验证图像的适当权限
4. 尝试将图片上传至XOOPS
5. 检查外部阻塞（可能需要CORS）

### 字符编码问题

**症状：** 特殊字符显示为乱码

**解决方案：**
1. 将文件另存为UTF-8编码
2.确保页面字符集为UTF-8
3.添加到HTML头：`<meta charset="UTF-8">`
4. 避免从 Word 复制-pasting（使用纯文本）

## 内容工作流程最佳实践

### 推荐流程

1. **首先在编辑器中写入：** 使用管理内容编辑器
2. **发布前预览：** 单击预览按钮
3. **添加元数据：** 完整的标题、描述、标签
4. **先保存为草稿：** 保存为草稿以避免丢失工作
5. **最终审查：** Re-read 发布前
6. **发布：** 准备好后单击“发布”
7. **验证：** 检查实时站点
8. **根据需要进行编辑：** 快速更正

### 版本控制

始终保留备份：

1. **重大更改之前：** 保存为新版本或备份
2. **存档旧内容：** 保留未发布的版本
3. **草稿日期：** 使用清晰的命名：“Page-Draft-2025-01-28”

## 发布多个页面

创建内容策略：

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

创建遵循此结构的页面。

## 后续步骤

创建第一个页面后：

1. 设置用户帐户
2. 安装附加模区块
3. 探索管理功能
4. 配置设置
5. 优化性能设置

---

**标签：** #content-creation #pages #publishing #editor

**相关文章：**
- 管理员-Panel-Overview
- 管理-Users
- 安装-Modules
- ../Configuration/Basic-Configuration