---
title: "Mẫu và khối"
---
## Tổng quan

Nhà xuất bản cung cấp templates có thể tùy chỉnh để hiển thị các bài viết và khối để tích hợp thanh bên/widget. Hướng dẫn này bao gồm việc tùy chỉnh mẫu và cấu hình khối.

## Tệp mẫu

### Mẫu cốt lõi

| Mẫu | Mục đích |
|----------|----------|
| `publisher_index.tpl` | Trang chủ mô-đun |
| `publisher_item.tpl` | Xem bài viết đơn |
| `publisher_category.tpl` | Danh sách danh mục |
| `publisher_archive.tpl` | Trang lưu trữ |
| `publisher_search.tpl` | Kết quả tìm kiếm |
| `publisher_submit.tpl` | Mẫu gửi bài viết |
| `publisher_print.tpl` | Chế độ xem thân thiện với bản in |

### Mẫu khối

| Mẫu | Mục đích |
|----------|----------|
| `publisher_block_latest.tpl` | Khối bài viết mới nhất |
| `publisher_block_spotlight.tpl` | Khối bài viết nổi bật |
| `publisher_block_category.tpl` | Khối danh sách danh mục |
| `publisher_block_author.tpl` | Khối bài viết của tác giả |

## Biến mẫu

### Biến bài viết

```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```

### Biến danh mục

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Tùy chỉnh mẫu

### Ghi đè vị trí

Sao chép templates vào chủ đề của bạn để tùy chỉnh:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Ví dụ: Mẫu bài viết tùy chỉnh

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## Khối

### Khối có sẵn

| Chặn | Mô tả |
|-------|-------------|
| Tin tức mới nhất | Hiển thị các bài viết gần đây |
| Tiêu điểm | Bài viết nổi bật |
| Thực đơn danh mục | Điều hướng danh mục |
| Lưu trữ | Lưu trữ liên kết |
| Tác giả hàng đầu | Nhà văn tích cực nhất |
| Mặt hàng phổ biến | Bài viết được xem nhiều nhất |

### Tùy chọn chặn

#### Khối tin tức mới nhất

| Tùy chọn | Mô tả |
|--------|-------------|
| Các mục để hiển thị | Số lượng bài viết |
| Bộ lọc danh mục | Giới hạn ở các danh mục cụ thể |
| Hiển thị tóm tắt | Hiển thị đoạn trích bài viết |
| Độ dài tiêu đề | Tiêu đề cắt ngắn |
| Mẫu | Chặn tệp mẫu |

### Mẫu khối tùy chỉnh

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Thủ thuật mẫu

### Hiển thị có điều kiện

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Lớp CSS tùy chỉnh

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Định dạng ngày

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Tài liệu liên quan

- ../User-Guide/Basic-Configuration - Cài đặt mô-đun
- ../User-Guide/Creating-Bài viết - Quản lý nội dung
- ../../04-API-Reference/Template/Template-System - Công cụ tạo mẫu XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Tùy chỉnh chủ đề