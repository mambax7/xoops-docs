---
title: "modul izdavača"
description: "Kompletna dokumentacija za Publisher news and blog modul za XOOPS"
---
> Vrhunski modul za objavljivanje vijesti i blogova za XOOPS CMS.

---

## Pregled

Publisher je definitivni modul za upravljanje sadržajem za XOOPS, razvio se iz SmartSectiona da postane najbogatije rješenje za blogove i vijesti. Pruža sveobuhvatne alate za stvaranje, organiziranje i objavljivanje sadržaja s punom podrškom za urednički tijek rada.

**Zahtjevi:**
- XOOPS 2.5.10+
- PHP 7.1+ (preporučuje se PHP 8.x)

---

## 🌟 Ključne značajke

### Upravljanje sadržajem
- **Kategorije i potkategorije** - Hijerarhijska organizacija sadržaja
- **Uređivanje obogaćenog teksta** - Podržano više WYSIWYG uređivača
- **Datotečni prilozi** - Priložite datoteke uz članke
- **Upravljanje slikama** - Slike stranica i kategorija
- **File Wrapping** - Omotajte datoteke kao članke

### Tijek rada objavljivanja
- **Zakazano objavljivanje** - Postavite buduće datume objavljivanja
- **Datumi isteka** - Sadržaj koji automatski istječe
- **Moderacija** - tijek uredničkog odobrenja
- **Draft Management** - Spremite posao koji je u tijeku

### Prikaz i predlošci
- **Četiri osnovna predloška** - Višestruki izgledi prikaza
- **Prilagođeni predlošci** - Izradite vlastiti dizajn
- **SEO optimizacija** - URL-ovi prilagođeni tražilicama
- **Responzivni dizajn** - Izlaz spreman za mobilne uređaje

### Interakcija korisnika
- **Ocjene** - Sustav ocjenjivanja članaka
- **Komentari** - Rasprave čitatelja
- **Dijeljenje na društvenim mrežama** - Dijelite na društvenim mrežama

### dozvole
- **Kontrola slanja** - Tko može slati članke
- **dozvole na razini polja** - Kontrolirajte polja obrasca prema grupi
- **dozvole za kategorije** - Kontrola pristupa po kategoriji
- **Prava moderiranja** - Globalne postavke moderiranja

---

## 🗂️ Sadržaj odjeljka

### Korisnički priručnik
- Vodič za instalaciju
- Osnovna konfiguracija
- Izrada članaka
- Upravljanje kategorijama
- Postavljanje dopuštenja

### Vodič za razvojne programere
- Extending Publisher
- Stvaranje prilagođenih predložaka
- Referenca API
- Kuke i događaji

---

## 🚀 Brzi početak

### 1. Instalacija

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Zatim instalirajte putem XOOPS Admin → moduli → Instaliraj.

### 2. Stvorite svoju prvu kategoriju

1. Idite na **Administrator → Izdavač → Kategorije**
2. Kliknite **Dodaj kategoriju**
3. Ispunite:
   - **Ime**: Vijesti
   - **Opis**: Najnovije vijesti i ažuriranja
   - **Slika**: Učitajte sliku kategorije
4. Spremiti

### 3. Napravite svoj prvi članak

1. Idite na **Administrator → Izdavač → Članci**
2. Kliknite **Dodaj članak**
3. Ispunite:
   - **Naslov**: Dobro došli na našu stranicu
   - **Kategorija**: Vijesti
   - **Sadržaj**: Sadržaj vašeg članka
4. Postavite **Status**: Objavljeno
5. Spremiti

---

## ⚙️ Mogućnosti konfiguracije

### Opće postavke

| Postavka | Opis | Zadano |
|---------|-------------|---------|
| Urednik | WYSIWYG uređivač za korištenje | XOOPS Zadano |
| Stavki po stranici | Članci prikazani po stranici | 10 |
| Prikaži put kroz web stranicu | Prikaz navigacijske staze | Da |
| Dopusti ocjene | Omogući ocjene članaka | Da |
| Dopusti komentare | Omogući komentare članaka | Da |

### SEO postavke

| Postavka | Opis | Zadano |
|---------|-------------|---------|
| SEO URL-ovi | Omogući prijateljske URL-ove | Ne |
| URL prepisivanje | Apache mod_rewrite | Ništa |
| Meta ključne riječi | Automatski generiraj ključne riječi | Da |

### Matrica dopuštenja| Dopuštenje | Anonimno | Registrirano | Urednik | Admin |
|------------|-----------|------------|--------|-------|
| Pregledajte članke | ✓ | ✓ | ✓ | ✓ |
| Pošaljite članke | ✗ | ✓ | ✓ | ✓ |
| Uređivanje vlastitih članaka | ✗ | ✓ | ✓ | ✓ |
| Uredi sve članke | ✗ | ✗ | ✓ | ✓ |
| Odobri članke | ✗ | ✗ | ✓ | ✓ |
| Upravljanje kategorijama | ✗ | ✗ | ✗ | ✓ |

---

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

## 🔄 Migracija

### Iz SmartSection

Izdavač includes ugrađeni alat za migraciju:

1. Idite na **Administrator → Izdavač → Uvoz**
2. Odaberite **SmartSection** kao izvor
3. Odaberite opcije uvoza:
   - Kategorije
   - Članci
   - Komentari
4. Kliknite **Uvezi**

### Iz modula vijesti

1. Idite na **Administrator → Izdavač → Uvoz**
2. Odaberite **Vijesti** kao izvor
3. Kategorije karte
4. Kliknite **Uvezi**

---

## 🔗 Povezana dokumentacija

- Vodič za razvoj modula
- Smarty Šablone
- XMF Okvir

---

## 📚 Resursi

- [GitHub spremište](https://github.com/XoopsModules25x/publisher)
- [Praćenje problema](https://github.com/XoopsModules25x/publisher/issues)
- [Izvorni vodič](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
