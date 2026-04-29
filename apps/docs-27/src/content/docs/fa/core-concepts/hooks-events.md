---
title: "قلاب ها و رویدادها"
---
## بررسی اجمالی

XOOPS قلاب ها و رویدادها را به عنوان نقاط توسعه ارائه می دهد که به ماژول ها اجازه می دهد بدون وابستگی مستقیم با عملکرد اصلی و یکدیگر تعامل داشته باشند.

## Hooks vs Events

| جنبه | قلاب | رویدادها |
|--------|-------|--------|
| هدف | اصلاح behavior/data | واکنش به اتفاقات |
| بازگشت | می تواند داده های اصلاح شده را برگرداند | به طور معمول خالی |
| زمان بندی | اکشن Before/during | بعد از عمل |
| الگو | زنجیره فیلتر | Observer/pub-sub |

## سیستم هوک

### ثبت قلاب

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### پاسخ به تماس را قلاب کنید

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

### قلاب های هسته موجود

| نام قلاب | داده ها | توضیحات |
|-----------|------|-------------|
| `user.profile.display` | آرایه داده های کاربر | تغییر نمایش مشخصات |
| `content.render` | HTML محتوا | فیلتر خروجی محتوای |
| `form.submit` | داده های فرم | داده های فرم Validate/modify |
| `search.results` | آرایه نتایج | فیلتر کردن نتایج جستجو |
| `menu.main` | آیتم های منو | تغییر منوی اصلی |

## سیستم رویداد

### اعزام رویدادها

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### گوش دادن به رویدادها

```php
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

## پیش بارگذاری مرجع رویدادها

### رویدادهای اصلی

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

### رویدادهای کاربر

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### رویدادهای ماژول

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## رویدادهای ماژول سفارشی

### تعریف رویدادها

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

### ایجاد رویدادها

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

### گوش دادن به رویدادهای ماژول

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

## بهترین شیوه ها

1. **استفاده از نام های خاص ** - فرمت `module.entity.action`
2. ** داده های حداقلی را ارسال کنید ** - فقط آنچه شنوندگان نیاز دارند
3. ** رویدادهای سند ** - لیست رویدادها در اسناد ماژول
4. **اجتناب از عوارض جانبی** - شنوندگان را متمرکز نگه دارید
5. **بررسی خطاها** - اجازه ندهید که خطاهای شنونده جریان را قطع کنند

## مستندات مرتبط

- رویداد-سیستم - مستندات دقیق رویداد
- ../03-Module-Development/Module-Development - توسعه ماژول
- رویدادهای ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14