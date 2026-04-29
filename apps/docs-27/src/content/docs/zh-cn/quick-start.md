---
title：快速入门
description：在 5 分钟内运行 XOOPS 2.7。
---

## 要求

|组件|最低 |推荐|
|------------|-------------------------|----------------|
| PHP | 8.2 | 8.4+ |
| MySQL | 5.7 | 5.7 8.0+ |
| MariaDB | 10.4 | 10.4 10.11+ |
|网络服务器| Apache 2.4 / Nginx 1.20 |最新稳定|

## 下载

从 [GitHub Releases](https://github.com/XOOPS/XOOPSCore27/releases) 下载最新版本。

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## 安装步骤

1. **上传文件**到您的网络服务器文档根目录（例如`public_html/`）。
2. **创建 MySQL 数据库**和对其拥有完全权限的用户。
3. **打开浏览器**并导航到您的域 - XOOPS 安装程序会自动启动。
4. **遵循 5-step 向导** - 它配置路径、创建表并设置您的管理员帐户。
5. **出现提示时删除 `install/` 文件夹**。为了安全起见，这是强制性的。

## 验证安装

设置完成后，访问：

- **首页：** `https://yourdomain.com/`
- **管理面板：** `https://yourdomain.com/XOOPS_data/` *（您在安装过程中选择的路径）*

## 后续步骤

- [Full Installation Guide](./installation/) — 服务器配置、权限、故障排除
- [Module Guide](./module-guide/introduction/) — 构建你的第一个模区块
- [Theme Guide](./theme-guide/introduction/) — 创建或自定义主题