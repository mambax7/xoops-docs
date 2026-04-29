---
title: "Systém povolení"
description: "Kompletní průvodce systémem oprávnění XOOPS, typy, kontrola, hierarchie a řízení přístupu"
---

# Systém oprávnění v XOOPS

Systém oprávnění XOOPS je granulární rámec řízení přístupu, který řídí, kdo může provádět jaké akce na kterých zdrojích. Tento dokument popisuje typy oprávnění, kontrolní mechanismy, hierarchii a příklady implementace.

## Typy oprávnění

### Oprávnění na úrovni modulu

Oprávnění na úrovni modulu řídí přístup k celým modulům nebo funkcím modulu.

**Běžná jména oprávnění:**
- `module_view` - Zobrazení obsahu modulu
- `module_read` - Čtení zdrojů modulu
- `module_submit` - Odešlete obsah do modulu
- `module_edit` - Úprava obsahu modulu
- `module_admin` - Modul správy

```php
<?php
/**
 * Module permission example
 */

$permissionHandler = xoops_getHandler('groupperm');
$userGroups = $xoopsUser->getGroups();
$moduleId = 2; // Article module

// Check if user can view module
$canView = false;
foreach ($userGroups as $groupId) {
    if ($permissionHandler->checkRight('module_view', $groupId, $moduleId)) {
        $canView = true;
        break;
    }
}

if (!$canView) {
    redirect('index.php?error=no_access');
}
```

### Oprávnění na úrovni položky

Oprávnění na úrovni položek řídí přístup ke konkrétním zdrojům v rámci modulu.

**Příklady:**
- ID článku: Může skupina view/edit konkrétní článek?
- ID kategorie: Může skupina přistupovat ke kategorii?
- ID stránky: Může seskupit konkrétní stránku view/modify?

```php
<?php
/**
 * Item permission example
 */

$permissionHandler = xoops_getHandler('groupperm');
$userGroups = $xoopsUser->getGroups();
$moduleId = 2;      // Article module
$articleId = 42;    // Specific article

// Check if user can edit specific article
$canEdit = false;
foreach ($userGroups as $groupId) {
    if ($permissionHandler->checkRight(
        'item_edit',
        $groupId,
        $moduleId,
        $articleId
    )) {
        $canEdit = true;
        break;
    }
}
```

### Blokovat oprávnění

Bloková oprávnění řídí viditelnost a interakci s bloky zobrazenými na stránkách.

```php
<?php
/**
 * Block permission example
 */

$permissionHandler = xoops_getHandler('groupperm');
$userGroups = $xoopsUser->getGroups();

// Check if user can view block
$blockId = 5;
$canViewBlock = false;

foreach ($userGroups as $groupId) {
    if ($permissionHandler->checkRight('block_view', $groupId, 1, $blockId)) {
        $canViewBlock = true;
        break;
    }
}
```

### Skupinová oprávnění

Oprávnění k řízení a správě skupiny.

```php
<?php
/**
 * Group management permission example
 */

$permissionHandler = xoops_getHandler('groupperm');
$userGroups = $xoopsUser->getGroups();

// Check if user can manage groups
$canManageGroups = false;
foreach ($userGroups as $groupId) {
    if ($permissionHandler->checkRight('group_admin', $groupId, 1)) {
        $canManageGroups = true;
        break;
    }
}
```

## Hierarchie oprávnění

### Diagram struktury oprávnění

```mermaid
graph TB
    SYSTEM["XOOPS System<br/>Global Permissions"]

    SYSTEM --> MODULES["Module Level<br/>Module Access Control"]
    SYSTEM --> ADMIN["Admin Level<br/>System Administration"]
    SYSTEM --> GROUPS["Group Level<br/>Group Management"]

    MODULES --> ITEM["Item Level<br/>Specific Resources"]
    MODULES --> BLOCK["Block Level<br/>Block Display"]
    MODULES --> CUSTOM["Custom Permissions<br/>Module Defined"]

    ITEM --> VIEW["View Permission"]
    ITEM --> EDIT["Edit Permission"]
    ITEM --> DELETE["Delete Permission"]
    ITEM --> SUBMIT["Submit Permission"]

    CUSTOM --> PERM1["Custom Perm 1"]
    CUSTOM --> PERM2["Custom Perm 2"]
    CUSTOM --> PERM3["Custom Perm 3"]

    VIEW --> GRANT["User Granted<br/>via Group"]
    EDIT --> GRANT
    DELETE --> GRANT
```

### Řetězec dědičnosti oprávnění

```mermaid
sequenceDiagram
    participant User as User
    participant Groups as User Groups
    participant Perms as Permission Check
    participant Result as Access Decision

    User->>Groups: Get User's Groups
    Groups-->>Perms: Group IDs
    Perms->>Perms: Check Module Permission
    Perms->>Perms: Check Item Permission
    Perms->>Perms: Merge Results (OR logic)
    Perms-->>Result: Has Permission?
    Result->>Result: Grant or Deny Access
    Result-->>User: Access Status
```

## Kontrola oprávnění

### XOOPSGroupPermHandler

Třída `XOOPSGroupPermHandler` poskytuje metody pro kontrolu a správu oprávnění.

```php
<?php
/**
 * XOOPSGroupPermHandler methods
 */

class XOOPSGroupPermHandler
{
    /**
     * Check if group has permission
     *
     * @param string $gperm_name Permission name
     * @param int $gperm_group_id Group ID
     * @param int $gperm_modid Module ID
     * @param int $gperm_itemid Item ID (optional)
     * @return bool Permission status
     */
    public function checkRight(
        $gperm_name,
        $gperm_group_id,
        $gperm_modid,
        $gperm_itemid = 0
    ) { }

    /**
     * Add permission to group
     *
     * @param string $gperm_name Permission name
     * @param int $gperm_group_id Group ID
     * @param int $gperm_modid Module ID
     * @param int $gperm_itemid Item ID (optional)
     * @return bool Success status
     */
    public function addRight(
        $gperm_name,
        $gperm_group_id,
        $gperm_modid,
        $gperm_itemid = 0
    ) { }

    /**
     * Remove permission from group
     *
     * @param string $gperm_name Permission name
     * @param int $gperm_group_id Group ID
     * @param int $gperm_modid Module ID
     * @param int $gperm_itemid Item ID (optional)
     * @return bool Success status
     */
    public function deleteRight(
        $gperm_name,
        $gperm_group_id,
        $gperm_modid,
        $gperm_itemid = 0
    ) { }

    /**
     * Get all permissions for group in module
     *
     * @param int $groupId Group ID
     * @param int $modId Module ID
     * @return array Permission list
     */
    public function getGroupPermissions($groupId, $modId) { }

    /**
     * Get permitted item IDs for group
     *
     * @param string $permName Permission name
     * @param int $groupId Group ID
     * @param int $modId Module ID
     * @return array Item IDs
     */
    public function getPermittedItemIds(
        $permName,
        $groupId,
        $modId
    ) { }
}
```

## Implementace kontroly oprávnění

### Kontrola oprávnění pro jednoho uživatele

```php
<?php
/**
 * Permission checking utility
 */
class PermissionChecker
{
    private $permissionHandler;
    private $user;

    public function __construct(XOOPSUser $user = null)
    {
        $this->permissionHandler = xoops_getHandler('groupperm');
        $this->user = $user ?? $GLOBALS['xoopsUser'] ?? null;
    }

    /**
     * Check if user has permission
     *
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @return bool Permission status
     */
    public function hasPermission(
        string $permissionName,
        int $moduleId,
        int $itemId = 0
    ): bool
    {
        if (!$this->user instanceof XOOPSUser) {
            return false;
        }

        $userGroups = $this->user->getGroups();

        foreach ($userGroups as $groupId) {
            if ($this->permissionHandler->checkRight(
                $permissionName,
                $groupId,
                $moduleId,
                $itemId
            )) {
                return true;
            }
        }

        return false;
    }

    /**
     * Require permission or deny access
     *
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @throws Exception If permission denied
     */
    public function requirePermission(
        string $permissionName,
        int $moduleId,
        int $itemId = 0
    ): void
    {
        if (!$this->hasPermission($permissionName, $moduleId, $itemId)) {
            throw new Exception('Permission denied');
        }
    }

    /**
     * Get permitted item IDs
     *
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @return array Item IDs user can access
     */
    public function getPermittedItems(
        string $permissionName,
        int $moduleId
    ): array
    {
        if (!$this->user instanceof XOOPSUser) {
            return [];
        }

        $permitted = [];
        $userGroups = $this->user->getGroups();

        foreach ($userGroups as $groupId) {
            $items = $this->permissionHandler->getPermittedItemIds(
                $permissionName,
                $groupId,
                $moduleId
            );
            $permitted = array_merge($permitted, $items);
        }

        return array_unique($permitted);
    }

    /**
     * Check multiple permissions (AND logic)
     *
     * @param array $permissions Permission names
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @return bool All permissions granted
     */
    public function hasAllPermissions(
        array $permissions,
        int $moduleId,
        int $itemId = 0
    ): bool
    {
        foreach ($permissions as $perm) {
            if (!$this->hasPermission($perm, $moduleId, $itemId)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check multiple permissions (OR logic)
     *
     * @param array $permissions Permission names
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @return bool Any permission granted
     */
    public function hasAnyPermission(
        array $permissions,
        int $moduleId,
        int $itemId = 0
    ): bool
    {
        foreach ($permissions as $perm) {
            if ($this->hasPermission($perm, $moduleId, $itemId)) {
                return true;
            }
        }
        return false;
    }
}
```

### Middleware pro oprávnění

```php
<?php
/**
 * Permission middleware for request filtering
 */
class PermissionMiddleware
{
    private $permissionChecker;

    public function __construct(PermissionChecker $checker)
    {
        $this->permissionChecker = $checker;
    }

    /**
     * Enforce permission on request
     *
     * @param string $permissionName Permission to check
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @return void Halts execution on permission denied
     */
    public function enforce(
        string $permissionName,
        int $moduleId,
        int $itemId = 0
    ): void
    {
        try {
            $this->permissionChecker->requirePermission(
                $permissionName,
                $moduleId,
                $itemId
            );
        } catch (Exception $e) {
            // Log permission denial
            error_log(sprintf(
                'Permission denied: %s (User: %s, Module: %d, Item: %d)',
                $permissionName,
                $GLOBALS['xoopsUser']?->getVar('uname') ?? 'anonymous',
                $moduleId,
                $itemId
            ));

            // Send error response
            header('HTTP/1.1 403 Forbidden');
            die('Access denied');
        }
    }

    /**
     * Filter array of items by permission
     *
     * @param array $items Items to filter
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @param callable $idExtractor Callback to extract ID from item
     * @return array Filtered items
     */
    public function filterByPermission(
        array $items,
        string $permissionName,
        int $moduleId,
        callable $idExtractor
    ): array
    {
        return array_filter($items, function($item) use (
            $permissionName,
            $moduleId,
            $idExtractor
        ) {
            $itemId = $idExtractor($item);
            return $this->permissionChecker->hasPermission(
                $permissionName,
                $moduleId,
                $itemId
            );
        });
    }
}
```

## Praktické příklady implementace

### Řízení přístupu k modulu

```php
<?php
/**
 * Module access control example
 */

// Get current module
$moduleId = $GLOBALS['xoopsModule']->getVar('mid');
$moduleDir = $GLOBALS['xoopsModule']->getVar('dirname');

// Create permission checker
$checker = new PermissionChecker();

// Check module view permission
if (!$checker->hasPermission('module_view', $moduleId)) {
    redirect('index.php?error=access_denied');
}

// Get items user can access
$permittedItems = $checker->getPermittedItems('item_view', $moduleId);

// Build query to only show permitted items
$sql = 'SELECT * FROM articles WHERE id IN (' . implode(',', $permittedItems) . ')';
```

### Příklad správy obsahu

```php
<?php
/**
 * Article management with permissions
 */

class ArticleManager
{
    private $permissionChecker;
    private $moduleId = 2;

    public function __construct(PermissionChecker $checker)
    {
        $this->permissionChecker = $checker;
    }

    /**
     * Get articles user can view
     *
     * @return array Article list
     */
    public function getViewableArticles(): array
    {
        $this->permissionChecker->requirePermission(
            'module_view',
            $this->moduleId
        );

        $permittedIds = $this->permissionChecker->getPermittedItems(
            'article_view',
            $this->moduleId
        );

        if (empty($permittedIds)) {
            return [];
        }

        $db = XOOPSDatabaseFactory::getDatabaseConnection();
        $result = $db->query(
            'SELECT * FROM articles WHERE id IN (' .
            implode(',', $permittedIds) .
            ') AND published = 1'
        );

        $articles = [];
        while ($row = $db->fetchArray($result)) {
            $articles[] = $row;
        }

        return $articles;
    }

    /**
     * Create article with permission check
     *
     * @param array $data Article data
     * @return int Article ID
     */
    public function createArticle(array $data): int
    {
        $this->permissionChecker->requirePermission(
            'article_create',
            $this->moduleId
        );

        $db = XOOPSDatabaseFactory::getDatabaseConnection();
        $db->query(
            'INSERT INTO articles (title, content, author_id, created) VALUES (?, ?, ?, ?)',
            array($data['title'], $data['content'], $_SESSION['xoopsUserId'], time())
        );

        return $db->getInsertId();
    }

    /**
     * Update article with permission check
     *
     * @param int $articleId Article ID
     * @param array $data Update data
     * @return bool Success
     */
    public function updateArticle(int $articleId, array $data): bool
    {
        $this->permissionChecker->requirePermission(
            'article_edit',
            $this->moduleId,
            $articleId
        );

        $db = XOOPSDatabaseFactory::getDatabaseConnection();
        return (bool)$db->query(
            'UPDATE articles SET title = ?, content = ? WHERE id = ?',
            array($data['title'], $data['content'], $articleId)
        );
    }

    /**
     * Delete article with permission check
     *
     * @param int $articleId Article ID
     * @return bool Success
     */
    public function deleteArticle(int $articleId): bool
    {
        $this->permissionChecker->requirePermission(
            'article_delete',
            $this->moduleId,
            $articleId
        );

        $db = XOOPSDatabaseFactory::getDatabaseConnection();
        return (bool)$db->query(
            'DELETE FROM articles WHERE id = ?',
            array($articleId)
        );
    }
}
```

### Kontrola oprávnění panelu administrátora

```php
<?php
/**
 * Admin panel access control
 */

// Verify user is webmaster
if (!in_array(1, $xoopsUser->getGroups())) {
    redirect('index.php');
    exit;
}

$checker = new PermissionChecker();
$moduleId = $GLOBALS['xoopsModule']->getVar('mid');

// Check admin permission
$checker->requirePermission('module_admin', $moduleId);

// Load admin content
?>
<h1>Admin Panel</h1>
<p>Welcome, Administrator</p>
```

## Ukládání oprávnění do mezipaměti

### Optimalizovaná kontrola oprávnění

```php
<?php
/**
 * Cached permission checker for performance
 */
class CachedPermissionChecker extends PermissionChecker
{
    private $cache = [];
    private $cachePrefix = 'xoops_perm_';

    /**
     * Check permission with caching
     *
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @param int $itemId Item ID (optional)
     * @return bool Permission status
     */
    public function hasPermission(
        string $permissionName,
        int $moduleId,
        int $itemId = 0
    ): bool
    {
        $cacheKey = $this->getCacheKey(
            $permissionName,
            $moduleId,
            $itemId
        );

        // Check memory cache
        if (isset($this->cache[$cacheKey])) {
            return $this->cache[$cacheKey];
        }

        // Check APCu cache
        $cacheKeyFull = $this->cachePrefix . $cacheKey;
        $cached = apcu_fetch($cacheKeyFull);
        if ($cached !== false) {
            $this->cache[$cacheKey] = $cached;
            return $cached;
        }

        // Check actual permission
        $result = parent::hasPermission($permissionName, $moduleId, $itemId);

        // Cache result (1 hour TTL)
        $this->cache[$cacheKey] = $result;
        apcu_store($cacheKeyFull, $result, 3600);

        return $result;
    }

    /**
     * Generate cache key
     *
     * @param string $permissionName Permission name
     * @param int $moduleId Module ID
     * @param int $itemId Item ID
     * @return string Cache key
     */
    private function getCacheKey(
        string $permissionName,
        int $moduleId,
        int $itemId
    ): string
    {
        $uid = $this->user?->getVar('uid') ?? 0;
        return md5("{$uid}_{$permissionName}_{$moduleId}_{$itemId}");
    }

    /**
     * Clear permission cache for user
     *
     * @param int $uid User ID
     */
    public static function clearUserCache(int $uid): void
    {
        // This would need to be more sophisticated in production
        apcu_clear_cache();
    }
}
```

## Nejlepší bezpečnostní postupy

### Pravidla přidělování oprávnění

1. **Princip nejmenšího privilegia**: Přidělujte pouze nezbytná oprávnění
2. **Přístup na základě rolí**: Používejte skupiny pro oprávnění na základě rolí
3. **Pravidelné audity**: Pravidelně kontrolujte oprávnění
4. **Oddělení povinností**: Oddělte oprávnění správce od oprávnění uživatele
5. **Explicit Deny**: Výchozí odmítnutí, explicitní povolení přístupu

### Ověření oprávnění

```php
<?php
/**
 * Permission validation best practices
 */

// Always check permission before action
$moduleId = 2;
$articleId = 42;

try {
    $checker = new PermissionChecker();

    // Explicit permission check
    if (!$checker->hasPermission('article_edit', $moduleId, $articleId)) {
        throw new Exception('Insufficient permissions');
    }

    // Perform action only after permission verified
    updateArticle($articleId);

} catch (Exception $e) {
    // Log security event
    error_log('Permission denied: ' . $e->getMessage());
    // Show user-friendly error
    die('You do not have permission to perform this action');
}
```

## Související odkazy

- Uživatel Management.md
- Skupina System.md
- Authentication.md
- ../../Security/Security-Guidelines.md

## Tagy

#oprávnění #kontrola přístupu #zabezpečení #autorizace #acl #kontrola oprávnění