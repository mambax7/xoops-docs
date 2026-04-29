---
title: "Webhely áthelyezése"
---
Nagyon hasznos technika lehet egy új XOOPS webhely prototípusa helyi rendszeren vagy fejlesztői szerveren. Az is nagyon körültekintő lehet, ha először teszteli a XOOPS frissítést a gyártóhely egy példányán, arra az esetre, ha valami baj lenne. Ezek megvalósításához képesnek kell lennie arra, hogy a XOOPS webhelyet egyik webhelyről a másikra helyezze át. A következőket kell tudnia a XOOPS webhely sikeres áthelyezéséhez.

Az első lépés az új webhelykörnyezet létrehozása. Az [Előzetes előkészületek](../installation/preparations/) szakaszban szereplő tételek itt is érvényesek.

Az áttekintésben ezek a lépések a következők:

* tárhely beszerzése, beleértve a domain névre vagy e-mail-címre vonatkozó követelményeket
* szerezzen be egy MySQL felhasználói fiókot és jelszót
* szerezzen be egy MySQL adatbázist, amelyen a fenti felhasználó minden jogosultsággal rendelkezik

A folyamat hátralévő része nagyon hasonló a normál telepítéshez, de:

* a fájlok XOOPS disztribúcióból való másolása helyett a meglévő webhelyről másolja őket
* A telepítő futtatása helyett egy már feltöltött adatbázist fog importálni
* A válaszok beírása helyett a telepítőben módosítja a korábbi válaszokat a fájlokban és az adatbázisban

## Másolja a meglévő webhelyfájlokat

Készítsen teljes másolatot a meglévő webhely fájljairól a helyi gépre, ahol szerkesztheti azokat. Ha távoli gazdagéppel dolgozik, a FTP segítségével másolhatja a fájlokat. Akkor is szüksége van egy másolatra, ha a webhely fut a helyi gépen, ebben az esetben csak készítsen egy másik másolatot a webhely könyvtárairól.

Fontos megjegyezni, hogy a _xoops_data_ és _xoops_lib_ könyvtárakat akkor is bele kell foglalni, ha átnevezték őket and/or áthelyezésre.

A dolgok gördülékenyebbé tétele érdekében távolítsa el a gyorsítótárat és a Smarty által lefordított sablonfájlokat a másolatból. Ezeket a fájlokat a rendszer újra létrehozza az új környezetben, és problémákat okozhat a régi, helytelen információk megőrzése, ha nem törlik őket. Ehhez törölje az összes fájlt az _index.html_ kivételével mindhárom könyvtárból:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Megjegyzés:** A `smarty_compile` törlése különösen fontos, ha egy webhelyet áthelyez a XOOPS 2.7.0 verzióra vagy onnan. A XOOPS 2.7.0 Smarty 4-et használ, és a Smarty 4 által lefordított sablonok nem cserélhetők fel a Smarty 3 által lefordított sablonokkal. Ha az elavult lefordított fájlokat a helyükön hagyja, az új webhely első oldalának betöltésekor sablonhibákat okoz.

### `xoops_lib` és zeneszerzői függőségek

A XOOPS 2.7.0 a PHP függőségeit a Composeren keresztül kezeli, a `xoops_lib/`-n belül. A `xoops_lib/vendor/` könyvtár tartalmazza azokat a harmadik féltől származó könyvtárakat, amelyekre a XOOPS-nak futás közben szüksége van (Smarty 4, PHPMailer, HTMLPurifier stb.). Egy webhely áthelyezésekor a teljes `xoops_lib/` fát – beleértve a `vendor/`-t is – át kell másolnia az új gazdagépre. Ne próbálja meg újra generálni a `vendor/`-t a célállomáson, hacsak nem olyan fejlesztő, aki testreszabta a `composer.json`-t, és a Composer elérhető a célgépen.

## Állítsa be az új környezetet

Az [Előzetes előkészületek](../installation/preparations/) szakaszban szereplő tételek itt is érvényesek. Itt azt feltételezzük, hogy rendelkezik bármilyen tárhelytel, amelyre szüksége lesz az áthelyezett webhelyhez.

### Kulcsinformációk (mainfile.php és secure.php)

Egy webhely sikeres áthelyezése magában foglalja az abszolút fájl- és elérési útnevekre, URL-címekre, adatbázis-paraméterekre és hozzáférési hitelesítő adatokra való hivatkozások módosítását.

Két fájl, a `mainfile.php` a webhelye gyökérkönyvtárában, és a `data/secure.php` a webhelye (új néven and/or áthelyezve) _xoops_data_ könyvtárában határozza meg webhelye alapvető paramétereit, például, ahol a PH0P0 a QZ8-ban a sitt QZ8. a gazdagép fájlrendszerét, és hogyan csatlakozik az adatbázishoz.

Tudnia kell, hogy mik az értékek a régi rendszerben, és mik lesznek az új rendszerben.

#### mainfile.php

| Név | Régi érték mainfile.php | Új érték mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |Nyissa meg a _mainfile.php_ fájlt a szerkesztőben. Módosítsa a fenti diagramban látható definíciók értékeit a régi értékekről az új webhely megfelelő értékeire.

Jegyezze fel a régi és az új értékeket, mivel néhány későbbi lépésben más helyeken is hasonló változtatásokat kell végrehajtanunk.

Például, ha áthelyez egy webhelyet a helyi számítógépéről egy kereskedelmi tárhelyszolgáltatásra, értékei így nézhetnek ki:

| Név | Régi érték mainfile.php | Új érték mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Miután módosította a _mainfile.php_ fájlt, mentse el.

Lehetséges, hogy néhány más fájlok tartalmazhatnak kódolt hivatkozásokat a URL-ra vagy akár elérési utakra. Ez a személyre szabott témákban és menükben valószínűbb, de a szerkesztővel az összes fájl között kereshet, csak a biztonság kedvéért.

A szerkesztőben végezzen keresést a másolatban lévő fájlok között, keresse meg a régi XOOPS_URL értéket, és cserélje ki az új értékre.

Tegye ugyanezt a régi XOOPS_ROOT_PATH értékkel, és cserélje le az összes előfordulást az új értékre.

Őrizze meg jegyzeteit, mert később újra fel kell használnunk őket az adatbázis mozgatásakor.

#### data/secure.php

| Név | Régi érték data/secure.php | Új érték a data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Nyissa meg a _data/secure.php_ fájlt az átnevezett and/or áthelyezett _xoops_data_ könyvtárban a szerkesztőben. Módosítsa a fenti diagramban látható definíciók értékeit a régi értékekről az új webhely megfelelő értékeire.

#### Egyéb fájlok

Lehetnek más fájlok is, amelyekre figyelmet kell fordítani, amikor webhelye költözik. Néhány gyakori példa a API kulcsok különféle szolgáltatásokhoz, amelyek a tartományhoz köthetők, például:

* Google Maps
* Recaptch2
* Like gombok
* Linkmegosztás and/or hirdetések, például Shareaholic vagy AddThis

Az ilyen típusú társítások megváltoztatása nem könnyen automatizálható, mivel a régi domainhez való csatlakozások jellemzően a szolgáltatási oldalon a regisztráció részét képezik. Bizonyos esetekben ez egyszerűen hozzáadhatja vagy megváltoztathatja a szolgáltatáshoz társított tartományt.

### Másolja a fájlokat az új webhelyre

Másolja át a módosított fájlokat az új webhelyre. A technikák megegyeznek a [Telepítés](../installation/installation/) során alkalmazottakkal, azaz a FTP használatával.

## Másolja a meglévő webhelyadatbázist

### Készítsen biztonsági másolatot az adatbázisról a régi kiszolgálóról

Ehhez a lépéshez erősen ajánlott a _phpMyAdmin_ használata. Jelentkezzen be a _phpMyAdmin_-ba meglévő webhelyéhez, válassza ki az adatbázist, majd válassza az _Exportálás_ lehetőséget.

Az alapértelmezett beállítások általában rendben vannak, ezért csak válassza ki az "Exportálási módot" a _Gyors_ és a "Formátum" lehetőséget a _SQL_-nál.

Az adatbázis biztonsági másolatának letöltéséhez használja a _Go_ gombot.

![Adatbázis exportálása a phpMyAdmin segítségével](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Ha az adatbázisban olyan táblák vannak, amelyek nem a XOOPS-ból vagy annak moduljaiból származnak, és a NOT áthelyezésre kerül, válassza az _Custom_ "Exportálási módszerét", és csak a XOOPS kapcsolódó táblákat válassza az adatbázisban. (Ezek a telepítés során megadott "előtaggal" kezdődnek. Az adatbázis előtagját a `xoops_data/data/secure.php` fájlban keresheti meg.)

### Állítsa vissza az adatbázist az új kiszolgálóra

Az új gazdagépen az új adatbázis használatával állítsa vissza az adatbázist az [eszközök](../tools/tools.md) segítségével, például a _phpMyAdmin_ _Import_ lapjával (vagy szükség esetén a _bigdump_ segítségével).

### Frissítse az URL-eket és útvonalakat az adatbázisban

Frissítse a webhelyén található erőforrásokra mutató http hivatkozásokat az adatbázisában. Ez hatalmas erőfeszítést igényel, és van egy [eszköz](../tools/tools.md), amely ezt megkönnyíti.A Interconnect/it-nak van egy Search-Replace-DB nevű terméke, amely segíthet ebben. Beépített Wordpress- és Drupal-környezetekkel jár. Ez az eszköz nagyon hasznos lehet, de még jobb, ha ismeri az Ön XOOPS-ját. A XOOPS-tudatos verzió itt található: [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Kövesse a README.md fájl utasításait a segédprogram letöltéséhez és ideiglenes telepítéséhez webhelyére. Korábban megváltoztattuk a XOOPS_URL definíciót. Az eszköz futtatásakor le szeretné cserélni az eredeti XOOPS_URL definíciót az új definícióra, azaz a [http://localhost/xoops](http://localhost/xoops) helyett a [https://example.com](QZQ)7PH0P0

![A keresés és csere használata DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Adja meg a régi és az új URL-címeket, és válassza a száraz futtatás opciót. Tekintse át a változtatásokat, és ha minden rendben van, válassza az élő futás opciót. Ez a lépés elkapja azokat a konfigurációs elemeket és hivatkozásokat a tartalomban, amelyek az Ön webhelyére hivatkoznak URL.

![A SRDB változásainak áttekintése](/xoops-docs/2.7/img/installation/srdb-02.png)

Ismételje meg a folyamatot a XOOPS_ROOT_PATH régi és új értékeivel.

#### Alternatív megközelítés SRDB nélkül

Egy másik módja annak, hogy ezt a lépést az srdb eszköz nélkül hajtsa végre, az adatbázis kiíratása, a kiíratás szövegszerkesztőben történő szerkesztése az URL-ek és elérési utak módosításával, majd az adatbázis újratöltése a szerkesztett kiíratásból. Igen, ez a folyamat kellően kiterjedt, és elég kockázatot rejt magában ahhoz, hogy az emberek motiváltak legyenek olyan speciális eszközök létrehozására, mint a Search-Replace-DB.

## Próbálja ki áthelyezett webhelyét

Ezen a ponton webhelyének készen kell állnia az új környezetben való futásra!

Problémák persze mindig adódhatnak. Ne féljen kérdéseket feltenni a [xoops.org fórumon](https://xoops.org/modules/newbb/index.php).
