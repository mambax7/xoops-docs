---
title: "Katkıda Bulunma Kuralları"
description: "XOOPS CMS geliştirme, kodlama standartları ve topluluk kurallarına nasıl katkıda bulunabilirsiniz?"
---
# 🤝 XOOPS'ye katkıda bulunuyorum

> XOOPS topluluğuna katılın ve onun dünyadaki en iyi CMS olmasına yardımcı olun.

---

## 📋 Genel Bakış

XOOPS, topluluğun katkılarıyla gelişen açık kaynaklı bir projedir. Hataları düzeltiyor, özellikler ekliyor, belgeleri geliştiriyor veya başkalarına yardım ediyor olun, katkılarınız değerlidir.

---

## 🗂️ Bölüm İçeriği

### Yönergeler
- Davranış Kuralları
- Katkı İş Akışı
- Çekme Talebi Yönergeleri
- Sorun Raporlama

### Kod Stili
- PHP Kodlama Standartları
- JavaScript Standartlar
- CSS Yönergeler
- Smarty template Standartları

### Mimari Kararlar
- ADR Dizin
- ADR template
- ADR-001: Modüler Mimari
- ADR-002: database Soyutlaması

---

## 🚀 Başlarken

### 1. Geliştirme Ortamını Kurun
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
### 2. Özellik Dalı Oluşturun
```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. Değişiklik Yapın

Kodlama standartlarını takip edin ve yeni özellikler için testler yazın.

### 4. Çekme İsteğini Gönderin
```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
Ardından GitHub'da bir Çekme İsteği oluşturun.

---

## 📝 Kodlama Standartları

### PHP Standartlar

XOOPS, PSR-1, PSR-4 ve PSR-12 kodlama standartlarına uygundur.
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
### Temel Kurallar

| Kural | Örnek |
|------|------------|
| Sınıf adları | `PascalCase` |
| Yöntem adları | `camelCase` |
| Sabitler | `UPPER_SNAKE_CASE` |
| Değişkenler | `$camelCase` |
| Dosyalar | `ClassName.php` |
| Girinti | 4 alan |
| Hat uzunluğu | Maksimum 120 karakter |

### Smarty templates
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

## 🔀 Git İş Akışı

### Şube Adlandırma

| Tür | Desen | Örnek |
|------|---------|--------|
| Özellik | `feature/description` | `feature/add-user-export` |
| Hata düzeltme | `fix/description` | `fix/login-validation` |
| Düzeltme | `hotfix/description` | `hotfix/security-patch` |
| Sürüm | `release/version` | `release/2.7.0` |

### Mesajları Kaydet

Geleneksel taahhütleri takip edin:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**Türler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Belgeler
- `style`: Kod stili (biçimlendirme)
- `refactor`: Kodun yeniden düzenlenmesi
- `test`: Test ekleme
- `chore`: Bakım

**Örnekler:**
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

## 🧪 Test ediliyor

### Testleri Çalıştırma
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### Yazma Testleri
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

## 📋 Çekme İsteği Kontrol Listesi

PR göndermeden önce aşağıdakilerden emin olun:

- [ ] Kod XOOPS kodlama standartlarına uygundur
- [ ] Tüm testler başarıyla geçti
- [ ] Yeni özelliklerin testleri var
- [ ] Gerekirse belgeler güncellenir
- [ ] Ana şubeyle birleştirme çakışması yok
- [ ] Commit mesajları açıklayıcıdır
- [ ] Halkla İlişkiler açıklaması değişiklikleri açıklıyor
- [ ] İlgili konular bağlantılıdır

---

## 🏗️Mimarlık Karar Kayıtları

ADR'ler önemli mimari kararları belgelemektedir.

### ADR template
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
### Mevcut ADR'ler

| ADR | Başlık | Durum |
|-----|-------|-----------|
| ADR-001 | Modüler Mimari | Kabul edildi |
| ADR-002 | Nesneye Yönelik database Erişimi | Kabul edildi |
| ADR-003 | Smarty template Motoru | Kabul edildi |
| ADR-004 | Güvenlik Sistemi Tasarımı | Kabul edildi |
| ADR-005 | PSR-15 Ara yazılım (4.0.x) | Önerilen |

---

## 🎖️Tanınma

Katkıda bulunanlar aşağıdakiler aracılığıyla tanınır:

- **Katkıda Bulunanlar Listesi** - Depoda listelenmiştir
- **Sürüm Notları** - Sürümlere dahil edildi
- **Şeref Listesi** - Üstün katkıda bulunanlar
- **module Sertifikasyonu** - modules için kalite rozeti

---

## 🔗 İlgili Belgeler

- XOOPS 4.0 Yol Haritası
- Temel Kavramlar
- module Geliştirme

---

## 📚 Kaynaklar

- [GitHub Deposu](https://github.com/XOOPS/XoopsCore27)
- [Sorun Takibi](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS Forumlar](https://xoops.org/modules/newbb/)
- [Discord Topluluğu](https://discord.gg/xoops)

---

#xoops #katkıda bulunma #açık kaynak #topluluk #geliştirme #kodlama standartları