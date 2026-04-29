---
title: "Frissítés után"
---
## Frissítse a rendszermodult

Miután az összes szükséges javítást felhelyezte, a _Folytatás_ kiválasztásával mindent beállít a **rendszer** modul frissítéséhez. Ez egy nagyon fontos lépés, és szükséges a frissítés megfelelő befejezéséhez.

![XOOPS frissítési rendszermodul](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Válassza az _Update_ lehetőséget a rendszermodul frissítésének végrehajtásához.

## Frissítse a XOOPS egyéb mellékelt moduljait

A XOOPS-t három opcionális modullal szállítjuk – pm (Privát üzenetküldés,) profil (Felhasználói profil) és Protector (Protector) A telepített modulok bármelyikén frissítenie kell.

![XOOPS Egyéb modulok frissítése](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Más modulok frissítése

Valószínűleg vannak olyan frissítések más modulokhoz, amelyek lehetővé teszik, hogy a modulok jobban működjenek a most frissített XOOPS alatt. Vizsgálja meg és alkalmazza a megfelelő modulfrissítéseket.

## Tekintse át az új cookie-keményítési beállításokat

A XOOPS 2.7.0 frissítés két új beállítást ad, amelyek szabályozzák a munkamenet-cookie-k kiadását:

* **`session_cookie_samesite`** – a SameSite cookie attribútumot vezérli. A `Lax` biztonságos alapértelmezés a legtöbb webhelyen. Használja a `Strict`-t a maximális védelem érdekében, ha webhelye nem támaszkodik több eredetű navigációra. A `None` csak akkor megfelelő, ha tudja, hogy szüksége van rá.
* **`session_cookie_secure`** – ha engedélyezve van, a munkamenet-cookie csak HTTPS kapcsolatokon keresztül kerül elküldésre. Kapcsolja be, ha webhelye a HTTPS rendszeren fut.

Ezeket a beállításokat a Rendszerbeállítások → Beállítások → Általános beállítások alatt tekintheti meg.

## Egyéni témák érvényesítése

Ha webhelye egyéni témát használ, menjen végig a kezelőfelületen és az adminisztrációs területen, és ellenőrizze, hogy az oldalak megfelelően jelennek-e meg. A Smarty 4-re való frissítés még akkor is érintheti az egyéni sablonokat, ha az előzetes vizsgálat sikeres volt. Ha renderelési problémákat észlel, keresse fel újra a [Hibaelhárítás](ustep-03.md) oldalt.

## Telepítési és frissítési fájlok tisztítása

Biztonsági okokból távolítsa el ezeket a könyvtárakat a web gyökérkönyvtárából, miután megerősítette, hogy a frissítés működik:

* `upgrade/` – a frissítési munkafolyamat-könyvtár
* `install/` — ha van, akkor `install/` vagy átnevezett `installremove*` könyvtárként

Ha ezeket a helyükön hagyja, akkor a frissítési és telepítési szkriptek bárki számára elérhetővé válnak, aki elérheti webhelyét.

## Nyissa meg webhelyét

Ha követte a _Kapcsolja ki webhelyét__ tanácsot, kapcsolja be újra, miután meggyőződött arról, hogy megfelelően működik.
