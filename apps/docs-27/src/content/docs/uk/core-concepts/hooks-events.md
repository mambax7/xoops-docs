---
title: "Хуки та події"
---
## Огляд

XOOPS надає хуки та події як точки розширення, які дозволяють модулям взаємодіяти з основною функціональністю та один з одним без прямих залежностей.

## Хуки проти подій

| Аспект | Гачки | Події |
|--------|-------|--------|
| Призначення | Змінити behavior/data | Реагувати на випадки |
| Повернення | Може повертати змінені дані | Як правило недійсні |
| Терміни | Before/during дія | Після дії |
| Візерунок | Ланцюг фільтра | Observer/pub-sub |

## Система гаків

### Реєстрація хуків
```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```
### Зворотний виклик
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
### Доступні основні гачки

| Назва гака | Дані | Опис |
|-----------|------|------------|
| `user.profile.display` | Масив даних користувача | Змінити відображення профілю |
| `content.render` | Вміст HTML | Виведення вмісту фільтра |
| `form.submit` | Дані форми | Дані форми Validate/modify |
| `search.results` | Масив результатів | Фільтрувати результати пошуку |
| `menu.main` | Пункти меню | Змінити головне меню |

## Система подій

### Відправлення подій
```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```
### Прослуховування подій
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
## Довідка про події попереднього завантаження

### Основні події
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
### Події користувача
```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```
### Події модуля
```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```
## Спеціальні події модуля

### Визначення подій
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
### Запуск подій
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
### Прослуховування подій модуля
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
## Найкращі практики

1. **Використовуйте конкретні імена** - формат `module.entity.action`
2. **Передача мінімальних даних** – лише те, що потрібно слухачам
3. **Документувати події** - список подій у документах модуля
4. **Уникайте побічних ефектів** - Тримайте слухачів зосередженими
5. **Обробляти помилки** - не дозволяйте помилкам слухача переривати процес

## Пов'язана документація

- Event-System - Детальна документація подій
- ../03-Module-Development/Module-Development - Розробка модуля
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 події