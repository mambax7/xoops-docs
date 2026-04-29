---
title: "Speciale onderwerpen"
---
Voor sommige specifieke systeemsoftwarecombinaties zijn mogelijk aanvullende configuraties nodig om te kunnen werken
 met XOOPS. Hier vindt u enkele details van bekende problemen en richtlijnen voor het omgaan ermee.

## SELinux-omgevingen

Bepaalde bestanden en mappen moeten schrijfbaar zijn tijdens de installatie, upgrade en normale werking
van XOOPS. In een traditionele Linux-omgeving wordt dit bereikt door ervoor te zorgen dat de
systeemgebruiker waaronder de webserver draait, heeft machtigingen voor de XOOPS-mappen, meestal door 
het instellen van de juiste groep voor die mappen.

Voor SELinux geschikte systemen (zoals CentOS en RHEL) hebben een extra, beveiligingscontext, die
kan de mogelijkheid van een proces beperken om het bestandssysteem te wijzigen. Deze systemen kunnen dit vereisen 
wijzigingen in de beveiligingscontext zodat XOOPS correct functioneert.

XOOPS verwacht tijdens normaal gebruik vrij naar bepaalde mappen te kunnen schrijven. 
Bovendien moeten bepaalde bestanden tijdens XOOPS-installaties en -upgrades ook schrijfbaar zijn.
 
Tijdens normaal gebruik verwacht XOOPS bestanden te kunnen schrijven en submappen te kunnen maken 
in deze mappen:

- `uploads` in de hoofdwebroot XOOPS
- `xoops_data`, waar deze ook wordt verplaatst tijdens de installatie

Tijdens een installatie- of upgradeproces moet XOOPS naar dit bestand schrijven:

- `mainfile.php` in de hoofdwebroot XOOPS

Voor een typisch op CentOS Apache gebaseerd systeem kunnen de wijzigingen in de beveiligingscontext hetzelfde zijn 
bereikt met deze commando's:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

U kunt mainfile.php beschrijfbaar maken met:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Let op: Tijdens de installatie kunt u een lege mainfile.php uit de map *extras* kopiëren.

Je moet httpd ook toestaan om e-mail te verzenden:

```
setsebool -P httpd_can_sendmail=1
```

Andere instellingen die u mogelijk nodig heeft, zijn onder meer:

Laat httpd netwerkverbindingen maken, d.w.z. RSS-feeds ophalen of een API-oproep doen:

```
setsebool -P httpd_can_network_connect 1
```

Schakel netwerkverbinding met een database in met:

```
setsebool -P httpd_can_network_connect_db=1
```

Raadpleeg voor meer informatie uw systeemdocumentatie en/of systeembeheerder.

## Smarty 4 en aangepaste thema's

XOOPS 2.7.0 heeft zijn template-engine geüpgraded van Smarty 3 naar **Smarty 4**. Smarty 4 is strenger
over sjabloonsyntaxis dan Smarty 3, en een paar patronen die in oudere sjablonen werden getolereerd
zal nu fouten veroorzaken. Als u een nieuw exemplaar van XOOPS 2.7.0 installeert met alleen de thema's
en modules die bij de release worden geleverd, hoeft u zich nergens zorgen over te maken: over elk verzonden sjabloon
is bijgewerkt voor Smarty 4-compatibiliteit.

De zorg is van toepassing wanneer u:

- het upgraden van een bestaande XOOPS 2.5.x-site met aangepaste thema's, of
- Aangepaste thema's of oudere modules van derden installeren in XOOPS 2.7.0.

Voordat u live verkeer naar een geüpgradede site overschakelt, voert u de preflightscanner uit die in de
`/upgrade/`-map. Het scant `/themes/` en `/modules/` op zoek naar Smarty 4-incompatibiliteiten
en kan veel ervan automatisch repareren. Zie de
Pagina [Preflightcontrole](../upgrading/upgrade/preflight.md) voor meer informatie.

Als u sjabloonfouten tegenkomt na een installatie of upgrade:

1. Voer `/upgrade/preflight.php` opnieuw uit en verhelp eventuele gemelde problemen.
2. Wis de gecompileerde sjablooncache door alles behalve `index.html` te verwijderen uit
   `xoops_data/caches/smarty_compile/`.
3. Schakel tijdelijk over naar een verzonden thema zoals `xbootstrap5` of `default` om het probleem te bevestigen
   is themaspecifiek in plaats van sitebreed.
4. Valideer eventuele wijzigingen in het aangepaste thema of de modulesjabloon voordat u de site weer in gebruik neemt.