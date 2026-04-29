---
title: "Uitgeversmodule"
description: "Volledige documentatie voor de Publisher-nieuws- en blogmodule voor XOOPS"
---
> De belangrijkste nieuws- en blogpublicatiemodule voor XOOPS CMS.

---

## Overzicht

Publisher is de definitieve contentbeheermodule voor XOOPS, ontwikkeld van SmartSection tot de meest veelzijdige blog- en nieuwsoplossing. Het biedt uitgebreide tools voor het creëren, organiseren en publiceren van inhoud met volledige ondersteuning voor de redactionele workflow.

**Vereisten:**
-XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x aanbevolen)

---

## 🌟 Belangrijkste kenmerken

### Inhoudsbeheer
- **Categorieën en subcategorieën** - Hiërarchische inhoudsorganisatie
- **Rich Text Editing** - Meerdere WYSIWYG-editors ondersteund
- **Bestandsbijlagen** - Voeg bestanden toe aan artikelen
- **Beeldbeheer** - Pagina- en categorieafbeeldingen
- **Bestandsverpakking** - Bestanden inpakken als artikelen

### Publicatieworkflow
- **Geplande publicatie** - Stel toekomstige publicatiedatums in
- **Vervaldata** - Inhoud automatisch verlopen
- **Moderatie** - Redactionele goedkeuringsworkflow
- **Conceptbeheer** - Bewaar onderhanden werk

### Weergave en sjablonen
- **Vier basissjablonen** - Meerdere weergave-indelingen
- **Aangepaste sjablonen** - Maak uw eigen ontwerpen
- **SEO-optimalisatie** - Zoekmachinevriendelijke URL's
- **Responsief ontwerp** - Uitvoer geschikt voor mobiel

### Gebruikersinteractie
- **Beoordelingen** - Artikelbeoordelingssysteem
- **Opmerkingen** - Lezersdiscussies
- **Sociaal delen** - Deel op sociale netwerken

### Machtigingen
- **Inzendingscontrole** - Wie artikelen kan indienen
- **Machtigingen op veldniveau** - Beheer formuliervelden per groep
- **Categorierechten** - Toegangscontrole per categorie
- **Moderatierechten** - Algemene moderatie-instellingen

---

## 🗂️ Sectie-inhoud

### Gebruikershandleiding
- Installatiehandleiding
- Basisconfiguratie
- Artikelen maken
- Categorieën beheren
- Machtigingen instellen

### Handleiding voor ontwikkelaars
- Uitgever uitbreiden
- Aangepaste sjablonen maken
- API-referentie
- Haken en evenementen

---

## 🚀 Snelle start

### 1. Installatie

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Installeer vervolgens via XOOPS Beheerder → Modules → Installeren.

### 2. Maak uw eerste categorie

1. Ga naar **Beheerder → Uitgever → Categorieën**
2. Klik op **Categorie toevoegen**
3. Vul in:
   - **Naam**: Nieuws
   - **Beschrijving**: Laatste nieuws en updates
   - **Afbeelding**: Categorieafbeelding uploaden
4. Opslaan

### 3. Maak uw eerste artikel

1. Ga naar **Beheerder → Uitgever → Artikelen**
2. Klik op **Artikel toevoegen**
3. Vul in:
   - **Titel**: Welkom op onze site
   - **Categorie**: Nieuws
   - **Inhoud**: de inhoud van uw artikel
4. Stel **Status** in: Gepubliceerd
5. Opslaan

---

## ⚙️ Configuratieopties

### Algemene instellingen

| Instelling | Beschrijving | Standaard |
|---------|-------------|---------|
| Redacteur | WYSIWYG-editor om te gebruiken | XOOPS Standaard |
| Artikelen per pagina | Artikelen getoond per pagina | 10 |
| Broodkruimel tonen | Navigatiepad weergeven | Ja |
| Beoordelingen toestaan ​​| Artikelbeoordelingen inschakelen | Ja |
| Reacties toestaan ​​| Artikelopmerkingen inschakelen | Ja |

### SEO-instellingen

| Instelling | Beschrijving | Standaard |
|---------|-------------|---------|
| SEO URL's | Gebruiksvriendelijke URL's inschakelen | Nee |
| URL herschrijven | Apache mod_rewrite | Geen |
| Meta-trefwoorden | Zoekwoorden automatisch genereren | Ja |

### Machtigingenmatrix

| Toestemming | Anoniem | Geregistreerd | Redacteur | Beheerder |
|-----------|-----------|------------|-------|-------|
| Bekijk artikelen | ✓ | ✓ | ✓ | ✓ |
| Artikelen indienen | ✗ | ✓ | ✓ | ✓ |
| Eigen artikelen bewerken | ✗ | ✓ | ✓ | ✓ |
| Bewerk alle artikelen | ✗ | ✗ | ✓ | ✓ |
| Artikelen goedkeuren | ✗ | ✗ | ✓ | ✓ |
| Categorieën beheren | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Modulestructuur

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

## 🔄 Migratie

### Van SmartSection

Publisher bevat een ingebouwde migratietool:

1. Ga naar **Beheerder → Uitgever → Importeren**
2. Selecteer **SmartSection** als bron
3. Kies importopties:
   - Categorieën
   - Artikelen
   - Opmerkingen
4. Klik op **Importeren**

### Van Nieuwsmodule

1. Ga naar **Beheerder → Uitgever → Importeren**
2. Selecteer **Nieuws** als bron
3. Kaartcategorieën
4. Klik op **Importeren**

---

## 🔗 Gerelateerde documentatie

- Module-ontwikkelingsgids
- Slimme sjablonen
- XMF-framework

---

## 📚 Hulpbronnen- [GitHub-opslagplaats](https://github.com/XoopsModules25x/publisher)
- [Probleemtracker](https://github.com/XoopsModules25x/publisher/issues)
- [Originele zelfstudie](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #nieuws #CMS #content-management