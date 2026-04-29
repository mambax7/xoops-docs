---
title: "Garis Panduan Permintaan Tarik"
description: "Garis panduan untuk menyerahkan permintaan tarik kepada projek XOOPS"
---
Dokumen ini menyediakan garis panduan komprehensif untuk menyerahkan permintaan tarik kepada projek XOOPS. Mengikuti garis panduan ini memastikan semakan kod yang lancar dan masa penggabungan yang lebih cepat.## Sebelum Membuat Permintaan Tarik### Langkah 1: Semak Isu Sedia Ada
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### Langkah 2: Garpu dan Klon Repositori
```
bash
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
### Langkah 3: Buat Cawangan Ciri
```
bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```
### Langkah 4: Buat Perubahan Anda
```
bash
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
## Standard Mesej Komit### Mesej Komit yang BaikGunakan mesej yang jelas dan deskriptif mengikut corak ini:
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
### Kategori Jenis Komit| Taip | Penerangan | Contoh |
|------|-------------|---------|
| `feat` | Ciri baharu | `feat: add user dashboard widget` |
| `fix` | Pembetulan pepijat | `fix: resolve cache invalidation bug` |
| `docs` | Dokumentasi | `docs: update API reference` |
| `style` | Gaya kod (tiada perubahan logik) | `style: format imports` |
| `refactor` | Pemfaktoran semula kod | `refactor: simplify service layer` |
| `perf` | Peningkatan prestasi | `perf: optimize database queries` |
| `test` | Perubahan ujian | `test: add integration tests` |
| `chore` | Build/tooling perubahan | `chore: update dependencies` |## Perihalan Permintaan Tarik### Templat PR
```
markdown
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
## Keperluan Kualiti Kod### Gaya KodIkuti garis panduan Gaya Kod:
```
php
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
## Keperluan Ujian### Ujian Unit
```
php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use XOOPS\Database\XoopsDatabase;

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
### Menjalankan Ujian
```
bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## Bekerja dengan Cawangan### Pastikan Cawangan Kemas Kini
```
bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```
## Mencipta Permintaan Tarik### Format Tajuk PR
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## Proses Semakan Kod### Perkara Yang Dicari Pengulas1. **Ketepatan**
   - Adakah kod menyelesaikan masalah yang dinyatakan?
   - Adakah kes tepi dikendalikan?
   - Adakah pengendalian ralat sesuai?2. **Kualiti**
   - Adakah ia mengikut piawaian pengekodan?
   - Adakah ia boleh dikekalkan?
   - Adakah ia diuji dengan baik?3. **Prestasi**
   - Sebarang regresi prestasi?
   - Adakah pertanyaan dioptimumkan?
   - Adakah penggunaan memori munasabah?4. **Keselamatan**
   - Pengesahan input?
   - Pencegahan suntikan SQL?
   - Authentication/authorization?### Menjawab Maklum Balas
```
bash
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
## Isu dan Penyelesaian PR Biasa### Isu 1: PR Terlalu Besar**Masalah:** Pengulas tidak boleh menyemak PR besar-besaran dengan berkesan**Penyelesaian:** Pecah kepada PR yang lebih kecil
- PR Pertama: Perubahan teras
- PR Kedua: Ujian
- PR Ketiga: Dokumentasi### Isu 2: Tiada Ujian Termasuk**Masalah:** Pengulas tidak dapat mengesahkan kefungsian**Penyelesaian:** Tambah ujian komprehensif sebelum menyerahkan### Isu 3: Konflik dengan Utama**Masalah:** Cawangan anda tidak segerak dengan utama**Penyelesaian:** Asas semula pada utama terkini
```
bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## Selepas Gabung### Pembersihan
```
bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```
## Ringkasan Amalan Terbaik### Lakukan- Buat mesej komit deskriptif
- Buat PR satu tujuan yang fokus
- Sertakan ujian untuk fungsi baharu
- Kemas kini dokumentasi
- Isu berkaitan rujukan
- Pastikan penerangan PR jelas
- Balas ulasan dengan segera### Tidak boleh- Sertakan perubahan yang tidak berkaitan
- Gabung utama ke cawangan anda (gunakan rebase)
- Tolak paksa selepas semakan bermula
- Langkau ujian
- Hantar kerja yang sedang dijalankan
- Abaikan maklum balas semakan kod## Dokumentasi Berkaitan- ../Contributing - Gambaran keseluruhan menyumbang
- Gaya Kod - Garis panduan gaya kod
- ../../03-Module-Development/Best-Practices/Testing - Menguji amalan terbaik
- ../Architecture-Decisions/ADR-Index - Garis panduan seni bina## Sumber- [Dokumentasi Git](https://git-scm.com/doc)
- [Bantuan Permintaan Tarik GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Komitmen Konvensional](https://www.conventionalcommits.org/)
- [XOOPS Organisasi GitHub](https://github.com/XOOPS)---

**Terakhir Dikemaskini:** 2026-01-31
**Terpakai Kepada:** Semua projek XOOPS
**Repositori:** https://github.com/XOOPS/XOOPS