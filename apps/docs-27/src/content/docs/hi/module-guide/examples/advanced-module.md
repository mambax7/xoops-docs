---
title: "उन्नत मॉड्यूल उदाहरण"
description: "एकाधिक तालिकाओं, संबंधों, व्यवस्थापक इंटरफ़ेस और ब्लॉक के साथ जटिल मॉड्यूल"
---
# उन्नत मॉड्यूल उदाहरण - फोरम

उन्नत पैटर्न प्रदर्शित करने वाला एक व्यापक "फोरम" मॉड्यूल: कई इकाई प्रकार, रिश्ते, जटिल व्यवस्थापक इंटरफ़ेस और सूचनाएं।

## मॉड्यूल संरचना

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

## डेटाबेस स्कीमा

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

## इकाई वर्ग

### विषय इकाई

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

## रिश्तों के साथ भंडार

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

## सेवा परत

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

## उन्नत सुविधाएँ

यह उदाहरण दर्शाता है:

1. **इकाई संबंध** - फ़ोरम में विषय होते हैं, विषयों में पोस्ट होते हैं
2. **जटिल प्रश्न** - उपयोगकर्ता जानकारी और आंकड़ों के साथ जुड़ता है
3. **सेवा समन्वय** - एक साथ काम करने वाली कई सेवाएँ
4. **डेटा एकत्रीकरण** - पोस्ट की संख्या, देखे जाने की संख्या
5. **सूचनाएँ** - सदस्यता के लिए ईवेंट-संचालित सूचनाएं
6. **लेन-देन-जैसे संचालन** - प्रारंभिक पोस्ट के साथ विषय बनाना

## संबंधित पैटर्न

यह भी देखें:
- जटिल प्रश्नों के लिए ../पैटर्न/रिपोजिटरी-पैटर्न
- ../सेवा समन्वय के लिए पैटर्न/सेवा-परत
- ../पैटर्न/डेटा ट्रांसफर के लिए डीटीओ-पैटर्न

---

टैग: #उदाहरण #उन्नत-मॉड्यूल #जटिल-उदाहरण #रिश्ते #मॉड्यूल-विकास