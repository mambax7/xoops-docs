---
title: "Nakon nadogradnje"
---
## Ažurirajte modul sustava

Nakon što su primijenjene sve potrebne zakrpe, odabirom _Nastavi_ sve će se postaviti za ažuriranje modula **sustava**. Ovo je vrlo važan korak i potreban je za pravilno dovršenje nadogradnje.

![XOOPS modul sustava ažuriranja](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Odaberite _Ažuriraj_ za izvođenje ažuriranja modula sustava.

## Ažurirajte druge XOOPS isporučene module

XOOPS isporučuje se s tri opcijska modules - pm (Private Messaging,) profil (Korisnički profil) i zaštitnik (Protector) Trebali biste ažurirati bilo koji od ovih modules koji su instalirani.

![XOOPS Ažuriranje ostalih modula](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Ažurirajte druge module

Vjerojatno postoje ažuriranja za druge modules koja bi mogla omogućiti bolji rad modules pod vašim sada ažuriranim XOOPS. Trebali biste istražiti i primijeniti sva odgovarajuća ažuriranja modula.

## Pregledajte nove postavke otvrdnjavanja kolačića

Nadogradnja XOOPS 2.7.0 dodaje dvije nove postavke koje kontroliraju način izdavanja kolačića sesije:

* **`session_cookie_samesite`** — kontrolira atribut kolačića SameSite. `Lax` sigurna je zadana postavka za većinu web-mjesta. Koristite `Strict` za maksimalnu zaštitu ako se vaše web mjesto ne oslanja na navigaciju s drugog izvora. `None` prikladan je samo ako znate da vam je potreban.
* **`session_cookie_secure`** — kada je omogućeno, kolačić sesije šalje se samo preko HTTPS veze. Uključite ovo ako vaše web mjesto radi na HTTPS-u.

Ove postavke možete pregledati pod System Options → Preferences → General Settings.

## Provjerite prilagođene teme

Ako vaše web mjesto koristi prilagođenu temu, prođite kroz prednji dio i područje admin kako biste potvrdili da se stranice prikazuju ispravno. Nadogradnja na Smarty 4 može utjecati na prilagođeni templates čak i ako je skeniranje prije leta prošlo. Ako vidite probleme s renderiranjem, ponovno posjetite [Rješavanje problema](ustep-03.md).

## Očisti instalacijske i nadogradne datoteke

Radi sigurnosti, uklonite ove direktorije iz svog web korijena nakon što se potvrdi da nadogradnja radi:

* `upgrade/` — direktorij tijeka rada nadogradnje
* `install/` — ako postoji, ili kao `install/` ili kao preimenovani direktorij `installremove*`

Ako ih ostavite na mjestu, nadogradnju i instalacijske skripte izlažete svima koji mogu doći do vaše stranice.

## Otvorite svoju stranicu

Ako ste slijedili savjet da _Isključite svoju stranicu_, trebali biste je ponovno uključiti nakon što utvrdite da radi ispravno.
