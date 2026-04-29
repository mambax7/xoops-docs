---
title: "การวิเคราะห์โมดูลผู้เผยแพร่"
---
## ภาพรวม

เอกสารนี้ให้การวิเคราะห์ทางเทคนิคของสถาปัตยกรรมโมดูลผู้เผยแพร่ รูปแบบ และรายละเอียดการใช้งาน ใช้ข้อมูลนี้เป็นข้อมูลอ้างอิงเพื่อทำความเข้าใจวิธีการจัดโครงสร้างโมดูล XOOPS คุณภาพการผลิต

## ภาพรวมสถาปัตยกรรม
```
mermaid
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
## โครงสร้างไดเร็กทอรี
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
## การวิเคราะห์เอนทิตี

### รายการ (บทความ) เอนทิตี
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
### รูปแบบตัวจัดการ
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
## ระบบการอนุญาต

### ประเภทการอนุญาต

| การอนุญาต | คำอธิบาย |
|------------|-------------|
| `publisher_view` | ดูหมวดหมู่/บทความ |
| `publisher_submit` | ส่งบทความใหม่ |
| `publisher_approve` | อนุมัติการส่งอัตโนมัติ |
| `publisher_moderate` | ตรวจสอบบทความที่รอดำเนินการ |
| `publisher_global` | สิทธิ์โมดูลสากล |

### การตรวจสอบสิทธิ์
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
## สถานะเวิร์กโฟลว์
```
mermaid
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
## โครงสร้างเทมเพลต

### เทมเพลตส่วนหน้า

| แม่แบบ | วัตถุประสงค์ |
|----------|---------|
| `publisher_index.tpl` | หน้าแรกของโมดูล |
| `publisher_item.tpl` | บทความเดียว |
| `publisher_category.tpl` | รายการหมวดหมู่ |
| `publisher_submit.tpl` | แบบฟอร์มการยื่นคำร้อง |
| `publisher_search.tpl` | ผลการค้นหา |

### เทมเพลตบล็อก

| แม่แบบ | วัตถุประสงค์ |
|----------|---------|
| `publisher_block_latest.tpl` | บทความล่าสุด |
| `publisher_block_spotlight.tpl` | บทความเด่น |
| `publisher_block_category.tpl` | เมนูหมวดหมู่ |

## รูปแบบคีย์ที่ใช้

1. **รูปแบบตัวจัดการ** - การห่อหุ้มการเข้าถึงข้อมูล
2. **ออบเจ็กต์ค่า** - ค่าคงที่สถานะ
3. **วิธีเทมเพลต** - การสร้างแบบฟอร์ม
4. **กลยุทธ์** - โหมดการแสดงผลที่แตกต่างกัน
5. **ผู้สังเกตการณ์** - การแจ้งเตือนเกี่ยวกับเหตุการณ์

## บทเรียนสำหรับการพัฒนาโมดูล

1. ใช้ XoopsPersistableObjectHandler สำหรับ CRUD
2. ใช้สิทธิ์แบบละเอียด
3. แยกการนำเสนอออกจากตรรกะ
4. ใช้เกณฑ์สำหรับการสืบค้น
5. รองรับสถานะเนื้อหาหลายสถานะ
6. บูรณาการกับระบบการแจ้งเตือน XOOPS

## เอกสารที่เกี่ยวข้อง

- การสร้างบทความ - การจัดการบทความ
- การจัดการหมวดหมู่ - ระบบหมวดหมู่
- สิทธิ์-การตั้งค่า - การกำหนดค่าสิทธิ์
- คู่มือนักพัฒนา/Hooks-and-Events - ประเด็นส่วนขยาย