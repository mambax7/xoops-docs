---
title: "Čarobnjak za instalaciju"
description: "Korak po korak kroz čarobnjak za instalaciju XOOPS — objašnjeno 15 zaslona."
---
Čarobnjak za instalaciju XOOPS vodi vas kroz proces od 15 koraka koji konfigurira vašu bazu podataka, stvara admin račun i priprema vašu stranicu za prvu upotrebu.

## Prije nego počnete

- [prenijeli ste XOOPS na svoj poslužitelj](/xoops-docs/2.7/installation/ftp-upload/) ili ste postavili lokalno okruženje
- Vi ste [potvrdili zahtjeve](/xoops-docs/2.7/installation/requirements/)
- Imate spremne podatke za bazu podataka

## Koraci čarobnjaka

| Korak | Zaslon | Što se događa |
|------|--------|--------------|
| 1 | [Odabir jezika](./step-01/) | Odaberite instalaciju language |
| 2 | [Dobro došli](./step-02/) | Licencni ugovor |
| 3 | [Provjera konfiguracije](./step-03/) | PHP/provjera okruženja poslužitelja |
| 4 | [Postavljanje puta](./step-04/) | Postavite korijensku stazu i URL |
| 5 | [Veza s bazom podataka](./step-05/) | Unesite host baze podataka, korisnika, lozinku |
| 6 | [Konfiguracija baze podataka](./step-06/) | Postavite naziv baze podataka i prefiks tablice |
| 7 | [Spremi konfiguraciju](./step-07/) | Napišite mainfile.php |
| 8 | [Izrada tablice](./step-08/) | Stvorite shemu baze podataka |
| 9 | [Početne postavke](./step-09/) | Naziv stranice, admin e-pošta |
| 10 | [Umetanje podataka](./step-10/) | Popunjavanje zadanih podataka |
| 11 | [Konfiguracija web mjesta](./step-11/) | URL, vremenska zona, language |
| 12 | [Odaberite temu](./step-12/) | Odaberite zadanu temu |
| 13 | [Instalacija modula](./step-13/) | Instalirajte modules u paketu |
| 14 | [Dobrodošli](./step-14/) | Poruka o dovršetku instalacije |
| 15 | [Čišćenje](./step-15/) | Uklonite instalacijsku mapu |

:::oprez[Sigurnost]
Nakon dovršetka čarobnjaka, **izbrišite ili preimenujte mapu `install/`** — korak 15 vodi vas kroz to. Ostavljanje pristupačnim predstavlja sigurnosni rizik.
:::
