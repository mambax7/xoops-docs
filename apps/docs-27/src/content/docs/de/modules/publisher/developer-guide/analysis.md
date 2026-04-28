---
title: "Publisher-Modulanalyse"
---

## Übersicht

Dieses Dokument bietet eine technische Analyse der Publisher-Modularchitektur, Muster und Implementierungsdetails. Verwende dies als Referenz, um zu verstehen, wie ein produktionsreifen XOOPS-Modul strukturiert ist.

## Architekturübersicht

```mermaid
flowchart TB
    subgraph "Presentation Layer"
        FE[Frontend Pages]
        AD[Admin Panel]
        BL[Blocks]
    end

    subgraph "Application Layer"
        PH[Page Handlers]
        BH[Block Handlers]
        FO[Forms]
    end

    subgraph "Domain Layer"
        IT[Item Entity]
        CA[Category Entity]
        FI[File Entity]
    end

    subgraph "Infrastructure"
        IH[ItemHandler]
        CH[CategoryHandler]
        FH[FileHandler]
        DB[(Database)]
    end

    FE --> PH
    AD --> PH
    BL --> BH
    PH --> IT
    PH --> CA
    BH --> IT
    IT --> IH
    CA --> CH
    FI --> FH
    IH --> DB
    CH --> DB
    FH --> DB
```

## Verzeichnisstruktur

```
publisher/
├── admin/
│   ├── index.php           # Admin dashboard
│   ├── item.php            # Article management
│   ├── category.php        # Category management
│   ├── permission.php      # Permissions
│   ├── file.php            # File manager
│   └── menu.php            # Admin menu
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── class/
│   ├── Category.php        # Category entity
│   ├── CategoryHandler.php # Category data access
│   ├── Item.php            # Article entity
│   ├── ItemHandler.php     # Article data access
│   ├── File.php            # File attachment
│   ├── FileHandler.php     # File data access
│   ├── Form/               # Form classes
│   ├── Common/             # Utilities
│   └── Helper.php          # Module helper
├── include/
│   ├── common.php          # Initialization
│   ├── functions.php       # Utility functions
│   ├── oninstall.php       # Install hooks
│   ├── onupdate.php        # Update hooks
│   └── search.php          # Search integration
├── language/
├── templates/
├── sql/
└── xoops_version.php
```

## Entity-Analyse

### Item (Artikel) Entity

```php
class Item extends \XoopsObject
{
    // Fields
    public function initVar(): void
    {
        $this->initVar('itemid', XOBJ_DTYPE_INT, null, false);
        $this->initVar('categoryid', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true);
        $this->initVar('subtitle', XOBJ_DTYPE_TXTBOX, '');
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '');
        $this->initVar('body', XOBJ_DTYPE_TXTAREA, '', true);
        $this->initVar('uid', XOBJ_DTYPE_INT, 0);
        $this->initVar('status', XOBJ_DTYPE_INT, 0);
        $this->initVar('datesub', XOBJ_DTYPE_INT, time());
        // ... more fields
    }

    // Business methods
    public function isPublished(): bool
    {
        return $this->getVar('status') == _PUBLISHER_STATUS_PUBLISHED;
    }

    public function canEdit(int $userId): bool
    {
        return $this->getVar('uid') == $userId
            || $this->isAdmin($userId);
    }
}
```

### Handler Pattern

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'publisher_items',
            Item::class,
            'itemid',
            'title'
        );
    }

    public function getPublishedItems(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', _PUBLISHER_STATUS_PUBLISHED));
        $criteria->setSort('datesub');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```

## Berechtigungssystem

### Berechtigungstypen

| Permission | Description |
|------------|-------------|
| `publisher_view` | View category/articles |
| `publisher_submit` | Submit new articles |
| `publisher_approve` | Auto-approve submissions |
| `publisher_moderate` | Review pending articles |
| `publisher_global` | Global module permissions |

### Permission Check

```php
class PermissionHandler
{
    public function isGranted(string $permission, int $categoryId): bool
    {
        $userId = $GLOBALS['xoopsUser']?->uid() ?? 0;
        $groups = $this->getUserGroups($userId);

        return $this->grouppermHandler->checkRight(
            $permission,
            $categoryId,
            $groups,
            $this->helper->getModule()->mid()
        );
    }
}
```

## Workflow-Zustände

```mermaid
stateDiagram-v2
    [*] --> Draft: Create
    Draft --> Submitted: Submit
    Submitted --> Published: Approve
    Submitted --> Rejected: Reject
    Submitted --> Draft: Return for Edit
    Published --> Offline: Unpublish
    Offline --> Published: Republish
    Published --> [*]: Delete
    Rejected --> [*]: Delete
```

## Template-Struktur

### Frontend-Templates

| Template | Purpose |
|----------|---------|
| `publisher_index.tpl` | Module homepage |
| `publisher_item.tpl` | Single article |
| `publisher_category.tpl` | Category listing |
| `publisher_submit.tpl` | Submission form |
| `publisher_search.tpl` | Search results |

### Block-Templates

| Template | Purpose |
|----------|---------|
| `publisher_block_latest.tpl` | Recent articles |
| `publisher_block_spotlight.tpl` | Featured article |
| `publisher_block_category.tpl` | Category menu |

## Verwendete Schlüsselmuster

1. **Handler-Muster** - Datenzugriffskapselung
2. **Value Object** - Statuskonstanten
3. **Template Method** - Formulargenerierung
4. **Strategy** - Verschiedene Anzeigemodi
5. **Observer** - Benachrichtigungen bei Ereignissen

## Lektionen für die Modulentwicklung

1. Verwende XoopsPersistableObjectHandler für CRUD
2. Implementiere granulare Berechtigungen
3. Trennung von Präsentation und Logik
4. Verwende Criteria für Abfragen
5. Unterstütze mehrere Content-Status
6. Integriere dich mit dem XOOPS-Benachrichtigungssystem

## Verwandte Dokumentation

- Creating-Articles - Artikelverwaltung
- Managing-Categories - Kategoriensystem
- Permissions-Setup - Berechtigungskonfiguration
- Developer-Guide/Hooks-and-Events - Erweiterungspunkte
