---
title: "Konfigurer e-mail"
---

![XOOPS e-mailkonfiguration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS er afhængig af e-mail til mange kritiske brugerinteraktioner, såsom validering af en registrering eller nulstilling af en adgangskode. Så det er vigtigt, at det er sat rigtigt op.

Konfiguration af websteds-e-mail kan være meget let i nogle tilfælde og frustrerende vanskeligt i andre.

Her er nogle tips til at hjælpe med at gøre din opsætning til en succes.

## E-mail leveringsmetode

Denne del af konfigurationen har 4 mulige værdier

* **PHP Mail()** - den nemmeste måde, hvis den er tilgængelig. Afhænger af systemets _sendmail_-program.
* **sendmail** - En industriel styrkeindstilling, men ofte målrettet mod SPAM ved at udnytte svagheder i anden software.
* **SMTP** - Simple Mail Transfer Protocol er normalt ikke tilgængelig på nye hostingkonti på grund af sikkerhedsproblemer og potentiale for misbrug. Den er stort set blevet erstattet med SMTP Auth.
* **SMTP Auth** - SMTP med autorisation foretrækkes normalt frem for almindelig SMTP. I dette tilfælde forbinder XOOPS direkte til mailserveren på en mere sikker måde.

## SMTP Værter

Hvis du skal bruge SMTP, med eller uden "Auth", skal du angive et servernavn her. Dette navn kan være et simpelt værtsnavn eller IP-adresse, eller det kan indeholde yderligere port- og protokoloplysninger. Det enkleste tilfælde ville være `localhost` for en SMTP (ingen godkendelse) server, der kører på den samme maskine med webserveren.

SMTP brugernavn og SMTP adgangskode er altid påkrævet, når du bruger SMTP Auth. Det er muligt at angive TLS eller SSL, samt en port i XOOPS-konfigurationsfeltet SMTP Hosts.

Dette kan bruges til at oprette forbindelse til Gmails SMTP: `tls://smtp.gmail.com:587`

Et andet eksempel, der bruger SSL: `ssl://mail.example.com:465`

## Tips til fejlfinding

Nogle gange går tingene ikke så glat, som vi måske håber. Her er nogle forslag og ressourcer, der kan hjælpe.

### Tjek din hostingudbyders dokumentation

Når du etablerer hostingtjeneste hos en udbyder, bør de give oplysninger om, hvordan du får adgang til e-mail-servere. Du ønsker at have denne tilgængelig, når du konfigurerer e-mailen til dit XOOPS-system.

### XOOPS Bruger PHPMailer

XOOPS bruger biblioteket [PHPMailer](https://github.com/PHPMailer/PHPMailer) til at sende e-mail. [fejlfinding](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) sektionen i wikien giver nogle indsigter.
