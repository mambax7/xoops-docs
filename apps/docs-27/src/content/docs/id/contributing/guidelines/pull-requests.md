---
title: "Pedoman Permintaan Tarik"
description: "Pedoman untuk mengirimkan permintaan penarikan ke proyek XOOPS"
---

Dokumen ini memberikan pedoman komprehensif untuk mengirimkan permintaan penarikan ke proyek XOOPS. Mengikuti pedoman ini memastikan peninjauan kode lancar dan waktu penggabungan lebih cepat.

## Sebelum Membuat Pull Request

### Langkah 1: Periksa Masalah yang Ada

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

### Langkah 2: Fork dan Kloning Repositori

```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```

### Langkah 3: Buat Cabang Fitur

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Langkah 4: Lakukan Perubahan

```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Komit Standar Pesan

### Pesan Komit yang Baik

Gunakan pesan yang jelas dan deskriptif dengan mengikuti pola berikut:

```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### Kategori Jenis Komit

| Ketik | Deskripsi | Contoh |
|------|-------------|---------|
| `feat` | Fitur baru | `feat: add user dashboard widget` |
| `fix` | Perbaikan bug | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentasi | `docs: update API reference` |
| `style` | Gaya kode (tidak ada perubahan logika) | `style: format imports` |
| `refactor` | Pemfaktoran ulang kode | `refactor: simplify service layer` |
| `perf` | Peningkatan kinerja | `perf: optimize database queries` |
| `test` | Perubahan pengujian | `test: add integration tests` |
| `chore` | Build/tooling berubah | `chore: update dependencies` |

## Deskripsi Permintaan Tarik

### template PR

```markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```

## Persyaratan Kualitas Kode

### Gaya Kode

Ikuti pedoman Gaya Kode:

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## Persyaratan Pengujian

### Pengujian Satuan

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### Menjalankan Tes

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Bekerja dengan Cabang

### Terus Perbarui Cabang

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```

## Membuat Permintaan Tarik

### Format Judul PR

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Proses Peninjauan Kode

### Yang Dicari Peninjau

1. **Kebenaran**
   - Apakah kode tersebut menyelesaikan masalah yang disebutkan?
   - Apakah kasus-kasus edge ditangani?
   - Apakah penanganan kesalahan sudah tepat?

2. **Kualitas**
   - Apakah mengikuti standar pengkodean?
   - Apakah bisa dipelihara?
   - Apakah sudah teruji dengan baik?

3. **Kinerja**
   - Adakah regresi kinerja?
   - Apakah kueri dioptimalkan?
   - Apakah penggunaan memori masuk akal?

4. **Keamanan**
   - Validasi masukan?
   - Pencegahan injeksi SQL?
   -Authentication/authorization?

### Menanggapi Masukan

```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```

## Masalah dan Solusi Umum PR

### Edisi 1: PR Terlalu Besar

**Masalah:** Peninjau tidak dapat meninjau PR dalam jumlah besar secara efektif

**Solusi:** Bagi menjadi PR yang lebih kecil
- PR Pertama: Perubahan core
- PR Kedua: Tes
- PR Ketiga: Dokumentasi

### Edisi 2: Tidak Termasuk Tes

**Masalah:** Peninjau tidak dapat memverifikasi fungsionalitas

**Solusi:** Tambahkan tes komprehensif sebelum mengirimkan

### Edisi 3: Konflik dengan Utama

**Masalah:** Cabang Anda tidak sinkron dengan main

**Solusi:** Rebase pada main terbaru

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Setelah Penggabungan

### Pembersihan

```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## Ringkasan Praktik Terbaik

### Yang harus dilakukan

- Buat pesan komit deskriptif
- Buatlah PR yang terfokus dan mempunyai tujuan tunggal
- Sertakan tes untuk fungsionalitas baru
- Perbarui dokumentasi
- Masalah terkait referensi
- Jaga agar deskripsi PR tetap jelas
- Segera tanggapi ulasan

### Larangan

- Sertakan perubahan yang tidak terkait
- Gabungkan main ke cabang Anda (gunakan rebase)
- Paksa dorongan setelah peninjauan dimulai
- Lewati tes
- Kirim pekerjaan yang sedang berlangsung
- Abaikan umpan balik peninjauan kode

## Dokumentasi Terkait

- ../Berkontribusi - Berkontribusi ikhtisar
- Gaya Kode - Pedoman gaya kode
- ../../03-Module-Development/Best-Practices/Testing - Menguji praktik terbaik
- ../Architecture-Decisions/ADR-Index - Pedoman arsitektur

## Sumber Daya

- [Dokumentasi Git](https://git-scm.com/doc)
- [Bantuan Permintaan Tarik GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Komitmen Konvensional](https://www.conventionalcommits.org/)
- [Organisasi GitHub XOOPS](https://github.com/XOOPS)

---

**Terakhir Diperbarui:** 31-01-2026
**Berlaku Untuk:** Semua proyek XOOPS
**Repositori:** https://github.com/XOOPS/XOOPS
