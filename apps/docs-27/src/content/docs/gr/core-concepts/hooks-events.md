---
title: "Άγκιστρα και εκδηλώσεις"
---

## Επισκόπηση

Το XOOPS παρέχει άγκιστρα και συμβάντα ως σημεία επέκτασης που επιτρέπουν στις μονάδες να αλληλεπιδρούν με τη βασική λειτουργικότητα και μεταξύ τους χωρίς άμεσες εξαρτήσεις.

## Hooks vs Events

| Όψη | Άγκιστρα | Εκδηλώσεις |
|--------|-------|--------|
| Σκοπός | Τροποποίηση behavior/data | Αντίδραση σε περιστατικά |
| Επιστροφή | Μπορεί να επιστρέψει τροποποιημένα δεδομένα | Τυπικά άκυρο |
| Χρονομέτρηση | Before/during δράση | Μετά από δράση |
| Μοτίβο | Αλυσίδα φίλτρου | Observer/pub-sub |

## Σύστημα αγκίστρου

## # Εγγραφή αγκίστρων

```php
// Register a hook in xoops_version.php
$modversion['hooks'][] = [
    'name'     => 'user.profile.display',
    'callback' => 'mymodule_hook_user_profile',
    'priority' => 10,
];
```

## # Άγκιστρο επανάκληση

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

## # Διαθέσιμα άγκιστρα πυρήνα

| Όνομα γάντζου | Δεδομένα | Περιγραφή |
|-----------|------|-------------|
| `user.profile.display` | Συστοιχία δεδομένων χρήστη | Τροποποίηση εμφάνισης προφίλ |
| `content.render` | Περιεχόμενο HTML | Φιλτράρισμα εξόδου περιεχομένου |
| `form.submit` | Δεδομένα φόρμας | Validate/modify δεδομένα φόρμας |
| `search.results` | Πίνακας αποτελεσμάτων | Φιλτράρισμα αποτελεσμάτων αναζήτησης |
| `menu.main` | Στοιχεία μενού | Τροποποίηση του κύριου μενού |

## Σύστημα εκδηλώσεων

## # Αποστολή συμβάντων

```php
// In your module code
$eventHandler = xoops_getHandler('event');

$eventHandler->trigger('mymodule.article.created', [
    'article_id' => $article->id(),
    'author_id'  => $article->authorId(),
    'title'      => $article->title(),
]);
```

## # Ακρόαση για εκδηλώσεις

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

## Αναφορά προφόρτωσης συμβάντων

## # Βασικά συμβάντα

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

## # Συμβάντα χρήστη

```php
public function eventUserLogin(array $args): void {}
public function eventUserLogout(array $args): void {}
public function eventUserRegister(array $args): void {}
public function eventUserActivate(array $args): void {}
public function eventUserDelete(array $args): void {}
```

## # Εκδηλώσεις ενότητας

```php
public function eventSystemModuleInstall(array $args): void {}
public function eventSystemModuleUninstall(array $args): void {}
public function eventSystemModuleUpdate(array $args): void {}
public function eventSystemModuleActivate(array $args): void {}
public function eventSystemModuleDeactivate(array $args): void {}
```

## Συμβάντα προσαρμοσμένης μονάδας

## # Καθορισμός συμβάντων

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

## # Ενεργοποίηση συμβάντων

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

## # Ακρόαση συμβάντων ενότητας

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

## Βέλτιστες πρακτικές

1. **Χρησιμοποιήστε συγκεκριμένα ονόματα** - μορφή `module.entity.action`
2. **Περάστε ελάχιστα δεδομένα** - Μόνο ό,τι χρειάζονται οι ακροατές
3. **Συμβάντα εγγράφου** - Καταχωρίστε συμβάντα στα έγγραφα της ενότητας
4. **Αποφύγετε τις παρενέργειες** - Κρατήστε τους ακροατές συγκεντρωμένους
5. **Χειρισμός σφαλμάτων** - Μην αφήνετε τα σφάλματα ακροατών να διακόπτουν τη ροή

## Σχετική τεκμηρίωση

- Σύστημα συμβάντων - Αναλυτική τεκμηρίωση συμβάντων
- ../03-Module-Development/Module-Development - Ανάπτυξη ενότητας
- ../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide - PSR-14 συμβάντα
