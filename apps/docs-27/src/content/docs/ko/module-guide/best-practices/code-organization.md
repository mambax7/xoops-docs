---
title: "코드 구성 모범 사례"
description: "모듈 구조, 명명 규칙 및 PSR-4 자동 로딩"
---

# XOOPS의 코드 구성 모범 사례

적절한 코드 구성은 유지 관리성, 확장성 및 팀 협업에 필수적입니다.

## 모듈 디렉토리 구조

잘 구성된 XOOPS 모듈은 다음 구조를 따라야 합니다:

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

## 명명 규칙

### PHP 명명 표준(PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```

### 파일 및 디렉토리 구성

- 파일당 하나의 클래스
- 파일 이름이 클래스 이름과 일치합니다.
- 디렉토리 구조가 네임스페이스 계층과 일치합니다.
- 관련 클래스을 함께 유지
- 모듈 전반에 걸쳐 일관된 이름 지정 사용

## PSR-4 자동 로딩

### 작성기 구성

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### 수동 오토로더

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

## 모범 사례

### 1. 단일 책임
- 각 클래스에는 변경해야 할 하나의 이유가 있어야 합니다.
- 우려 사항을 여러 클래스로 분리
- 클래스의 집중력과 응집력을 유지하세요.

### 2. 일관된 이름 지정
- 의미 있고 설명이 포함된 이름을 사용하세요.
- PSR-12 코딩 표준을 따르십시오.
- 명백하지 않은 한 약어를 사용하지 마세요.
- 일관된 패턴을 사용하라

### 3. 디렉토리 구성
- 관련 클래스을 함께 그룹화
- 우려 사항을 하위 디렉터리로 분리
- 템플릿과 자산을 체계적으로 정리하세요
- 일관된 파일 이름 사용

### 4. 네임스페이스 사용
- 모든 클래스에 적절한 네임스페이스 사용
- PSR-4 자동 로딩을 따릅니다.
- 네임스페이스가 디렉터리 구조와 일치합니다.

### 5. 구성 관리
- 구성 디렉터리에 구성을 중앙 집중화합니다.
- 환경 기반 구성 사용
- 설정을 하드코딩하지 마세요.

## 모듈 부트스트랩

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

## 관련 문서

참조:
- 예외 관리를 위한 오류 처리
- 테스트 기관을 위한 테스트
- 컨트롤러 구조의../Patterns/MVC-Pattern

---

태그: #모범 사례 #코드 구성 #psr-4 #모듈 개발
