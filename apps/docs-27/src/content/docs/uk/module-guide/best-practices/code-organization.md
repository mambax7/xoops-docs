---
title: "Найкращі методи організації коду"
description: "Структура модуля, правила іменування та автозавантаження PSR-4"
---
# Найкращі методи організації коду в XOOPS

Правильна організація коду має важливе значення для зручності обслуговування, масштабованості та командної співпраці.

## Структура каталогу модулів

Добре організований модуль XOOPS має відповідати такій структурі:
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
## Правила іменування

### PHP Стандарти найменування (PSR-12)
```
Classes:      PascalCase         (UserController, PostRepository)
Methods:      camelCase          (getUserById, createUser)
Properties:   camelCase          ($userId, $username)
Constants:    UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Functions:    snake_case         (get_user_data, validate_email)
Files:        PascalCase.php     (UserController.php)
```
### Організація файлів і каталогів

- Один клас на файл
- Назва файлу відповідає назві класу
- Структура каталогу відповідає ієрархії простору імен
- Тримайте споріднені класи разом
- Використовуйте узгоджені імена для всіх модулів

## PSR-4 Автозавантаження

### Конфігурація Composer
```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```
### Ручний автозавантажувач
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
## Найкращі практики

### 1. Єдина відповідальність
- У кожного класу має бути одна причина змінитися
- Розділіть проблеми на різні класи
- Тримайте заняття зосередженими та згуртованими

### 2. Послідовне іменування
- Використовуйте змістовні, описові імена
- Дотримуйтесь стандартів кодування PSR-12
- Уникайте скорочень, якщо вони не очевидні
- Використовуйте послідовні шаблони

### 3. Організація каталогу
- Згрупуйте споріднені класи разом
- Розділіть завдання на підкаталоги
- Тримайте шаблони та активи впорядкованими
- Використовуйте послідовне іменування файлів

### 4. Використання простору імен
- Використовуйте належні простори імен для всіх класів
- Слідкуйте за автозавантаженням PSR-4
- Простір імен відповідає структурі каталогу

### 5. Керування конфігурацією
- Централізація конфігурації в каталозі конфігурації
- Використовуйте конфігурацію на основі середовища
- Не закодуйте налаштування

## Модуль Bootstrap
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
## Пов'язана документація

Дивіться також:
- Обробка помилок для керування винятками
- Тестування для організації тестування
- ../Patterns/MVC-Pattern для структури контролера

---

Теги: #найкращі практики #організація коду #psr-4 #модульна розробка