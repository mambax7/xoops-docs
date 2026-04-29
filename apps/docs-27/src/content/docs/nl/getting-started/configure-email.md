---
title: "E-mail configureren"
---
![XOOPS e-mailconfiguratie](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS is voor veel kritieke gebruikersinteracties afhankelijk van e-mail, zoals het valideren van een registratie of het opnieuw instellen van een wachtwoord. Het is dus belangrijk dat het correct wordt ingesteld.

Het configureren van site-e-mail kan in sommige gevallen heel eenvoudig zijn, en in andere gevallen frustrerend moeilijk.

Hier zijn enkele tips om uw installatie tot een succes te maken.

## E-mailbezorgmethode

Dit gedeelte van de configuratie heeft 4 mogelijke waarden

* **PHP Mail()** - de gemakkelijkste manier, als deze beschikbaar is. Afhankelijk van het systeemprogramma _sendmail_.
* **sendmail** - Een industriële krachtoptie, maar vaak gericht op SPAM door zwakke punten in andere software te exploiteren.
* **SMTP** - Simple Mail Transfer Protocol is doorgaans niet beschikbaar in nieuwe hostingaccounts vanwege beveiligingsproblemen en potentieel voor misbruik. Het is grotendeels vervangen door SMTP Auth.
* **SMTP Auth** - SMTP met autorisatie heeft doorgaans de voorkeur boven gewone SMTP. In dit geval maakt XOOPS op een veiligere manier rechtstreeks verbinding met de mailserver.

## SMTP-hosts

Als u SMTP moet gebruiken, met of zonder "Auth", moet u hier een servernaam opgeven. Die naam kan een eenvoudige hostnaam of IP-adres zijn, maar kan ook aanvullende poort- en protocolinformatie bevatten. Het eenvoudigste geval zou `localhost` zijn voor een SMTP-server (geen auth) die op dezelfde machine draait als de webserver.

SMTP-gebruikersnaam en SMTP-wachtwoord zijn altijd vereist bij gebruik van SMTP Auth. Het is mogelijk om TLS of SSL op te geven, evenals een poort in het XOOPS-configuratieveld SMTP Hosts.

Dit kan worden gebruikt om verbinding te maken met de SMTP van Gmail: `tls://smtp.gmail.com:587`

Nog een voorbeeld met SSL: `ssl://mail.example.com:465`

## Tips voor het oplossen van problemen

Soms gaan dingen niet zo soepel als we zouden hopen. Hier volgen enkele suggesties en bronnen die kunnen helpen.

### Controleer de documentatie van uw hostingprovider

Wanneer u een hostingservice bij een provider opzet, moet deze informatie verstrekken over hoe u toegang krijgt tot e-mailservers. U wilt hierover beschikken wanneer u de e-mail configureert voor uw XOOPS-systeem.

### XOOPS Maakt gebruik van PHPMailer

XOOPS gebruikt de bibliotheek [PHPMailer](https://github.com/PHPMailer/PHPMailer) om e-mail te verzenden. De sectie [probleemoplossing](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) in de wiki biedt enkele inzichten.