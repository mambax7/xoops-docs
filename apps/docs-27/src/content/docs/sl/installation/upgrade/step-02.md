---
title: "Teče nadgradnja"
---
Preden zaženete glavno nadgradnjo, se prepričajte, da ste opravili [Preverjanje pred tiskom](preflight.md). Uporabniški vmesnik za nadgradnjo zahteva, da se pred tiskom zažene vsaj enkrat in vas bo usmeril tja, če tega niste storili.

Zaženite nadgradnjo tako, da brskalnik usmerite v imenik _upgrade_ vašega spletnega mesta:
```text
http://example.com/upgrade/
```
To bi moralo prikazati stran, kot je ta:

![XOOPS Zagon nadgradnje](/XOOPS-docs/2.7/img/installation/upgrade-01.png)

Za nadaljevanje izberite gumb »Nadaljuj«.

Vsak "Nadaljuj" napreduje skozi drug popravek. Nadaljujte, dokler niso uporabljeni vsi popravki in se prikaže stran za posodobitev sistemskega modula.

![XOOPS Uporabljeni popravek nadgradnje](/XOOPS-docs/2.7/img/installation/upgrade-05-applied.png)

## Kaj velja nadgradnja 2.5.11 → 2.7.0

Pri nadgradnji z XOOPS 2.5.11 na 2.7.0 nadgrajevalec uporabi naslednje popravke. Vsak je predstavljen kot ločen korak v čarovniku, tako da lahko potrdite, kaj se spreminja:

1. **Odstranite zastareli paket PHPMailer.** Kopija PHPMailerja v paketu znotraj modula Protector je izbrisana. PHPMailer je zdaj na voljo prek Composerja v `xoops_lib/vendor/`.
2. **Odstranite zastarelo mapo HTMLPurifier.** Podobno se izbriše stara mapa HTMLPurifier znotraj modula Protector. HTMLPurifier je zdaj na voljo prek Composerja.
3. **Ustvarite tabelo `tokens`.** Dodana je nova tabela `tokens` za generično shranjevanje žetonov v obsegu. Tabela ima stolpce za ID žetona, ID uporabnika, obseg, zgoščeno vrednost in časovne žige issued/expires/used, uporabljajo pa jo funkcije na osnovi žetonov v XOOPS 2.7.0.
4. **Razširite `bannerclient.passwd`.** Stolpec `bannerclient.passwd` je razširjen na `VARCHAR(255)`, tako da lahko shranjuje sodobne zgoščene vrednosti gesel (bcrypt, argon2) namesto podedovanega ozkega stolpca.
5. **Dodajte nastavitve piškotkov seje.** Vstavljeni sta dve novi nastavitvi: `session_cookie_samesite` (za atribut piškotka SameSite) in `session_cookie_secure` (za vsilitev piškotkov samo HTTPS). Glejte [Po nadgradnji](ustep-04.md), kako jih pregledati po končani nadgradnji.Noben od teh korakov se ne dotika vaših podatkov o vsebini. Vaši uporabniki, objave, slike in podatki modulov ostanejo nedotaknjeni.

## Izbira jezika

Glavna distribucija XOOPS ima podporo za angleščino. Podporo za dodatne področne nastavitve nudijo [XOOPS lokalna podporna mesta](https://XOOPS.org/modules/xoopspartners/). Ta podpora je lahko v obliki prilagojene distribucije ali dodatnih datotek, ki jih dodate glavni distribuciji.

XOOPS prevodi se vzdržujejo na [transifex](https://www.transifex.com/XOOPS/public/)

Če ima vaš XOOPS nadgraditelj dodatno jezikovno podporo, lahko spremenite jezik tako, da izberete ikono jezika v zgornjih menijih in izberete drug jezik.

![XOOPS Jezik nadgradnje](/XOOPS-docs/2.7/img/installation/upgrade-02-change-language.png)