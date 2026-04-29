---
title: “挂钩和事件”
---

## 概述

XOOPS 提供钩子和事件作为扩展点，允许模区块与核心功能以及彼此交互，而无需直接依赖。

## 挂钩与事件

|方面|挂钩|活动 |
|--------|--------|--------|
|目的|修改behavior/data|对事件做出反应 |
|返回 |可以返回修改后的数据 |通常无效 |
|时间 | Before/during行动|行动后|
|图案|过滤链| Observer/pub-sub |

## 挂钩系统

### 注册钩子

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### 钩子回调

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

### 可用的核心挂钩

|挂钩名称 |数据|描述 |
|------------|------|-------------|
| `user.profile.display` |用户数据数组 |修改个人资料显示 |
| `content.render` |内容HTML |过滤内容输出|
| `form.submit`|表格数据| Validate/modify表格数据|
| `search.results` |结果数组 |过滤搜索结果 |
| `menu.main`|菜单项|修改主菜单|

## 事件系统

### 调度事件

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### 监听事件

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

## 预加载事件参考

### 核心活动

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

### 用户事件

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### 模区块事件

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## 自定义模区块事件

### 定义事件

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

### 触发事件

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

### 监听模区块事件

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

## 最佳实践

1. **使用特定名称** - `module.entity.action`格式
2. **传递最少的数据** - 仅传递听众需要的数据
3. **文档事件** - 列出模区块文档中的事件
4. **避免副作用** - 让听众集中注意力
5. **处理错误** - 不要让侦听器错误破坏流程

## 相关文档

- 活动-System - 详细的活动文档
- ../03-Module-Development/Module-Development - 模区块开发
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 事件