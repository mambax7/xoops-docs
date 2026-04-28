---
title: Module Development Introduction
description: Learn the fundamentals of building XOOPS modules — the domain model, directory structure, and core objects.
---

XOOPS modules are self-contained applications that plug into the XOOPS core.
Each module owns its own database tables, admin pages, templates, and language files.

## Core Concept: The Module Domain Model

Think of a XOOPS module as a mini-MVC application:

```
mymodule/
├── xoops_version.php   ← Module manifest (name, version, tables, menu)
├── index.php           ← Front-end entry point
├── admin/
│   └── index.php       ← Admin panel entry point
├── class/
│   ├── myobject.php    ← Domain object (extends XoopsObject)
│   └── myobjecthandler.php  ← Repository (extends XoopsPersistableObjectHandler)
├── include/
│   └── functions.php   ← Helper functions
├── language/
│   └── english/
│       └── main.php    ← Translation strings
└── templates/
    └── mymodule_index.tpl  ← Smarty templates
```

## xoops_version.php — The Module Manifest

Every module starts here. This file tells XOOPS everything it needs to know
about the module: its name, version, what database tables to create, and
what to show in the admin menu.

```php
<?php
$modversion = [
    'name'          => 'My Module',
    'version'       => 1.00,
    'description'   => 'A sample XOOPS module',
    'author'        => 'Your Name',
    'credits'       => 'XOOPS Community',
    'license'       => 'GPL 2.0',
    'dirname'       => 'mymodule',
    'image'         => 'assets/images/logo.png',
    'cube_style'    => true,  // Use XOOPS 2.7 admin UI

    // Database tables (without xoops_ prefix)
    'tables'        => ['mymodule_items'],

    // Admin menu entries
    'adminmenu'     => 'admin/menu.php',
    'hasMain'       => 1,
];
```

## XoopsObject — Your Domain Entity

`XoopsObject` is the base class for all XOOPS domain entities.
It is analogous to a Doctrine Entity or an Eloquent Model.

```php
<?php
// class/myitem.php
use Xmf\Database\TableLoad;

class MyItem extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('item_id',    XOBJ_DTYPE_INT,    null, false);
        $this->initVar('title',      XOBJ_DTYPE_TXTBOX, '',   true,  255);
        $this->initVar('body',       XOBJ_DTYPE_TXTAREA,'',   false);
        $this->initVar('created_at', XOBJ_DTYPE_INT,    time(),false);
    }
}
```

## Next Steps

- Module Structure (coming soon)
- The XoopsObject System (coming soon)
- Admin Panel Development (coming soon)
