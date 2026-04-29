---
title: "Các phương pháp hay nhất về tổ chức mã"
description: "Cấu trúc mô-đun, quy ước đặt tên và tự động tải PSR-4"
---
# Thực tiễn tốt nhất về tổ chức mã trong XOOPS

Việc tổ chức mã phù hợp là điều cần thiết để có khả năng bảo trì, khả năng mở rộng và cộng tác nhóm.

## Cấu trúc thư mục mô-đun

Mô-đun XOOPS được tổ chức tốt phải tuân theo cấu trúc sau:

```
mymodule/
├── xoops_version.php           # Module metadata
├── index.php                    # Frontend entry point
├── admin.php                    # Admin entry point
├── class/
│   ├── Controller/             # Request handlers
│   ├── Handler/                # Data handlers
│   ├── Repository/             # Data access
│   ├── Entity/                 # Domain objects
│   ├── Service/                # Business logic
│   ├── DTO/                    # Data transfer objects
│   └── Exception/              # Custom exceptions
├── templates/                  # Smarty templates
│   ├── admin/                  # Admin templates
│   └── blocks/                 # Block templates
├── assets/
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript
│   └── images/                 # Images
├── sql/                        # Database schemas
├── tests/                      # Unit and integration tests
├── docs/                       # Documentation
└── composer.json              # Composer configuration
```

## Quy ước đặt tên

### Tiêu chuẩn đặt tên PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### Tổ chức tập tin và thư mục

- Một class cho mỗi tệp
- Tên file trùng với tên class
- Cấu trúc thư mục phù hợp với hệ thống phân cấp không gian tên
- Giữ classes có liên quan cùng nhau
- Sử dụng cách đặt tên nhất quán trên toàn mô-đun

## PSR-4 Tự động tải

### Cấu hình trình soạn thảo

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Trình tải tự động thủ công

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

## Các phương pháp hay nhất

### 1. Trách nhiệm duy nhất
- Mỗi class đều có một lý do để thay đổi
- Tách các mối quan tâm thành classes khác nhau
- Giữ classes tập trung và gắn kết

### 2. Đặt tên nhất quán
- Sử dụng tên có ý nghĩa, mang tính mô tả
- Thực hiện theo tiêu chuẩn mã hóa PSR-12
- Tránh viết tắt trừ khi rõ ràng
- Sử dụng các mẫu nhất quán

### 3. Tổ chức thư mục
- Nhóm liên quan classes với nhau
- Tách các mối quan tâm thành các thư mục con
- Giữ templates và assets ngăn nắp
- Sử dụng cách đặt tên file nhất quán

### 4. Cách sử dụng không gian tên
- Sử dụng không gian tên thích hợp cho tất cả classes
- Theo dõi tự động tải PSR-4
- Không gian tên phù hợp với cấu trúc thư mục

### 5. Quản lý cấu hình
- Tập trung cấu hình vào thư mục config
- Sử dụng cấu hình dựa trên môi trường
- Không cài đặt mã hóa cứng

## Khởi động mô-đun

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

## Tài liệu liên quan

Xem thêm:
- Xử lý lỗi để quản lý ngoại lệ
- Kiểm tra tổ chức kiểm tra
- ../Patterns/MVC-Pattern cho cấu trúc bộ điều khiển

---

Tags: #các phương pháp thực hành tốt nhất #tổ chức mã #psr-4 #phát triển mô-đun