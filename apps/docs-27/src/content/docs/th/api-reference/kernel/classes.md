---
title: "XOOPS คลาสเคอร์เนล"
description: "คลาสเคอร์เนลหลักรวมถึง XoopsKernel, การบูตระบบ, การจัดการการกำหนดค่า และส่วนประกอบของระบบหลัก"
---
เคอร์เนล XOOPS มอบเฟรมเวิร์กพื้นฐานสำหรับการบูตระบบ การจัดการการกำหนดค่า การจัดการเหตุการณ์ของระบบ และการจัดหายูทิลิตี้หลัก คลาสเหล่านี้เป็นแกนหลักของแอปพลิเคชัน XOOPS

## สถาปัตยกรรมระบบ
```
mermaid
graph TD
    A[XoopsKernel] -->|initializes| B[Configuration Manager]
    A -->|manages| C[Service Container]
    A -->|handles| D[System Hooks]
    A -->|registers| E[Core Services]

    B -->|loads| F[config.php]
    B -->|manages| G[Module Configs]

    C -->|contains| H[Database]
    C -->|contains| I[Logger]
    C -->|contains| J[Template Engine]
    C -->|contains| K[Module Manager]

    E -->|registers| L[User Service]
    E -->|registers| M[Module Service]
    E -->|registers| N[Database Service]
```
## คลาส XoopsKernel

คลาสเคอร์เนลหลักที่เริ่มต้นและจัดการระบบ XOOPS

### ภาพรวมชั้นเรียน
```php
namespace Xoops;

class XoopsKernel
{
    private static ?XoopsKernel $instance = null;
    protected ServiceContainer $services;
    protected ConfigurationManager $config;
    protected array $modules = [];
    protected bool $isLoaded = false;
}
```
### ตัวสร้าง
```php
private function __construct()
```
ตัวสร้างส่วนตัวบังคับใช้รูปแบบซิงเกิล

### รับอินสแตนซ์

ดึงข้อมูลอินสแตนซ์เคอร์เนลซิงเกิลตัน
```php
public static function getInstance(): XoopsKernel
```
**ผลตอบแทน:** `XoopsKernel` - อินสแตนซ์เคอร์เนลซิงเกิลตัน

**ตัวอย่าง:**
```php
$kernel = XoopsKernel::getInstance();
```
### กระบวนการบูต

กระบวนการบู๊ตเคอร์เนลทำตามขั้นตอนเหล่านี้:

1. **การเริ่มต้น** - ตั้งค่าตัวจัดการข้อผิดพลาด กำหนดค่าคงที่
2. **การกำหนดค่า** - โหลดไฟล์การกำหนดค่า
3. **การลงทะเบียนบริการ** - ลงทะเบียนบริการหลัก
4. **การตรวจจับโมดูล** - สแกนและระบุโมดูลที่ใช้งานอยู่
5. **การเตรียมฐานข้อมูล** - เชื่อมต่อกับฐานข้อมูล
6. **การล้างข้อมูล** - เตรียมพร้อมสำหรับการจัดการคำขอ
```php
public function boot(): void
```
**ตัวอย่าง:**
```php
$kernel = XoopsKernel::getInstance();
$kernel->boot();
```
### วิธีคอนเทนเนอร์บริการ

#### ลงทะเบียนบริการ

ลงทะเบียนบริการในคอนเทนเนอร์บริการ
```php
public function registerService(
    string $name,
    callable|object $definition
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$name` | สตริง | ตัวระบุบริการ |
| `$definition` | เรียกได้\|วัตถุ | โรงงานบริการหรืออินสแตนซ์ |

**ตัวอย่าง:**
```php
$kernel->registerService('custom.handler', function($c) {
    return new CustomHandler();
});
```
#### รับบริการ

ดึงข้อมูลบริการที่ลงทะเบียนไว้
```php
public function getService(string $name): mixed
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$name` | สตริง | ตัวระบุบริการ |

**ผลตอบแทน:** `mixed` - บริการที่ร้องขอ

**ตัวอย่าง:**
```php
$database = $kernel->getService('database');
$logger = $kernel->getService('logger');
```
#### มีบริการ

ตรวจสอบว่ามีการลงทะเบียนบริการหรือไม่
```php
public function hasService(string $name): bool
```
**ตัวอย่าง:**
```php
if ($kernel->hasService('cache')) {
    $cache = $kernel->getService('cache');
}
```
## เครื่องมือจัดการการกำหนดค่า

จัดการการกำหนดค่าแอปพลิเคชันและการตั้งค่าโมดูล

### ภาพรวมชั้นเรียน
```php
namespace Xoops\Core;

class ConfigurationManager
{
    protected array $config = [];
    protected array $defaults = [];
    protected string $configPath;
}
```
### วิธีการ

#### กำลังโหลด

โหลดการกำหนดค่าจากไฟล์หรืออาร์เรย์
```php
public function load(string|array $source): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$source` | สตริง\|อาร์เรย์ | กำหนดค่าเส้นทางไฟล์หรืออาร์เรย์ |

**ตัวอย่าง:**
```php
$config = $kernel->getService('config');
$config->load(XOOPS_ROOT_PATH . '/include/config.php');
$config->load(['sitename' => 'My Site', 'admin_email' => 'admin@example.com']);
```
#### รับ

ดึงค่าการกำหนดค่า
```php
public function get(string $key, mixed $default = null): mixed
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | คีย์การกำหนดค่า (เครื่องหมายจุด) |
| `$default` | ผสม | ค่าเริ่มต้นหากไม่พบ |

**ผลตอบแทน:** `mixed` - ค่าการกำหนดค่า

**ตัวอย่าง:**
```php
$siteName = $config->get('sitename');
$adminEmail = $config->get('admin.email', 'admin@example.com');
```
#### ชุด

ตั้งค่าการกำหนดค่า
```php
public function set(string $key, mixed $value): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | รหัสการกำหนดค่า |
| `$value` | ผสม | ค่าการกำหนดค่า |

**ตัวอย่าง:**
```php
$config->set('sitename', 'New Site Name');
$config->set('features.cache_enabled', true);
```
####getModuleConfig

รับการกำหนดค่าสำหรับโมดูลเฉพาะ
```php
public function getModuleConfig(
    string $moduleName
): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$moduleName` | สตริง | ชื่อไดเร็กทอรีโมดูล |

**ผลตอบแทน:** `array` - อาร์เรย์การกำหนดค่าโมดูล

**ตัวอย่าง:**
```php
$publisherConfig = $config->getModuleConfig('publisher');
```
## ตะขอระบบ

hooks ของระบบอนุญาตให้โมดูลและปลั๊กอินเรียกใช้โค้ด ณ จุดใดจุดหนึ่งในวงจรการใช้งานของแอปพลิเคชัน

### คลาส HookManager
```php
namespace Xoops\Core;

class HookManager
{
    protected array $hooks = [];
    protected array $listeners = [];
}
```
### วิธีการ

#### เพิ่มHook

ลงทะเบียนจุดเชื่อมต่อ
```php
public function addHook(string $name): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$name` | สตริง | ตัวระบุตะขอ |

**ตัวอย่าง:**
```php
$hooks = $kernel->getService('hooks');
$hooks->addHook('system.startup');
$hooks->addHook('user.login');
$hooks->addHook('module.install');
```
#### ฟังนะ

แนบผู้ฟังเข้ากับตะขอ
```php
public function listen(
    string $hookName,
    callable $callback,
    int $priority = 10
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$hookName` | สตริง | ตัวระบุตะขอ |
| `$callback` | โทรได้ | ฟังก์ชั่นที่จะดำเนินการ |
| `$priority` | อินท์ | ลำดับความสำคัญของการดำเนินการ (เรียกใช้สูงกว่าก่อน) |

**ตัวอย่าง:**
```php
$hooks->listen('user.login', function($user) {
    error_log('User ' . $user->uname . ' logged in');
}, 10);

$hooks->listen('module.install', function($module) {
    // Custom module installation logic
    echo "Installing " . $module->getName();
}, 5);
```
#### ทริกเกอร์

ดำเนินการ Listener ทั้งหมดเพื่อขอ hook
```php
public function trigger(
    string $hookName,
    mixed $arguments = null
): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$hookName` | สตริง | ตัวระบุตะขอ |
| `$arguments` | ผสม | ข้อมูลที่จะส่งต่อไปยังผู้ฟัง |

**ผลตอบแทน:** `array` - ผลลัพธ์จากผู้ฟังทั้งหมด

**ตัวอย่าง:**
```php
$results = $hooks->trigger('system.startup');
$results = $hooks->trigger('user.created', $newUser);
```
## ภาพรวมบริการหลัก

เคอร์เนลลงทะเบียนบริการหลักหลายอย่างระหว่างการบู๊ต:

| บริการ | คลาส | วัตถุประสงค์ |
|---------|-------|---------|
| `database` | Xoopsฐานข้อมูล | เลเยอร์นามธรรมของฐานข้อมูล |
| `config` | ตัวจัดการการกำหนดค่า | การจัดการการกำหนดค่า |
| `logger` | คนตัดไม้ | การบันทึกแอปพลิเคชัน |
| `template` | XoopsTpl | เอ็นจิ้นเทมเพลต |
| `user` | ผู้จัดการผู้ใช้ | บริการการจัดการผู้ใช้ |
| `module` | ผู้จัดการโมดูล | การจัดการโมดูล |
| `cache` | ตัวจัดการแคช | เลเยอร์แคช |
| `hooks` | HookManager | hooks เหตุการณ์ของระบบ |

## ตัวอย่างการใช้งานที่สมบูรณ์
```php
<?php
/**
 * Custom module boot process utilizing kernel
 */

// Get kernel instance
$kernel = XoopsKernel::getInstance();

// Boot the system
$kernel->boot();

// Get services
$config = $kernel->getService('config');
$database = $kernel->getService('database');
$logger = $kernel->getService('logger');
$hooks = $kernel->getService('hooks');

// Access configuration
$siteName = $config->get('sitename');
$adminEmail = $config->get('admin.email');

// Register module-specific hooks
$hooks->listen('user.login', function($user) {
    // Log user login
    $logger->info('User login: ' . $user->uname);

    // Track in database
    $database->query(
        'INSERT INTO ' . $database->prefix('event_log') .
        ' (type, user_id, message, timestamp) VALUES (?, ?, ?, ?)',
        ['login', $user->uid(), 'User login', time()]
    );
});

$hooks->listen('module.install', function($module) {
    $logger->info('Module installed: ' . $module->getName());
});

// Trigger hooks
$hooks->trigger('system.startup');

// Use database service
$result = $database->query(
    'SELECT * FROM ' . $database->prefix('users') .
    ' LIMIT 10'
);

while ($row = $database->fetchArray($result)) {
    echo "User: " . htmlspecialchars($row['uname']) . "\n";
}

// Register custom service
$kernel->registerService('custom.repository', function($c) {
    return new CustomRepository($c->getService('database'));
});

// Later access custom service
$repo = $kernel->getService('custom.repository');
```
## ค่าคงที่หลัก

เคอร์เนลกำหนดค่าคงที่ที่สำคัญหลายประการระหว่างการบูต:
```php
// System paths
define('XOOPS_ROOT_PATH', '/var/www/xoops');
define('XOOPS_HTDOCS_PATH', XOOPS_ROOT_PATH . '/htdocs');
define('XOOPS_MODULES_PATH', XOOPS_ROOT_PATH . '/htdocs/modules');
define('XOOPS_THEMES_PATH', XOOPS_ROOT_PATH . '/htdocs/themes');

// Web paths
define('XOOPS_URL', 'http://example.com');
define('XOOPS_HTDOCS_URL', XOOPS_URL . '/htdocs');

// Database
define('XOOPS_DB_PREFIX', 'xoops_');
```
## การจัดการข้อผิดพลาด

เคอร์เนลตั้งค่าตัวจัดการข้อผิดพลาดระหว่างการบู๊ต:
```php
// Set custom error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    $kernel->getService('logger')->error(
        "Error: $errstr in $errfile:$errline"
    );
});

// Set exception handler
set_exception_handler(function($exception) {
    $kernel->getService('logger')->critical(
        "Exception: " . $exception->getMessage()
    );
});
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **บูตครั้งเดียว** - โทร `boot()` เพียงครั้งเดียวระหว่างการเริ่มต้นแอปพลิเคชัน
2. **ใช้ Service Container** - ลงทะเบียนและรับบริการผ่านเคอร์เนล
3. **Handle Hooks Early** - ลงทะเบียนผู้ฟัง hook ก่อนที่จะกระตุ้นพวกเขา
4. **บันทึกเหตุการณ์สำคัญ** - ใช้บริการตัวบันทึกเพื่อแก้ไขจุดบกพร่อง
5. **การกำหนดค่าแคช** - โหลดการกำหนดค่าหนึ่งครั้งและนำมาใช้ซ้ำ
6. **การจัดการข้อผิดพลาด** - ตั้งค่าตัวจัดการข้อผิดพลาดก่อนประมวลผลคำขอเสมอ

## เอกสารที่เกี่ยวข้อง

- ../Module/Module-System - ระบบโมดูลและวงจรชีวิต
- ../Template/Template-System - การรวมเอ็นจิ้นเทมเพลต
- ../User/User-System - การตรวจสอบและการจัดการผู้ใช้
- ../Database/XoopsDatabase - เลเยอร์ฐานข้อมูล

---

*ดูเพิ่มเติมที่: [¤XOOPS Kernel Source](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*