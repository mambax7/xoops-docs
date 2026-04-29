---
title: "Zahteve"
---
## Programsko okolje (sklad)

Večina XOOPS produkcijskih mest deluje na skladu _LAMP_ (sistem **L**inux, ki izvaja **A**pache, **M**ySQL in **P**HP), vendar obstaja veliko različnih možnih skladov.

Pogosto je najlažje ustvariti prototip novega mesta na lokalnem računalniku. V tem primeru veliko uporabnikov XOOPS izbere sklad _WAMP_ (z uporabo **W**indows kot OS), medtem ko drugi izvajajo sklade _LAMP_ ali _MAMP_ (**M**AC).

### PHP

Katera koli različica PHP &gt;= 8.2.0 (PHP 8.4 ali novejša je močno priporočljiva)

> **Pomembno:** XOOPS 2.7.0 zahteva **PHP 8.2 ali novejšo**. PHP 7.x in starejši niso več podprti. Če nadgrajujete starejše spletno mesto, pred začetkom potrdite ponudbe gostitelja PHP 8.2+.

### MySQL

Strežnik MySQL 5.7 ali višji (močno priporočamo strežnik MySQL 8.4 ali novejši.) Podprt je tudi MySQL 9.0. MariaDB je nazaj združljiva binarna zamenjava za MySQL in dobro deluje tudi z XOOPS.

### Spletni strežnik

Spletni strežnik, ki podpira izvajanje skriptov PHP, kot so Apache, NGINX, LiteSpeed itd.

### Zahtevane PHP razširitve

Namestitveni program XOOPS preveri, ali so naložene naslednje razširitve, preden dovoli namestitev:

* `mysqli` — Gonilnik baze podatkov MySQL
* `session` — obravnava seje
* `pcre` — Regularni izrazi, združljivi s Perlom
* `filter` — filtriranje in preverjanje vnosa
* `fileinfo` — zaznavanje vrste MIME za nalaganja### Zahtevane nastavitve PHP

Poleg zgornjih razširitev namestitveni program preveri naslednjo nastavitev `php.ini`:

* `file_uploads` mora biti **Vklopljeno** — brez tega XOOPS ne more sprejeti naloženih datotek

### Priporočene PHP razširitve

Namestitveni program preveri tudi te razširitve. Niso strogo zahtevani, vendar XOOPS in večina modulov se zanaša nanje za popolno funkcionalnost. Omogočite toliko, kolikor dovoljuje vaš gostitelj:

* `mbstring` — obravnava večbajtnih nizov
* `intl` — internacionalizacija
* `iconv` — pretvorba nabora znakov
* `xml` — XML razčlenjevanje
* `zlib` — stiskanje
* `gd` — obdelava slik
* `exif` — slikovni metapodatki
* `curl` — HTTP odjemalec za vire in API klice

## Storitve

### Dostop do datotečnega sistema (za dostop spletnega skrbnika)

Potrebovali boste neko metodo (FTP, SFTP itd.) za prenos distribucijskih datotek XOOPS na spletni strežnik.

### Dostop do datotečnega sistema (za proces spletnega strežnika)

Za zagon XOOPS je potrebna sposobnost ustvarjanja, branja in brisanja datotek in imenikov. Za normalno namestitev in normalno vsakodnevno delovanje mora proces spletnega strežnika omogočati zapisovanje v naslednje poti:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (zapisljivo med namestitvijo in nadgradnjo)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`### Baza podatkov

XOOPS bo moral ustvariti, spremeniti in poizvedovati po tabelah v MySQL. Za to boste potrebovali:

* uporabniški račun MySQL in geslo
* zbirka podatkov MySQL, za katero ima uporabnik vse privilegije (ali pa ima lahko uporabnik privilegij za ustvarjanje take baze podatkov)

### E-pošta

Za spletno mesto v živo boste potrebovali delujoč e-poštni naslov, ki ga XOOPS lahko uporablja za komunikacijo z uporabniki, kot je aktivacija računa in ponastavitev gesla. Čeprav to ni nujno potrebno, je priporočljivo, če je mogoče, uporabiti e-poštni naslov, ki se ujema z domeno, na kateri deluje vaš XOOPS. To pomaga preprečiti, da bi bila vaša komunikacija zavrnjena ali označena kot vsiljena pošta.

## Orodja

Za nastavitev in prilagajanje namestitve XOOPS boste morda potrebovali nekaj dodatnih orodij. Ti lahko vključujejo:

* FTP Odjemalska programska oprema
* Urejevalnik besedil
* Programska oprema za arhiviranje za delo z datotekami izdaje XOOPS (_.zip_ ali _.tar.gz_).

Glejte razdelek [Tools of the Trade](../tools/tools.md) za nekaj predlogov za primerna orodja in nize spletnih strežnikov, če so potrebni.

## Posebne teme

Nekatere posebne kombinacije sistemske programske opreme lahko zahtevajo nekaj dodatnih konfiguracij za delovanje z XOOPS. Če uporabljate okolje SELinux ali nadgrajujete starejše spletno mesto s temami po meri, glejte [Posebne teme](specialtopics.md) za več informacij.