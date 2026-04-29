---
title: "Premikanje spletnega mesta"
---
Zelo uporabna tehnika je lahko prototip novega XOOPS mesta v lokalnem sistemu ali razvojnem strežniku. Prav tako je lahko zelo preudarno, da nadgradnjo XOOPS najprej preizkusite na kopiji svojega proizvodnega mesta, če gre kaj narobe. Da bi to dosegli, morate imeti možnost premikanja svojega mesta XOOPS z enega mesta na drugega. Tukaj je tisto, kar morate vedeti, da uspešno premaknete svoje spletno mesto XOOPS.

Prvi korak je vzpostavitev vašega novega okolja spletnega mesta. Ista postavka, ki je zajeta v poglavju [Predhodne priprave](../installation/preparations/), velja tudi tukaj.

Pri pregledu so ti koraki:

* pridobite gostovanje, vključno z morebitnimi zahtevami glede imena domene ali e-pošte
* pridobite uporabniški račun in geslo MySQL
* pridobite bazo podatkov MySQL, do katere ima zgornji uporabnik vse privilegije

Preostali del postopka je precej podoben običajni namestitvi, vendar:

* namesto da kopirate datoteke iz distribucije XOOPS, jih boste kopirali z obstoječega mesta
* namesto da bi zagnali namestitveni program, boste uvozili že poseljeno bazo podatkov
* namesto vnašanja odgovorov v namestitveni program boste spremenili prejšnje odgovore v datotekah in bazi podatkov

## Kopirajte obstoječe datoteke spletnega mesta

Naredite popolno kopijo datotek vašega obstoječega mesta na vaš lokalni računalnik, kjer jih lahko urejate. Če delate z oddaljenim gostiteljem, lahko uporabite FTP za kopiranje datotek. Potrebujete kopijo za delo, tudi če se spletno mesto izvaja na vašem lokalnem računalniku, v tem primeru preprosto naredite drugo kopijo imenikov spletnega mesta.Pomembno je, da ne pozabite vključiti imenikov _xoops_data_ in _xoops_lib_, tudi če sta bila preimenovana and/or prestavljena.

Da bodo stvari bolj gladke, morate iz svoje kopije odstraniti predpomnilnik in datoteke predlog, ki jih je prevedel Smarty. Te datoteke bodo znova ustvarjene v vašem novem okolju in lahko povzročijo težave z ohranitvijo starih nepravilnih informacij, če jih ne počistite. Če želite to narediti, izbrišite vse datoteke, razen _index.html_, v vseh teh treh imenikih:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Opomba:** Čiščenje `smarty_compile` je še posebej pomembno pri premikanju spletnega mesta na ali iz XOOPS 2.7.0. XOOPS 2.7.0 uporablja Smarty 4, prevedene predloge Smarty 4 pa niso zamenljive s prevedenimi predlogami Smarty 3. Če zastarele prevedene datoteke pustite na mestu, boste povzročili napake predloge pri nalaganju prve strani na novem mestu.

### `xoops_lib` in odvisnosti skladatelja

XOOPS 2.7.0 upravlja svoje odvisnosti PHP prek Composerja, znotraj `xoops_lib/`. Imenik `xoops_lib/vendor/` vsebuje knjižnice tretjih oseb, ki jih XOOPS potrebuje med izvajanjem (Smarty 4, PHPMailer, HTMLPurifier itd.). Ko premikate spletno mesto, morate kopirati celotno drevo `xoops_lib/` – vključno z `vendor/` – na novega gostitelja. Ne poskušajte znova generirati `vendor/` na ciljnem gostitelju, razen če ste razvijalec, ki je prilagodil `composer.json` in ima Composer na voljo na cilju.## Nastavite novo okolje

Ista postavka, ki je zajeta v poglavju [Predhodne priprave](../installation/preparations/), velja tudi tukaj. Predvidevamo, da imate gostovanje, ki ga potrebujete za spletno mesto, ki ga premikate.

### Ključne informacije (glavna datoteka.php and secure.php)

Uspešno premikanje spletnega mesta vključuje spreminjanje vseh sklicev na absolutna imena datotek in poti, URL-je, parametre baze podatkov in poverilnice za dostop.

Dve datoteki, `mainfile.php` v spletnem korenu vašega mesta in `data/secure.php` v (preimenovanem and/or prestavljenem) _xoops_data_ imeniku vašega mesta določata osnovne parametre vašega mesta, kot je URL, kje se nahaja v datotečnem sistemu gostitelja in kako se poveže z bazo podatkov.

Morali boste vedeti, kakšne so vrednosti v starem sistemu in kakšne bodo v novem sistemu.

#### glavna datoteka.php

| Name | Old Value in mainfile.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Odprite _mainfile.php_ v urejevalniku. Spremenite vrednosti za definicije, prikazane v zgornji tabeli, iz starih vrednosti v ustrezne vrednosti za novo spletno mesto.Zabeležite si stare in nove vrednosti, saj bomo morali narediti podobne spremembe na drugih mestih v nekaterih kasnejših korakih.

Na primer, če premikate spletno mesto iz lokalnega računalnika v komercialno storitev gostovanja, so lahko vaše vrednosti videti takole:

| Ime | Stara vrednost v glavni datoteki.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/XOOPS | https://example.com |
| XOOPS_COOKIE_DOMAIN | lokalni gostitelj | example.com |

Ko ste spremenili _mainfile.php_, ga shranite.

Možno je, da nekatere druge datoteke vsebujejo trdo kodirane reference na vaš URL ali celo poti. To je bolj verjetno pri prilagojenih temah in menijih, vendar z vašim urejevalnikom lahko iščete po vseh datotekah, da se prepričate.

V urejevalniku preiščite datoteke v vaši kopiji in poiščite staro vrednost XOOPS_URL in jo zamenjajte z novo vrednostjo.

Enako storite za staro vrednost XOOPS_ROOT_PATH, tako da vse pojavitve zamenjate z novo vrednostjo.Hranite svoje zapiske, ker jih bomo morali uporabiti pozneje, ko bomo premikali bazo podatkov.

#### data/secure.php

| Ime | Stara vrednost v data/secure.php | Nova vrednost v data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Odprite _data/secure.php_ v preimenovanem and/or prestavljenem imeniku _xoops_data_ v vašem urejevalniku. Spremenite vrednosti za definicije, prikazane v zgornji tabeli, iz starih vrednosti v ustrezne vrednosti za novo spletno mesto.

#### Druge datoteke

Morda obstajajo druge datoteke, na katere bo morda treba biti pozoren, ko se vaše spletno mesto premakne. Nekateri pogosti primeri so ključi API za različne storitve, ki so lahko povezane z domeno, kot so:

* Google Zemljevidi
* Recaptch2
* Všeč gumbi
* Deljenje povezav and/or oglaševanje, kot sta Shareaholic ali AddThis

Spreminjanja teh vrst povezav ni mogoče preprosto avtomatizirati, saj so povezave s staro domeno običajno del registracije na strani storitve. V nekaterih primerih lahko to preprosto doda ali spremeni domeno, povezano s storitvijo.

### Kopirajte datoteke na novo mesto

Kopirajte zdaj spremenjene datoteke na novo spletno mesto. Tehnike so enake, kot so bile uporabljene med [Namestitvijo](../installation/installation/), tj. z uporabo FTP.## Kopirajte obstoječo bazo podatkov mesta

### Varnostno kopirajte bazo podatkov iz starega strežnika

Za ta korak je uporaba _phpMyAdmin_ zelo priporočljiva. Prijavite se v _phpMyAdmin_ za svoje obstoječe spletno mesto, izberite svojo bazo podatkov in izberite _Izvozi_.

Privzete nastavitve so običajno v redu, zato preprosto izberite »Izvozna metoda« _Quick_ in »Oblika« _SQL_.

Za prenos varnostne kopije baze podatkov uporabite gumb _Go_.

![Izvoz zbirke podatkov s phpMyAdmin](/XOOPS-docs/2.7/img/installation/phpmyadmin-export-01.png)

Če imate v svoji zbirki podatkov tabele, ki niso iz XOOPS ali njenih modulov in naj bi jih NOT premaknili, izberite »Izvozna metoda« _Po meri_ in izberite samo XOOPS povezane tabele v vaši bazi podatkov. (Ti se začnejo s "predpono", ki ste jo določili med namestitvijo. Predpono baze podatkov lahko poiščete v datoteki `xoops_data/data/secure.php`.)

### Obnovite bazo podatkov na nov strežnik

Na vašem novem gostitelju z vašo novo bazo podatkov obnovite bazo podatkov z [orodji](../tools/tools.md), kot je zavihek _Import_ v _phpMyAdmin_ (ali _bigdump_, če je potrebno.)

### Posodobite URL-je in poti v zbirki podatkov

Posodobite vse http povezave do virov na vašem spletnem mestu v vaši bazi podatkov. To je lahko velik napor in obstaja [orodje](../tools/tools.md), ki to olajša.Interconnect/it ima izdelek z imenom Search-Replace-DB, ki lahko pomaga pri tem. Prihaja z vgrajeno zavestjo o okoljih Wordpress in Drupal. Kot je, je to orodje lahko zelo koristno, vendar je še boljše, če se zaveda vašega XOOPS. Različico, ki pozna XOOPS, najdete na [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Sledite navodilom v datoteki README.md za prenos in začasno namestitev tega pripomočka na vaše spletno mesto. Prej smo spremenili definicijo XOOPS_URL. Ko zaženete to orodje, želite prvotno definicijo XOOPS_URL zamenjati z novo definicijo, tj. zamenjati [http://localhost/XOOPS](http://localhost/XOOPS) z [https://example.com](https://example.com)

![Uporaba Iskanje in zamenjava DB](/XOOPS-docs/2.7/img/installation/srdb-01.png)

Vnesite svoj stari in novi URL in izberite možnost suhega zagona. Preglejte spremembe in če je vse videti dobro, izberite možnost izvajanja v živo. Ta korak bo zajel konfiguracijske elemente in povezave znotraj vaše vsebine, ki se nanašajo na vaše spletno mesto URL.

![Pregled sprememb v SRDB](/XOOPS-docs/2.7/img/installation/srdb-02.png)

Ponovite postopek z uporabo vaših starih in novih vrednosti za XOOPS_ROOT_PATH.

#### Alternativni pristop brez SRDBDrug način za izvedbo tega koraka brez orodja srdb bi bil izpis vaše baze podatkov, urejanje izpisa v urejevalniku besedila, spreminjanje URL-jev in poti, ter nato ponovno nalaganje baze podatkov iz vašega urejenega izpisa. Da, ta proces je dovolj vključen in nosi dovolj tveganja, da so bili ljudje motivirani za ustvarjanje specializiranih orodij, kot je Search-Replace-DB.

## Preizkusite svoje prestavljeno spletno mesto

Na tej točki bi moralo biti vaše spletno mesto pripravljeno za delovanje v novem okolju!

Seveda so vedno lahko težave. Naj vas ne bo strah objaviti kakršnih koli vprašanj na [forumih XOOPS.org](https://XOOPS.org/modules/newbb/index.php).