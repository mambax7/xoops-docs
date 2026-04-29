---
title: "ตัวอย่างโมดูลขั้นสูง"
description: "โมดูลที่ซับซ้อนพร้อมหลายตาราง ความสัมพันธ์ อินเทอร์เฟซผู้ดูแลระบบ และบล็อก"
---
# ตัวอย่างโมดูลขั้นสูง - ฟอรัม

โมดูล "ฟอรัม" ที่ครอบคลุมซึ่งสาธิตรูปแบบขั้นสูง: เอนทิตีหลายประเภท ความสัมพันธ์ อินเทอร์เฟซผู้ดูแลระบบที่ซับซ้อน และการแจ้งเตือน

## โครงสร้างโมดูล
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
## สคีมาฐานข้อมูล
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
## คลาสเอนทิตี

### เอนทิตีหัวข้อ
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
## พื้นที่เก็บข้อมูลที่มีความสัมพันธ์
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
## ชั้นบริการ
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
## คุณสมบัติขั้นสูง

ตัวอย่างนี้แสดงให้เห็นว่า:

1. **ความสัมพันธ์ของเอนทิตี** - ฟอรัมประกอบด้วยหัวข้อ หัวข้อประกอบด้วยโพสต์
2. **ข้อความค้นหาที่ซับซ้อน** - เข้าร่วมกับข้อมูลผู้ใช้และสถิติ
3. **การประสานงานด้านบริการ** - บริการหลายอย่างที่ทำงานร่วมกัน
4. **การรวมข้อมูล** - จำนวนโพสต์, จำนวนการดู
5. **การแจ้งเตือน** - การแจ้งเตือนตามเหตุการณ์สำหรับการสมัครสมาชิก
6. **การดำเนินการเหมือนธุรกรรม** - การสร้างหัวข้อด้วยการโพสต์เริ่มต้น

## รูปแบบที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- ../Patterns/Repository-Pattern สำหรับการสืบค้นที่ซับซ้อน
- ../Patterns/Service-Layer สำหรับการประสานงานการบริการ
- ../Patterns/DTO-รูปแบบการถ่ายโอนข้อมูล

---

Tags: #ตัวอย่าง #โมดูลขั้นสูง #ตัวอย่างที่ซับซ้อน #ความสัมพันธ์ #การพัฒนาโมดูล