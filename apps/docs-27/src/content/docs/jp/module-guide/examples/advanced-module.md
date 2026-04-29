---
title: "高度なモジュール例"
description: "複数のテーブル、リレーションシップ、管理インターフェース、ブロックを備えた複雑なモジュール"
---

# 高度なモジュール例 - フォーラム

複数のエンティティ型、リレーションシップ、複雑な管理インターフェース、通知を示す包括的な「フォーラム」モジュール。

## モジュール構造

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

## データベーススキーマ

```sql
-- フォーラム
CREATE TABLE `xoops_forum_forums` (
  `forum_id` INT AUTO_INCREMENT PRIMARY KEY,
  `forum_name` VARCHAR(255) NOT NULL,
  `forum_description` TEXT,
  `forum_order` INT,
  `forum_created` INT NOT NULL
);

-- トピック
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

-- 投稿
CREATE TABLE `xoops_forum_posts` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_topic_id` INT NOT NULL,
  `post_forum_id` INT NOT NULL,
  `post_author_id` INT NOT NULL,
  `post_content` LONGTEXT NOT NULL,
  `post_created` INT NOT NULL,
  FOREIGN KEY (`post_topic_id`) REFERENCES `xoops_forum_topics`(`topic_id`)
);

-- サブスクリプション
CREATE TABLE `xoops_forum_subscriptions` (
  `subscription_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subscription_user_id` INT NOT NULL,
  `subscription_topic_id` INT NOT NULL,
  UNIQUE (`subscription_user_id`, `subscription_topic_id`)
);
```

## エンティティクラス

### トピックエンティティ

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
    
    // ゲッターとセッター...
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

## リレーションシップを持つリポジトリ

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

## サービスレイヤー

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
        // 検証
        if (strlen($title) < 3) {
            throw new \InvalidArgumentException('タイトルが短すぎます');
        }
        
        // トピックを作成
        $topic = new Topic();
        $topic->setForumId($forumId)
            ->setAuthorId($userId)
            ->setTitle($title)
            ->setCreatedAt(new \DateTime());
        
        $topicId = $this->topicRepository->save($topic);
        
        // 最初の投稿を作成
        $this->postRepository->createPost($topicId, $forumId, $userId, $content);
        
        // サブスクライバーに通知
        $this->notificationHandler->notifyNewTopic($topicId);
        
        return $topicId;
    }
    
    public function getTopicWithPosts($topicId, $page = 1, $perPage = 20)
    {
        // 著者情報付きトピックを取得
        $topic = $this->topicRepository->getWithAuthorInfo($topicId);
        
        if (!$topic) {
            throw new \RuntimeException('トピックが見つかりません');
        }
        
        // ビュー数をインクリメント
        $topic['topic_view_count']++;
        $this->topicRepository->updateViewCount($topicId, $topic['topic_view_count']);
        
        // 投稿を取得
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

## 高度な機能

このサンプルは以下を示します:

1. **エンティティリレーションシップ** - フォーラムはトピックを含む、トピックは投稿を含む
2. **複雑なクエリ** - ユーザー情報と統計を含むJOIN
3. **サービス調整** - 複数のサービスが連携
4. **データ集約** - 投稿数、ビュー数
5. **通知** - サブスクリプション用のイベント駆動型通知
6. **トランザクションのような操作** - 初期投稿を含むトピックを作成

## 関連パターン

関連トピック:
- ../Patterns/Repository-Pattern - 複雑なクエリ
- ../Patterns/Service-Layer - サービス調整
- ../Patterns/DTO-Pattern - データ転送

---

タグ: #examples #advanced-module #complex-example #relationships #module-development
