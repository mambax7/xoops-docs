---
title: "Konfiguracija baze podataka"
---
Ova stranica prikuplja informacije o bazi podataka koju će XOOPS koristiti.

Nakon unosa traženih podataka i ispravljanja problema, odaberite gumb "Nastavi" za nastavak.

![XOOPS Konfiguracija baze podataka programa za instalaciju](/xoops-docs/2.7/img/installation/installer-06.png)

## Podaci prikupljeni u ovom koraku

### baza podataka

#### Ime baze podataka

Naziv baze podataka na glavnom računalu koji XOOPS treba koristiti. Korisnik baze podataka unesen u prethodnom koraku trebao bi imati sve privilegije na ovoj bazi podataka. Instalater će pokušati stvoriti ovu bazu podataka ako ne postoji.

#### Prefiks tablice

Ovaj prefiks će biti dodan nazivima svih novih tablica koje je kreirao XOOPS. Ovo pomaže u izbjegavanju sukoba imena ako se baza podataka dijeli s drugim aplikacijama. Jedinstveni prefiks također otežava pogađanje naziva tablica, što ima sigurnosne prednosti. Ako niste sigurni, samo zadržite zadano

#### Skup znakova baze podataka

Instalacijski program zadano je `utf8mb4`, koji podržava cijeli Unicode raspon uključujući emotikone i dodatne znakove. Ovdje možete odabrati drugačiji skup znakova, ali `utf8mb4` se preporučuje za gotovo sve languages i lokalizacije i treba ga ostaviti kakav jest osim ako nemate poseban razlog da ga promijenite.

#### Uspoređivanje baze podataka

Polje za uspoređivanje je prema zadanim postavkama ostavljeno prazno. Kada je prazan, MySQL primjenjuje zadanu sortaciju za bilo koji skup znakova koji je gore odabran (za `utf8mb4` to je obično `utf8mb4_general_ci` ili `utf8mb4_0900_ai_ci`, ovisno o MySQL verzija). Ako vam je potrebna određena sortacija — na primjer za podudaranje s postojećom bazom podataka — odaberite je ovdje. U suprotnom, preporuča se da ga ostavite praznim.
