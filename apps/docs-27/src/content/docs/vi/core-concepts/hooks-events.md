---
title: "Móc và sự kiện"
---
## Tổng quan

XOOPS cung cấp các hook và sự kiện dưới dạng điểm mở rộng cho phép modules tương tác với chức năng cốt lõi và tương tác với nhau mà không phụ thuộc trực tiếp.

## Hook và sự kiện

| Khía cạnh | Móc | Sự kiện |
|--------|-------|--------|
| Mục đích | Sửa đổi hành vi/dữ liệu | Phản ứng với sự xuất hiện |
| Trở về | Có thể trả về dữ liệu đã sửa đổi | Thông thường void |
| Thời gian | Trước/trong khi hành động | Sau hành động |
| Mẫu | Chuỗi lọc | Người quan sát/pub-sub |

## Hệ thống móc

### Đăng ký Hook

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### Gọi lại Hook

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

### Móc lõi có sẵn

| Tên móc | Dữ liệu | Mô tả |
|----------|------|-------------|
| `user.profile.display` | Mảng dữ liệu người dùng | Sửa đổi hiển thị hồ sơ |
| `content.render` | Nội dung HTML | Lọc nội dung đầu ra |
| `form.submit` | Dữ liệu biểu mẫu | Xác thực/sửa đổi dữ liệu biểu mẫu |
| `search.results` | Mảng kết quả | Lọc kết quả tìm kiếm |
| `menu.main` | Các món trong thực đơn | Sửa đổi menu chính |

## Hệ thống sự kiện

### Sự kiện gửi đi

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### Lắng nghe sự kiện

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

## Tham khảo sự kiện tải trước

### Sự kiện cốt lõi

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

### Sự kiện của người dùng

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### Sự kiện mô-đun

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Sự kiện mô-đun tùy chỉnh

### Xác định sự kiện

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

### Sự kiện kích hoạt

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

### Nghe sự kiện mô-đun

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

## Các phương pháp hay nhất

1. **Sử dụng tên cụ thể** - định dạng `module.entity.action`
2. **Truyền dữ liệu tối thiểu** - Chỉ những gì người nghe cần
3. **Sự kiện tài liệu** - Liệt kê các sự kiện trong tài liệu mô-đun
4. **Tránh tác dụng phụ** - Giữ người nghe tập trung
5. **Xử lý lỗi** - Đừng để lỗi của người nghe làm gián đoạn dòng chảy

## Tài liệu liên quan

- Event-System - Tài liệu chi tiết về sự kiện
- ../03-Module-Development/Module-Development - Phát triển mô-đun
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - Sự kiện PSR-14