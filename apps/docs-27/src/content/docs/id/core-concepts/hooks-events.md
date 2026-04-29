---
title: "Kait dan Acara"
---

## Ikhtisar

XOOPS menyediakan hook dan event sebagai titik ekstensi yang memungkinkan module berinteraksi dengan fungsionalitas core dan satu sama lain tanpa ketergantungan langsung.

## Kait vs Acara

| Aspek | Kait | Acara |
|--------|-------|--------|
| Tujuan | Ubah behavior/data | Bereaksi terhadap kejadian |
| Kembali | Dapat mengembalikan data yang dimodifikasi | Biasanya batal |
| Waktu | Tindakan Before/during | Setelah tindakan |
| Pola | Rantai penyaring | Observer/pub-sub |

## Sistem Kait

### Mendaftarkan Kait

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Kaitkan Panggilan Balik

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

### Kait core yang Tersedia

| Nama Kait | Data | Deskripsi |
|-----------|------|-------------|
| `user.profile.display` | Array data pengguna | Ubah tampilan profil |
| `content.render` | Konten HTML | Filter keluaran konten |
| `form.submit` | Data formulir | Data formulir Validate/modify |
| `search.results` | Rangkaian hasil | Saring hasil pencarian |
| `menu.main` | Item menu | Ubah menu utama |

## Sistem Acara

### Acara Pengiriman

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Mendengarkan Acara

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

## Referensi Acara Pramuat

### Acara core

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

### Acara Pengguna

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Acara module

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Acara module Khusus

### Mendefinisikan Peristiwa

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

### Peristiwa yang Memicu

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

### Mendengarkan Acara module

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

## Praktik Terbaik

1. **Gunakan Nama Tertentu** - format `module.entity.action`
2. **Berikan Data Minimal** - Hanya yang dibutuhkan pendengar
3. **Dokumen Peristiwa** - Mencantumkan peristiwa dalam dokumen module
4. **Hindari Efek Samping** - Jaga agar pendengar tetap fokus
5. **Menangani Kesalahan** - Jangan biarkan kesalahan pendengar mengganggu aliran

## Dokumentasi Terkait

- Sistem Acara - Dokumentasi acara terperinci
- ../03-Module-Development/Module-Development - Pengembangan module
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 acara
