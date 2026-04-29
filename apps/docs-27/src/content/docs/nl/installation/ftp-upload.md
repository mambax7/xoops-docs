---
title: "Bijlage 2: XOOPS uploaden via FTP"
---
In deze bijlage wordt uitgelegd hoe u XOOPS 2.7.0 op een externe host kunt implementeren met behulp van FTP of SFTP. Elk controlepaneel (cPanel, Plesk, DirectAdmin, etc.) zal dezelfde onderliggende stappen blootleggen.

## 1. Bereid de database voor

Via het controlepaneel van uw host:

1. Maak een nieuwe MySQL-database voor XOOPS.
2. Maak een databasegebruiker aan met een sterk wachtwoord.
3. Verleen de gebruiker volledige rechten op de nieuw aangemaakte database.
4. Noteer de databasenaam, gebruikersnaam, wachtwoord en host. U voert deze in het XOOPS-installatieprogramma in.

> **Tip**
>
> Moderne bedieningspanelen genereren sterke wachtwoorden voor u. Omdat de applicatie het wachtwoord opslaat in `xoops_data/data/secure.php`, hoeft u het niet vaak te typen; u geeft de voorkeur aan een lange, willekeurig gegenereerde waarde.

## 2. Maak een beheerdersmailbox aan

Maak een e-mailbox aan waarin meldingen over het sitebeheer worden ontvangen. Het XOOPS-installatieprogramma vraagt ​​om dit adres tijdens het instellen van de webmasteraccount en valideert het met `FILTER_VALIDATE_EMAIL`.

## 3. Upload de bestanden

XOOPS 2.7.0 wordt geleverd met de afhankelijkheden van derden vooraf geïnstalleerd in `xoops_lib/vendor/` (Composer-pakketten, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF en meer). Dit maakt `xoops_lib/` aanzienlijk groter dan in 2.5.x - verwacht tientallen megabytes.

**Sla niet selectief bestanden over in `xoops_lib/vendor/`.** Als u bestanden overslaat in de leveranciersstructuur van Composer, wordt het automatisch laden onderbroken en mislukt de installatie.

Uploadstructuur (ervan uitgaande dat `public_html` de hoofdmap van het document is):

1. Upload `xoops_data/` en `xoops_lib/` **naast** `public_html`, niet erin. Het plaatsen ervan buiten de webroot is de aanbevolen beveiligingshouding voor 2.7.0.

   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Upload de resterende inhoud van de distributiemap `htdocs/` naar `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Als uw host geen mappen buiten de hoofdmap van het document toestaat**
>
> Upload `xoops_data/` en `xoops_lib/` **in** `public_html/` en **hernoem ze naar niet voor de hand liggende namen** (bijvoorbeeld `xdata_8f3k2/` en `xlib_7h2m1/`). U voert de hernoemde paden in het installatieprogramma in wanneer wordt gevraagd naar het XOOPS-gegevenspad en het XOOPS-bibliotheekpad.

## 4. Maak beschrijfbare mappen beschrijfbaar

Maak via het CHMOD-dialoogvenster van de FTP-client (of SSH) de mappen uit Hoofdstuk 2 schrijfbaar voor de webserver. Op de meeste gedeelde hosts is `0775` op mappen en `0664` op `mainfile.php` voldoende. `0777` is acceptabel tijdens de installatie als uw host PHP uitvoert onder een andere gebruiker dan de FTP-gebruiker, maar verscherp de machtigingen nadat de installatie is voltooid.

## 5. Start het installatieprogramma

Ga met uw browser naar de openbare URL van de site. Als alle bestanden aanwezig zijn, wordt de XOOPS Installatiewizard gestart en kunt u de rest van deze handleiding volgen vanaf [Hoofdstuk 2](chapter-2-introduction.md).