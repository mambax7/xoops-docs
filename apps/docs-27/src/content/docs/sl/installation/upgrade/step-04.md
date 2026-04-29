---
title: "Po nadgradnji"
---
## Posodobite sistemski modul

Po uporabi vseh potrebnih popravkov bo izbira _Nadaljuj_ nastavila vse za posodobitev **sistemskega** modula. To je zelo pomemben korak in je potreben za pravilno dokončanje nadgradnje.

![XOOPS Posodobi sistemski modul](/XOOPS-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Izberite _Posodobi_, da izvedete posodobitev sistemskega modula.

## Posodobite druge XOOPS priložene module

XOOPS je dobavljen s tremi izbirnimi moduli - pm (zasebna sporočila,) profil (uporabniški profil) in zaščitnik (zaščitnik). Naredite posodobitev katerega koli od teh modulov, ki so nameščeni.

![XOOPS Posodobi druge module](/XOOPS-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Posodobite druge module

Verjetno obstajajo posodobitve drugih modulov, ki bi lahko omogočile boljše delovanje modulov pod vašim zdaj posodobljenim XOOPS. Morate raziskati in uporabiti vse ustrezne posodobitve modulov.

## Preglejte nove nastavitve utrjevanja piškotkov

Nadgradnja XOOPS 2.7.0 doda dve novi nastavitvi, ki nadzorujeta, kako se izdajajo sejni piškotki:

* **`session_cookie_samesite`** — nadzoruje atribut piškotka SameSite. `Lax` je varna privzeta vrednost za večino spletnih mest. Uporabite `Strict` za največjo zaščito, če se vaše spletno mesto ne zanaša na navigacijo navzkrižnega izvora. `None` je primeren le, če veste, da ga potrebujete.
* **`session_cookie_secure`** — ko je omogočen, se sejni piškotek pošlje samo prek HTTPS povezav. Vklopite to, če vaše spletno mesto deluje na HTTPS.Te nastavitve lahko pregledate pod Sistemske možnosti → Nastavitve → Splošne nastavitve.

## Preverjanje tem po meri

Če vaše spletno mesto uporablja temo po meri, se sprehodite skozi sprednji del in skrbniško območje, da preverite, ali se strani pravilno upodabljajo. Nadgradnja na Smarty 4 lahko vpliva na predloge po meri, tudi če je pregled pred tiskom uspel. Če opazite težave z upodabljanjem, ponovno obiščite [Odpravljanje težav](ustep-03.md).

## Počisti namestitvene in nadgradne datoteke

Zaradi varnosti odstranite te imenike iz spletnega korena, ko je potrjeno, da nadgradnja deluje:

* `upgrade/` — imenik poteka nadgradnje
* `install/` — če je prisoten, kot `install/` ali kot preimenovani imenik `installremove*`

Če jih pustite na mestu, so skripti za nadgradnjo in namestitev izpostavljeni vsakomur, ki lahko doseže vaše spletno mesto.

## Odprite svoje spletno mesto

Če ste upoštevali nasvet za _Izklop spletnega mesta_, ga znova vklopite, ko ugotovite, da deluje pravilno.