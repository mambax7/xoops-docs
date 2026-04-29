---
title：“高级模区块示例”
description：“具有多个表、关系、管理界面和区块的复杂模区块”
---

# 高级模区块示例 - 论坛

全面的“论坛”模区块展示了高级模式：多种实体类型、关系、复杂的管理界面和通知。

## 模区块结构

```
forum/
├── xoops_version.php
├── class/
│   ├── Repository/
│   │   ├── ForumRepository.php
│   │   ├── TopicRepository.php
│   │   └── PostRepository.php
│   ├── Entity/
│   │   ├── Forum.php
│   │   ├── Topic.php
│   │   └── Post.php
│   ├── Service/
│   │   ├── ForumService.php
│   │   └── TopicService.php
│   └── Handler/
│       └── NotificationHandler.php
├── templates/
│   ├── forum_list.html
│   ├── topic_view.html
│   └── admin/dashboard.html
└── sql/mysql.sql
```

## 数据库架构

```sql
-- Forums
CREATE TABLE `xoops_forum_forums` (
  `forum_id` INT AUTO_INCREMENT PRIMARY KEY,
  `forum_name` VARCHAR(255) NOT NULL,
  `forum_description` TEXT,
  `forum_order` INT,
  `forum_created` INT NOT NULL
);

-- Topics
CREATE TABLE `xoops_forum_topics` (
  `topic_id` INT AUTO_INCREMENT PRIMARY KEY,
  `topic_forum_id` INT NOT NULL,
  `topic_author_id` INT NOT NULL,
  `topic_title` VARCHAR(255) NOT NULL,
  `topic_post_count` INT DEFAULT 1,
  `topic_view_count` INT DEFAULT 0,
  `topic_created` INT NOT NULL,
  FOREIGN KEY (`topic_forum_id`) REFERENCES `xoops_forum_forums`(`forum_id`)
);

-- Posts
CREATE TABLE `xoops_forum_posts` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_topic_id` INT NOT NULL,
  `post_forum_id` INT NOT NULL,
  `post_author_id` INT NOT NULL,
  `post_content` LONGTEXT NOT NULL,
  `post_created` INT NOT NULL,
  FOREIGN KEY (`post_topic_id`) REFERENCES `xoops_forum_topics`(`topic_id`)
);

-- Subscriptions
CREATE TABLE `xoops_forum_subscriptions` (
  `subscription_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subscription_user_id` INT NOT NULL,
  `subscription_topic_id` INT NOT NULL,
  UNIQUE (`subscription_user_id`, `subscription_topic_id`)
);
```

## 实体类

### 主题实体

```php
<?php
class Topic
{
    private $id;
    private $forumId;
    private $authorId;
    private $title;
    private $postCount = 1;
    private $viewCount = 0;
    private $createdAt;
    
    // Getters and setters...
    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; return $this; }
    
    public function getForumId() { return $this->forumId; }
    public function setForumId($id) { $this->forumId = $id; return $this; }
    
    public function getTitle() { return $this->title; }
    public function setTitle($t) { $this->title = $t; return $this; }
    
    public function getPostCount() { return $this->postCount; }
    public function incrementPostCount() { $this->postCount++; return $this; }
    
    public function getViewCount() { return $this->viewCount; }
    public function incrementViewCount() { $this->viewCount++; return $this; }
}
?>
```

## 具有关系的存储库

```php
<?php
class TopicRepository
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function getWithAuthorInfo($id)
    {
        $sql = "SELECT t.*, u.uname as author_name
                FROM " . $this->db->prefix('forum_topics') . " t
                LEFT JOIN " . $this->db->prefix('users') . " u
                ON t.topic_author_id = u.uid
                WHERE t.topic_id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }
    
    public function getByForumWithStats($forumId, $limit = 20, $offset = 0)
    {
        $sql = "SELECT t.*, u.uname as author_name,
                        COUNT(p.post_id) as post_count
                FROM " . $this->db->prefix('forum_topics') . " t
                LEFT JOIN " . $this->db->prefix('users') . " u
                ON t.topic_author_id = u.uid
                LEFT JOIN " . $this->db->prefix('forum_posts') . " p
                ON t.topic_id = p.post_topic_id
                WHERE t.topic_forum_id = ?
                GROUP BY t.topic_id
                ORDER BY t.topic_created DESC
                LIMIT ?, ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('iii', $forumId, $offset, $limit);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $topics = [];
        while ($row = $result->fetch_assoc()) {
            $topics[] = $row;
        }
        
        return $topics;
    }
}
?>
```

## 服务层

```php
<?php
class TopicService
{
    private $topicRepository;
    private $postRepository;
    private $notificationHandler;
    
    public function __construct(
        TopicRepository $topicRepository,
        PostRepository $postRepository,
        NotificationHandler $notificationHandler
    ) {
        $this->topicRepository = $topicRepository;
        $this->postRepository = $postRepository;
        $this->notificationHandler = $notificationHandler;
    }
    
    public function createTopic($forumId, $userId, $title, $content)
    {
        // Validate
        if (strlen($title) < 3) {
            throw new \InvalidArgumentException('Title too short');
        }
        
        // Create topic
        $topic = new Topic();
        $topic->setForumId($forumId)
            ->setAuthorId($userId)
            ->setTitle($title)
            ->setCreatedAt(new \DateTime());
        
        $topicId = $this->topicRepository->save($topic);
        
        // Create first post
        $this->postRepository->createPost($topicId, $forumId, $userId, $content);
        
        // Notify subscribers
        $this->notificationHandler->notifyNewTopic($topicId);
        
        return $topicId;
    }
    
    public function getTopicWithPosts($topicId, $page = 1, $perPage = 20)
    {
        // Get topic with author info
        $topic = $this->topicRepository->getWithAuthorInfo($topicId);
        
        if (!$topic) {
            throw new \RuntimeException('Topic not found');
        }
        
        // Increment view count
        $topic['topic_view_count']++;
        $this->topicRepository->updateViewCount($topicId, $topic['topic_view_count']);
        
        // Get posts
        $offset = ($page - 1) * $perPage;
        $posts = $this->postRepository->getByTopicId($topicId, $perPage, $offset);
        
        return [
            'topic' => $topic,
            'posts' => $posts,
            'page' => $page,
            'totalPages' => ceil($topic['topic_post_count'] / $perPage),
        ];
    }
}
?>
```

## 高级功能

此示例演示：

1. **实体关系** - 论坛包含主题，主题包含帖子
2. **复杂查询** - 连接用户信息和统计数据
3. **服务协调** - 多个服务协同工作
4. **数据聚合** - 帖子计数、查看计数
5. **通知** - 订阅事件-driven通知
6. **交易-like操作** - 使用初始帖子创建主题

## 相关模式

另请参阅：
- ../Patterns/Repository-Pattern用于复杂查询
- ../Patterns/Service-Layer 用于服务协调
- ../Patterns/DTO-Pattern用于数据传输

---

标签：#examples #advanced-module #complex-example #relationships #module-development