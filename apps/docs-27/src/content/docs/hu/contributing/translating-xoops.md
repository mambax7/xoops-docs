---
title: "3. függelék: XOOPS fordítása helyi nyelvre"
---
A XOOPS 2.7.0 csak angol nyelvű fájlokkal szállítható. A más nyelvekre történő fordításokat a közösség tartja karban, és a GitHubon és a különböző helyi XOOPS támogatási webhelyeken keresztül terjesztik.

## Hol találhatók a meglévő fordítások

- **GitHub** – a közösségi fordítások egyre gyakrabban jelennek meg a [XOOPS szervezet](https://github.com/XOOPS) és az egyéni közreműködők fiókjaiban, külön tárolókban. Keressen a GitHubban a `xoops-language-<your-language>` kifejezésre, vagy böngésszen a XOOPS szervezetben az aktuális csomagokért.
- **Helyi XOOPS támogatási webhelyek** — sok regionális XOOPS közösség tesz közzé fordításokat saját webhelyén. Látogassa meg a [https://xoops.org](https://xoops.org) oldalt, és kövesse a helyi közösségekre mutató hivatkozásokat.
- **modulfordítások** — az egyes közösségi modulok fordításai általában maga a modul mellett találhatók a `XOOPSmodules25x` GitHub szervezetben (a névben szereplő `25x` történeti; a modulok mind a QZXPH000062HPXZxQ 2..7.5.2.2.2.

Ha már létezik fordítás az Ön nyelvére, dobja be a nyelvi könyvtárakat a XOOPS telepítésébe (lásd alább, „A fordítás telepítése”).

## Amit le kell fordítani

A XOOPS 2.7.0 a nyelvi fájlokat az azokat fogyasztó kód mellett tartja. A teljes fordítás lefedi ezeket a helyeket:

- **Mag** — `htdocs/language/english/` — minden oldal által használt webhely-szintű állandók (bejelentkezés, gyakori hibák, dátumok, levélsablonok stb.).
- **Telepítő** — `htdocs/install/language/english/` — a telepítővarázsló által megjelenített karakterláncok. Fordítsa le ezeket *mielőtt* futtatná a telepítőt, ha lokalizált telepítési élményt szeretne.
- **Rendszermodul** — `htdocs/modules/system/language/english/` — messze a legnagyobb készlet; lefedi a teljes adminisztrátori vezérlőpultot.
- **Csomagolt modulok** — a `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` és `htdocs/modules/debugbar/language/english/` mindegyike.
- **Témák** – néhány téma saját nyelvi fájljait szállítja; ellenőrizze a `htdocs/themes/<theme>/language/` elemet, ha létezik.

A „csak mag” fordítás a minimális hasznos egység, és megfelel a fenti első két pontnak.

## Hogyan kell fordítani

1. Másolja ki a mellette lévő `english/` könyvtárat, és nevezze át a másolatot a saját nyelvére. A könyvtárnév a nyelv kisbetűs angol neve legyen (`spanish`, `german`, `french`, `japanese`, `arabic` stb.).

   
   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Nyissa meg az egyes `.php` fájlokat az új könyvtárban, és fordítsa le a **string értékeket** a `define()` hívásokon belül. **Ne** változtassa meg a konstans neveket – az egész magban a PHP kódból hivatkoznak rájuk.

   
   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Minden fájl mentése UTF-8 néven * nélkül* BOM.** A XOOPS 2.7.0 `utf8mb4` végpontok közötti, végpontok közötti, fájlokat (adatbázisokat) és munkameneteket (adatbázisokat) használ. A Notepad++-ban ez a **"UTF-8"** opció, *nem* "UTF-8-BOM". A VS Code-ban ez az alapértelmezett; csak erősítse meg a kódolást az állapotsorban.

4. Frissítse a nyelvet és a karakterkészlet metaadatait az egyes fájlok tetején, hogy megfeleljen az Ön nyelvének:

   
   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   A `_LANGCODE` az Ön nyelvének megfelelő [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) kód. A `_CHARSET` mindig `UTF-8` a XOOPS 2.7.0 verzióban — már nincs ISO-8859-1 változat.

5. Ismételje meg a műveletet a telepítővel, a rendszermodullal és az összes szükséges modullal.

## Fordítás telepítése

Ha egy kész fordítást kapott könyvtárfaként:

1. Másoljon minden `<language>/` könyvtárat a megfelelő `language/english/` szülőbe a XOOPS telepítésében. Például másolja a `language/spanish/`-t a `htdocs/language/`-ba, a `install/language/spanish/`-t a `htdocs/install/language/`-ba és így tovább.
2. Győződjön meg arról, hogy a fájlok tulajdonjoga és engedélyei olvashatók a webszerver számára.
3. Vagy válassza ki az új nyelvet a telepítéskor (a varázsló megvizsgálja a `htdocs/language/` elérhető nyelveket), vagy egy meglévő webhelyen módosítsa a nyelvet az **Adminisztrálás → Rendszer → Beállítások → Általános beállítások** menüpontban.

## A fordítás megosztása

Kérjük, adja vissza fordítását a közösségnek.1. Hozzon létre egy GitHub-tárat (vagy húzzon ki egy meglévő nyelvi tárat, ha létezik ilyen az Ön nyelvéhez).
2. Használjon egyértelmű nevet, például `xoops-language-<language-code>` (pl. `xoops-language-es`, `xoops-language-pt-br`).
3. Tükrözze a XOOPS könyvtárstruktúrát a tárhelyen belül, hogy a fájlok összhangban legyenek a másolás helyével:

   
   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Csatoljon be egy `README.md` dokumentumot, amely dokumentálja:
   - Nyelv neve és ISO kód
   - XOOPS verzió kompatibilitás (pl. `XOOPS 2.7.0+`)
   - Fordító és hitelek
   - Függetlenül attól, hogy a fordítás csak a magra vonatkozik, vagy a csomagban lévő modulokra vonatkozik
5. Nyisson meg egy lehívási kérelmet a megfelelő module/core-tárral szemben a GitHubon, vagy tegyen közzé bejelentést a [https://xoops.org](https://xoops.org) oldalon, hogy a közösség megtalálhassa.

> **Megjegyzés**
>
> Ha az Ön nyelve a dátum vagy a naptár formázásához szükséges változtatásokat igényli, ezeket a változtatásokat is foglalja bele a csomagba. A jobbról balra írt nyelvek (arab, héber, perzsa, urdu) a XOOPS 2.7.0-ban már a dobozból is működnek – a RTL támogatás hozzáadásra került ebben a kiadásban, és az egyes témák automatikusan felveszik azt.
