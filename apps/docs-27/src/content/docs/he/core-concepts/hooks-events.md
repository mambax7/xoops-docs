---
title: "הוקס ואירועים"
---
## סקירה כללית

XOOPS מספקת הוקס ואירועים כנקודות הרחבה המאפשרות למודולים לקיים אינטראקציה עם פונקציונליות ליבה ואחד עם השני ללא תלות ישירה.

## הוקס לעומת אירועים

| היבט | ווים | אירועים |
|--------|-------|--------|
| מטרה | שנה behavior/data | להגיב להתרחשויות |
| חזור | יכול להחזיר נתונים שהשתנו | בדרך כלל בטל |
| תזמון | Before/during פעולה | לאחר פעולה |
| דפוס | שרשרת סינון | Observer/pub-sub |

## מערכת הוק

### רישום הוקס
```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### התקשר להתקשרות חזרה
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
### ווי ליבה זמינים

| שם הוק | נתונים | תיאור |
|-----------|------|------------|
| `user.profile.display` | מערך נתוני משתמש | שנה תצוגת פרופיל |
| `content.render` | תוכן HTML | סינון פלט תוכן |
| `form.submit` | נתוני טופס | Validate/modify נתוני טופס |
| `search.results` | מערך תוצאות | סנן תוצאות חיפוש |
| `menu.main` | פריטי תפריט | שנה תפריט ראשי |

## מערכת אירועים

### שיגור אירועים
```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### האזנה לאירועים
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
## טען מראש הפניה לאירועים

### אירועי ליבה
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
### אירועי משתמש
```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### אירועי מודול
```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## אירועי מודול מותאם אישית

### הגדרת אירועים
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
### מפעילים אירועים
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
### האזנה לאירועי מודול
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
## שיטות עבודה מומלצות

1. **השתמש בשמות ספציפיים** - פורמט `module.entity.action`
2. **העברת נתונים מינימליים** - רק מה שמאזינים צריכים
3. **אירועי מסמך** - רשימת אירועים במסמכי מודול
4. **הימנע מתופעות לוואי** - שמור על מיקוד המאזינים
5. **טפל בשגיאות** - אל תיתן לשגיאות מאזינים לשבור את הזרימה

## תיעוד קשור

- Event-System - תיעוד אירועים מפורט
- ../03-Module-Development/Module-Development - פיתוח מודול
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 אירועים