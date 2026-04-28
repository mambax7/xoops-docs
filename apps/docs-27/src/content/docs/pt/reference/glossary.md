---
title: "XOOPS Glossary"
description: "Definitions of XOOPS-specific terms and concepts"
---

> Comprehensive glossary of XOOPS-specific terminology and concepts.

---

## A

### Admin Framework
The standardized administrative interface framework introduced in XOOPS 2.3, providing consistent admin pages across modules.

### Autoloading
The automatic loading of PHP classes when they are needed, using PSR-4 standard in modern XOOPS.

---

## B

### Block
A self-contained content unit that can be positioned in theme regions. Blocks can display module content, custom HTML, or dynamic data.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
The process of initializing XOOPS core before executing module code, typically through `mainfile.php` and `header.php`.

---

## C

### Criteria / CriteriaCompo
Classes for building database query conditions in an object-oriented manner.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
A security attack prevented in XOOPS using security tokens via `XoopsFormHiddenToken`.

---

## D

### DI (Dependency Injection)
A design pattern planned for XOOPS 4.0 where dependencies are injected rather than created internally.

### Dirname
The directory name of a module, used as a unique identifier throughout the system.

### DTYPE (Data Type)
Constants defining how XoopsObject variables are stored and sanitized:
- `XOBJ_DTYPE_INT` - Integer
- `XOBJ_DTYPE_TXTBOX` - Text (single line)
- `XOBJ_DTYPE_TXTAREA` - Text (multi-line)
- `XOBJ_DTYPE_EMAIL` - Email address

---

## E

### Event
An occurrence in the XOOPS lifecycle that can trigger custom code through preloads or hooks.

---

## F

### Framework
See XMF (XOOPS Module Framework).

### Form Element
A component of the XOOPS form system representing an HTML form field.

---

## G

### Group
A collection of users with shared permissions. Core groups include: Webmasters, Registered Users, Anonymous.

---

## H

### Handler
A class that manages CRUD operations for XoopsObject instances.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
A utility class providing easy access to module handlers, configurations, and services.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
The core XOOPS classes providing fundamental functionality: database access, user management, security, etc.

---

## L

### Language File
PHP files containing constants for internationalization, stored in `language/[code]/` directories.

---

## M

### mainfile.php
The primary configuration file for XOOPS containing database credentials and path definitions.

### MCP (Model-Controller-Presenter)
An architectural pattern similar to MVC, often used in XOOPS module development.

### Middleware
Software that sits between the request and response, planned for XOOPS 4.0 using PSR-15.

### Module
A self-contained package that extends XOOPS functionality, installed in the `modules/` directory.

### MOC (Map of Content)
An Obsidian concept for overview notes that link to related content.

---

## N

### Namespace
PHP feature for organizing classes, used in XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Notification
The XOOPS system for alerting users about events via email or PM.

---

## O

### Object
See XoopsObject.

---

## P

### Permission
Access control managed through groups and permission handlers.

### Preload
A class that hooks into XOOPS events, loaded automatically from `preloads/` directory.

### PSR (PHP Standards Recommendation)
Standards from PHP-FIG that XOOPS 4.0 will fully implement.

---

## R

### Renderer
A class that outputs form elements or other UI components in specific formats (Bootstrap, etc.).

---

## S

### Smarty
The template engine used by XOOPS for separating presentation from logic.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
A class providing reusable business logic, typically accessed via the Helper.

---

## T

### Template
A Smarty file (`.tpl` or `.html`) defining the presentation layer for modules.

### Theme
A collection of templates and assets defining the site's visual appearance.

### Token
A security mechanism (CSRF protection) ensuring form submissions originate from legitimate sources.

---

## U

### uid
User ID - the unique identifier for each user in the system.

---

## V

### Variable (Var)
A field defined on an XoopsObject using `initVar()`.

---

## W

### Widget
A small, self-contained UI component, similar to blocks.

---

## X

### XMF (XOOPS Module Framework)
A collection of utilities and classes for modern XOOPS module development.

### XOBJ_DTYPE
Constants for defining variable data types in XoopsObject.

### XoopsDatabase
The database abstraction layer providing query execution and escaping.

### XoopsForm
The form generation system for creating HTML forms programmatically.

### XoopsObject
The base class for all data objects in XOOPS, providing variable management and sanitization.

### xoops_version.php
The module manifest file defining module properties, tables, blocks, templates, and configuration.

---

## Common Acronyms

| Acronym | Meaning |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## 🔗 Related Documentation

- Core Concepts
- API Reference
- External Resources

---

#xoops #glossary #reference #terminology #definitions
