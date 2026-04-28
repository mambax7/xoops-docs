---
title: "Publisher-Modul"
description: "Vollständige Dokumentation für das Publisher-Nachrichten- und Blog-Modul für XOOPS"
---

> Das führende Nachrichten- und Blog-Publishing-Modul für XOOPS CMS.

---

## Übersicht

Publisher ist das definitive Content-Management-Modul für XOOPS, das sich von SmartSection weiterentwickelt hat und zur reichhaltigsten Blog- und News-Lösung wurde. Es bietet umfassende Werkzeuge zum Erstellen, Organisieren und Veröffentlichen von Inhalten mit vollständiger Editorial-Workflow-Unterstützung.

**Anforderungen:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x empfohlen)

---

## 🌟 Hauptfunktionen

### Content Management
- **Kategorien & Unterkategorien** - Hierarchische Inhaltsorganisation
- **Rich Text Editing** - Mehrere WYSIWYG-Editoren unterstützt
- **Dateianhänge** - Dateien an Artikel anhängen
- **Bildverwaltung** - Seiten- und Kategoriebilder
- **Datei-Umhüllung** - Dateien als Artikel verpacken

### Publishing Workflow
- **Geplante Veröffentlichung** - Zukünftige Veröffentlichungsdaten setzen
- **Ablaufdaten** - Auto-Expire-Inhalte
- **Moderation** - Editorial-Approval-Workflow
- **Entwurfsverwaltung** - Laufende Arbeiten speichern

### Display & Templates
- **Vier Basis-Templates** - Mehrere Display-Layouts
- **Benutzerdefinierte Templates** - Erstelle deine eigenen Designs
- **SEO-Optimierung** - Suchmaschinen-freundliche URLs
- **Responsives Design** - Mobile-ready Output

### Benutzerinteraktion
- **Bewertungen** - Artikel-Bewertungssystem
- **Kommentare** - Leserdiskussionen
- **Social Sharing** - Teilen in sozialen Netzwerken

### Berechtigungen
- **Einreichungskontrolle** - Wer kann Artikel einreichen
- **Feldebenen-Berechtigungen** - Formularfelder nach Gruppe steuern
- **Kategorie-Berechtigungen** - Zugriffskontrolle pro Kategorie
- **Moderationsrechte** - Globale Moderationseinstellungen

---

## 🗂️ Section Contents

### User Guide
- Installation Guide
- Basic Configuration
- Creating Articles
- Managing Categories
- Setting Up Permissions

### Developer Guide
- Extending Publisher
- Creating Custom Templates
- API Reference
- Hooks and Events

---

## 🚀 Quick Start

### 1. Installation

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Then install via XOOPS Admin → Modules → Install.

### 2. Create Your First Category

1. Go to **Admin → Publisher → Categories**
2. Click **Add Category**
3. Fill in:
   - **Name**: News
   - **Description**: Latest news and updates
   - **Image**: Upload category image
4. Save

### 3. Create Your First Article

1. Go to **Admin → Publisher → Articles**
2. Click **Add Article**
3. Fill in:
   - **Title**: Welcome to Our Site
   - **Category**: News
   - **Content**: Your article content
4. Set **Status**: Published
5. Save

---

## ⚙️ Configuration Options

### General Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Editor | WYSIWYG editor to use | XOOPS Default |
| Items per page | Articles shown per page | 10 |
| Show breadcrumb | Display navigation trail | Yes |
| Allow ratings | Enable article ratings | Yes |
| Allow comments | Enable article comments | Yes |

### SEO Settings

| Setting | Description | Default |
|---------|-------------|---------|
| SEO URLs | Enable friendly URLs | No |
| URL rewriting | Apache mod_rewrite | None |
| Meta keywords | Auto-generate keywords | Yes |

### Permissions Matrix

| Permission | Anonymous | Registered | Editor | Admin |
|------------|-----------|------------|--------|-------|
| View articles | ✓ | ✓ | ✓ | ✓ |
| Submit articles | ✗ | ✓ | ✓ | ✓ |
| Edit own articles | ✗ | ✓ | ✓ | ✓ |
| Edit all articles | ✗ | ✗ | ✓ | ✓ |
| Approve articles | ✗ | ✗ | ✓ | ✓ |
| Manage categories | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Module Structure

```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```

---

## 🔄 Migration

### From SmartSection

Publisher includes a built-in migration tool:

1. Go to **Admin → Publisher → Import**
2. Select **SmartSection** as source
3. Choose import options:
   - Categories
   - Articles
   - Comments
4. Click **Import**

### From News Module

1. Go to **Admin → Publisher → Import**
2. Select **News** as source
3. Map categories
4. Click **Import**

---

## 🔗 Related Documentation

- Module Development Guide
- Smarty Templating
- XMF Framework

---

## 📚 Resources

- [GitHub Repository](https://github.com/XoopsModules25x/publisher)
- [Issue Tracker](https://github.com/XoopsModules25x/publisher/issues)
- [Original Tutorial](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
