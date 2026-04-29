---
title: "Çekme Talebi Yönergeleri"
description: "XOOPS projelerine çekme istekleri gönderme yönergeleri"
---
Bu belge, XOOPS projelerine çekme isteklerinin gönderilmesine ilişkin kapsamlı yönergeler sağlar. Bu yönergelere uyulması, kod incelemelerinin sorunsuz olmasını ve birleştirme sürelerinin daha hızlı olmasını sağlar.

## Çekme İsteği Oluşturmadan Önce

### 1. Adım: Mevcut Sorunları Kontrol Edin
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### Adım 2: Depoyu Çatallayın ve Klonlayın
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
### Adım 3: Özellik Dalı Oluşturun
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
### 4. Adım: Değişikliklerinizi Yapın
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
## Mesaj Standartlarını Taahhüt Et

### İyi Taahhüt Mesajları

Aşağıdaki kalıpları takip eden net, açıklayıcı mesajlar kullanın:
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
### Taahhüt Türü Kategorileri

| Tür | Açıklama | Örnek |
|------|-------------|--------|
| `feat` | Yeni özellik | `feat: add user dashboard widget` |
| `fix` | Hata düzeltme | `fix: resolve cache invalidation bug` |
| `docs` | Dokümantasyon | `docs: update API reference` |
| `style` | Kod stili (mantık değişikliği yok) | `style: format imports` |
| `refactor` | Kodu yeniden düzenleme | `refactor: simplify service layer` |
| `perf` | Performans iyileştirme | `perf: optimize database queries` |
| `test` | Değişiklikleri test edin | `test: add integration tests` |
| `chore` | Build/tooling değişiklikler | `chore: update dependencies` |

## Çekme İsteği Açıklaması

### Halkla İlişkiler Şablonu
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
## Kod Kalitesi Gereksinimleri

### Kod Stili

Kod Stili yönergelerini izleyin:
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
## Test Gereksinimleri

### Birim Testleri
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
### Testleri Çalıştırma
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## Şubelerle Çalışmak

### Şubeyi Güncel Tutun
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
## Çekme İsteğini Oluşturma

### PR Başlık Formatı
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## Kod İnceleme Süreci

### İncelemecilerin Aradığı Şeyler

1. **Doğruluk**
   - Kod belirtilen sorunu çözüyor mu?
   - Son vakalar ele alınıyor mu?
   - Hata işleme uygun mu?

2. **Kalite**
   - Kodlama standartlarına uyuyor mu?
   - Bakımı yapılabilir mi?
   - İyice test edilmiş mi?

3. **Performans**
   - Herhangi bir performans gerilemesi var mı?
   - Sorgular optimize edildi mi?
   - Bellek kullanımı makul mü?

4. **Güvenlik**
   - Giriş doğrulaması mı?
   - SQL enjeksiyonun önlenmesi?
   - Authentication/authorization?

### Geri Bildirime Yanıt Verme
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
## Yaygın Halkla İlişkiler Sorunları ve Çözümleri

### Sayı 1: Halkla İlişkiler Çok Büyük

**Sorun:** İncelemeciler büyük PR'ları etkili bir şekilde inceleyemiyor

**Çözüm:** Daha küçük PR'lere bölün
- İlk PR: Temel değişiklikler
- İkinci Halkla İlişkiler: Testler
- Üçüncü Halkla İlişkiler: Dokümantasyon

### Sayı 2: Test Dahil Değil

**Sorun:** İncelemeciler işlevselliği doğrulayamıyor

**Çözüm:** Göndermeden önce kapsamlı testler ekleyin

### Sayı 3: Ana ile Çatışmalar

**Sorun:** Şubeniz ana şubeyle senkronize değil

**Çözüm:** En son ana temele göre yeniden temel alın
```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## Birleştirmeden Sonra

### Temizleme
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
## En İyi Uygulamaların Özeti

### Yapılacaklar

- Açıklayıcı taahhüt mesajları oluşturun
- Odaklanmış, tek amaçlı halkla ilişkiler çalışmaları yapın
- Yeni işlevlere yönelik testleri dahil edin
- Belgeleri güncelleyin
- Referansla ilgili sorunlar
- PR açıklamalarını net tutun
- İncelemelere hemen yanıt verin

### Yapılmaması Gerekenler

- İlgisiz değişiklikleri dahil et
- Ana şubenizi şubenizle birleştirin (rebase kullanın)
- İnceleme başladıktan sonra zorlamaya zorla
- Testleri atla
- Devam eden çalışmayı gönderin
- Kod inceleme geri bildirimlerini dikkate almayın

## İlgili Belgeler

- ../Contributing - Katkıda bulunanlara genel bakış
- Kod Stili - Kod stili yönergeleri
- ../../03-Module-Development/Best-Practices/Testing - En iyi uygulamaları test etme
- ../Architecture-Decisions/ADR-Index - Mimari yönergeler

## Kaynaklar

- [Git Belgeleri](https://git-scm.com/doc)
- [GitHub Çekme İsteği Yardımı](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Geleneksel Taahhütler](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organizasyonu](https://github.com/XOOPS)

---

**Son Güncelleme:** 2026-01-31
**Geçerli olduğu yerler:** Tüm XOOPS projeleri
**Depo:** https://github.com/XOOPS/XOOPS