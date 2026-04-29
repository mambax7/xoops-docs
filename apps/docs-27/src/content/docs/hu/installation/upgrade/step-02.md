---
title: "Futó frissítés"
---
A fő frissítő futtatása előtt győződjön meg arról, hogy elvégezte a [Futtatás előtti ellenőrzést](preflight.md). A frissítési felhasználói felület megköveteli, hogy az elővizsgálatot legalább egyszer lefusson, és ha még nem tette meg, akkor oda irányítja.

Indítsa el a frissítést úgy, hogy böngészőjét webhelye _upgrade_ könyvtárára irányítja:

```text
http://example.com/upgrade/
```

Ennek egy ehhez hasonló oldalt kell mutatnia:

![XOOPS Frissítés indítása](/xoops-docs/2.7/img/installation/upgrade-01.png)

A folytatáshoz válassza a "Folytatás" gombot.

Minden "Continue" egy másik javításon keresztül halad előre. Folytassa mindaddig, amíg az összes javítást fel nem helyezi, és meg nem jelenik a System module Update oldal.

![XOOPS Frissítés alkalmazott javítás](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Mire vonatkozik a 2.5.11 → 2.7.0 frissítés

Amikor XOOPS 2.5.11-ről 2.7.0-ra frissít, a frissítő a következő javításokat alkalmazza. Mindegyik külön lépésként jelenik meg a varázslóban, így ellenőrizheti, hogy mit változtat:

1. **Távolítsa el az elavult csomagolt PHPMailer-t.** A PHPMailer Protector modulon belüli kötegelt példánya törlődik. A PHPMailer mostantól a Composeren keresztül érhető el a `xoops_lib/vendor/`-ban.
2. **Távolítsa el az elavult HTMLPurifier mappát.** Hasonlóképpen, a Protector modulban lévő régi HTMLPurifier mappa törlődik. A HTMLPurifier mostantól a Composeren keresztül érhető el.
3. **Hozza létre a `tokens` táblát.** Egy új `tokens` tábla került hozzáadásra az általános hatókörű token tároláshoz. A táblázatban vannak oszlopok a token azonosítóhoz, a felhasználói azonosítóhoz, a hatókörhöz, a hash-hez és a issued/expires/used időbélyegekhez, és a XOOPS 2.7.0 token alapú szolgáltatásai használják.
4. **A `bannerclient.passwd` kiszélesítése.** A `bannerclient.passwd` oszlop `VARCHAR(255)`-ra bővült, így modern jelszókivonatokat (bcrypt, argon2) tud tárolni az örökölt szűk oszlop helyett.
5. **Adja hozzá a munkamenet-cookie-beállításokat.** Két új beállítás került beillesztésre: `session_cookie_samesite` (a SameSite cookie-attribútumhoz) és `session_cookie_secure` (csak a HTTPS-alapú cookie-k kényszerítéséhez). Tekintse meg a [Frissítés után](ustep-04.md) részt, hogy hogyan tekintheti át ezeket a frissítés befejezése után.

E lépések egyike sem érinti a tartalomadatait. Felhasználói, bejegyzései, képei és moduladatai érintetlenek maradnak.

## Nyelvválasztás

A fő XOOPS disztribúció angol támogatással érkezik. A további területi beállítások támogatását a [XOOPS Helyi támogatási webhelyek](https://xoops.org/modules/xoopspartners/) biztosítják. Ez a támogatás testreszabott disztribúció vagy a fő disztribúcióhoz hozzáadandó további fájlok formájában jelentkezhet.

A XOOPS fordításokat a [transifex](https://www.transifex.com/xoops/public/) karbantartja

Ha a XOOPS Upgrader további nyelvtámogatással rendelkezik, módosíthatja a nyelvet a felső menük nyelvi ikonjának kiválasztásával, majd egy másik nyelv kiválasztásával.

![XOOPS frissítési nyelv](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
