---
title: "Posebne teme"
---
Neke specifične kombinacije softvera sustava mogu zahtijevati dodatne konfiguracije za rad
 sa XOOPS. Evo nekih pojedinosti o poznatim problemima i smjernica za njihovo rješavanje.

## SELinux okruženja

Određene datoteke i direktoriji moraju biti upisivi tijekom instalacije, nadogradnje i normalnog rada
od XOOPS. U tradicionalnom Linux okruženju to se postiže osiguravanjem da je
korisnik sustava pod kojim radi web poslužitelj ima dopuštenja za direktorije XOOPS, obično do 
postavljanje odgovarajuće grupe za te direktorije.

Sustavi omogućeni za SELinux (kao što su CentOS i RHEL) imaju dodatni, sigurnosni kontekst koji
može ograničiti mogućnost procesa da promijeni datotečni sustav. Ovi sustavi mogu zahtijevati 
mijenja sigurnosni kontekst kako bi XOOPS ispravno funkcionirao.

XOOPS očekuje da će moći slobodno pisati u određene direktorije tijekom normalnog rada. 
Osim toga, tijekom instalacije i nadogradnje XOOPS, određene datoteke također moraju biti pisane.
 
Tijekom normalnog rada, XOOPS očekuje da će moći pisati datoteke i stvarati poddirektorije 
u ovim imenicima:

- `uploads` u glavnom web korijenu XOOPS
- `xoops_data` gdje god se premjestio tijekom instalacije

Tijekom procesa instalacije ili nadogradnje XOOPS morat će pisati u ovu datoteku:

- `mainfile.php` u glavnom web korijenu XOOPS

Za tipičan sustav temeljen na CentOS Apacheu, sigurnosne promjene konteksta mogu biti 
postiže se ovim naredbama:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

mainfile.php možete učiniti pisivim pomoću:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Napomena: Prilikom instalacije možete kopirati prazan mainfile.php iz direktorija *extras*.

Također biste trebali dopustiti httpd-u da šalje poštu:

```
setsebool -P httpd_can_sendmail=1
```

Ostale postavke koje bi vam mogle trebati include:

Dopustite httpd-u uspostavljanje mrežnih veza, tj. dohvaćanje rss feedova ili upućivanje API poziva:

```
setsebool -P httpd_can_network_connect 1
```

Omogućite mrežnu vezu s bazom podataka pomoću:

```
setsebool -P httpd_can_network_connect_db=1
```

Za više informacija pogledajte dokumentaciju vašeg sustava i/ili sustava administrator.

## Smarty 4 i prilagođene teme

XOOPS 2.7.0 je nadogradio svoj mehanizam za izradu predložaka sa Smarty 3 na **Smarty 4**. Smarty 4 je stroži
o sintaksi predloška od Smarty 3, i nekoliko uzoraka koji su bili tolerirani u starijim templates
sada će uzrokovati pogreške. Ako instalirate novu kopiju XOOPS 2.7.0 koristeći samo themes
i modules isporučen s izdanjem, nema razloga za brigu — svaki isporučeni predložak
je ažuriran za Smarty 4 kompatibilnost.

Zabrinutost se primjenjuje kada ste:

- nadogradnja postojeće XOOPS 2.5.x stranice koja ima prilagođeni themes, ili
- instaliranje prilagođenog themes ili starijeg modules treće strane u XOOPS 2.7.0.

Prije prebacivanja prometa uživo na nadograđeno mjesto, pokrenite skener prije leta koji se isporučuje u
Imenik `/upgrade/`. Skenira `/themes/` i `/modules/` tražeći nekompatibilnosti Smarty 4
i može automatski popraviti mnoge od njih. Vidite
[Provjera prije leta](../upgrading/upgrade/preflight.md) za detalje.Ako naiđete na pogreške predloška nakon instalacije ili nadogradnje:

1. Ponovno pokrenite `/upgrade/preflight.php` i riješite sve prijavljene probleme.
2. Očistite kompilirani predložak cache uklanjanjem svega osim `index.html` iz
   `xoops_data/caches/smarty_compile/`.
3. Privremeno prijeđite na isporučenu temu kao što je `xbootstrap5` ili `default` da potvrdite problem
   specifična je za temu, a ne za cijelo web mjesto.
4. Potvrdite sve promjene prilagođene teme ili predloška modula prije vraćanja stranice u proizvodnju.
