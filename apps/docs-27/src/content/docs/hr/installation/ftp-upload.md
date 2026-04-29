---
title: "Dodatak 2: Prijenos XOOPS putem FTP-a"
---
Ovaj dodatak prolazi kroz postavljanje XOOPS 2.7.0 na udaljeni host koristeći FTP ili SFTP. Bilo koja administratorska ploča (cPanel, Plesk, DirectAdmin itd.) izložit će iste temeljne korake.

## 1. Pripremite bazu podataka

Putem upravljačke ploče vašeg domaćina:

1. Napravite novu MySQL bazu podataka za XOOPS.
2. Stvorite korisnika baze podataka sa jakom lozinkom.
3. Dodijelite korisniku pune privilegije na novostvorenoj bazi podataka.
4. Zabilježite naziv baze podataka, korisničko ime, lozinku i host — unijet ćete ih u instalacijski program XOOPS.

> **Savjet**
>
> Moderne upravljačke ploče umjesto vas generiraju jake lozinke. Budući da aplikacija pohranjuje zaporku u `xoops_data/data/secure.php`, ne morate je često upisivati ​​— radije dugu, nasumično generiranu vrijednost.

## 2. Napravite administrator poštanski sandučić

Napravite poštanski sandučić e-pošte koji će primati obavijesti stranice administration. XOOPS instalacijski program traži ovu adresu tijekom postavljanja računa webmastera i potvrđuje je sa `FILTER_VALIDATE_EMAIL`.

## 3. Učitajte datoteke

XOOPS 2.7.0 isporučuje se sa svojim ovisnostima trećih strana unaprijed instaliranim u `xoops_lib/vendor/` (paketi Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF i više). Zbog toga je `xoops_lib/` znatno veći nego u 2.5.x — očekujte desetke megabajta.

**Nemojte selektivno preskakati datoteke unutar `xoops_lib/vendor/`.** Preskakanje datoteka u stablu Composer vendor prekinut će automatsko učitavanje i instalacija neće uspjeti.

Struktura prijenosa (pod pretpostavkom da je `public_html` korijen dokumenta):

1. Učitajte `xoops_data/` i `xoops_lib/` **pored** `public_html`, ne unutar njega. Njihovo postavljanje izvan web korijena preporučeno je sigurnosno stanje za 2.7.0.

   
   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Učitajte preostali sadržaj distribucijskog direktorija `htdocs/` u `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Ako vaš host ne dopušta direktorije izvan korijena dokumenta**
>
> Učitajte `xoops_data/` i `xoops_lib/` **unutar** `public_html/` i **preimenujte ih u neočita imena** (na primjer `xdata_8f3k2/` i `xlib_7h2m1/`). U program za instalaciju unijet ćete preimenovane staze kada zatraži XOOPS Data Path i XOOPS Library Path.

## 4. Učinite direktorije u koje je moguće pisati

Putem CHMOD dijaloga (ili SSH) FTP klijenta, web poslužitelju omogućite upisivanje u direktorije navedene u poglavlju 2. Na većini dijeljenih hostova dovoljni su `0775` na imenicima i `0664` na `mainfile.php`. `0777` je prihvatljiv tijekom instalacije ako vaš host pokreće PHP pod korisnikom koji nije FTP korisnik, ali pooštrite dopuštenja nakon što instalacija završi.

## 5. Pokrenite instalacijski program

Usmjerite svoj preglednik na javni URL stranice. Ako su sve datoteke na mjestu, pokreće se čarobnjak za instalaciju XOOPS i možete pratiti ostatak ovog vodiča od [Poglavlja 2](chapter-2-introduction.md) nadalje.
