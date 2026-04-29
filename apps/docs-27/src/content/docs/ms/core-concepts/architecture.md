---
title: "XOOPS Seni Bina"
description: "Gambaran keseluruhan menyeluruh seni bina sistem XOOPS, termasuk komponen teras, kitaran hayat permintaan dan titik sambungan"
---
:::nota[Mengenai Dokumen Ini]
Halaman ini menerangkan **seni bina konseptual** XOOPS yang digunakan pada kedua-dua versi semasa (2.5.x) dan akan datang (4.0.x). Beberapa rajah menunjukkan visi reka bentuk berlapis.**Untuk butiran khusus versi:**
- **XOOPS 2.5.x Hari ini:** Menggunakan `mainfile.php`, global (`$xoopsDB`, `$xoopsUser`), pramuat dan corak pengendali
- **XOOPS 4.0 Sasaran:** PSR-15 middleware, bekas DI, penghala - lihat [Peta Jalan](../../07-XOOPS-4.0/XOOPS-4.0-Roadmap.md)
:::Dokumen ini memberikan gambaran menyeluruh tentang seni bina sistem XOOPS, menerangkan cara pelbagai komponen berfungsi bersama untuk mencipta sistem pengurusan kandungan yang fleksibel dan boleh dikembangkan.## Gambaran KeseluruhanXOOPS mengikut seni bina modular yang memisahkan kebimbangan kepada lapisan yang berbeza. Sistem ini dibina berdasarkan beberapa prinsip teras:- **Modulariti**: Kefungsian disusun menjadi modul bebas yang boleh dipasang
- **Kebolehlanjutan**: Sistem boleh dilanjutkan tanpa mengubah suai kod teras
- **Abstraksi**: Pangkalan data dan lapisan pembentangan disarikan daripada logik perniagaan
- **Keselamatan**: Mekanisme keselamatan terbina dalam melindungi daripada kelemahan biasa## Lapisan Sistem
```
mermaid
graph TB
    subgraph Presentation["🎨 Presentation Layer"]
        Themes["Themes"]
        Templates["Smarty Templates"]
        Blocks["Blocks"]
    end

    subgraph Application["⚙️ Application Layer"]
        Modules["Modules"]
        Preloads["Preloads"]
        Controllers["Controllers"]
        BlockHandlers["Block Handlers"]
    end

    subgraph Domain["📦 Domain Layer"]
        XoopsObject["XoopsObject"]
        Handlers["Object Handlers"]
        Criteria["Criteria System"]
    end

    subgraph Infrastructure["🔧 Infrastructure Layer"]
        Database["XoopsDatabase"]
        Cache["Cache System"]
        Session["Session Manager"]
        Security["Security Layer"]
    end

    Presentation --> Application
    Application --> Domain
    Domain --> Infrastructure

    style Presentation fill:#e8f5e9,stroke:#388e3c
    style Application fill:#e3f2fd,stroke:#1976d2
    style Domain fill:#fff3e0,stroke:#f57c00
    style Infrastructure fill:#fce4ec,stroke:#c2185b
```
### 1. Lapisan PersembahanLapisan pembentangan mengendalikan pemaparan antara muka pengguna menggunakan enjin templat Smarty.**Komponen Utama:**
- **Tema**: Penggayaan dan reka letak visual
- **Templat Smarty**: Penyampaian kandungan dinamik
- **Blok**: Widget kandungan boleh guna semula### 2. Lapisan AplikasiLapisan aplikasi mengandungi logik perniagaan, pengawal dan fungsi modul.**Komponen Utama:**
- **Modul**: Pakej kefungsian serba lengkap
- **Pengendali**: Kelas manipulasi data
- **Pramuat**: Pendengar acara dan cangkuk### 3. Lapisan DomainLapisan domain mengandungi objek dan peraturan perniagaan teras.**Komponen Utama:**
- **XoopsObject**: Kelas asas untuk semua objek domain
- **Pengendali**: Operasi CRUD untuk objek domain### 4. Lapisan InfrastrukturLapisan infrastruktur menyediakan perkhidmatan teras seperti akses pangkalan data dan caching.## Minta Kitaran HayatMemahami kitaran hayat permintaan adalah penting untuk pembangunan XOOPS yang berkesan.### XOOPS 2.5.x Aliran Pengawal HalamanXOOPS semasa 2.5.x menggunakan corak **Pengawal Halaman** di mana setiap fail PHP mengendalikan permintaannya sendiri. Globals (`$xoopsDB`, `$xoopsUser`, `$xoopsTpl`, dll.) dimulakan semasa bootstrap dan tersedia sepanjang pelaksanaan.
```
mermaid
sequenceDiagram
    participant Browser
    participant Entry as modules/mymod/index.php
    participant Main as mainfile.php
    participant Kernel as XOOPS Kernel
    participant DB as $xoopsDB
    participant User as $xoopsUser
    participant Handler as MyObjectHandler
    participant Tpl as $xoopsTpl (Smarty)
    participant Theme

    Browser->>Entry: GET /modules/mymod/index.php

    rect rgb(240, 248, 255)
        Note over Entry,User: Bootstrap Phase (mainfile.php)
        Entry->>Main: include mainfile.php
        Main->>Kernel: Initialize Core
        Kernel->>DB: Create XoopsDatabase (singleton)
        Kernel->>User: Load Session → $xoopsUser
        Kernel->>Tpl: Initialize Smarty → $xoopsTpl
        Main-->>Entry: Globals Ready
    end

    rect rgb(255, 250, 240)
        Note over Entry,Handler: Page Controller Execution
        Entry->>Handler: xoops_getModuleHandler('myobject')
        Handler->>DB: query via Criteria
        DB-->>Handler: Result Set
        Handler-->>Entry: XoopsObject[]
    end

    rect rgb(240, 255, 240)
        Note over Entry,Theme: Rendering Phase
        Entry->>Tpl: $xoopsTpl->assign('items', $objects)
        Entry->>Theme: include header.php
        Entry->>Tpl: $xoopsTpl->display('mymod_index.tpl')
        Entry->>Theme: include footer.php
        Theme-->>Browser: Complete HTML Page
    end
```
### Global Utama dalam 2.5.x| Global | Taip | Dimulakan | Tujuan |
|--------|------|--------------|---------|
| `$xoopsDB` | `XoopsDatabase` | Bootstrap | Sambungan pangkalan data (singleton) |
| `$xoopsUser` | `XoopsUser\|null` | Muatan sesi | Pengguna log masuk semasa |
| `$xoopsTpl` | `XoopsTpl` | Templat init | Enjin templat pintar |
| `$xoopsModule` | `XoopsModule` | Muatan modul | Konteks modul semasa |
| `$xoopsConfig` | `array` | Muatan konfigurasi | Konfigurasi sistem |:::nota[XOOPS 4.0 Perbandingan]
Dalam XOOPS 4.0, corak Pengawal Halaman digantikan dengan **PSR-15 Middleware Pipeline** dan penghantaran berasaskan penghala. Global digantikan dengan suntikan pergantungan. Lihat [Kontrak Mod Hibrid](../../07-XOOPS-4.0/Specifications/Hybrid-Mode-Contract.md) untuk jaminan keserasian semasa penghijrahan.
:::### 1. Fasa Bootstrap
```
php
// mainfile.php is the entry point
include_once XOOPS_ROOT_PATH . '/mainfile.php';

// Core initialization
$XOOPS = XOOPS::getInstance();
$XOOPS->boot();
```
**Langkah:**
1. Muatkan konfigurasi (`mainfile.php`)
2. Mulakan autoloader
3. Sediakan pengendalian ralat
4. Wujudkan sambungan pangkalan data
5. Muatkan sesi pengguna
6. Mulakan enjin templat Smarty### 2. Fasa Penghalaan
```
php
// Request routing to appropriate module
$module = $GLOBALS['xoopsModule'];
$controller = $module->getController();
$controller->dispatch($request);
```
**Langkah:**
1. Menghuraikan URL permintaan
2. Kenal pasti modul sasaran
3. Muatkan konfigurasi modul
4. Semak kebenaran
5. Laluan ke pengendali yang sesuai### 3. Fasa Perlaksanaan
```
php
// Controller execution
$data = $handler->getObjects($criteria);
$xoopsTpl->assign('items', $data);
```
**Langkah:**
1. Laksanakan logik pengawal
2. Berinteraksi dengan lapisan data
3. Memproses peraturan perniagaan
4. Sediakan data paparan### 4. Fasa Rendering
```
php
// Template rendering
include XOOPS_ROOT_PATH . '/header.php';
$xoopsTpl->display('db:module_template.tpl');
include XOOPS_ROOT_PATH . '/footer.php';
```
**Langkah:**
1. Gunakan reka letak tema
2. Templat modul render
3. Blok proses
4. Respons keluaran## Komponen Teras### XoopsObjectKelas asas untuk semua objek data dalam XOOPS.
```
php
<?php
class MyModuleItem extends XoopsObject
{
    public function __construct()
    {
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
    }
}
```
**Kaedah Utama:**
- `initVar()` - Tentukan sifat objek
- `getVar()` - Dapatkan semula nilai harta
- `setVar()` - Tetapkan nilai harta
- `assignVars()` - Tugasan pukal daripada tatasusunan### XoopsPersistableObjectHandlerMengendalikan operasi CRUD untuk kejadian XoopsObject.
```
php
<?php
class MyModuleItemHandler extends XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db)
    {
        parent::__construct($db, 'mymodule_items', 'MyModuleItem', 'id', 'title');
    }

    public function getActiveItems($limit = 10)
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```
**Kaedah Utama:**
- `create()` - Buat contoh objek baharu
- `get()` - Dapatkan semula objek melalui ID
- `insert()` - Simpan objek ke pangkalan data
- `delete()` - Alih keluar objek daripada pangkalan data
- `getObjects()` - Dapatkan berbilang objek
- `getCount()` - Kira objek yang sepadan### Struktur ModulSetiap modul XOOPS mengikut struktur direktori standard:
```
modules/mymodule/
├── class/                  # PHP classes
│   ├── MyModuleItem.php
│   └── MyModuleItemHandler.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── mymodule_index.tpl
│   └── mymodule_item.tpl
├── admin/                  # Admin area
│   ├── index.php
│   └── menu.php
├── language/               # Translations
│   └── english/
│       ├── main.php
│       └── modinfo.php
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
├── index.php               # Module entry
└── header.php              # Module header
```
## Bekas Suntikan KetergantunganPembangunan XOOPS moden boleh memanfaatkan suntikan pergantungan untuk kebolehujian yang lebih baik.### Pelaksanaan Kontena Asas
```
php
<?php
class XoopsDependencyContainer
{
    private array $services = [];

    public function register(string $name, callable $factory): void
    {
        $this->services[$name] = $factory;
    }

    public function resolve(string $name): mixed
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }

        $factory = $this->services[$name];

        if (is_callable($factory)) {
            return $factory($this);
        }

        return $factory;
    }

    public function has(string $name): bool
    {
        return isset($this->services[$name]);
    }
}
```
### Bekas Serasi PSR-11
```
php
<?php
namespace XMF\Di;

use Psr\Container\ContainerInterface;

class BasicContainer implements ContainerInterface
{
    protected array $definitions = [];

    public function set(string $id, mixed $value): void
    {
        $this->definitions[$id] = $value;
    }

    public function get(string $id): mixed
    {
        if (!$this->has($id)) {
            throw new \InvalidArgumentException("Service not found: $id");
        }

        $entry = $this->definitions[$id];

        if (is_callable($entry)) {
            return $entry($this);
        }

        return $entry;
    }

    public function has(string $id): bool
    {
        return isset($this->definitions[$id]);
    }
}
```
### Contoh Penggunaan
```
php
<?php
// Service registration
$container = new XoopsDependencyContainer();

$container->register('database', function () {
    return XoopsDatabaseFactory::getDatabaseConnection();
});

$container->register('userHandler', function ($c) {
    return new XoopsUserHandler($c->resolve('database'));
});

// Service resolution
$userHandler = $container->resolve('userHandler');
$user = $userHandler->get($userId);
```
## Mata SambunganXOOPS menyediakan beberapa mekanisme lanjutan:### 1. PramuatPramuat membenarkan modul menyambung ke acara teras.
```
php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreHeaderEnd($args)
    {
        // Execute when header processing ends
    }

    public static function eventCoreFooterStart($args)
    {
        // Execute when footer processing starts
    }
}
```
### 2. PemalamPemalam memanjangkan fungsi khusus dalam modul.
```
php
<?php
// modules/mymodule/plugins/notify.php
class MymoduleNotifyPlugin
{
    public function onItemCreate($item)
    {
        // Send notification when item is created
    }
}
```
### 3. PenapisPenapis mengubah suai data semasa ia melalui sistem.
```
php
<?php
// Content filter example
$myts = MyTextSanitizer::getInstance();
$content = $myts->displayTarea($rawContent, 1, 1, 1);
```
## Amalan Terbaik### Organisasi Kod1. **Gunakan ruang nama** untuk kod baharu:
   
```
php
   ruang nama XoopsModules\MyModule;Item kelas memanjangkan \XoopsObject
   {
       // Pelaksanaan
   }
   ```2. **Ikuti pemuatan auto PSR-4**:
   
```
json
   {
       "automuat": {
           "psr-4": {
               "XoopsModules\\MyModule\\": "class/"
           }
       }
   }
   ```3. **Kebimbangan berasingan**:
   - Logik domain dalam `class/`
   - Pembentangan dalam `templates/`
   - Pengawal dalam akar modul### Prestasi1. **Gunakan caching** untuk operasi yang mahal
2. **Malas memuat** sumber apabila boleh
3. **Minimumkan pertanyaan pangkalan data** menggunakan batching kriteria
4. **Optimumkan templat** dengan mengelakkan logik kompleks### Keselamatan1. **Sahkan semua input** menggunakan `XMF\Request`
2. **Escape output** dalam templat
3. **Gunakan pernyataan yang disediakan** untuk pertanyaan pangkalan data
4. **Semak kebenaran** sebelum operasi sensitif## Dokumentasi Berkaitan- [Corak Reka Bentuk](Design-Patterns.md) - Corak reka bentuk yang digunakan dalam XOOPS
- [Lapisan Pangkalan Data](../Database/Database-Layer.md) - Butiran abstraksi pangkalan data
- [Asas Pintar](../Templates/Smarty-Basics.md) - Dokumentasi sistem templat
- [Amalan Terbaik Keselamatan](../Security/Security-Best-Practices.md) - Garis panduan keselamatan---

#XOOPS #architecture #core #design #system-design