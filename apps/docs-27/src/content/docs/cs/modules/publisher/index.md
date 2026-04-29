---
title: "Modul vydavatele"
description: "Kompletní dokumentace pro modul zpráv a blogů Publisher pro XOOPS"
---

> Přední modul pro publikování zpráv a blogů pro XOOPS CMS.

---

## Přehled

Publisher je definitivní modul pro správu obsahu pro XOOPS, který se vyvinul ze SmartSection, aby se stal nejbohatším řešením pro blogy a zprávy. Poskytuje komplexní nástroje pro vytváření, organizaci a publikování obsahu s plnou podporou redakčního workflow.

**Požadavky:**
- XOOPS 2.5.10+
- PHP 7.1+ (doporučeno PHP 8.x)

---

## 🌟 Klíčové vlastnosti

### Správa obsahu
- **Kategorie a podkategorie** - Hierarchická organizace obsahu
- **Úpravy bohatého textu** - Podporováno více editorů WYSIWYG
- **Přílohy souborů** - Připojte soubory k článkům
- **Správa obrázků** - Obrázky stránek a kategorií
- **Zalamování souborů** - Zabalte soubory jako články

### Publikační pracovní postup
- **Plánované publikování** - Nastavte budoucí data publikování
- **Data vypršení platnosti** - Obsah automaticky vyprší
- **Moderování** - Pracovní postup schvalování redakcí
- **Správa konceptů** - Uložte nedokončenou práci

### Zobrazení a šablony
- **Čtyři základní šablony** - Více rozvržení zobrazení
- **Vlastní šablony** - Vytvořte si vlastní návrhy
- **SEO optimalizace** - Adresy URL vhodné pro vyhledávače
- **Responzivní design** - Výstup připravený pro mobilní zařízení

### Uživatelská interakce
- **Hodnocení** - Systém hodnocení článků
- **Komentáře** - Diskuse čtenářů
- **Sdílení na sociálních sítích** - Sdílejte na sociálních sítích

### Oprávnění
- **Submission Control** - Kdo může odesílat články
- **Oprávnění na úrovni pole** - Ovládejte pole formuláře podle skupiny
- **Oprávnění kategorií** - Řízení přístupu podle kategorií
- **Práva na moderování** - Globální nastavení moderování

---

## 🗂️ Obsah sekce

### Uživatelská příručka
- Průvodce instalací
- Základní konfigurace
- Vytváření článků
- Správa kategorií
- Nastavení oprávnění

### Příručka pro vývojáře
- Rozšíření vydavatele
- Vytváření vlastních šablon
- Reference API
- Háčky a události

---

## 🚀 Rychlý start

### 1. Instalace

```bash
# Download from GitHub
git clone https://github.com/XOOPSModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Poté nainstalujte přes XOOPS Admin → Moduly → Instalovat.

### 2. Vytvořte svou první kategorii

1. Přejděte na **Správce → Vydavatel → Kategorie**
2. Klikněte na **Přidat kategorii**
3. Vyplňte:
   - **Jméno**: Novinky
   - **Popis**: Nejnovější zprávy a aktualizace
   - **Obrázek**: Nahrajte obrázek kategorie
4. Uložit

### 3. Vytvořte svůj první článek

1. Přejděte na **Správce → Vydavatel → Články**
2. Klikněte na **Přidat článek**
3. Vyplňte:
   - **Titul**: Vítejte na našich stránkách
   - **Kategorie**: Novinky
   - **Obsah**: Obsah vašeho článku
4. Nastavte **Stav**: Publikováno
5. Uložit

---

## ⚙️ Možnosti konfigurace

### Obecná nastavení

| Nastavení | Popis | Výchozí |
|---------|-------------|---------|
| Redaktor | Editor WYSIWYG k použití | XOOPS Výchozí |
| Položky na stránku | Články zobrazené na stránce | 10 |
| Zobrazit drobenku | Zobrazit navigační stopu | Ano |
| Povolit hodnocení | Povolit hodnocení článků | Ano |
| Povolit komentáře | Povolit komentáře k článku | Ano |

### Nastavení SEO

| Nastavení | Popis | Výchozí |
|---------|-------------|---------|
| URL SEO | Povolit popisné adresy URL | Ne |
| Přepisování URL | Apache mod_rewrite | Žádné |
| Meta klíčová slova | Automaticky generovat klíčová slova | Ano |

### Matice oprávnění

| Povolení | Anonymní | Registrován | Redaktor | Admin |
|------------|-----------|------------|--------|-------|
| Zobrazit články | ✓ | ✓ | ✓ | ✓ |
| Odeslat články | ✗ | ✓ | ✓ | ✓ |
| Upravit vlastní články | ✗ | ✓ | ✓ | ✓ |
| Upravit všechny články | ✗ | ✗ | ✓ | ✓ |
| Schvalovat články | ✗ | ✗ | ✓ | ✓ |
| Spravovat kategorie | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Struktura modulu

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

## 🔄 Migrace

### Ze SmartSection

Publisher obsahuje vestavěný nástroj pro migraci:

1. Přejděte na **Správce → Vydavatel → Import**
2. Jako zdroj vyberte **SmartSection**
3. Vyberte možnosti importu:
   - Kategorie
   - Články
   - Komentáře
4. Klikněte na **Importovat**

### Z modulu zpráv

1. Přejděte na **Správce → Vydavatel → Import**
2. Jako zdroj vyberte **Zprávy**
3. Kategorie map
4. Klikněte na **Importovat**

---

## 🔗 Související dokumentace

- Průvodce vývojem modulu
- Šablona Smarty
- Rámec XMF

---

## 📚 Zdroje

- [Úložiště GitHub](https://github.com/XOOPSModules25x/publisher)
- [Sledování problémů](https://github.com/XOOPSModules25x/publisher/issues)
- [Původní návod](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management