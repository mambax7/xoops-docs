---
title: "Pedoman Berkontribusi"
description: "Cara berkontribusi pada pengembangan CMS XOOPS, standar pengkodean, dan pedoman komunitas"
---

# 🤝 Berkontribusi pada XOOPS

> Bergabunglah dengan komunitas XOOPS dan bantu menjadikannya CMS terbaik di dunia.

---

## 📋 Ikhtisar

XOOPS adalah proyek sumber terbuka yang berkembang berkat kontribusi komunitas. Baik Anda memperbaiki bug, menambahkan fitur, menyempurnakan dokumentasi, atau membantu orang lain, kontribusi Anda sangat berharga.

---

## 🗂️ Bagian Isi

### Pedoman
- Kode Etik
- Alur Kerja Kontribusi
- Pedoman Permintaan Tarik
- Pelaporan Masalah

### Gaya Kode
- Standar Pengkodean PHP
- Standar JavaScript
- Pedoman CSS
- Standar template Smarty

### Keputusan Arsitektur
- Indeks ADR
- template ADR
- ADR-001: Arsitektur Modular
- ADR-002: Abstraksi Basis Data

---

## 🚀 Memulai

### 1. Menyiapkan Lingkungan Pengembangan

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```

### 2. Buat Cabang Fitur

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Lakukan Perubahan

Ikuti standar pengkodean dan tulis tes untuk fitur baru.

### 4. Kirim Permintaan Tarik

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Kemudian buat Permintaan Tarik di GitHub.

---

## 📝 Standar Pengkodean

### Standar PHP

XOOPS mengikuti standar pengkodean PSR-1, PSR-4, dan PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
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

### Konvensi Utama

| Aturan | Contoh |
|------|---------|
| Nama kelas | `PascalCase` |
| Nama metode | `camelCase` |
| Konstanta | `UPPER_SNAKE_CASE` |
| Variabel | `$camelCase` |
| File | `ClassName.php` |
| Indentasi | 4 spasi |
| Panjang garis | Maks 120 karakter |

### template Smarty

```smarty
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
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Alur Kerja Git

### Penamaan Cabang

| Ketik | Pola | Contoh |
|------|---------|---------|
| Fitur | `feature/description` | `feature/add-user-export` |
| Perbaikan bug | `fix/description` | `fix/login-validation` |
| Perbaikan terbaru | `hotfix/description` | `hotfix/security-patch` |
| Rilis | `release/version` | `release/2.7.0` |

### Komit Pesan

Ikuti komitmen konvensional:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Jenis:**
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Dokumentasi
- `style`: Gaya kode (pemformatan)
- `refactor`: Pemfaktoran ulang kode
- `test`: Menambahkan tes
- `chore`: Pemeliharaan

**Contoh:**
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

## 🧪 Pengujian

### Menjalankan Tes

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Tes Menulis

```php
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

## 📋 Daftar Periksa Permintaan Tarik

Sebelum mengirimkan PR, pastikan:

- [ ] Kode mengikuti standar pengkodean XOOPS
- [ ] Semua tes lulus
- [ ] Fitur baru ada pengujiannya
- [ ] Dokumentasi diperbarui jika diperlukan
- [ ] Tidak ada konflik penggabungan dengan cabang utama
- [ ] Pesan penerapan bersifat deskriptif
- [ ] Deskripsi PR menjelaskan perubahan
- [ ] Masalah terkait ditautkan

---

## 🏗️ Catatan Keputusan Arsitektur

ADR mendokumentasikan keputusan arsitektur yang signifikan.

### template ADR

```markdown
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

### ADR saat ini

| ADR | Judul | Status |
|-----|-------|--------|
| ADR-001 | Arsitektur Modular | Diterima |
| ADR-002 | Akses Database Berorientasi Objek | Diterima |
| ADR-003 | Mesin template Smarty | Diterima |
| ADR-004 | Desain Sistem Keamanan | Diterima |
| ADR-005 | PSR-15 Middleware (4.0.x) | Diusulkan |

---

## 🎖️ Pengakuan

Kontributor diakui melalui:

- **Daftar Kontributor** - Terdaftar di repositori
- **Catatan Rilis** - Dikreditkan dalam rilis
- **Hall of Fame** - Kontributor luar biasa
- **Sertifikasi module** - Lencana kualitas untuk module

---

## 🔗 Dokumentasi Terkait

- Peta Jalan XOOPS 4.0
- Konsep core
- Pengembangan module

---

## 📚 Sumber Daya

- [Repositori GitHub](https://github.com/XOOPS/XoopsCore27)
- [Pelacak Masalah](https://github.com/XOOPS/XoopsCore27/issues)
- [Forum XOOPS](https://xoops.org/modules/newbb/)
- [Komunitas Perselisihan](https://discord.gg/xoops)

---

#xoops #kontribusi #sumber terbuka #komunitas #pengembangan #standar pengkodean
