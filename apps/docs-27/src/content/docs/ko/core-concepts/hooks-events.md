---
title: "후크 및 이벤트"
---

## 개요

XOOPS는 모듈이 직접적인 종속성 없이 핵심 기능 및 서로 상호 작용할 수 있도록 하는 확장 지점으로 후크 및 이벤트를 제공합니다.

## 후크 대 이벤트

| 측면 | 후크 | 이벤트 |
|--------|-------|--------|
| 목적 | 동작/데이터 수정 | 발생에 대응 |
| 반품 | 수정된 데이터를 반환할 수 있습니다 | 일반적으로 무효 |
| 타이밍 | 작업 전/작업 중 | 조치 후 |
| 패턴 | 필터 체인 | 관찰자/pub-sub |

## 후크 시스템

### 후크 등록

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### 후크 콜백

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

### 사용 가능한 코어 후크

| 후크 이름 | 데이터 | 설명 |
|-----------|------|-------------|
| `user.profile.display` | 사용자 데이터 배열 | 프로필 표시 수정 |
| `content.render` | 콘텐츠 HTML | 필터 콘텐츠 출력 |
| `form.submit` | 양식 데이터 | 양식 데이터 유효성 검사/수정 |
| `search.results` | 결과 배열 | 검색 결과 필터링 |
| `menu.main` | 메뉴 항목 | 메인 메뉴 수정 |

## 이벤트 시스템

### 이벤트 전달

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### 이벤트 수신

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

## 사전 로드 이벤트 참조

### 핵심 이벤트

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

### 사용자 이벤트

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### 모듈 이벤트

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## 사용자 정의 모듈 이벤트

### 이벤트 정의

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

### 이벤트 트리거

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

### 모듈 이벤트 듣기

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

## 모범 사례

1. **특정 이름 사용** - `module.entity.action` 형식
2. **최소 데이터 전달** - 청취자에게 필요한 것만 전달
3. **문서 이벤트** - 모듈 문서의 이벤트 나열
4. **부작용 방지** - 청취자의 집중력을 유지하세요.
5. **오류 처리** - 리스너 오류로 인해 흐름이 중단되지 않도록 합니다.

## 관련 문서

- 이벤트 시스템 - 자세한 이벤트 문서
-../03-모듈-개발/모듈-개발 - 모듈 개발
-../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 이벤트
