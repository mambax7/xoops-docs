---
title: "XOOPS Kelas Kernel"
description: "Kelas inti teras termasuk XoopsKernel, bootstrap sistem, pengurusan konfigurasi dan komponen sistem teras"
---
Kernel XOOPS menyediakan rangka kerja asas untuk bootstrap sistem, mengurus konfigurasi, mengendalikan acara sistem dan menyediakan utiliti teras. Kelas-kelas ini membentuk tulang belakang aplikasi XOOPS.## Seni Bina Sistem
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
## Kelas XoopsKernelKelas kernel utama yang memulakan dan mengurus sistem XOOPS.### Gambaran Keseluruhan Kelas
```
php
namespace XOOPS;

class XoopsKernel
{
    private static ?XoopsKernel $instance = null;
    protected ServiceContainer $services;
    protected ConfigurationManager $config;
    protected array $modules = [];
    protected bool $isLoaded = false;
}
```
### Pembina
```
php
private function __construct()
```
Pembina persendirian menguatkuasakan corak tunggal.### getInstanceMengambil contoh kernel tunggal.
```
php
public static function getInstance(): XoopsKernel
```
**Pemulangan:** `XoopsKernel` - Contoh kernel tunggal**Contoh:**
```
php
$kernel = XoopsKernel::getInstance();
```
### Proses ButProses but kernel mengikuti langkah berikut:1. **Permulaan** - Tetapkan pengendali ralat, tentukan pemalar
2. **Konfigurasi** - Muatkan fail konfigurasi
3. **Pendaftaran Perkhidmatan** - Daftar perkhidmatan teras
4. **Pengesanan Modul** - Imbas dan kenal pasti modul aktif
5. **Permulaan Pangkalan Data** - Sambung ke pangkalan data
6. **Pembersihan** - Bersedia untuk pengendalian permintaan
```
php
public function boot(): void
```
**Contoh:**
```
php
$kernel = XoopsKernel::getInstance();
$kernel->boot();
```
### Kaedah Bekas Perkhidmatan#### registerServiceMendaftarkan perkhidmatan dalam bekas perkhidmatan.
```
php
public function registerService(
    string $name,
    callable|object $definition
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$name` | rentetan | Pengecam perkhidmatan |
| `$definition` | callable\|object | Kilang perkhidmatan atau contoh |**Contoh:**
```
php
$kernel->registerService('custom.handler', function($c) {
    return new CustomHandler();
});
```
#### getServiceMendapat semula perkhidmatan berdaftar.
```
php
public function getService(string $name): mixed
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$name` | rentetan | Pengecam perkhidmatan |**Pemulangan:** `mixed` - Perkhidmatan yang diminta**Contoh:**
```
php
$database = $kernel->getService('database');
$logger = $kernel->getService('logger');
```
#### hasServiceMenyemak sama ada perkhidmatan didaftarkan.
```
php
public function hasService(string $name): bool
```
**Contoh:**
```
php
if ($kernel->hasService('cache')) {
    $cache = $kernel->getService('cache');
}
```
## Pengurus KonfigurasiMenguruskan konfigurasi aplikasi dan tetapan modul.### Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Core;

class ConfigurationManager
{
    protected array $config = [];
    protected array $defaults = [];
    protected string $configPath;
}
```
### Kaedah#### bebanMemuatkan konfigurasi daripada fail atau tatasusunan.
```
php
public function load(string|array $source): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$source` | string\|array | Konfigurasi laluan fail atau tatasusunan |**Contoh:**
```
php
$config = $kernel->getService('config');
$config->load(XOOPS_ROOT_PATH . '/include/config.php');
$config->load(['sitename' => 'My Site', 'admin_email' => 'admin@example.com']);
```
#### dapatkanMendapatkan nilai konfigurasi.
```
php
public function get(string $key, mixed $default = null): mixed
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Kekunci konfigurasi (notasi titik) |
| `$default` | bercampur | Nilai lalai jika tidak ditemui |**Pemulangan:** `mixed` - Nilai konfigurasi**Contoh:**
```
php
$siteName = $config->get('sitename');
$adminEmail = $config->get('admin.email', 'admin@example.com');
```
#### ditetapkanMenetapkan nilai konfigurasi.
```
php
public function set(string $key, mixed $value): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Kekunci konfigurasi |
| `$value` | bercampur | Nilai konfigurasi |**Contoh:**
```
php
$config->set('sitename', 'New Site Name');
$config->set('features.cache_enabled', true);
```
#### getModuleConfigMendapat konfigurasi untuk modul tertentu.
```
php
public function getModuleConfig(
    string $moduleName
): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$moduleName` | rentetan | Nama direktori modul |**Pemulangan:** `array` - Tatasusunan konfigurasi modul**Contoh:**
```
php
$publisherConfig = $config->getModuleConfig('publisher');
```
## Cangkuk SistemCangkuk sistem membenarkan modul dan pemalam untuk melaksanakan kod pada titik tertentu dalam kitaran hayat aplikasi.### Kelas HookManager
```
php
namespace XOOPS\Core;

class HookManager
{
    protected array $hooks = [];
    protected array $listeners = [];
}
```
### Kaedah#### addHookMendaftarkan mata kail.
```
php
public function addHook(string $name): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$name` | rentetan | Pengecam cangkuk |**Contoh:**
```
php
$hooks = $kernel->getService('hooks');
$hooks->addHook('system.startup');
$hooks->addHook('user.login');
$hooks->addHook('module.install');
```
#### dengarMelekatkan pendengar pada cangkuk.
```
php
public function listen(
    string $hookName,
    callable $callback,
    int $priority = 10
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$hookName` | rentetan | Pengecam cangkuk |
| `$callback` | boleh dipanggil | Fungsi untuk melaksanakan |
| `$priority` | int | Keutamaan pelaksanaan (larian lebih tinggi dahulu) |**Contoh:**
```
php
$hooks->listen('user.login', function($user) {
    error_log('User ' . $user->uname . ' logged in');
}, 10);

$hooks->listen('module.install', function($module) {
    // Custom module installation logic
    echo "Installing " . $module->getName();
}, 5);
```
#### pencetusMelaksanakan semua pendengar untuk cangkuk.
```
php
public function trigger(
    string $hookName,
    mixed $arguments = null
): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$hookName` | rentetan | Pengecam cangkuk |
| `$arguments` | bercampur | Data untuk dihantar kepada pendengar |**Pemulangan:** `array` - Hasil daripada semua pendengar**Contoh:**
```
php
$results = $hooks->trigger('system.startup');
$results = $hooks->trigger('user.created', $newUser);
```
## Gambaran Keseluruhan Perkhidmatan TerasKernel mendaftarkan beberapa perkhidmatan teras semasa but:| Perkhidmatan | Kelas | Tujuan |
|---------|-------|---------|
| `database` | XoopsDatabase | Lapisan abstraksi pangkalan data |
| `config` | Pengurus Konfigurasi | Pengurusan konfigurasi |
| `logger` | Pembalak | Pengelogan permohonan |
| `template` | XoopsTpl | Enjin templat |
| `user` | Pengurus Pengguna | Perkhidmatan pengurusan pengguna |
| `module` | Pengurus Modul | Pengurusan modul |
| `cache` | CacheManager | Caching lapisan |
| `hooks` | HookManager | Cangkuk acara sistem |## Contoh Penggunaan Lengkap
```
php
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
## Pemalar TerasKernel mentakrifkan beberapa pemalar penting semasa but:
```
php
// System paths
define('XOOPS_ROOT_PATH', '/var/www/XOOPS');
define('XOOPS_HTDOCS_PATH', XOOPS_ROOT_PATH . '/htdocs');
define('XOOPS_MODULES_PATH', XOOPS_ROOT_PATH . '/htdocs/modules');
define('XOOPS_THEMES_PATH', XOOPS_ROOT_PATH . '/htdocs/themes');

// Web paths
define('XOOPS_URL', 'http://example.com');
define('XOOPS_HTDOCS_URL', XOOPS_URL . '/htdocs');

// Database
define('XOOPS_DB_PREFIX', 'xoops_');
```
## Pengendalian RalatKernel menyediakan pengendali ralat semasa but:
```
php
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
## Amalan Terbaik1. **But Tunggal** - Panggil `boot()` sekali sahaja semasa aplikasi dimulakan
2. **Gunakan Bekas Perkhidmatan** - Daftar dan dapatkan perkhidmatan melalui kernel
3. **Kendalikan Cangkuk Awal** - Daftar pendengar cangkuk sebelum mencetuskannya
4. **Log Peristiwa Penting** - Gunakan perkhidmatan logger untuk nyahpepijat
5. **Konfigurasi Cache** - Muatkan konfigurasi sekali dan gunakan semula
6. **Pengendalian Ralat** - Sentiasa sediakan pengendali ralat sebelum memproses permintaan## Dokumentasi Berkaitan- ../Module/Module-System - Sistem modul dan kitaran hayat
- ../Template/Template-System - Penyepaduan enjin templat
- ../User/User-System - Pengesahan dan pengurusan pengguna
- ../Database/XoopsDatabase - Lapisan pangkalan data---

*Lihat juga: [XOOPS Sumber Kernel](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*