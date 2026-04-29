---
title: "Rješavanje problema"
---
## Smarty 4 pogreške predloška

Najčešći class problem prilikom nadogradnje sa XOOPS 2.5.x na 2.7.0 je nekompatibilnost predloška Smarty 4. Ako ste preskočili ili niste dovršili [Provjeru prije leta](preflight.md), možda ćete vidjeti pogreške predloška na prednjoj strani ili u području admin nakon nadogradnje.

Za oporavak:

1. **Ponovo pokrenite skener prije leta** na `/upgrade/preflight.php`. Primijenite sve automatske popravke koje nudi ili ručno popravite označeni templates.
2. **Očistite kompilirani predložak cache.** Uklonite sve osim `index.html` iz `xoops_data/caches/smarty_compile/`. Smarty 3 kompilirani templates nisu kompatibilni sa Smarty 4 i zastarjele datoteke mogu uzrokovati zbunjujuće pogreške.
3. **Privremeno prijeđite na isporučenu temu.** Iz područja admin odaberite `xbootstrap5` ili `default` kao aktivnu temu. Ovo će potvrditi je li problem ograničen na prilagođenu temu ili se odnosi na cijelo web-mjesto.
4. **Validirajte sve prilagođene themes i modul templates** prije ponovnog uključivanja proizvodnog prometa. Obratite posebnu pozornost na templates koji koristi blokove `{php}`, zastarjele modifikatore ili nestandardnu ​​sintaksu razdjelnika — ovo su najčešći kvarovi Smarty 4.

Također pogledajte odjeljak Smarty 4 u [Posebne teme](../../installation/specialtopics.md).

## Problemi s dozvolama

Nadogradnja XOOPS možda će trebati pisati u datoteke koje su prethodno bile postavljene samo za čitanje. Ako je to slučaj, vidjet ćete poruku poput ove:

![XOOPS Napravi pogrešku za pisanje](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Rješenje je promijeniti dopuštenja. Možete promijeniti dopuštenja koristeći FTP ako nemate izravniji pristup. Evo primjera korištenja FileZille:

![FileZilla Promjena dopuštenja](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Izlaz za otklanjanje pogrešaka

Možete omogućiti dodatni izlaz za ispravljanje pogrešaka u zapisniku dodavanjem parametra za ispravljanje pogrešaka u URL koji se koristi za pokretanje nadogradnje:

```text
http://example.com/upgrade/?debug=1
```
