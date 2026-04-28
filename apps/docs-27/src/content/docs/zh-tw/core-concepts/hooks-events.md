---
title: "掛鉤和事件"
---

## 概述

XOOPS 提供掛鉤和事件作為擴展點，允許模組與核心功能和彼此互動，無需直接依賴。

## 掛鉤 vs 事件

| 方面 | 掛鉤 | 事件 |
|------|------|------|
| 目的 | 修改行為/資料 | 對發生的事物做出反應 |
| 返回 | 可以返回修改的資料 | 通常為空 |
| 時機 | 動作前/期間 | 動作後 |
| 模式 | 篩選器鏈 | 觀察者/pub-sub |

## 掛鉤系統

### 登錄掛鉤

```php
// 在 xoops_version.php 中登錄掛鉤
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### 掛鉤回調

```php
// include/hooks.php

function mymodule_hook_user_profile(array $data): array
{
    $userId = $data['user_id'];

    // 新增自訂設定檔欄位
    $data['fields']['reputation'] = mymodule_get_user_reputation($userId);
    $data['fields']['badges'] = mymodule_get_user_badges($userId);

    return $data;
}
```

### 可用核心掛鉤

| 掛鉤名稱 | 資料 | 描述 |
|---------|------|------|
| `user.profile.display` | 使用者資料陣列 | 修改設定檔顯示 |
| `content.render` | 內容 HTML | 篩選內容輸出 |
| `form.submit` | 表單資料 | 驗證/修改表單資料 |
| `search.results` | 結果陣列 | 篩選搜尋結果 |
| `menu.main` | 功能表項目 | 修改主功能表 |

## 事件系統

### 發派事件

```php
// 在模組程式碼中
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### 偵聽事件

```php
// class/Preload.php

class MyModulePreload extends \Xmf\Module\Helper\AbstractHelper
{
    public function eventMymoduleArticleCreated(array $args): void
    {
        $articleId = $args['article_id'];

        // 通知訂閱者
        $this->notifyNewArticle($articleId);
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];

        // 更新模組的最後登錄
        $this->updateUserActivity($userId);
    }
}
```

## 預加載事件參考

### 核心事件

```php
// 頁首/頁尾
public function eventCoreHeaderStart(array $args): void {}
public function eventCoreHeaderEnd(array $args): void {}
public function eventCoreFooterStart(array $args): void {}
public function eventCoreFooterEnd(array $args): void {}

// 包含
public function eventCoreIncludeCommonStart(array $args): void {}
public function eventCoreIncludeCommonEnd(array $args): void {}

// 異常
public function eventCoreException(array $args): void {}
```

### 使用者事件

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### 模組事件

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## 自訂模組事件

### 定義事件

```php
// 定義事件常數
class ArticleEvents
{
    public const CREATED = 'mymodule.article.created';
    public const UPDATED = 'mymodule.article.updated';
    public const DELETED = 'mymodule.article.deleted';
    public const PUBLISHED = 'mymodule.article.published';
}
```

### 觸發事件

```php
class ArticleService
{
    public function publish(Article $article): void
    {
        $article->publish();
        $this->repository->save($article);

        // 觸發事件
        $GLOBALS['xoopsPreload']->triggerEvent(
            ArticleEvents::PUBLISHED,
            ['article' => $article]
        );
    }
}
```

### 偵聽模組事件

```php
// 在另一個模組的 Preload.php 中

public function eventMymoduleArticlePublished(array $args): void
{
    $article = $args['article'];

    // 索引用於搜尋
    $this->searchIndexer->index($article);

    // 更新網站地圖
    $this->sitemapGenerator->addUrl($article->url());
}
```

## 最佳實踐

1. **使用特定名稱** - `module.entity.action` 格式
2. **傳遞最少資料** - 只傳遞偵聽器需要的資料
3. **記錄事件** - 在模組文檔中列出事件
4. **避免副作用** - 保持偵聽器集中
5. **處理錯誤** - 不要讓偵聽器錯誤破壞流程

## 相關文檔

- 事件系統 - 詳細的事件文檔
- ../03-Module-Development/Module-Development - 模組開發
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 事件
