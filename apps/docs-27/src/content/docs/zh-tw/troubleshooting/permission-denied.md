---
title: "權限被拒錯誤"
description: "XOOPS 中檔案和目錄權限問題故障排除"
---

XOOPS 安裝中檔案和目錄權限問題很常見，尤其是在上傳或伺服器遷移後。本指南有助於診斷和解決權限問題。

## 瞭解檔案權限

### Linux/Unix 權限基礎

檔案權限用三位數代碼表示：

```
rwxrwxrwx
||| ||| |||
||| ||| +-- 其他 (世界)
||| +------ 群組
+--------- 擁有者

r = 讀取 (4)
w = 寫入 (2)
x = 執行 (1)

755 = rwxr-xr-x (擁有者完全、群組讀/執、其他讀/執)
644 = rw-r--r-- (擁有者讀/寫、群組讀、其他讀)
777 = rwxrwxrwx (每個人完全訪問 - 不推薦)
```

## 常見權限錯誤

### 上傳中「權限被拒」

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### 「無法寫入檔案」

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### 「無法建立目錄」

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## XOOPS 關鍵目錄

### 需要寫入權限的目錄

| 目錄 | 最小值 | 用途 |
|-----------|---------|---------|
| `/uploads` | 755 | 使用者上傳 |
| `/cache` | 755 | 快取檔案 |
| `/templates_c` | 755 | 編譯的樣板 |
| `/var` | 755 | 變數資料 |
| `mainfile.php` | 644 | 設定 (可讀) |

## Linux/Unix 故障排除

### 步驟 1：檢查目前權限

```bash
# 檢查檔案權限
ls -l /var/www/html/xoops/

# 檢查特定檔案
ls -l /var/www/html/xoops/mainfile.php

# 檢查目錄權限
ls -ld /var/www/html/xoops/uploads/
```

### 步驟 2：識別 Web 伺服器使用者

```bash
# 檢查 Apache 使用者
ps aux | grep -E '[a]pache|[h]ttpd'
# 通常：www-data (Debian/Ubuntu) 或 apache (RedHat/CentOS)

# 檢查 Nginx 使用者
ps aux | grep -E '[n]ginx'
# 通常：www-data 或 nginx
```

### 步驟 3：修復擁有權

```bash
# 設置正確的擁有權 (假設 www-data 使用者)
sudo chown -R www-data:www-data /var/www/html/xoops/

# 僅修復可寫目錄的擁有權
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### 步驟 4：修復權限

#### 選項 A：限制權限（推薦）

```bash
# 所有目錄：755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# 所有檔案：644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# 除了可寫目錄
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### 選項 B：一次性指令碼

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# 設置擁有權
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# 設置目錄權限
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# 設置檔案權限
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# 確保可寫目錄
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## 按目錄的權限問題

### 上傳目錄

**問題：** 無法上傳檔案

```bash
# 解決方案
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### 快取目錄

**問題：** 快取檔案未被寫入

```bash
# 解決方案
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### 樣板快取

**問題：** 樣板未編譯

```bash
# 解決方案
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows 故障排除

### 步驟 1：檢查檔案屬性

1. 右鍵檔案 → 內容
2. 按下「安全」標籤
3. 按下「編輯」按鈕
4. 選擇使用者並驗證權限

### 步驟 2：授予寫入權限

#### 透過 GUI：

```
1. 右鍵資料夾 → 內容
2. 選擇「安全」標籤
3. 按下「編輯」
4. 選擇「IIS_IUSRS」或「NETWORK SERVICE」
5. 勾選「修改」和「寫入」
6. 按下「套用」和「確定」
```

#### 透過命令行 (PowerShell)：

```powershell
# 以管理員身份運行 PowerShell

# 授予 IIS 應用程式池權限
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## PHP 指令碼以檢查權限

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## 最佳實踐

### 1. 最低特權原則

```bash
# 只授予必要的權限
# 不要使用 777 或 666

# 差 (危險)
chmod 777 /var/www/html/xoops/uploads/  # 危險！

# 好 (安全)
chmod 755 /var/www/html/xoops/uploads/  # 安全
```

### 2. 變更前備份

```bash
# 備份目前狀態
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## 快速參考

```bash
# 快速修復 (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## 相關文件

- 白色死亡螢幕 - 其他常見錯誤
- 資料庫連接錯誤 - 資料庫問題
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS 設定

---

**最後更新：** 2026-01-31
**適用於：** XOOPS 2.5.7+
**作業系統：** Linux、Windows、macOS
