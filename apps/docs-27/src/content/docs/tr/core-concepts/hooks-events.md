---
title: "hooks ve Etkinlikler"
---
## Genel Bakış

XOOPS, modüllerin temel işlevlerle ve birbirleriyle doğrudan bağımlılık olmadan etkileşime girmesine olanak tanıyan uzantı noktaları olarak hooks ve events sağlar.

## hooks ve Etkinlikler

| Görünüş | hooks | Etkinlikler |
|----------|----------|--------|
| Amaç | Değiştir behavior/data | Olaylara tepki verin |
| Geri Dön | Değiştirilen verileri döndürebilir | Genellikle geçersiz |
| Zamanlama | Before/during eylem | Eylemden sonra |
| Desen | Filtre zinciri | Observer/pub-sub |

## Kanca Sistemi

### Kancaları Kaydetme
```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### Kanca Geri Arama
```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Add custom profile fields
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```
### Mevcut Core Kancaları

| Kanca Adı | Veri | Açıklama |
|-----------|------|------------|
| `user.profile.display` | user veri dizisi | Profil görünümünü değiştirin |
| `content.render` | İçerik HTML | İçerik çıktısını filtrele |
| `form.submit` | Form verileri | Validate/modify form verileri |
| `search.results` | Sonuçlar dizisi | Arama sonuçlarını filtrele |
| `menu.main` | Menü öğeleri | Ana menüyü değiştir |

## Etkinlik Sistemi

### Olayları Gönderme
```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### Etkinlikleri Dinleme
```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Notify subscribers
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Update last login for module
        $this->updateUserActivity($userId);
    }
}
```
## Ön Yükleme Olayları Referansı

### Temel Etkinlikler
```php
// Header/Footer
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Includes
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Exceptions
public function eventCoreException(array $args): void {}
```
### user Etkinlikleri
```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### module Etkinlikleri
```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## Özel module Etkinlikleri

### Olayları Tanımlama
```php
// Define event constants
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```
### Olayları Tetiklemek
```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Trigger event
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```
### module Etkinliklerini Dinleme
```php
// In another module's Preload.php

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Index for search
    $this->searchIndexer->index($article);

    // Update sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```
## En İyi Uygulamalar

1. **Belirli İsimler Kullanın** - `module.entity.action` biçimi
2. **Minimum Veri Aktarın** - Yalnızca dinleyicilerin ihtiyaç duyduğu şeyler
3. **Belge Olayları** - module belgelerindeki olayları listeleyin
4. **Yan Etkilerden Kaçının** - Dinleyicilerin odaklanmasını sağlayın
5. **Hataları Ele Alın** - Dinleyici hatalarının akışı bozmasına izin vermeyin

## İlgili Belgeler

- Etkinlik Sistemi - Ayrıntılı etkinlik dokümantasyonu
- ../03-Module-Development/Module-Development - module geliştirme
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 events