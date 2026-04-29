---
title: "Kiadó modul"
description: "A XOOPS kiadói hír- és blogmoduljának teljes dokumentációja"
---
> A XOOPS CMS első számú hír- és blogközzétételi modulja.

---

## Áttekintés

A Publisher a XOOPS végleges tartalomkezelő modulja, amely a SmartSection-ből fejlődött ki, és a legtöbb szolgáltatásban gazdag blog- és hírmegoldássá vált. Átfogó eszközöket biztosít a tartalom létrehozásához, rendszerezéséhez és közzétételéhez, teljes körű szerkesztői munkafolyamat-támogatással.

**Követelmények:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x ajánlott)

---

## 🌟 Főbb jellemzők

### Tartalomkezelés
- **Kategóriák és alkategóriák** - Hierarchikus tartalomszervezés
- **Rich Text szerkesztés** - Több WYSIWYG szerkesztő támogatott
- **Fájlmellékletek** - Fájlok csatolása cikkekhez
- **Képkezelés** - Oldal- és kategóriaképek
- **Fájlcsomagolás** - Fájlok tördelése cikkként

### Közzétételi munkafolyamat
- **Ütemezett közzététel** - Állítsa be a jövőbeni közzétételi dátumokat
- **Lejárati dátumok** - Tartalom automatikus lejárata
- **Moderálás** - Szerkesztői jóváhagyási munkafolyamat
- **Piszkozatkezelés** - Folyamatban lévő munka mentése

### Megjelenítés és sablonok
- **Négy alapsablon** - Több megjelenítési elrendezés
- **Egyéni sablonok** - Készítsen saját terveket
- **SEO optimalizálás** - Keresőbarát URL-ek
- **Reszponzív kialakítás** - Mobilra kész kimenet

### Felhasználói interakció
- **Értékelések** - Cikkértékelési rendszer
- **Megjegyzések** - Olvasói beszélgetések
- **Közösségi megosztás** - Megosztás a közösségi hálózatokon

### Engedélyek
- **Beküldés ellenőrzése** - Ki küldhet be cikkeket
- **Mezőszintű engedélyek** - Az űrlapmezők csoportonkénti szabályozása
- **Kategória engedélyek** - Kategóriánkénti hozzáférés-szabályozás
- **Moderálási jogok** - Globális moderálási beállítások

---

## 🗂️ A szakasz tartalma

### Felhasználói kézikönyv
- Telepítési útmutató
- Alapkonfiguráció
- Cikkek készítése
- Kategóriák kezelése
- Engedélyek beállítása

### Fejlesztői útmutató
- Kiadó kiterjesztése
- Egyedi sablonok készítése
- API Referencia
- Horgok és események

---

## 🚀 Gyors kezdés

### 1. Telepítés

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Ezután telepítse a XOOPS Admin → modulok → Telepítés segítségével.

### 2. Hozza létre első kategóriáját

1. Lépjen az **Adminisztráció → Kiadó → Kategóriák** menüpontra.
2. Kattintson a **Kategória hozzáadása** lehetőségre.
3. Töltse ki:
   - **Név**: Hírek
   - **Leírás**: Legfrissebb hírek és frissítések
   - **Kép**: Kategóriakép feltöltése
4. Mentés

### 3. Készítse el első cikkét

1. Lépjen az **Adminisztrálás → Kiadó → Cikkek** oldalra.
2. Kattintson a **Cikk hozzáadása** lehetőségre.
3. Töltse ki:
   - **Cím**: Üdvözöljük oldalunkon
   - **Kategória**: Hírek
   - **Tartalom**: A cikk tartalma
4. Állítsa be az **Állapot**: Közzétéve
5. Mentés

---

## ⚙️ Konfigurációs lehetőségek

### Általános beállítások

| Beállítás | Leírás | Alapértelmezett |
|---------|--------------|----------|
| Szerkesztő | WYSIWYG használható szerkesztő | XOOPS Alapértelmezett |
| Elemek oldalanként | Oldalanként megjelenített cikkek | 10 |
| Panoráma megjelenítése | Navigációs nyomvonal megjelenítése | Igen |
| Értékelések engedélyezése | Cikkértékelés engedélyezése | Igen |
| Megjegyzések engedélyezése | Cikkhez fűzött megjegyzések engedélyezése | Igen |

### SEO Beállítások

| Beállítás | Leírás | Alapértelmezett |
|---------|--------------|----------|
| SEO URL-ek | Barátságos URL-ek engedélyezése | Nem |
| URL újraírás | Apache mod_rewrite | Nincs |
| Meta kulcsszavak | Kulcsszavak automatikus generálása | Igen |

### Engedélyek mátrixa

| Engedély | Névtelen | Regisztrált | Szerkesztő | Admin |
|------------|-----------|------------|---------|-------|
| Cikkek megtekintése | ✓ | ✓ | ✓ | ✓ |
| Cikkek beküldése | ✗ | ✓ | ✓ | ✓ |
| Saját cikkek szerkesztése | ✗ | ✓ | ✓ | ✓ |
| Összes cikk szerkesztése | ✗ | ✗ | ✓ | ✓ |
| Cikkek jóváhagyása | ✗ | ✗ | ✓ | ✓ |
| Kategóriák kezelése | ✗ | ✗ | ✗ | ✓ |

---

## 📦 modul felépítése

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

## 🔄 Migráció

### A SmartSectionből

A Publisher beépített migrációs eszközt tartalmaz:

1. Lépjen az **Adminisztrálás → Megjelenítő → Importálás** elemre.
2. Válassza ki a **SmartSection** forrást
3. Válassza ki az importálási beállításokat:
   - Kategóriák
   - Cikkek
   - Megjegyzések
4. Kattintson az **Importálás** gombra.

### A Hírek modulból

1. Lépjen az **Adminisztrálás → Megjelenítő → Importálás** elemre.
2. Válassza ki a **Hírek** forrást
3. Térképkategóriák
4. Kattintson az **Importálás** gombra.

---

## 🔗 Kapcsolódó dokumentáció

- modulfejlesztési útmutató
- Okos sablonozás
- XMF keretrendszer

---

## 📚 Források- [GitHub Repository](https://github.com/XOOPSmodules25x/publisher)
- [Problémakövető](https://github.com/XOOPSmodules25x/publisher/issues)
- [Eredeti oktatóanyag](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #kiadó #modul #blog #hírek #cms #tartalomkezelés
