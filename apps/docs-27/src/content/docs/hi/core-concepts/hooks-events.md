---
title: "हुक और घटनाएँ"
---
## अवलोकन

XOOPS विस्तार बिंदुओं के रूप में हुक और इवेंट प्रदान करता है जो मॉड्यूल को मुख्य कार्यक्षमता और एक दूसरे के साथ प्रत्यक्ष निर्भरता के बिना बातचीत करने की अनुमति देता है।

## हुक बनाम घटनाएँ

| पहलू | हुक्स | घटनाएँ |
|--------|-------|--------|
| उद्देश्य | व्यवहार/डेटा संशोधित करें | घटनाओं पर प्रतिक्रिया |
| वापसी | संशोधित डेटा लौटा सकते हैं | आमतौर पर शून्य |
| समय | कार्रवाई से पहले/उस दौरान | कार्रवाई के बाद |
| पैटर्न | फ़िल्टर श्रृंखला | ऑब्जर्वर/पब-उप |

## हुक सिस्टम

### हुक पंजीकृत करना

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

### हुक कॉलबैक

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

### उपलब्ध कोर हुक

| हुक का नाम | डेटा | विवरण |
|----|------|----|
| `user.profile.display` | उपयोगकर्ता डेटा सरणी | प्रोफ़ाइल प्रदर्शन संशोधित करें |
| `content.render` | सामग्री HTML | सामग्री आउटपुट फ़िल्टर करें |
| `form.submit` | फॉर्म डेटा | फॉर्म डेटा को सत्यापित/संशोधित करें |
| `search.results` | परिणाम सरणी | खोज परिणाम फ़िल्टर करें |
| `menu.main` | मेनू आइटम | मुख्य मेनू संशोधित करें |

## इवेंट सिस्टम

### प्रेषण घटनाएँ

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

### घटनाओं को सुनना

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

## प्रीलोड इवेंट संदर्भ

### मुख्य घटनाएँ

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

### उपयोगकर्ता घटनाएँ

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

### मॉड्यूल इवेंट

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## कस्टम मॉड्यूल इवेंट

### घटनाओं को परिभाषित करना

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

### ट्रिगर करने वाली घटनाएँ

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

### मॉड्यूल इवेंट सुनना

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

## सर्वोत्तम प्रथाएँ

1. **विशिष्ट नामों का उपयोग करें** - `module.entity.action` प्रारूप
2. **न्यूनतम डेटा पास करें** - केवल वही जो श्रोताओं को चाहिए
3. **दस्तावेज़ घटनाएँ** - मॉड्यूल दस्तावेज़ों में घटनाओं की सूची बनाएं
4. **दुष्प्रभावों से बचें** - श्रोताओं का ध्यान केंद्रित रखें
5. **त्रुटियों को संभालें** - श्रोता की त्रुटियों को प्रवाहित न होने दें

## संबंधित दस्तावेज़ीकरण

- इवेंट-सिस्टम - विस्तृत इवेंट दस्तावेज़ीकरण
- ../03-मॉड्यूल-विकास/मॉड्यूल-विकास - मॉड्यूल विकास
- ../07-XOOPS-4.0/इम्प्लीमेंटेशन-गाइड्स/इवेंट-सिस्टम-गाइड - पीएसआर-14 इवेंट