---
title: "2. függelék: XOOPS feltöltése FTP-n keresztül"
---
Ez a függelék bemutatja a XOOPS 2.7.0 telepítését távoli gazdagépen a FTP vagy SFTP használatával. Bármely vezérlőpanel (cPanel, Plesk, DirectAdmin stb.) ugyanazokat a mögöttes lépéseket teszi közzé.

## 1. Készítse elő az adatbázist

A gazdagép vezérlőpultján keresztül:

1. Hozzon létre egy új MySQL adatbázist a XOOPS számára.
2. Hozzon létre egy adatbázis-felhasználót erős jelszóval.
3. Adjon teljes jogosultságot a felhasználónak az újonnan létrehozott adatbázishoz.
4. Jegyezze fel az adatbázis nevét, felhasználónevét, jelszavát és gazdagépét – ezeket be kell írnia a XOOPS telepítőbe.

> **Tipp**
>
> A modern vezérlőpanelek erős jelszavakat generálnak az Ön számára. Mivel az alkalmazás a jelszót `xoops_data/data/secure.php`-ban tárolja, nem kell gyakran begépelnie – inkább egy hosszú, véletlenszerűen generált értéket.

## 2. Hozzon létre egy rendszergazdai postafiókot

Hozzon létre egy e-mail postafiókot, amely megkapja a webhely adminisztrációs értesítéseit. A XOOPS telepítő ezt a címet kéri a webmesterfiók beállítása során, és a `FILTER_VALIDATE_EMAIL` segítségével érvényesíti.

## 3. Töltse fel a fájlokat

A XOOPS 2.7.0 harmadik féltől származó függőségei előre telepítve vannak a `xoops_lib/vendor/`-ban (Composer csomagok, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF stb.). Ez jelentősen nagyobbá teszi a `xoops_lib/`-t, mint a 2.5.x-ben – több tíz megabájtra számíthatunk.

**Ne ugorjon át szelektíven a `xoops_lib/vendor/`-n belüli fájlokat.** A Composer szállítói fájában lévő fájlok átugrása megszakítja az automatikus betöltést, és a telepítés sikertelen lesz.

Feltöltés szerkezete (feltételezve, hogy `public_html` a dokumentum gyökér):

1. Töltse fel a `xoops_data/`-t és a `xoops_lib/`-t **mellett** `public_html`, ne annak belsejében. A 2.7.0-s verzióhoz ajánlott biztonsági helyzet a webgyökéren kívülre helyezni őket.

   
   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Töltse fel a `htdocs/` terjesztési könyvtár fennmaradó tartalmát a `public_html/`-ba.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Ha a gazdagép nem engedélyezi a dokumentumgyökéren kívüli könyvtárakat**
>
> Töltsd fel a `xoops_data/` és `xoops_lib/` **belül** `public_html/`-t, és **nevezd át nem nyilvánvaló nevekre** (például `xdata_8f3k2/` és QZXPH0000Q22). Az átnevezett elérési utakat be kell írnia a telepítőbe, amikor az kéri a XOOPS adatútvonalat és a XOOPS könyvtár elérési utat.

## 4. Tegye írhatóvá az írható könyvtárakat

A FTP kliens CHMOD párbeszédpaneljén (vagy SSH) keresztül tegye írhatóvá a 2. fejezetben felsorolt könyvtárakat a webszerver által. A legtöbb megosztott gazdagépen elegendő a `0775` a könyvtárakon és a `0664` a `mainfile.php`-n. A `0777` a telepítés során elfogadható, ha a gazdagép a PHP-t a FTP felhasználótól eltérő felhasználó alatt futtatja, de a telepítés befejezése után szigorítsa meg az engedélyeket.

## 5. Indítsa el a telepítőt

Irányítsa böngészőjét a webhely nyilvános URL-jára. Ha minden fájl a helyén van, elindul a XOOPS telepítővarázsló, és követheti az útmutató további részét a [2. fejezettől](chapter-2-introduction.md) kezdve.
