---
title: "Rujukan API XOOPS"
description: "Dokumentasi API komprehensif untuk kelas teras CMS XOOPS, lapisan pangkalan data, borang dan modul"
---
Selamat datang ke dokumentasi Rujukan API XOOPS yang komprehensif. Bahagian ini menyediakan dokumentasi terperinci untuk semua kelas teras, kaedah dan sistem yang membentuk Sistem Pengurusan Kandungan XOOPS.## Gambaran KeseluruhanAPI XOOPS disusun ke dalam beberapa subsistem utama, masing-masing bertanggungjawab untuk aspek tertentu kefungsian CMS. Memahami API ini adalah penting untuk membangunkan modul, tema dan sambungan untuk XOOPS.## Bahagian API### Kelas TerasKelas asas yang dibina oleh semua komponen XOOPS yang lain.| Dokumentasi | Penerangan |
|--------------|-------------|
| XoopsObject | Kelas asas untuk semua objek data dalam XOOPS |
| XoopsObjectHandler | Corak pengendali untuk operasi CRUD |### Lapisan Pangkalan DataUtiliti abstraksi pangkalan data dan pembinaan pertanyaan.| Dokumentasi | Penerangan |
|--------------|-------------|
| XoopsDatabase | Lapisan abstraksi pangkalan data |
| Sistem Kriteria | Kriteria dan syarat pertanyaan |
| QueryBuilder | Bangunan pertanyaan fasih moden |### Sistem BorangHTML penjanaan borang dan pengesahan.| Dokumentasi | Penerangan |
|--------------|-------------|
| XoopsForm | Bentuk bekas dan pemaparan |
| Elemen Borang | Semua jenis unsur bentuk tersedia |### Kelas KernelKomponen dan perkhidmatan sistem teras.| Dokumentasi | Penerangan |
|--------------|-------------|
| Kelas Kernel | Inti sistem dan komponen teras |### Sistem ModulPengurusan modul dan kitaran hayat.| Dokumentasi | Penerangan |
|--------------|-------------|
| Sistem Modul | Pemuatan modul, pemasangan dan pengurusan |### Sistem TemplatPenyepaduan templat pintar.| Dokumentasi | Penerangan |
|--------------|-------------|
| Sistem Templat | Integrasi pintar dan pengurusan templat |### Sistem PenggunaPengurusan dan pengesahan pengguna.| Dokumentasi | Penerangan |
|--------------|-------------|
| Sistem Pengguna | Akaun pengguna, kumpulan dan kebenaran |## Gambaran Keseluruhan Seni Bina
```
mermaid
flowchart TB
    subgraph "Foundation Layer"
        XO[XoopsObject<br/>Base Class]
        XD[XoopsDatabase<br/>DB Abstraction]
        XF[XoopsForm<br/>Form Generation]
    end

    subgraph "Handler Layer"
        XOH[XoopsObjectHandler<br/>CRUD Operations]
        CR[Criteria<br/>Query Building]
        XFE[XoopsFormElement<br/>Input Types]
    end

    subgraph "Module Layer"
        XM[XoopsModule<br/>Module Management]
    end

    subgraph "Presentation Layer"
        XT[XoopsTpl<br/>Template Engine]
    end

    XO --> XOH
    XD --> CR
    XF --> XFE
    XOH --> XM
    CR --> XM
    XFE --> XM
    XM --> XT
```
## Hierarki Kelas### Model Objek
```
mermaid
classDiagram
    class XoopsObject {
        <<Base>>
        +getVar()
        +setVar()
        +toArray()
    }
    XoopsObject <|-- XoopsUser
    XoopsObject <|-- XoopsGroup
    XoopsObject <|-- XoopsModule
    XoopsObject <|-- XoopsBlock
    XoopsObject <|-- XoopsComment
    XoopsObject <|-- XoopsNotification
```
### Model Pengendali
```
mermaid
classDiagram
    class XoopsObjectHandler {
        <<Base>>
        +create()
        +get()
        +insert()
        +delete()
    }
    class XoopsPersistableObjectHandler {
        +getObjects()
        +getCount()
        +deleteAll()
    }
    XoopsObjectHandler <|-- XoopsPersistableObjectHandler
    XoopsPersistableObjectHandler <|-- XoopsUserHandler
    XoopsPersistableObjectHandler <|-- XoopsGroupHandler
    XoopsPersistableObjectHandler <|-- XoopsModuleHandler
    XoopsPersistableObjectHandler <|-- XoopsBlockHandler
    XoopsObjectHandler <|-- CustomModuleHandlers
```
### Model Borang
```
mermaid
classDiagram
    class XoopsForm {
        <<Base>>
        +addElement()
        +render()
        +display()
    }
    XoopsForm <|-- XoopsThemeForm
    XoopsForm <|-- XoopsSimpleForm

    class XoopsFormElement {
        <<Base>>
        +getName()
        +render()
        +getValue()
    }
    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormEditor
```
## Corak RekaanAPI XOOPS melaksanakan beberapa corak reka bentuk yang terkenal:### Corak Singleton
Digunakan untuk perkhidmatan global seperti sambungan pangkalan data dan contoh kontena.
```
php
$db = XoopsDatabase::getInstance();
$container = XoopsContainer::getInstance();
```
### Corak Kilang
Pengendali objek mencipta objek domain secara konsisten.
```
php
$handler = xoops_getHandler('user');
$user = $handler->create();
```
### Corak Komposit
Borang mengandungi pelbagai elemen bentuk; kriteria boleh mengandungi kriteria bersarang.
```
php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new CriteriaCompo(...)); // Nested
```
### Corak Pemerhati
Sistem acara membenarkan gandingan longgar antara modul.
```
php
$dispatcher->addListener('module.news.article_published', $callback);
```
## Contoh Mula Pantas### Mencipta dan Menyimpan Objek
```
php
// Get the handler
$handler = xoops_getHandler('user');

// Create a new object
$user = $handler->create();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'user@example.com');

// Save to database
$handler->insert($user);
```
### Bertanya dengan Kriteria
```
php
// Build criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('level', 0, '>'));
$criteria->setSort('uname');
$criteria->setOrder('ASC');
$criteria->setLimit(10);

// Get objects
$handler = xoops_getHandler('user');
$users = $handler->getObjects($criteria);
```
### Mencipta Borang
```
php
$form = new XoopsThemeForm('User Profile', 'userform', 'save.php', 'post', true);
$form->addElement(new XoopsFormText('Username', 'uname', 50, 255, $user->getVar('uname')));
$form->addElement(new XoopsFormTextArea('Bio', 'bio', $user->getVar('bio')));
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
echo $form->render();
```
## Konvensyen API### Konvensyen Penamaan| Taip | Konvensyen | Contoh |
|------|-----------|---------|
| Kelas | PascalCase | `XoopsUser`, `CriteriaCompo` |
| Kaedah | sarung unta | `getVar()`, `setVar()` |
| Hartanah | sarung unta (dilindungi) | `$_vars`, `$_handler` |
| Pemalar | UPPER_SNAKE_CASE | `XOBJ_DTYPE_INT` |
| Jadual Pangkalan Data | kes_ular | `users`, `groups_users_link` |### Jenis DataXOOPS mentakrifkan jenis data standard untuk pembolehubah objek:| Malar | Taip | Penerangan |
|----------|------|-------------|
| `XOBJ_DTYPE_TXTBOX` | Rentetan | Input teks (disanatkan) |
| `XOBJ_DTYPE_TXTAREA` | Rentetan | Kandungan Textarea |
| `XOBJ_DTYPE_INT` | Integer | Nilai angka |
| `XOBJ_DTYPE_URL` | Rentetan | Pengesahan URL |
| `XOBJ_DTYPE_EMAIL` | Rentetan | Pengesahan e-mel |
| `XOBJ_DTYPE_ARRAY` | Susunan | Tatasusunan bersiri |
| `XOBJ_DTYPE_OTHER` | Bercampur | Pengendalian tersuai |
| `XOBJ_DTYPE_SOURCE` | Rentetan | Kod sumber (pembersihan minimum) |
| `XOBJ_DTYPE_STIME` | Integer | Cap masa pendek |
| `XOBJ_DTYPE_MTIME` | Integer | Cap masa sederhana |
| `XOBJ_DTYPE_LTIME` | Integer | Cap masa panjang |## Kaedah PengesahanAPI menyokong pelbagai kaedah pengesahan:### Pengesahan Kunci API
```
X-API-Key: your-api-key
```
### Token Pembawa OAuth
```
Authorization: Bearer your-oauth-token
```
### Pengesahan Berasaskan Sesi
Menggunakan sesi XOOPS sedia ada apabila log masuk.## Titik Tamat API RESTApabila API REST didayakan:| Titik akhir | Kaedah | Penerangan |
|----------|--------|-------------|
| `/api.php/rest/users` | DAPATKAN | Senaraikan pengguna |
| `/api.php/rest/users/{id}` | DAPATKAN | Dapatkan pengguna melalui ID |
| `/api.php/rest/users` | POST | Cipta pengguna |
| `/api.php/rest/users/{id}` | LETAK | Kemas kini pengguna |
| `/api.php/rest/users/{id}` | DELETE | Padam pengguna |
| `/api.php/rest/modules` | DAPATKAN | Senaraikan modul |## Dokumentasi Berkaitan- Panduan Pembangunan Modul
- Panduan Pembangunan Tema
- Konfigurasi Sistem
- Amalan Terbaik Keselamatan## Sejarah Versi| Versi | Perubahan |
|---------|---------|
| 2.5.11 | Keluaran stabil semasa |
| 2.5.10 | Menambah sokongan API GraphQL |
| 2.5.9 | Sistem Kriteria Dipertingkat |
| 2.5.8 | Sokongan pemuatan auto PSR-4 |---

*Dokumentasi ini adalah sebahagian daripada Pangkalan Pengetahuan XOOPS. Untuk kemas kini terkini, lawati [repositori XOOPS GitHub](https://github.com/XOOPS).*