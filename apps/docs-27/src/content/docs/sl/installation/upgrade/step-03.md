---
title: "Odpravljanje težav"
---
## Napake predloge Smarty 4

Najpogostejši razred težav pri nadgradnji z XOOPS 2.5.x na 2.7.0 je nezdružljivost predloge Smarty 4. Če ste preskočili ali niste dokončali [Preverjanje pred tiskom](preflight.md), boste po nadgradnji morda videli napake predloge na sprednji strani ali v skrbniškem območju.

Za obnovitev:

1. **Znova zaženite skener pred tiskom** na `/upgrade/preflight.php`. Uporabite vsa samodejna popravila, ki jih ponuja, ali ročno popravite označene predloge.
2. **Počistite predpomnilnik prevedene predloge.** Odstranite vse razen `index.html` iz `xoops_data/caches/smarty_compile/`. Prevedene predloge Smarty 3 niso združljive s Smarty 4 in zastarele datoteke lahko povzročijo nejasne napake.
3. **Začasno preklopite na poslano temo.** V skrbniškem območju izberite `xbootstrap5` ali `default` kot aktivno temo. To bo potrdilo, ali je težava omejena na temo po meri ali pa se nanaša na celotno spletno mesto.
4. **Preverite morebitne teme po meri in predloge modulov**, preden znova vklopite produkcijski promet. Bodite še posebej pozorni na predloge, ki uporabljajo bloke `{php}`, zastarele modifikatorje ali nestandardno sintakso ločil – to so najpogostejše okvare Smarty 4.

Glejte tudi razdelek Smarty 4 v [Posebne teme](../../installation/specialtopics.md).## Težave z dovoljenji

XOOPS Nadgradnja bo morda morala pisati v datoteke, ki so bile prej nastavljene samo za branje. Če je temu tako, boste videli takšno sporočilo:

![XOOPS Upgrade Make Writable Error](/XOOPS-docs/2.7/img/installation/upgrade-03-make-writable.png)

Rešitev je, da spremenite dovoljenja. Dovoljenja lahko spremenite z uporabo FTP, če nimate bolj neposrednega dostopa. Tukaj je primer uporabe FileZilla:

![FileZilla spremeni dovoljenje](/XOOPS-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Izhod za odpravljanje napak

Dodaten izhod za odpravljanje napak v zapisovalniku lahko omogočite tako, da dodate parameter za odpravljanje napak v URL, ki se uporablja za zagon nadgradnje:
```text
http://example.com/upgrade/?debug=1
```

