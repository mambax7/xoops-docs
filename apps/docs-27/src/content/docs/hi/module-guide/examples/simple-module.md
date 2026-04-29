---
title: "सरल मॉड्यूल उदाहरण"
description: "सभी आवश्यक फाइलों के साथ कार्यशील मॉड्यूल पूरा करें"
---
# सरल मॉड्यूल उदाहरण - ब्लॉग

एक पूर्ण, कार्यशील सरल मॉड्यूल जो मूल XOOPS अवधारणाओं को प्रदर्शित करता है।

## मॉड्यूल संरचना

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

## डेटाबेस स्कीमा

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

## हैंडलर क्लास

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

## फ्रंटएंड (index.php)

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

## एडमिन इंटरफ़ेस (admin.php)

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

<h2>Manage Blog Posts</h2>
<a href="admin.php?op=create" class="btn btn-primary">New Post</a>

<table class="table">
    {foreach from=$posts item=post}
        <tr>
            <td>{$post->post_title}</td>
            <td>{if $post->post_published}Published{else}Draft{/if}</td>
            <td>
                <a href="admin.php?op=edit&id={$post->post_id}">Edit</a>
                <a href="admin.php?op=delete&id={$post->post_id}">Delete</a>
            </td>
        </tr>
    {/foreach}
</table>
```

## फ्रंटएंड टेम्पलेट्स

### blog_index.html

```smarty
<div class="blog-container">
    <h1>Blog</h1>
    
    {if $posts}
        <div class="posts-list">
            {foreach from=$posts item=post}
                <article class="post">
                    <h2><a href="?op=view&id={$post->post_id}">{$post->post_title|escape}</a></h2>
                    <small>Posted on {$post->post_created|date_format:"%Y-%m-%d"}</small>
                    <p>{$post->post_content|truncate:200|escape}</p>
                    <a href="?op=view&id={$post->post_id}">Read More</a>
                </article>
            {/foreach}
        </div>
    {else}
        <p>No posts available.</p>
    {/if}
</div>
```

### blog_view.html

```smarty
<article class="blog-post">
    <h1>{$post->post_title|escape}</h1>
    <small>Posted on {$post->post_created|date_format:"%Y-%m-%d %H:%M"}</small>
    
    <div class="post-content">
        {$post->post_content}
    </div>
    
    <a href="./">Back to Blog</a>
</article>
```

## CSS स्टाइलिंग

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

## मुख्य विशेषताएं

- पेजिनेशन के साथ प्रकाशित ब्लॉग पोस्ट प्रदर्शित करें
- व्यक्तिगत पोस्ट देखें
- पोस्ट बनाने, संपादित करने, हटाने के लिए एडमिन इंटरफ़ेस
- ड्राफ्ट/प्रकाशित स्थिति
- टाइमस्टैम्प

## परीक्षण

1. XOOPS व्यवस्थापक के माध्यम से मॉड्यूल स्थापित करें
2. `modules/blog/` पर फ्रंटएंड एक्सेस करें
3. `modules/blog/admin.php` पर एडमिन पर जाएँ
4. एक परीक्षण पोस्ट बनाएं और उसे प्रकाशित करें

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- ../पैटर्न/एमवीसी-पैटर्न पैटर्न के लिए
- ../पैटर्न/रिपॉजिटरी-डेटा एक्सेस के लिए पैटर्न
- ../संरचना के लिए सर्वोत्तम-अभ्यास/कोड-संगठन

---

टैग: #उदाहरण #सरल-मॉड्यूल #पूर्ण-उदाहरण #मॉड्यूल-विकास