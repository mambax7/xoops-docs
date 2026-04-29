---
title: "Posebne teme"
---
Nekatere posebne kombinacije sistemske programske opreme lahko zahtevajo nekaj dodatnih konfiguracij za delovanje
 z XOOPS. Tukaj je nekaj podrobnosti o znanih težavah in navodila za njihovo odpravljanje.

## Okolja SELinux

Nekatere datoteke in imeniki morajo biti med namestitvijo, nadgradnjo in normalnim delovanjem zapisljivi
od XOOPS. V tradicionalnem okolju Linux se to doseže z zagotavljanjem, da je
sistemski uporabnik, pod katerim teče spletni strežnik, ima dovoljenja za imenike XOOPS, običajno do 
nastavitev ustrezne skupine za te imenike.

Sistemi, ki podpirajo SELinux (kot sta CentOS in RHEL), imajo dodaten varnostni kontekst, ki
lahko procesom omeji zmožnost spreminjanja datotečnega sistema. Ti sistemi lahko zahtevajo 
spremeni varnostni kontekst za pravilno delovanje XOOPS.

XOOPS pričakuje, da bo med običajnim delovanjem lahko prosto pisal v določene imenike. 
Poleg tega mora biti med namestitvami in nadgradnjami XOOPS določene datoteke tudi zapisljive.
 
Med običajnim delovanjem XOOPS pričakuje, da bo lahko pisal datoteke in ustvarjal podimenike 
v teh imenikih:

- `uploads` v glavnem spletnem korenu XOOPS
- `xoops_data` kjerkoli se med namestitvijo prestavi

Med postopkom namestitve ali nadgradnje bo moral XOOPS pisati v to datoteko:- `mainfile.php` v glavnem spletnem korenu XOOPS

Za tipičen sistem, ki temelji na CentOS Apache, so lahko spremembe varnostnega konteksta 
doseženo s temi ukazi:
```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```
Ustvarite lahko glavno datoteko.php writable with:
```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```
Opomba: Pri namestitvi lahko kopirate prazno glavno datoteko.php from the *extras* directory.

Prav tako morate dovoliti httpd pošiljanje pošte:
```
setsebool -P httpd_can_sendmail=1
```
Druge nastavitve, ki jih boste morda potrebovali, vključujejo:

Dovoli httpd vzpostavljanje omrežnih povezav, tj. pridobivanje rss virov ali API klicev:
```
setsebool -P httpd_can_network_connect 1
```
Omogočite omrežno povezavo z bazo podatkov z:
```
setsebool -P httpd_can_network_connect_db=1
```
Za več informacij si oglejte sistemsko dokumentacijo and/or skrbnik sistema.

## Smarty 4 in teme po meri

XOOPS 2.7.0 je svoj mehanizem za predloge nadgradil s Smarty 3 na **Smarty 4**. Smarty 4 je strožji
o sintaksi predlog kot Smarty 3 in nekaj vzorcev, ki so bili dopustni v starejših predlogah
bo zdaj povzročil napake. Če nameščate novo kopijo XOOPS 2.7.0 z uporabo samo tem
in modulov, poslanih z izdajo, ni razloga za skrb — vsaka poslana predloga
je posodobljen za združljivost s Smarty 4.

Zaskrbljenost velja, ko ste:

- nadgradnja obstoječega mesta XOOPS 2.5.x, ki ima teme po meri, ali
- namestitev tem po meri ali starejših modulov tretjih oseb v XOOPS 2.7.0.

Preden promet v živo preklopite na nadgrajeno spletno mesto, zaženite optični bralnik pred tiskom, ki je dobavljen v
Imenik `/upgrade/`. Pregleduje `/themes/` in `/modules/` ter išče nekompatibilnosti Smarty 4
in lahko samodejno popravi veliko od njih. Glej
Stran [Preverjanje pred letom](../upgrading/upgrade/preflight.md) za podrobnosti.

Če po namestitvi ali nadgradnji naletite na napake predloge:

1. Ponovno zaženite `/upgrade/preflight.php` in odpravite vse prijavljene težave.
2. Počistite predpomnilnik prevedene predloge tako, da odstranite vse razen `index.html` iz
   `xoops_data/caches/smarty_compile/`.
3. Začasno preklopite na poslano temo, kot je `xbootstrap5` ali `default`, da potrdite težavo
   je specifična za temo in ne za celotno spletno mesto.
4. Potrdite morebitne spremembe teme po meri ali predloge modula, preden spletno mesto vrnete v produkcijo.