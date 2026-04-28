---
title: "簡單模塊示例"
description: "具有所有必要文件的完整工作模塊"
---

# 簡單模塊示例 - 博客

一個完整、有效的簡單模塊，展示核心 XOOPS 概念。

## 模塊結構

```
blog/
├── xoops_version.php
├── index.php
├── admin.php
├── class/
│   └── Handler/
│       └── BlogHandler.php
├── templates/
│   ├── blog_index.html
│   ├── blog_view.html
│   └── admin/blog_list.html
├── assets/
│   └── css/style.css
└── sql/mysql.sql
```

## xoops_version.php

```php
<?php
$modversion = [
    'name'           => 'Simple Blog',
    'version'        => '1.0.0',
    'description'    => 'A simple blog module',
    'author'         => 'Your Name',
    'dirname'        => 'blog',
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['blog_posts'],
    'hasAdmin'       => 1,
    'hasMain'        => 1,
];
?>
```

## 數據庫架構

```sql
CREATE TABLE `xoops_blog_posts` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_title` VARCHAR(255) NOT NULL,
  `post_content` LONGTEXT NOT NULL,
  `post_author` INT NOT NULL,
  `post_created` INT NOT NULL,
  `post_published` TINYINT(1) DEFAULT 0,
  INDEX `post_author` (`post_author`),
  INDEX `post_published` (`post_published`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
```

## 處理程序類

```php
<?php
class BlogHandler
{
    private $db;
    private $table;
    
    public function __construct($db)
    {
        $this->db = $db;
        $this->table = $this->db->prefix('blog_posts');
    }
    
    public function getAll($limit = 10, $offset = 0)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE post_published = 1 
                ORDER BY post_created DESC 
                LIMIT ?, ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('ii', $offset, $limit);
        $stmt->execute();
        
        $posts = [];
        $result = $stmt->get_result();
        while ($row = $result->fetch_object()) {
            $posts[] = $row;
        }
        
        return $posts;
    }
    
    public function get($id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE post_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_object();
    }
    
    public function insert($post)
    {
        $sql = "INSERT INTO {$this->table} 
                (post_title, post_content, post_author, post_created, post_published)
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('ssiii', 
            $post->post_title,
            $post->post_content,
            $post->post_author,
            $post->post_created,
            $post->post_published
        );
        
        return $stmt->execute() ? $this->db->insert_id : 0;
    }
    
    public function update($post)
    {
        $sql = "UPDATE {$this->table}
                SET post_title = ?, post_content = ?, post_published = ?
                WHERE post_id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('ssii',
            $post->post_title,
            $post->post_content,
            $post->post_published,
            $post->post_id
        );
        
        return $stmt->execute();
    }
    
    public function delete($id)
    {
        $sql = "DELETE FROM {$this->table} WHERE post_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('i', $id);
        
        return $stmt->execute();
    }
}
?>
```

## 前端 (index.php)

```php
<?php
require_once __DIR__ . '/../../mainfile.php';

global $xoopsDB;

$op = $_GET['op'] ?? 'index';
$id = $_GET['id'] ?? 0;

$blogHandler = new BlogHandler($xoopsDB);
$xoopsTheme = \Xoops::getInstance()->getTheme();

switch ($op) {
    case 'view':
        $post = $blogHandler->get($id);
        $xoopsTheme->assign('post', $post);
        $template = 'blog_view.html';
        break;
        
    case 'index':
    default:
        $page = $_GET['page'] ?? 1;
        $limit = 10;
        $offset = ($page - 1) * $limit;
        
        $posts = $blogHandler->getAll($limit, $offset);
        $xoopsTheme->assign('posts', $posts);
        $xoopsTheme->assign('page', $page);
        $template = 'blog_index.html';
        break;
}

$xoopsTheme->display(
    \Xoops::getInstance()->getModulePath() . "/templates/$template"
);
?>
```

## 管理界面 (admin.php)

```php
<?php
require_once __DIR__ . '/../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Access denied');
}

global $xoopsDB;

$op = $_GET['op'] ?? 'list';
$id = $_GET['id'] ?? 0;

$blogHandler = new BlogHandler($xoopsDB);

switch ($op) {
    case 'create':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $post = new \stdClass();
            $post->post_title = $_POST['title'];
            $post->post_content = $_POST['content'];
            $post->post_author = $xoopsUser->uid();
            $post->post_created = time();
            $post->post_published = $_POST['published'] ? 1 : 0;
            
            $blogHandler->insert($post);
        }
        break;
        
    case 'delete':
        $blogHandler->delete($id);
        break;
}

$posts = $blogHandler->getAll(999, 0);
?>

<h2>管理博客帖子</h2>
<a href="admin.php?op=create" class="btn btn-primary">新帖子</a>

<table class="table">
    {foreach from=$posts item=post}
        <tr>
            <td>{$post->post_title}</td>
            <td>{if $post->post_published}已發佈{else}草稿{/if}</td>
            <td>
                <a href="admin.php?op=edit&id={$post->post_id}">編輯</a>
                <a href="admin.php?op=delete&id={$post->post_id}">刪除</a>
            </td>
        </tr>
    {/foreach}
</table>
```

## 前端模板

### blog_index.html

```smarty
<div class="blog-container">
    <h1>博客</h1>
    
    {if $posts}
        <div class="posts-list">
            {foreach from=$posts item=post}
                <article class="post">
                    <h2><a href="?op=view&id={$post->post_id}">{$post->post_title|escape}</a></h2>
                    <small>發佈於 {$post->post_created|date_format:"%Y-%m-%d"}</small>
                    <p>{$post->post_content|truncate:200|escape}</p>
                    <a href="?op=view&id={$post->post_id}">閱讀更多</a>
                </article>
            {/foreach}
        </div>
    {else}
        <p>沒有可用的帖子。</p>
    {/if}
</div>
```

### blog_view.html

```smarty
<article class="blog-post">
    <h1>{$post->post_title|escape}</h1>
    <small>發佈於 {$post->post_created|date_format:"%Y-%m-%d %H:%M"}</small>
    
    <div class="post-content">
        {$post->post_content}
    </div>
    
    <a href="./">返回博客</a>
</article>
```

## CSS 樣式

```css
/* assets/css/style.css */

.blog-container {
    padding: 20px 0;
}

.post {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.post h2 {
    margin-top: 0;
}

.blog-post {
    max-width: 800px;
    margin: 0 auto;
}

.post-content {
    line-height: 1.6;
    margin: 20px 0;
}
```

## 主要功能

- 顯示已發佈的博客帖子並分頁
- 查看各個帖子
- 管理界面以創建、編輯、刪除帖子
- 草稿/已發佈狀態
- 時間戳

## 測試

1. 通過 XOOPS 管理器安裝模塊
2. 在 `modules/blog/` 訪問前端
3. 訪問 `modules/blog/admin.php` 進行管理
4. 創建一個測試帖子並發佈它

## 相關文檔

另見：
- ../Patterns/MVC-Pattern 用於模式
- ../Patterns/Repository-Pattern 用於數據訪問
- ../Best-Practices/Code-Organization 用於結構

---

標籤: #examples #simple-module #complete-example #module-development
