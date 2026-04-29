---
title: "Opmerkingen voor ontwikkelaars"
---
Hoewel de daadwerkelijke installatie van XOOPS voor ontwikkelingsgebruik vergelijkbaar is met de normale installatie die al is beschreven, zijn er belangrijke verschillen bij het bouwen van een systeem dat gereed is voor ontwikkelaars.

Een groot verschil bij een ontwikkelaarsinstallatie is dat in plaats van zich alleen te concentreren op de inhoud van de map _htdocs_, een ontwikkelaarsinstallatie alle bestanden bewaart en ze onder controle van de broncode houdt met behulp van git.

Een ander verschil is dat de mappen _xoops_data_ en _xoops_lib_ meestal op hun plaats kunnen blijven zonder de naam te wijzigen, zolang uw ontwikkelsysteem niet rechtstreeks toegankelijk is op het open internet (d.w.z. op een particulier netwerk, zoals achter een router).

De meeste ontwikkelaars werken op een _localhost_-systeem, dat de broncode, een webserverstack en alle tools bevat die nodig zijn om met de code en de database te werken.

Meer informatie vindt u in het hoofdstuk [Tools of the Trade](../tools/tools.md).

## Git en virtuele hosts

De meeste ontwikkelaars willen op de hoogte kunnen blijven van de huidige bronnen en wijzigingen kunnen bijdragen aan de upstream [XOOPS/XoopsCore27 repository op GitHub](https://github.com/XOOPS/XoopsCore27). Dit betekent dat in plaats van een release-archief te downloaden, je een kopie van XOOPS wilt [forken](https://help.github.com/articles/fork-a-repo/) en **git** wilt gebruiken om die repository naar je dev-box te [klonen](https://help.github.com/categories/bootcamp/).

Omdat de repository een specifieke structuur heeft, is het beter om, in plaats van bestanden van de map _htdocs_ naar uw webserver te kopiëren, uw webserver naar de map htdocs in uw lokaal gekloonde repository te verwijzen. Om dit te bereiken maken we doorgaans een nieuwe _Virtual Host_, of _vhost_, die naar onze door Git gecontroleerde broncode verwijst.

In een [WAMP](http://www.wampserver.com/)-omgeving bevat de standaardpagina [localhost](http://localhost/) in de sectie _Tools_ een link naar _Een virtuele host toevoegen_ die hierheen leidt:

![WAMP Virtuele host toevoegen](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Hiermee kun je een VirtualHost-item instellen dat rechtstreeks in je (nog steeds) door git gecontroleerde repository terechtkomt.

Hier is een voorbeeldinvoer in `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Mogelijk moet u ook een vermelding toevoegen in `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Nu kunt u installeren op `http://xoops.localhost/` om te testen, terwijl u uw repository intact houdt en de webserver in de htdocs-directory houdt met een eenvoudige URL. Bovendien kunt u uw lokale kopie van XOOPS op elk gewenst moment bijwerken naar de nieuwste master zonder dat u bestanden opnieuw hoeft te installeren of te kopiëren. En u kunt verbeteringen en reparaties aan de code aanbrengen om via GitHub een bijdrage te leveren aan XOOPS.

## Afhankelijkheden van componisten

XOOPS 2.7.0 gebruikt [Composer](https://getcomposer.org/) om de PHP-afhankelijkheden te beheren. De afhankelijkheidsboom bevindt zich in `htdocs/xoops_lib/` in de bronrepository:

* `composer.dist.json` is de hoofdlijst met afhankelijkheden die bij de release wordt geleverd.
* `composer.json` is de lokale kopie, die u indien nodig kunt aanpassen voor uw ontwikkelomgeving.
* `composer.lock` pint exacte versies, zodat installaties reproduceerbaar zijn.
* `vendor/` bevat de geïnstalleerde bibliotheken (Smarty 4, PHPMailer, HTMLPurifier, firebase/PHP-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom en andere).

Voor een nieuwe git-kloon van XOOPS 2.7.0, beginnend bij de repository, voer je het volgende uit:

```text
cd htdocs/xoops_lib
composer install
```

Merk op dat er geen `composer.json` in de hoofdmap van de repository staat; het project bevindt zich onder `htdocs/xoops_lib/`, dus u moet `cd` in die map plaatsen voordat u Composer uitvoert.

Release tarballs worden geleverd met `vendor/` vooraf ingevuld, maar git-klonen mogelijk niet. Houd `vendor/` intact bij ontwikkelingsinstallaties: XOOPS laadt zijn afhankelijkheden van daaruit tijdens runtime.

De bibliotheek [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) wordt in 2.7.0 als Composer-afhankelijkheid geleverd, zodat u `Xmf\Request`, `Xmf\Database\TableLoad` en gerelateerde klassen in uw modulecode kunt gebruiken zonder enige aanvullende installatie.

## DebugBar-moduleXOOPS 2.7.0 bevat een **DebugBar**-module gebaseerd op Symfony VarDumper. Het voegt een debug-werkbalk toe aan gerenderde pagina's die aanvraag-, database- en sjablooninformatie blootlegt. Installeer het vanuit het Modules-beheergebied op ontwikkelings- en testsites. Laat het niet geïnstalleerd achter op een openbare productielocatie, tenzij u weet dat u dat wilt.