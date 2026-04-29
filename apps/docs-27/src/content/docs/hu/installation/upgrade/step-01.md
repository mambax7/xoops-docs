---
title: "Előkészületek a frissítésre"
---
## Kapcsolja ki a webhelyet

A XOOPS frissítési folyamat megkezdése előtt állítsa be a "Kikapcsolja a webhelyet?" elemet _Igen_ értékre a Beállítások -&gt; Rendszerbeállítások -&gt; Általános beállítások oldalt az Adminisztráció menüben.

Ez megóvja a felhasználókat attól, hogy hibás webhelyet találjanak a frissítés során. A zökkenőmentesebb frissítés érdekében minimálisra csökkenti az erőforrásokért való versengést is.

Hibák és hibás webhely helyett a látogatók valami ilyesmit fognak látni:

![Webhely mobilon bezárva](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Biztonsági mentés

Célszerű a XOOPS adminisztrációs _Karbantartás_ szakaszát használni a _Gyorsítótár-mappa_tisztítására_ az összes gyorsítótárhoz, mielőtt teljes biztonsági másolatot készítene a webhely fájljairól. A webhely kikapcsolt állapotában az _Ürítse ki a munkamenetek tábláját_ szintén ajánlott, hogy ha visszaállításra van szükség, az elavult munkamenetek ne legyenek részei.

### Fájlok

A fájl biztonsági mentése a FTP segítségével készíthető, az összes fájlt a helyi gépre másolva. Ha közvetlen shell hozzáférésed van a szerverhez, _sokkal_ gyorsabban lehet ott másolatot (vagy archív másolatot) készíteni.

### Adatbázis

Adatbázis-mentés készítéséhez használhatja a XOOPS adminisztrációs _Karbantartás_ rész beépített függvényeit. Használhatja a _phpMyAdmin_ _Export_ funkcióit is, ha elérhető. Ha rendelkezik shell hozzáféréssel, a _mysql_ paranccsal kiírhatja az adatbázist.

A biztonsági mentés és az adatbázis _visszaállítása_ folyékonyan fontos webmesteri készség. Számos online forrás található, amelyek segítségével többet megtudhat ezekről a műveletekről a telepítésnek megfelelően, például [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Másoljon új fájlokat a webhelyre

Az új fájlok webhelyre másolása gyakorlatilag megegyezik az [Előkészületek](../../installation/preparations/) lépéssel a telepítés során. A _xoops_data_ és _xoops_lib_ könyvtárakat oda kell másolni, ahová a telepítés során áthelyezték. Ezután másolja át a disztribúció _htdocs_ könyvtárának többi tartalmát (a következő részben tárgyalt néhány kivétellel) a webgyökér meglévő fájljaira és könyvtáraira.

A XOOPS 2.7.0 verzióban egy új disztribúció meglévő webhely tetejére másolása **nem írja felül a meglévő konfigurációs fájlokat**, például `mainfile.php` vagy `xoops_data/data/secure.php`. Ez örvendetes változás a korábbi verziókhoz képest, de még mindig teljes biztonsági másolatot kell készítenie az indítás előtt.

Másolja a teljes _upgrade_ könyvtárat a terjesztésből a web gyökérkönyvtárába, és hozzon létre ott egy _upgrade_ könyvtárat.

## Futtassa le a Smarty 4 repülés előtti ellenőrzését

A fő `/upgrade/` munkafolyamat elindítása előtt futtassa a `upgrade/` könyvtárban szállított elővizsgálati szkennert. Megvizsgálja a meglévő témákat és modulsablonokat a Smarty 4-kompatibilitási problémák miatt, és sokukat automatikusan kijavíthatja.

1. Irányítsa böngészőjét a _your-site-url_/upgrade/preflight.php címre
2. Jelentkezzen be rendszergazdai fiókkal
3. Futtassa le a vizsgálatot, és tekintse át a jelentést
4. Alkalmazza a felajánlott automatikus javításokat, vagy manuálisan javítsa ki a megjelölt sablonokat
5. Futtassa újra a vizsgálatot, amíg meg nem tisztul
6. Csak ezután folytassa a fő frissítéssel

A teljes áttekintésért tekintse meg az [Preflight Check](preflight.md) oldalt.

### Olyan dolgok, amelyeket esetleg nem szeretne átmásolni

Ne másolja újra az _install_ könyvtárat működő XOOPS rendszerbe. Ha elhagyja a telepítési mappát a XOOPS-telepítésben, akkor a rendszer potenciális biztonsági problémáknak tesz ki. A telepítő véletlenszerűen átnevezi, de törölnie kell, és ügyelnie kell arra, hogy ne másoljon be egy másikat.

Vannak olyan fájlok, amelyeket webhelye testreszabása érdekében szerkesztett, és ezeket meg kell őriznie. Itt található a gyakori testreszabások listája.

* _xoops_data/configs/xoopsconfig.php_, ha a webhely telepítése óta megváltozott
* a _témákban_ lévő bármely könyvtár, ha testreszabta az Ön webhelyéhez. Ebben az esetben érdemes lehet a fájlokat összehasonlítani a hasznos frissítések azonosítása érdekében.
* bármely fájl a _class/captcha/_ "config" karakterlánccal kezdődően, ha a webhely telepítése óta megváltozott
* bármilyen testreszabás a _class/textsanitizer_-ban
* bármilyen testreszabás a _class/xoopseditor_-banHa a frissítés után rájön, hogy valamit véletlenül felülírtak, ne essen pánikba – ezért kezdett teljes biztonsági mentéssel. _(Csináltál biztonsági másolatot, igaz?)_

## Ellenőrizze a mainfile.php-t (frissítés 2.5 előtti XOOPS)

Ez a lépés csak akkor érvényes, ha egy régi XOOPS verzióról (2.3 vagy korábbi) frissít. Ha a XOOPS 2.5.x verzióról frissít, kihagyhatja ezt a részt.

A XOOPS régi verzióihoz manuálisan kellett módosítani a `mainfile.php`-ban a Protector modul engedélyezéséhez. A webgyökérben kell lennie egy `mainfile.php` nevű fájlnak. Nyissa meg a fájlt a szerkesztőben, és keresse meg a következő sorokat:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

és

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Távolítsa el ezeket a sorokat, ha megtalálja őket, és a folytatás előtt mentse el a fájlt.
