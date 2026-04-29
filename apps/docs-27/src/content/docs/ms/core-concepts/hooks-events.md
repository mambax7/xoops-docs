---
title: "Cangkuk dan Acara"
---
## Gambaran KeseluruhanXOOPS menyediakan cangkuk dan acara sebagai titik sambungan yang membolehkan modul berinteraksi dengan fungsi teras dan satu sama lain tanpa kebergantungan langsung.## Cangkuk vs Acara| Aspek | Cangkuk | Peristiwa |
|--------|-------|--------|
| Tujuan | Ubah suai behavior/data | Bertindak balas terhadap kejadian |
| Kembali | Boleh mengembalikan data yang diubah suai | Lazimnya batal |
| Masa | Tindakan Before/during | Selepas tindakan |
| Corak | Rantai penapis | Observer/pub-sub |## Sistem Cangkuk### Mendaftar Cangkuk
```
php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### Panggilan Balik Cangkuk
```
php
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
### Cangkuk Teras Tersedia| Nama Cangkuk | Data | Penerangan |
|-----------|------|-------------|
| `user.profile.display` | Tatasusunan data pengguna | Ubah suai paparan profil |
| `content.render` | Kandungan HTML | Output kandungan penapis |
| `form.submit` | Data borang | Data borang Validate/modify |
| `search.results` | Susunan keputusan | Tapis hasil carian |
| `menu.main` | Item menu | Ubah suai menu utama |## Sistem Acara### Menghantar Acara
```
php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### Mendengar Acara
```
php
// class/Preload.php

class MyModulePreload extends \XMF\Module\Helper\AbstractHelper
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
## Rujukan Acara Pramuat### Acara Teras
```
php
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
```
php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### Peristiwa Modul
```
php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## Acara Modul Tersuai### Menentukan Peristiwa
```
php
// Define event constants
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```
### Mencetuskan Peristiwa
```
php
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
### Mendengar Peristiwa Modul
```
php
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
## Amalan Terbaik1. **Gunakan Nama Tertentu** - Format `module.entity.action`
2. **Lulus Data Minimum** - Hanya apa yang pendengar perlukan
3. **Peristiwa Dokumen** - Senaraikan acara dalam dokumen modul
4. **Elakkan Kesan Sampingan** - Pastikan pendengar fokus
5. **Kendalikan Ralat** - Jangan biarkan ralat pendengar pecah mengalir## Dokumentasi Berkaitan- Sistem Peristiwa - Dokumentasi acara terperinci
- ../03-Module-Development/Module-Development - Pembangunan modul
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Acara PSR-14