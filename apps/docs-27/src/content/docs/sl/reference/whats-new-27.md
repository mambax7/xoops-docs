---
title: "Kaj je novega v XOOPS 2.7.0"
---
XOOPS 2.7.0 je pomembna posodobitev iz serije 2.5.x. Pred namestitvijo ali nadgradnjo preglejte spremembe na tej strani, da boste vedeli, kaj lahko pričakujete. Spodnji seznam je osredotočen na elemente, ki vplivajo na namestitev in administracijo spletnega mesta – za celoten seznam sprememb glejte opombe ob izdaji, ki so priložene distribuciji.

## PHP 8.2 je nov minimum

XOOPS 2.7.0 zahteva **PHP 8.2 ali novejšo**. PHP 7.x in starejši niso več podprti. PHP 8.4 ali višje je zelo priporočljivo.

**Ukrep:** Preden začnete, potrdite ponudbe svojega gostitelja PHP 8.2+. Glejte [Zahteve](installation/requirements.md).

## MySQL 5.7 je nov minimum

Nov minimum je **MySQL 5.7** (ali združljiva MariaDB). Močno priporočamo MySQL 8.4 ali novejši. Podprt je tudi MySQL 9.0.

Stara opozorila o težavah z združljivostjo PHP/MySQL 8 ne veljajo več, ker XOOPS ne podpira več prizadetih različic PHP.

## Smarty 4 nadomešča Smarty 3

To je največja sprememba za obstoječa spletna mesta. XOOPS 2.7.0 uporablja **Smarty 4** kot mehanizem za predloge. Smarty 4 je strožji glede sintakse predlog kot Smarty 3 in nekatere teme po meri in predloge modulov bodo morda treba prilagoditi, preden bodo pravilno upodobljene.Za pomoč pri odkrivanju in odpravljanju teh težav XOOPS 2.7.0 pošilja **skener pred tiskom** v imenik `upgrade/`, ki pregleda vaše obstoječe predloge glede znanih nezdružljivosti Smarty 4 in lahko samodejno popravi veliko od njih.

**Ukrep:** Če nadgrajujete z 2.5.x in imate teme po meri ali starejše module, zaženite [Preverjanje pred tiskom](upgrading/upgrade/preflight.md) _preden_ zaženete glavno nadgradnjo.

## Odvisnosti, ki jih upravlja skladatelj

XOOPS 2.7.0 uporablja **Composer** za upravljanje svojih PHP odvisnosti. Ti živijo v `xoops_lib/vendor/`. Knjižnice tretjih oseb, ki so bile prej združene v jedro ali v module – PHPMailer, HTMLPurifier, Smarty in druge – so zdaj na voljo prek Composerja.

**Ukrep:** Večini upravljavcev spletnih mest ni treba storiti ničesar — ​​izdaja arhivskih datotek se pošlje z že poseljenim `vendor/`. Če premikate ali nadgrajujete spletno mesto, kopirajte celotno drevo `xoops_lib/`, vključno z `vendor/`. Razvijalci klonirajo git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## Nove utrjene nastavitve sejnih piškotkov

Med nadgradnjo sta dodani dve novi nastavitvi:

* **`session_cookie_samesite`** — nadzoruje atribut SameSite v sejnih piškotkih (`Lax`, `Strict` ali `None`).
* **`session_cookie_secure`** — ko je omogočeno, se sejni piškotki pošiljajo samo nad HTTPS.**Ukrep:** Po nadgradnji jih preglejte pod Sistemske možnosti → Nastavitve → Splošne nastavitve. Glejte [Po nadgradnji](upgrading/upgrade/ustep-04.md).

## Nova tabela `tokens`

XOOPS 2.7.0 doda tabelo baze podatkov `tokens` za generično shranjevanje žetonov v obsegu. Nadgrajevalnik ustvari to tabelo samodejno kot del nadgradnje 2.5.11 → 2.7.0.

## Posodobljeno shranjevanje gesel

Stolpec `bannerclient.passwd` je bil razširjen na `VARCHAR(255)`, tako da lahko vsebuje sodobne zgoščene vrednosti gesel (bcrypt, argon2). Nadgrajevalnik samodejno razširi stolpec.

## Posodobljena zasedba tem in modulov

XOOPS 2.7.0 je opremljen s posodobljenimi sprednjimi temami:

* `default`, `xbootstrap` (zapuščina), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Poleg obstoječe teme prehoda je vključena nova skrbniška tema **Modern**.

Nov modul **DebugBar**, ki temelji na Symfony VarDumper, je dobavljen kot eden od izbirnih modulov, ki jih je mogoče namestiti. Uporaben je za razvoj in uprizarjanje, vendar običajno ni nameščen na javnih mestih za produkcijo.

Glejte [Izberite temo](installation/installation/step-12.md) in [Namestitev modulov](installation/installation/step-13.md).

## Kopiranje v novo izdajo ne prepiše več konfiguracijePrej je bilo pri kopiranju nove distribucije XOOPS na vrh obstoječega mesta potrebna previdnost, da se prepreči prepisovanje `mainfile.php` in drugih konfiguracijskih datotek. V 2.7.0 postopek kopiranja pusti obstoječe konfiguracijske datoteke nedotaknjene, zaradi česar so nadgradnje opazno varnejše.

Še vedno morate narediti popolno varnostno kopijo pred nadgradnjo.

## Možnost preobremenitve predloge v temah sistemskega skrbnika

Skrbniške teme v XOOPS 2.7.0 lahko zdaj preglasijo posamezne sistemske skrbniške predloge, kar olajša prilagajanje skrbniškega uporabniškega vmesnika brez razcepitve celotnega sistemskega modula.

## Kaj se ni spremenilo

Za zagotovilo, ti deli XOOPS delujejo na enak način v 2.7.0 kot v 2.5.x:

* Vrstni red strani namestitvenega programa in celoten tok
* Razdelitev konfiguracije `mainfile.php` plus `xoops_data/data/secure.php`
* Priporočena praksa premestitve `xoops_data` in `xoops_lib` izven spletnega korena
* Model namestitve modula in oblika manifesta `xoops_version.php`
* Potek dela za premikanje spletnega mesta (varnostno kopiranje, urejanje `mainfile.php`/`secure.php`, uporaba SRDB ali podobno)

## Kam naprej

* Začeti na novo? Nadaljujte na [Zahteve](installation/requirements.md).
* Nadgradnja z 2.5.x? Začnite z [Nadgradnja](upgrading/upgrade/README.md), nato zaženite [Preverjanje pred tiskom](upgrading/upgrade/preflight.md).