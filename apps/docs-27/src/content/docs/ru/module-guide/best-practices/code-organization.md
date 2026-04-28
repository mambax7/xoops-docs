---
title: "Лучшие практики организации кода"
description: "Структура модуля, соглашения об именах и автозагрузка PSR-4"
---

# Лучшие практики организации кода в XOOPS

Надлежащая организация кода необходима для поддерживаемости, масштабируемости и командного сотрудничества.

## Структура директории модуля

Хорошо организованный модуль XOOPS должен следовать этой структуре:

```
mymodule/
├── xoops_version.php           # Метаданные модуля
├── index.php                    # Входная точка фронтенда
├── admin.php                    # Входная точка администратора
├── class/
│   ├── Controller/             # Обработчики запросов
│   ├── Handler/                # Обработчики данных
│   ├── Repository/             # Доступ к данным
│   ├── Entity/                 # Объекты домена
│   ├── Service/                # Бизнес-логика
│   ├── DTO/                    # Объекты передачи данных
│   └── Exception/              # Пользовательские исключения
├── templates/                  # Шаблоны Smarty
│   ├── admin/                  # Шаблоны администратора
│   └── blocks/                 # Шаблоны блоков
├── assets/
│   ├── css/                    # Таблицы стилей
│   ├── js/                     # JavaScript
│   └── images/                 # Изображения
├── sql/                        # Схемы баз данных
├── tests/                      # Модульные и интеграционные тесты
├── docs/                       # Документация
└── composer.json              # Конфигурация Composer
```

## Соглашения об именах

### Стандарты именования PHP (PSR-12)

```
Классы:      PascalCase         (UserController, PostRepository)
Методы:      camelCase          (getUserById, createUser)
Свойства:    camelCase          ($userId, $username)
Константы:   UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Функции:     snake_case         (get_user_data, validate_email)
Файлы:       PascalCase.php     (UserController.php)
```

### Организация файлов и директорий

- Один класс на файл
- Имя файла соответствует имени класса
- Структура директорий соответствует иерархии пространства имен
- Держите связанные классы вместе
- Используйте последовательные имена по всему модулю

## Автозагрузка PSR-4

### Конфигурация Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Ручной автозагрузчик

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

## Лучшие практики

### 1. Единая ответственность
- Каждый класс должен иметь одну причину для изменения
- Разделяйте проблемы на разные классы
- Держите классы сфокусированными и связанными

### 2. Согласованное именование
- Используйте значимые, описательные имена
- Следуйте стандартам кодирования PSR-12
- Избегайте сокращений, если они не очевидны
- Используйте согласованные паттерны

### 3. Организация директорий
- Группируйте связанные классы вместе
- Разделяйте проблемы в подкаталоги
- Держите шаблоны и ресурсы организованными
- Используйте согласованное именование файлов

### 4. Использование пространств имен
- Используйте правильные пространства имен для всех классов
- Следуйте автозагрузке PSR-4
- Пространство имен соответствует структуре директорий

### 5. Управление конфигурацией
- Централизуйте конфигурацию в директории config
- Используйте конфигурацию, основанную на окружении
- Не жестко кодируйте параметры

## Инициализация модуля

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

## Связанная документация

Смотрите также:
- Error-Handling для управления исключениями
- Testing для организации тестов
- ../Patterns/MVC-Pattern для структуры контроллера

---

Tags: #best-practices #code-organization #psr-4 #module-development
