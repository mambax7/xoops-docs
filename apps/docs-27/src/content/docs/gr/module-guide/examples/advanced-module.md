---
title: "Παράδειγμα ενότητας για προχωρημένους"
description: "Πολύπλοκη ενότητα με πολλούς πίνακες, σχέσεις, διεπαφή διαχειριστή και μπλοκ"
---

# Παράδειγμα ενότητας για προχωρημένους - Φόρουμ

Μια ολοκληρωμένη ενότητα "Φόρουμ" που παρουσιάζει προηγμένα μοτίβα: πολλαπλούς τύπους οντοτήτων, σχέσεις, σύνθετη διεπαφή διαχειριστή και ειδοποιήσεις.

## Δομή ενότητας

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

## Σχήμα βάσης δεδομένων

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

## Τάξεις οντοτήτων

## # Θεματική οντότητα

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

## Αποθετήριο με σχέσεις

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

## Επίπεδο υπηρεσίας

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

## Προηγμένες δυνατότητες

Αυτό το παράδειγμα δείχνει:

1. **Σχέσεις οντοτήτων** - Τα φόρουμ περιέχουν θέματα, τα θέματα περιέχουν δημοσιεύσεις
2. **Σύνθετα ερωτήματα** - Συμμετέχει με πληροφορίες χρήστη και στατιστικά στοιχεία
3. **Συντονισμός υπηρεσιών** - Πολλαπλές υπηρεσίες που συνεργάζονται
4. **Συγκέντρωση δεδομένων** - Αριθμοί αναρτήσεων, μετρήσεις προβολών
5. **Ειδοποιήσεις** - Ειδοποιήσεις βάσει συμβάντων για συνδρομές
6. **Λειτουργίες που μοιάζουν με συναλλαγές** - Δημιουργία θέματος με την αρχική ανάρτηση

## Σχετικά μοτίβα

Δείτε επίσης:
- ../Patterns/Repository-Pattern για σύνθετα ερωτήματα
- ../Patterns/Service-Layer για συντονισμό σέρβις
- ../Patterns/DTO-Μοτίβο για μεταφορά δεδομένων

---

Ετικέτες: #examples #advanced-module #complex-example #σχέσεις #module-development
