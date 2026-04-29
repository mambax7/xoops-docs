---
title: "Konfiguráció mentése"
---
Ez az oldal az eddig megadott konfigurációs információk mentésének eredményeit jeleníti meg.

A problémák áttekintése és kijavítása után kattintson a „Folytatás” gombra a folytatáshoz.

## A sikerről

A _Rendszerkonfiguráció mentése_ szakasz a mentett információkat tartalmazza. A beállításokat a rendszer két fájl egyikébe menti. Az egyik fájl a _mainfile.php_ a webgyökérben. A másik a _data/secure.php_ a _xoops_data_ könyvtárban.

![XOOPS Telepítő Konfiguráció mentése](/xoops-docs/2.7/img/installation/installer-07.png)

Mindkét fájl a XOOPS 2.7.0 csomaggal szállított sablonfájlokból jön létre:

* A `mainfile.php` a webgyökérben található `mainfile.dist.php` fájlból jön létre.
* A `xoops_data/data/secure.php` a `xoops_data/data/secure.dist.php`-ból származik.

A megadott elérési utak és URL mellett a `mainfile.php` több olyan állandót is tartalmaz, amelyek újak a XOOPS 2.7.0 verzióban:

* `XOOPS_TRUST_PATH` — a `XOOPS_PATH` visszafelé kompatibilis álneveként megtartva; nem kell külön konfigurálnia.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` – az alapértelmezett `true`; a nyilvános utótaglistát használja a megfelelő cookie-domain származtatásához.
* `XOOPS_DB_LEGACY_LOG` – az alapértelmezett `false`; Állítsa be a `true` értékre fejlesztés alatt, hogy naplózza a régebbi adatbázis API-k használatát.
* `XOOPS_DEBUG` – az alapértelmezett `false`; fejlesztés alatt `true` értékre állítva, hogy további hibajelentéseket tegyen lehetővé.

Ezeket nem kell kézzel szerkesztenie a telepítés során – az alapértelmezett értékek a gyártási helyekre vonatkoznak. Itt említik őket, hogy tudja, mire kell figyelnie, ha később megnyitja a `mainfile.php`-t.

## Hibák

Ha a XOOPS hibákat észlel a konfigurációs fájlok írása során, üzeneteket jelenít meg, részletezve, hogy mi a hiba.

![XOOPS telepítői mentési konfigurációs hibák](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Sok esetben egy Debian-eredetű rendszer alapértelmezett telepítése az Apache mod_php használatával a hibák forrása. A legtöbb tárhelyszolgáltató olyan konfigurációval rendelkezik, amely nem rendelkezik ilyen problémákkal.

### Csoportengedély-problémák

A PHP folyamat néhány felhasználó engedélyével fut. A fájlok bizonyos felhasználók tulajdonában is vannak. Ha ez a kettő nem ugyanaz a felhasználó, a csoportengedélyek segítségével engedélyezheti a PHP folyamat számára, hogy fájlokat osszon meg az Ön felhasználói fiókjával. Ez általában azt jelenti, hogy módosítania kell a XOOPS-nak írandó fájlok és könyvtárak csoportját.

A fent említett alapértelmezett konfiguráció esetén ez azt jelenti, hogy a _www-data_ csoportot meg kell adni a fájlok és könyvtárak csoportjaként, és ezeknek a fájloknak és könyvtáraknak csoportonként írhatóaknak kell lenniük.

Gondosan tekintse át a konfigurációt, és alaposan válassza ki, hogyan oldja meg ezeket a problémákat a nyílt interneten elérhető dobozok esetében.

Példaparancsok lehetnek:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### mainfile.php nem hozható létre

Unix-szerű rendszerekben az új fájl létrehozásának engedélye a szülőmappában megadott engedélyektől függ. Egyes esetekben ez az engedély nem áll rendelkezésre, és annak megadása biztonsági aggályokat jelenthet.

Ha problémája van a konfigurációval, a XOOPS disztribúció _extras_ könyvtárában találhat egy álfájlt.php_. Másolja a fájlt a web gyökérbe, és állítsa be a fájl engedélyeit:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux környezetek

A SELinux biztonsági környezet problémák forrása lehet. Ha ez igaz, kérjük, olvassa el a [Speciális témák](../specialtopics.md) című részt további információkért.
