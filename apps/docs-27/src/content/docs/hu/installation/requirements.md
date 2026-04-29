---
title: "Követelmények"
---
## Szoftverkörnyezet (a verem)

A legtöbb XOOPS termelési hely _LAMP_ veremen fut (**L**inux rendszer, amely **A**pache-t, **M**ySQL-t és **P**HP-t futtat), de nagyon sok különböző lehetséges verem létezik.

Gyakran a legegyszerűbb egy új webhely prototípusa egy helyi gépen. Ebben az esetben sok XOOPS-felhasználó egy _WAMP_-vermet választ (**W**indows-t használva operációs rendszerként), míg mások a _LAMP_ vagy _MAMP_ (**M**s.AC) rendszert futtatják.

### PHP

Bármely PHP verzió >= 8.2.0 (PHP 8.4 vagy újabb erősen ajánlott)

> **Fontos:** A XOOPS 2.7.0 verzióhoz **PHP 8.2 vagy újabb** szükséges. A PHP 7.x és korábbi verziói már nem támogatottak. Ha egy régebbi webhelyet frissít, a kezdés előtt győződjön meg arról, hogy a gazdagép kínál-e PHP 8.2+ verziót.

### MySQL

MySQL szerver 5.7 vagy újabb (MySQL Server 8.4 vagy újabb erősen ajánlott.) A MySQL 9.0 is támogatott. A MariaDB a MySQL visszafelé kompatibilis, bináris beugró helyettesítője, és jól működik a XOOPS-val is.

### Webszerver

Olyan webszerver, amely támogatja a PHP szkriptek futtatását, például Apache, NGINX, LiteSpeed stb.

### Szükséges PHP bővítmények

A XOOPS telepítő ellenőrzi a következő bővítmények betöltését, mielőtt engedélyezi a telepítés folytatását:

* `mysqli` — MySQL adatbázis-illesztőprogram
* `session` — munkamenet-kezelés
* `pcre` – Perl-kompatibilis reguláris kifejezések
* `filter` – bemeneti szűrés és ellenőrzés
* `fileinfo` — MIME típusú észlelés a feltöltéshez

### Kötelező PHP beállítások

A fenti kiterjesztéseken kívül a telepítő ellenőrzi a következő `php.ini` beállítást:

* A `file_uploads` értéke **Be** legyen – enélkül a XOOPS nem fogadja el a feltöltött fájlokat

### Ajánlott PHP bővítmények

A telepítő ezeket a bővítményeket is ellenőrzi. Ezek nem feltétlenül szükségesek, de a XOOPS és a legtöbb modul teljes funkcionalitása érdekében rájuk támaszkodik. Engedélyezzen annyit, amennyit a gazdagép engedélyez:

* `mbstring` – többbájtos karakterlánc-kezelés
* `intl` – nemzetközivé válás
* `iconv` — karakterkészlet átalakítás
* `xml` — XML elemzés
* `zlib` – tömörítés
* `gd` — képfeldolgozás
* `exif` — kép metaadatai
* `curl` — HTTP kliens feedekhez és API hívásokhoz

## Szolgáltatások

### Fájlrendszer-hozzáférés (webmesteri hozzáféréshez)

Szüksége lesz valamilyen módszerre (FTP, SFTP stb.) a XOOPS terjesztési fájlok webszerverre való átviteléhez.

### Fájlrendszer-hozzáférés (webszerver-folyamathoz)

A XOOPS futtatásához fájlok és könyvtárak létrehozásának, olvasásának és törlésének képességére van szükség. A következő elérési utaknak írhatónak kell lenniük a webszerver-folyamatnak a normál telepítéshez és a normál napi működéshez:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (írható a telepítés és a frissítés során)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Adatbázis

A XOOPS-nak táblákat kell létrehoznia, módosítania és le kell kérdeznie a MySQL-ban. Ehhez szüksége lesz:

* egy MySQL felhasználói fiók és jelszó
* egy MySQL adatbázis, amelyre a felhasználó minden jogosultsággal rendelkezik (vagy alternatívaként a felhasználó jogosult lehet ilyen adatbázist létrehozni)

### E-mail

Élő webhely esetén szüksége lesz egy működő e-mail címre, amelyet a XOOPS használhat a felhasználói kommunikációhoz, például fiókaktiváláshoz és jelszó-visszaállításhoz. Bár nem feltétlenül kötelező, lehetőleg olyan e-mail címet használjon, amely megegyezik azzal a domainnel, amelyen a XOOPS fut. Ez segít elkerülni, hogy kommunikációit elutasítsák vagy spamként jelöljék meg.

## Eszközök

A XOOPS telepítés beállításához és testreszabásához további eszközökre lehet szüksége. Ezek a következők lehetnek:* FTP ügyfélszoftver
* Szövegszerkesztő
* Archív szoftver a XOOPS kiadású (_.zip_ vagy _.tar.gz_) fájlokkal való együttműködéshez.

Tekintse meg a [Tools of the Trade](../tools/tools.md) részt, ahol javaslatokat találhat a megfelelő eszközökre és szükség esetén webszerver-veremekre.

## Különleges témák

Egyes speciális rendszerszoftver-kombinációk további konfigurációkat igényelhetnek a XOOPS használatához. Ha SELinux környezetet használ, vagy egy régebbi webhelyet frissít egyéni témákkal, további információkért tekintse meg a [Speciális témák](specialtopics.md) részt.
