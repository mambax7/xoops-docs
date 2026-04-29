---
title: "Analiza modula izdajatelja"
---
## Pregled

Ta dokument ponuja tehnično analizo arhitekture, vzorcev in podrobnosti izvedbe modula Publisher. Uporabite to kot referenco za razumevanje, kako je strukturiran modul XOOPS proizvodne kakovosti.

## Pregled arhitekture
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
## Struktura imenika
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
## Analiza subjektov

### Entiteta postavke (članka).
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
### Vzorec upravljavca
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
## Sistem dovoljenj

### Vrste dovoljenj

| Dovoljenje | Opis |
|------------|-------------|
| `publisher_view` | Poglej category/articles |
| `publisher_submit` | Predloži nove članke |
| `publisher_approve` | Samodejno odobri predložitve |
| `publisher_moderate` | Pregled člankov v teku |
| `publisher_global` | Globalna dovoljenja modula |

### Preverjanje dovoljenj
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
## Stanja poteka dela
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
## Struktura predloge

### Frontend Templates

| Predloga | Namen |
|----------|---------|
| `publisher_index.tpl` | Domača stran modula |
| `publisher_item.tpl` | En članek |
| `publisher_category.tpl` | Seznam kategorij |
| `publisher_submit.tpl` | Obrazec za oddajo |
| `publisher_search.tpl` | Rezultati iskanja |

### Blokiraj predloge

| Predloga | Namen |
|----------|---------|
| `publisher_block_latest.tpl` | Nedavni članki |
| `publisher_block_spotlight.tpl` | Izbrani članek |
| `publisher_block_category.tpl` | Meni kategorije |

## Uporabljeni ključni vzorci

1. **Vzorec upravljavca** - Enkapsulacija dostopa do podatkov
2. **Vrednostni objekt** - Konstante stanja
3. **Metoda predloge** - Ustvarjanje obrazca
4. **Strategija** - Različni načini prikaza
5. **Opazovalec** - Obvestila o dogodkih

## Lekcije za razvoj modula

1. Uporabite XoopsPersistableObjectHandler za CRUD
2. Izvedite zrnata dovoljenja
3. Ločite predstavitev od logike
4. Uporabite merila za poizvedbe
5. Podpora več stanj vsebine
6. Integracija s sistemom obveščanja XOOPS

## Povezana dokumentacija

- Ustvarjanje-člankov - Upravljanje s članki
- Managing-Categories - Sistem kategorij
- Nastavitev dovoljenj - Konfiguracija dovoljenj
- Developer-Guide/Hooks-and-Events - Razširitvene točke