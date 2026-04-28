---
title: "程式碼組織最佳實踐"
description: "模組結構、命名約定和 PSR-4 自動載入"
---

# XOOPS 中的程式碼組織最佳實踐

適當的程式碼組織對於可維護性、可擴展性和團隊協作至關重要。

## 模組目錄結構

組織良好的 XOOPS 模組應遵循此結構：

```
mymodule/
├── xoops_version.php           # 模組中繼資料
├── index.php                    # 前端進入點
├── admin.php                    # 管理員進入點
├── class/
│   ├── Controller/             # 請求處理器
│   ├── Handler/                # 資料處理器
│   ├── Repository/             # 資料存取
│   ├── Entity/                 # 領域物件
│   ├── Service/                # 業務邏輯
│   ├── DTO/                    # 資料傳輸物件
│   └── Exception/              # 自訂例外狀況
├── templates/                  # Smarty 範本
│   ├── admin/                  # 管理員範本
│   └── blocks/                 # 區塊範本
├── assets/
│   ├── css/                    # 樣式表
│   ├── js/                     # JavaScript
│   └── images/                 # 圖片
├── sql/                        # 資料庫架構
├── tests/                      # 單元和整合測試
├── docs/                       # 文件
└── composer.json              # Composer 組態
```

## 命名約定

### PHP 命名標準 (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### 檔案和目錄組織

- 每個檔案一個類別
- 檔案名稱與類別名稱相符
- 目錄結構與命名空間階層相符
- 將相關類別保留在一起
- 在整個模組中使用一致的命名

## PSR-4 自動載入

### Composer 組態

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### 手動自動加載器

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## 最佳實踐

### 1. 單一責任
- 每個類別應該只有一個變更原因
- 將關注點分離到不同的類別中
- 保持類別集中和內聚

### 2. 一致的命名
- 使用有意義的、描述性的名稱
- 遵循 PSR-12 編碼標準
- 避免縮寫，除非明顯
- 使用一致的模式

### 3. 目錄組織
- 將相關類別組合在一起
- 將關注點分離到子目錄中
- 保持範本和資源井然有序
- 使用一致的檔案命名

### 4. 命名空間用法
- 對所有類別使用適當的命名空間
- 遵循 PSR-4 自動載入
- 命名空間與目錄結構相符

### 5. 組態管理
- 在組態目錄中集中化組態
- 使用環境型組態
- 不要對設定進行硬編碼

## 模組引導

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## 相關文件

另外參閱：
- Error-Handling 以進行例外狀況管理
- Testing 以進行測試組織
- ../Patterns/MVC-Pattern 以進行控制器結構

---

標籤: #best-practices #code-organization #psr-4 #module-development
