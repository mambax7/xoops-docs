---
title: "الخطاطيف والأحداث"
dir: rtl
lang: ar
---

## نظرة عامة

يوفر XOOPS الخطاطيف والأحداث كنقاط توسع تسمح للوحدات بالتفاعل مع الوظائف الأساسية وبعضها البعض دون اعتماديات مباشرة.

## الخطاطيف مقابل الأحداث

| الجانب | الخطاطيف | الأحداث |
|--------|-------|---------|
| الغرض | تعديل السلوك / البيانات | الرد على الحدوث |
| العودة | يمكن إرجاع البيانات المعدلة | عادة void |
| التوقيت | قبل / أثناء الإجراء | بعد الإجراء |
| النمط | سلسلة التصفية | Observer / pub-sub |

## نظام الخطاف

### تسجيل الخطاطيف

```php
// تسجيل خطاف في xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### استدعاء الخطاف

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // أضف حقول ملف تعريف مخصص
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### خطاطيف النواة المتاحة

| اسم الخطاف | البيانات | الوصف |
|-----------|------|-------------|
| `user.profile.display` | مصفوفة بيانات المستخدم | تعديل عرض الملف الشخصي |
| `content.render` | محتوى HTML | مرشح إخراج المحتوى |
| `form.submit` | بيانات النموذج | التحقق من صحة / تعديل بيانات النموذج |
| `search.results` | مصفوفة النتائج | مرشح نتائج البحث |
| `menu.main` | عناصر القائمة | تعديل القائمة الرئيسية |

## نظام الأحداث

### توزيع الأحداث

```php
// في كود الوحدة الخاصة بك
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### الاستماع للأحداث

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // إخطار المشتركين
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // تحديث آخر تسجيل دخول للوحدة
        $this->updateUserActivity($userId);
    }
}
```

## مرجع أحداث التحميل المسبق

### أحداث النواة

```php
// الرأس والتذييل
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// التضمينات
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// الاستثناءات
public function eventCoreException(array $args): void {}
```

### أحداث المستخدم

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### أحداث الوحدة

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## أحداث الوحدة المخصصة

### تحديد الأحداث

```php
// تحديد ثوابت الحدث
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### حدث الحدث

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // حدث الحدث
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### الاستماع لأحداث الوحدة

```php
// في Preload.php لوحدة أخرى

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // الفهرس للبحث
    $this->searchIndexer->index($article);

    // تحديث الخريطة
    $this->sitemapGenerator->addUrl($article->url());
}
```

## أفضل الممارسات

1. **استخدم أسماء محددة** - صيغة `module.entity.action`
2. **مرّر بيانات قليلة** - فقط ما يحتاجه المستمعون
3. **وثق الأحداث** - اسرد الأحداث في وثائق الوحدة
4. **تجنب التأثيرات الجانبية** - اجعل المستمعين في التركيز
5. **التعامل مع الأخطاء** - لا تدع أخطاء المستمع تفسد التدفق

## الوثائق ذات الصلة

- نظام الحدث - وثائق الحدث المفصلة
- ../03-Module-Development/Module-Development - تطوير الوحدة
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - أحداث PSR-14
