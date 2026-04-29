---
title: "Garis Panduan Menyumbang"
description: "Cara menyumbang kepada pembangunan, standard pengekodan dan garis panduan komuniti XOOPS CMS"
---
# 🤝 Menyumbang kepada XOOPS> Sertai komuniti XOOPS dan bantu menjadikannya CMS terbaik di dunia.---

## 📋 Gambaran keseluruhanXOOPS ialah projek sumber terbuka yang berkembang maju pada sumbangan komuniti. Sama ada anda membetulkan pepijat, menambah ciri, menambah baik dokumentasi atau membantu orang lain, sumbangan anda adalah berharga.---

## 🗂️ Kandungan Bahagian### Garis Panduan
- Tatakelakuan
- Aliran Kerja Sumbangan
- Garis Panduan Permintaan Tarik
- Pelaporan Isu### Gaya Kod
- Piawaian Pengekodan PHP
- Piawaian JavaScript
- Garis Panduan CSS
- Piawaian Templat Smarty### Keputusan Seni Bina
- Indeks ADR
- Templat ADR
- ADR-001: Seni Bina Modular
- ADR-002: Abstraksi Pangkalan Data---

## 🚀 Bermula### 1. Sediakan Persekitaran Pembangunan
```
bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```
### 2. Cipta Cawangan Ciri
```
bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. Buat PerubahanIkuti piawaian pengekodan dan tulis ujian untuk ciri baharu.### 4. Hantar Permintaan Tarik
```
bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
Kemudian buat Permintaan Tarik pada GitHub.---

## 📝 Piawaian Pengekodan### Piawaian PHPXOOPS mengikut piawaian pengekodan PSR-1, PSR-4 dan PSR-12.
```
php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XMF\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```
### Konvensyen Utama| Peraturan | Contoh |
|------|---------|
| Nama kelas | `PascalCase` |
| Nama kaedah | `camelCase` |
| Pemalar | `UPPER_SNAKE_CASE` |
| Pembolehubah | `$camelCase` |
| Fail | `ClassName.php` |
| Lekukan | 4 ruang |
| Panjang baris | Maks 120 aksara |### Templat Smarty
```
Smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$Smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```
---

## 🔀 Aliran Kerja Git### Penamaan Cawangan| Taip | Corak | Contoh |
|------|---------|---------|
| Ciri | `feature/description` | `feature/add-user-export` |
| Pembetulan pepijat | `fix/description` | `fix/login-validation` |
| Pembetulan terkini | `hotfix/description` | `hotfix/security-patch` |
| Keluarkan | `release/version` | `release/2.7.0` |### Komit MesejIkuti komitmen konvensional:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**Jenis:**
- `feat`: Ciri baharu
- `fix`: Pembetulan pepijat
- `docs`: Dokumentasi
- `style`: Gaya kod (pemformatan)
- `refactor`: Pemfaktoran semula kod
- `test`: Menambah ujian
- `chore`: Penyelenggaraan**Contoh:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```
```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```
---

## 🧪 Ujian### Menjalankan Ujian
```
bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### Ujian Penulisan
```
php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```
---

## 📋 Senarai Semak Permintaan TarikSebelum menghantar PR, pastikan:- [ ] Kod mengikut piawaian pengekodan XOOPS
- [ ] Semua ujian lulus
- [ ] Ciri baharu mempunyai ujian
- [ ] Dokumentasi dikemas kini jika perlu
- [ ] Tiada percanggahan gabungan dengan cawangan utama
- [ ] Mesej komit adalah deskriptif
- [ ] Penerangan PR menerangkan perubahan
- [ ] Isu berkaitan dipautkan---

## 🏗️ Rekod Keputusan Seni BinaADR mendokumenkan keputusan seni bina yang penting.### Templat ADR
```
markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```
### ADR semasa| ADR | Tajuk | Status |
|-----|-------|--------|
| ADR-001 | Seni Bina Modular | Diterima |
| ADR-002 | Akses Pangkalan Data Berorientasikan Objek | Diterima |
| ADR-003 | Enjin Templat Smarty | Diterima |
| ADR-004 | Reka Bentuk Sistem Keselamatan | Diterima |
| ADR-005 | PSR-15 Middleware (4.0.x) | Dicadangkan |---

## 🎖️ PengiktirafanPenyumbang diiktiraf melalui:- **Senarai Penyumbang** - Disenaraikan dalam repositori
- **Nota Keluaran** - Dikreditkan dalam keluaran
- **Dewan Kemasyhuran** - Penyumbang cemerlang
- **Pensijilan Modul** - Lencana kualiti untuk modul---

## 🔗 Dokumentasi Berkaitan- Pelan Jalan XOOPS 4.0
- Konsep Teras
- Pembangunan Modul---

## 📚 Sumber- [Repositori GitHub](https://github.com/XOOPS/XoopsCore27)
- [Penjejak Isu](https://github.com/XOOPS/XoopsCore27/issues)
- [Forum XOOPS](https://XOOPS.org/modules/newbb/)
- [Komuniti Discord](https://discord.gg/XOOPS)---

#XOOPS #contributing #open-source #community #development #coding-standard