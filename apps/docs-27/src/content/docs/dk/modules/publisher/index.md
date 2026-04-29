---
title: "Publisher Module"
description: "Fuldstændig dokumentation for Publisher-nyheds- og blogmodulet for XOOPS"
---

> Det førende nyheds- og blogudgivelsesmodul til XOOPS CMS.

---

## Oversigt

Publisher er det definitive indholdsstyringsmodul til XOOPS, udviklet fra SmartSection til at blive den mest funktionsrige blog- og nyhedsløsning. Det giver omfattende værktøjer til at skabe, organisere og udgive indhold med fuld redaktionel workflow-understøttelse.

**Krav:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x anbefales)

---

## 🌟 Nøglefunktioner

### Content Management
- **Kategorier og underkategorier** - Hierarkisk indholdsorganisation
- **Rich Text-redigering** - Flere WYSIWYG-editorer understøttes
- **Filvedhæftede filer** - Vedhæft filer til artikler
- **Image Management** - Side- og kategoribilleder
- **Filindpakning** - Ombryd filer som artikler

### Udgivelsesarbejdsgang
- **Planlagt udgivelse** - Indstil fremtidige udgivelsesdatoer
- **Udløbsdatoer** - Indhold, der udløber automatisk
- **Moderation** - Redaktionel godkendelsesarbejdsgang
- **Draft Management** - Gem igangværende arbejde

### Display & skabeloner
- **Fire basisskabeloner** - Flere displaylayouts
- **Tilpassede skabeloner** - Lav dine egne designs
- **SEO Optimering** - Søgemaskinevenlige URL'er
- **Responsivt design** - Mobile-klar udgang

### Brugerinteraktion
- **Bedømmelser** - Vareklassificeringssystem
- **Kommentarer** - Læserdiskussioner
- **Social deling** - Del til sociale netværk

### Tilladelser
- **Submission Control** - Hvem kan indsende artikler
- **Tilladelser på feltniveau** - Styr formularfelter efter gruppe
- **Kategoritilladelser** - Adgangskontrol pr. kategori
- **Moderationsrettigheder** - Globale moderationsindstillinger

---

## 🗂️ Indhold i afsnittet

### Brugervejledning
- Installationsvejledning
- Grundlæggende konfiguration
- Oprettelse af artikler
- Håndtering af kategorier
- Opsætning af tilladelser

### Udviklervejledning
- Udvidende forlag
- Oprettelse af brugerdefinerede skabeloner
- API Reference
- Hooks og Events

---

## 🚀 Hurtig start

### 1. Installation

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Installer derefter via XOOPS Admin → Moduler → Installer.

### 2. Opret din første kategori

1. Gå til **Admin → Udgiver → Kategorier**
2. Klik på **Tilføj kategori**
3. Udfyld:
   - **Navn**: Nyheder
   - **Beskrivelse**: Seneste nyheder og opdateringer
   - **Billede**: Upload kategoribillede
4. Gem

### 3. Opret din første artikel

1. Gå til **Admin → Udgiver → Artikler**
2. Klik på **Tilføj artikel**
3. Udfyld:
   - **Titel**: Velkommen til vores side
   - **Kategori**: Nyheder
   - **Indhold**: Dit artikelindhold
4. Indstil **Status**: Udgivet
5. Gem

---

## ⚙️ Konfigurationsmuligheder

### Generelle indstillinger

| Indstilling | Beskrivelse | Standard |
|--------|-------------|--------|
| Redaktør | WYSIWYG editor til brug | XOOPS Standard |
| Elementer pr. side | Artikler vist pr. side | 10 |
| Vis brødkrumme | Vis navigationsspor | Ja |
| Tillad bedømmelser | Aktiver artikelvurderinger | Ja |
| Tillad kommentarer | Aktiver artikelkommentarer | Ja |

### SEO Indstillinger

| Indstilling | Beskrivelse | Standard |
|--------|-------------|--------|
| SEO URL'er | Aktiver venlige URL'er | Nej |
| URL omskrivning | Apache mod_rewrite | Ingen |
| Meta søgeord | Autogenerer søgeord | Ja |

### Tilladelsesmatrix

| Tilladelse | Anonym | Registreret | Redaktør | Admin |
|------------|--------|--------|--------|------|
| Se artikler | ✓ | ✓ | ✓ | ✓ |
| Indsend artikler | ✗ | ✓ | ✓ | ✓ |
| Rediger egne artikler | ✗ | ✓ | ✓ | ✓ |
| Rediger alle artikler | ✗ | ✗ | ✓ | ✓ |
| Godkend artikler | ✗ | ✗ | ✓ | ✓ |
| Administrer kategorier | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Modulstruktur

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

### Fra SmartSection

Publisher inkluderer et indbygget migreringsværktøj:

1. Gå til **Admin → Udgiver → Import**
2. Vælg **SmartSection** som kilde
3. Vælg importindstillinger:
   - Kategorier
   - Artikler
   - Kommentarer
4. Klik på **Importer**

### Fra nyhedsmodulet

1. Gå til **Admin → Udgiver → Import**
2. Vælg **Nyheder** som kilde
3. Kortkategorier
4. Klik på **Importer**

---

## 🔗 Relateret dokumentation- Moduludviklingsvejledning
- Smart skabelon
- XMF Framework

---

## 📚 Ressourcer

- [GitHub-lager](https://github.com/XoopsModules25x/publisher)
- [Issue Tracker](https://github.com/XoopsModules25x/publisher/issues)
- [Original selvstudie](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #modul #blog #news #cms #content-management
