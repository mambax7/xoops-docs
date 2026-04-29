---
title: "Publisher Module"
description: "Celotna dokumentacija za Publisher novice in blog modul za XOOPS"
---
> Vrhunski modul za objavo novic in blogov za XOOPS CMS.

---

## Pregled

Publisher je dokončni modul za upravljanje vsebine za XOOPS, ki se je razvil iz SmartSection in postal najbolj bogata rešitev za bloge in novice. Zagotavlja celovita orodja za ustvarjanje, organiziranje in objavljanje vsebine s popolno podporo za uredniške poteke dela.

**Zahteve:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x priporočeno)

---

## 🌟 Ključne lastnosti

### Upravljanje vsebine
- **Kategorije in podkategorije** - Hierarhična organizacija vsebine
- **Urejanje obogatenega besedila** - Podprtih več urejevalnikov WYSIWYG
- **Datotečne priloge** - Priložite datoteke člankom
- **Upravljanje slik** - Slike strani in kategorij
- **Ovijanje datotek** - Ovijte datoteke kot članke

### Potek dela objave
- **Načrtovana objava** - Nastavite prihodnje datume objave
- **Datumi poteka** - Samodejno poteče vsebina
- **Moderiranje** - Potek dela za odobritev uredništva
- **Upravljanje osnutkov** - Shranite delo v teku

### Prikaz in predloge
- **Štiri osnovne predloge** - Več postavitev zaslona
- **Predloge po meri** - Ustvarite lastne modele
- **SEO Optimizacija** - Iskalnikom prijazni URL-ji
- **Odzivno oblikovanje** - Izhod, pripravljen za mobilne naprave

### Interakcija uporabnika
- **Ocene** - Sistem ocenjevanja člankov
- **Komentarji** - Razprave bralcev
- **Social Sharing** - Delite v družabnih omrežjih### Dovoljenja
- **Nadzor oddaje** - Kdo lahko odda članke
- **Dovoljenja na ravni polja** - Nadzor polj obrazca po skupinah
- **Dovoljenja za kategorije** - Nadzor dostopa po kategorijah
- **Pravice do moderiranja** - Globalne nastavitve moderiranja

---

## 🗂️ Vsebina razdelka

### Uporabniški priročnik
- Navodila za namestitev
- Osnovna konfiguracija
- Ustvarjanje člankov
- Upravljanje kategorij
- Nastavitev dovoljenj

### Vodnik za razvijalce
- Razširitev založnika
- Ustvarjanje predlog po meri
- API Referenca
- Trnki in dogodki

---

## 🚀 Hiter začetek

### 1. Namestitev
```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```
Nato namestite prek XOOPS Admin → Modules → Install.

### 2. Ustvarite svojo prvo kategorijo

1. Pojdite na **Admin → Publisher → Categories**
2. Kliknite **Dodaj kategorijo**
3. Izpolnite:
   - **Ime**: Novice
   - **Opis**: Zadnje novice in posodobitve
   - **Slika**: Naloži sliko kategorije
4. Shrani

### 3. Ustvarite svoj prvi članek

1. Pojdite na **Skrbnik → Založnik → Članki**
2. Kliknite **Dodaj članek**
3. Izpolnite:
   - **Naslov**: Dobrodošli na našem spletnem mestu
   - **Kategorija**: Novice
   - **Vsebina**: vsebina vašega članka
4. Nastavite **Stanje**: Objavljeno
5. Shrani

---

## ⚙️ Možnosti konfiguracije

### Splošne nastavitve

| Nastavitev | Opis | Privzeto |
|---------|-------------|---------|
| Urednik | WYSIWYG urejevalnik za uporabo | XOOPS Privzeto |
| Postavke na stran | Članki prikazani na stran | 10 |
| Pokaži drobtino | Prikaz navigacijske poti | Da |
| Dovoli ocene | Omogoči ocene člankov | Da |
| Dovoli komentarje | Omogoči komentarje člankov | Da |

### SEO Nastavitve

| Nastavitev | Opis | Privzeto |
|---------|-------------|---------|
| SEO URL-ji | Omogoči prijazne URL-je | Ne |
| URL prepisovanje | Apache mod_rewrite | Brez |
| Meta ključne besede | Samodejno ustvari ključne besede | Da |

### Matrica dovoljenj

| Dovoljenje | Anonimno | Registriran | Urednik | Admin |
|------------|-----------|------------|--------|-------|
| Ogled člankov | ✓ | ✓ | ✓ | ✓ |
| Predloži članke | ✗ | ✓ | ✓ | ✓ |
| Urejanje lastnih člankov | ✗ | ✓ | ✓ | ✓ |
| Uredi vse članke | ✗ | ✗ | ✓ | ✓ |
| Odobri članke | ✗ | ✗ | ✓ | ✓ |
| Upravljanje kategorij | ✗ | ✗ | ✗ | ✓ |---

## 📦 Struktura modula
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

## 🔄 Selitev

### Iz SmartSection

Publisher vključuje vgrajeno orodje za selitev:

1. Pojdite na **Admin → Publisher → Import**
2. Izberite **SmartSection** kot vir
3. Izberite možnosti uvoza:
   - Kategorije
   - Članki
   - Komentarji
4. Kliknite **Uvozi**

### Iz modula Novice

1. Pojdite na **Admin → Publisher → Import**
2. Za vir izberite **Novice**
3. Kategorije zemljevida
4. Kliknite **Uvozi**

---

## 🔗 Povezana dokumentacija

- Vodnik za razvoj modula
- Smarty Templateing
- XMF Okvir

---

## 📚 Viri

- [Repozitorij GitHub](https://github.com/XoopsModules25x/publisher)
- [Issue Tracker](https://github.com/XoopsModules25x/publisher/issues)
- [Izvirna vadnica](https://XOOPS.gitbook.io/publisher-tutorial/)

---

#XOOPS #publisher #module #blog #news #cms #content-management