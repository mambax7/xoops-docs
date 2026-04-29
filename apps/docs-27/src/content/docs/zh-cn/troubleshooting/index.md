---
title：“故障排除”
description：“常见XOOPS问题的解决方案、调试技术和FAQ”
---

> XOOPS CMS 的常见问题解决方案和调试技巧。

---

## 📋 快速诊断

在深入研究具体问题之前，请检查以下常见原因：

1. **文件权限** - 目录需要755，文件需要644
2. **PHP版本** - 确保PHP 7.4+（推荐8.x）
3. **错误日志** - 检查`XOOPS_data/logs/`和PHP错误日志
4. **缓存** - 在管理→系统→维护中清除缓存

---

## 🗂️ 部分内容

### 常见问题
- 白屏死机 (WSOD)
- 数据库连接错误
- 权限被拒绝错误
- 模区块安装失败
- 模板编译错误

### FAQ
- 安装FAQ
- 模区块FAQ
- 主题FAQ
- 性能FAQ

### 调试
- 启用调试模式
- 使用射线调试器
- 数据库查询调试
- Smarty模板调试

---

## 🚨 常见问题及解决方案

### 白屏死机 (WSOD)

**症状：** 空白页，无错误消息

**解决方案：**

1. **暂时启用PHP错误显示：**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
 
  ```

2. **检查PHP错误日志：**
   ```bash
   tail -f /var/log/php/error.log
 
  ```

3. **常见原因：**
   - 超出内存限制
   - 致命PHP语法错误
   - 缺少所需的扩展名

4. **修复内存问题：**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
 
  ```

---

### 数据库连接错误

**症状：**“无法连接到数据库”或类似情况

**解决方案：**

1. **验证主文件中的凭据。php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
 
  ```

2. **手动测试连接：**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
 
  ```

3. **检查MySQL服务：**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
 
  ```

4. **验证用户权限：**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
 
  ```

---

### 权限被拒绝错误

**症状：** 无法上传文件，无法保存设置

**解决方案：**

1. **设置正确的权限：**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
 
  ```

2. **设置正确的所有权：**
   ```bash
   chown -R www-data:www-data /path/to/xoops
 
  ```

3. **检查 SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
 
  ```

---

### 模区块安装失败

**症状：** 模区块无法安装，SQL错误

**解决方案：**

1. **检查模区块要求：**
   - PHP版本兼容性
   - 必需的PHP扩展
   - XOOPS版本兼容性

2. **手动SQL安装：**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
 
  ```

3. **清除模区块缓存：**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
 
  ```

4. **检查XOOPS_version.php语法：**
   ```bash
   php -l modules/mymodule/xoops_version.php
 
  ```

---

### 模板编译错误

**症状：** Smarty错误，找不到模板

**解决方案：**

1. **清除Smarty缓存：**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
 
  ```

2. **检查模板语法：**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
 
  ```

3. **验证模板是否存在：**
   ```bash
   ls modules/mymodule/templates/
 
  ```

4. **重新生成模板：**
   - 管理→系统→维护→模板→重新生成

---

## 🐛 调试技巧

### 启用XOOPS调试模式

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### 使用 Ray 调试器

Ray 是一款出色的调试工具 PHP：

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Smarty 调试控制台

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### 数据库查询日志记录

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ 常见问题

### 安装

**问：安装向导显示空白页**
答：检查PHP错误日志，确保PHP有足够的内存，验证文件权限。

**问：安装期间无法写入主文件。php**
答：设置权限：安装期间`chmod 666 mainfile.php`，安装后`chmod 444`。

**问：数据库表未创建**
答：检查MySQL用户是否拥有CREATETABLE权限，验证数据库是否存在。

### 模区块

**问：模区块管理页面是空白**
答：清除缓存，检查模区块的admin/menu.php是否存在语法错误。

**问：模区块区块未显示**
A：在管理→区块中检查区块权限，验证区块是否已分配给页面。

**问：模区块更新失败**
答：备份数据库，尝试手动SQL更新，检查版本要求。

### 主题

**问：主题应用不正确**
答：清除Smarty缓存，检查主题。html是否存在，验证主题权限。**问：自定义CSS未加载**
答：检查文件路径，清除浏览器缓存，验证CSS语法。

**问：图像不显示**
A：检查图片路径，验证上传文件夹权限。

### 性能

**问：网站速度很慢**
A：启用缓存、优化数据库、检查慢速查询、启用 OpCache。

**问：内存使用率高**
A：增加memory_limit，优化大查询，实现分页。

---

## 🔧 维护命令

### 清除所有缓存

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### 数据库优化

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### 检查文件完整性

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 相关文档

- 开始使用
- 安全最佳实践
- XOOPS 4.0 路线图

---

## 📚 外部资源

- [XOOPS Forums](https://XOOPS.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XOOPSCore27/issues)
- [PHP Error Reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#XOOPS #troubleshooting #debugging #faq #errors #solutions