---
title：“发布者模区块”
description：“XOOPS的Publisher新闻和博客模区块的完整文档”
---

> XOOPS CMS 的首要新闻和博客发布模区块。

---

## 概述

Publisher 是 XOOPS 的权威内容管理模区块，从 SmartSection 发展成为最具特色的-rich 博客和新闻解决方案。它提供了用于创建、组织和发布内容的综合工具，并提供完整的编辑工作流程支持。

**要求：**
- XOOPS2.5.10+
- PHP 7.1+（推荐PHP 8.x）

---

## 🌟 主要特点

### 内容管理
- **类别和子类别** - 分层内容组织
- **富文本编辑** - 支持多个WYSIWYG编辑器
- **文件附件** - 将文件附加到文章
- **图像管理** - 页面和类别图像
- **文件包装** - 将文件包装为文章

### 发布工作流程
- **预定发布** - 设置未来的发布日期
- **到期日期** - 自动-expire内容
- **审核** - 编辑审批工作流程
- **草稿管理** - 保存正在进行的工作

### 显示和模板
- **四个基本模板** - 多种显示布局
- **自定义模板** - 创建您自己的设计
- **SEO优化** - 搜索引擎友好的URL
- **响应式设计** - 移动-ready输出

### 用户交互
- **评级** - 文章评级系统
- **评论** - 读者讨论
- **社交共享** - 分享到社交网络

### 权限
- **提交控制** - 谁可以提交文章
- **字段-Level权限** - 按组控制表单字段
- **类别权限** - 每个类别的访问控制
- **审核权利** - 全局审核设置

---

## 🗂️ 部分内容

### 用户指南
- 安装指南
- 基本配置
- 创建文章
- 管理类别
- 设置权限

### 开发者指南
- 扩展发布者
- 创建自定义模板
- API参考
- 挂钩和事件

---

## 🚀 快速入门

### 1.安装

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

然后通过XOOPS管理→模区块→安装进行安装。

### 2. 创建您的第一个类别

1. 转到 **管理 → 发布者 → 类别**
2. 单击“**添加类别**”
3、填写：
   - **名称**：新闻
   - **描述**：最新新闻和更新
   - **图片**：上传类别图片
4. 保存

### 3. 创建您的第一篇文章

1. 转到**管理→发布者→文章**
2. 单击“**添加文章**”
3、填写：
   - **标题**：欢迎来到我们的网站
   - **类别**：新闻
   - **内容**：您的文章内容
4.设置**状态**：已发布
5. 保存

---

## ⚙️ 配置选项

### 常规设置

|设置|描述 |默认 |
|---------|-------------|---------|
|编辑| WYSIWYG编辑器使用| XOOPS默认|
|每页项目 |每页显示的文章 | 10 | 10
|显示面包屑 |显示导航轨迹 |是的 |
|允许评分 |启用文章评级 |是的 |
|允许评论 |启用文章评论 |是的 |

### SEO 设置

|设置|描述 |默认 |
|---------|-------------|---------|
| SEO 网址 |启用友好 URL |没有 |
| URL重写| Apache mod_rewrite | Apache mod_rewrite无 |
|元关键词|自动-generate 关键字 |是的 |

### 权限矩阵

|权限 |匿名 |注册|编辑|管理员 |
|------------|------------|------------|--------|--------|
|查看文章 | ✓ | ✓ | ✓ | ✓ |
|提交文章 | ✗ | ✓ | ✓ | ✓ |
|编辑自己的文章 | ✗ | ✓ | ✓ | ✓ |
|编辑所有文章 | ✗ | ✗ | ✓ | ✓ |
|批准文章 | ✗ | ✗ | ✓ | ✓ |
|管理类别 | ✗ | ✗ | ✗ | ✓ |

---

## 📦 模区块结构

```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```

---

## 🔄 迁移

### 来自 SmartSection

Publisher 包含内置的-in迁移工具：1. 转到**管理→发布者→导入**
2. 选择 **SmartSection** 作为源
3. 选择导入选项：
   - 类别
   - 文章
   - 评论
4. 单击**导入**

### 来自新闻模区块

1. 转到**管理→发布者→导入**
2. 选择**新闻**作为来源
3. 地图类别
4. 单击**导入**

---

## 🔗 相关文档

- 模区块开发指南
- Smarty 模板
- XMF框架

---

## 📚 资源

- [GitHub Repository](https://github.com/XOOPSModules25x/publisher)
- [Issue Tracker](https://github.com/XOOPSModules25x/publisher/issues)
- [Original Tutorial](https://XOOPS.gitbook.io/publisher-tutorial/)

---

#XOOPS #publisher #module #blog #news #cms #content-management