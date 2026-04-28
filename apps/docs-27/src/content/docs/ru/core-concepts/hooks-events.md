---
title: "Hooks и события"
---

## Обзор

XOOPS обеспечивает hooks и события как точки расширения, позволяющие модулям взаимодействовать с функциональностью ядра и друг другом без прямых зависимостей.

## Hooks vs События

| Аспект | Hooks | События |
|--------|-------|---------|
| Назначение | Изменение поведения/данных | Реакция на происходящее |
| Возврат | Может вернуть изменённые данные | Обычно void |
| Время | До/во время действия | После действия |
| Паттерн | Цепь фильтров | Observer/pub-sub |

## Система Hooks

### Регистрация Hooks

```php
// Зарегистрировать hook в xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Hook Callback

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // Добавить пользовательские поля профиля
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### Доступные Core Hooks

| Имя Hook | Данные | Описание |
|----------|--------|---------|
| `user.profile.display` | Массив данных пользователя | Изменить отображение профиля |
| `content.render` | HTML содержимого | Фильтровать вывод содержимого |
| `form.submit` | Данные формы | Проверить/изменить данные формы |
| `search.results` | Массив результатов | Фильтровать результаты поиска |
| `menu.main` | Пункты меню | Изменить главное меню |

## Система событий

### Диспетчеризация событий

```php
// В коде вашего модуля
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Прослушивание событий

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // Уведомить подписчиков
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // Обновить последнюю активность для модуля
        $this->updateUserActivity($userId);
    }
}
```

## Справочник событий Preload

### События ядра

```php
// Заголовок/Подвал
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// Включение
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// Исключения
public function eventCoreException(array $args): void {}
```

### События пользователя

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### События модуля

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Пользовательские события модуля

### Определение событий

```php
// Определить константы событий
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### Срабатывание событий

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // Срабатывание события
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### Прослушивание событий модуля

```php
// В Preload.php другого модуля

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // Индексировать для поиска
    $this->searchIndexer->index($article);

    // Обновить sitemap
    $this->sitemapGenerator->addUrl($article->url());
}
```

## Лучшие практики

1. **Используйте специфичные имена** - формат `module.entity.action`
2. **Передавайте минимум данных** - только то, что нужно слушателям
3. **Документируйте события** - перечисляйте события в документации модуля
4. **Избегайте побочных эффектов** - держите слушателей сфокусированными
5. **Обрабатывайте ошибки** - не позволяйте ошибкам слушателя разрушить процесс

## Связанная документация

- Event-System - Подробная документация по событиям
- ../03-Module-Development/Module-Development - Разработка модулей
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - События PSR-14
