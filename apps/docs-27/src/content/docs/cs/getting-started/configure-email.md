---
title: "Nakonfigurujte e-mail"
---

![Konfigurace e-mailu XOOPS](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS spoléhá na e-mail pro mnoho důležitých uživatelských interakcí, jako je ověření registrace nebo resetování hesla. Je tedy důležité, aby byl správně nastaven.

Konfigurace e-mailu na webu může být v některých případech velmi snadná a v jiných frustrujícím způsobem obtížná.

Zde je několik tipů, které vám pomohou, aby vaše nastavení bylo úspěšné.

## Způsob doručení e-mailem

Tato část konfigurace má 4 možné hodnoty

* **PHP Mail()** – nejjednodušší způsob, pokud je k dispozici. Závisí na systémovém programu _sendmail_.
* **sendmail** – Možnost průmyslové silné stránky, ale často cílená pro SPAM tím, že využívá slabiny v jiném softwaru.
* **SMTP** – Simple Mail Transfer Protocol není obvykle k dispozici na nových hostingových účtech kvůli bezpečnostním obavám a možnosti zneužití. Z velké části byl nahrazen SMTP Auth.
* **SMTP Auth** - SMTP s autorizací je obvykle preferován před prostým SMTP. V tomto případě se XOOPS připojuje přímo k poštovnímu serveru bezpečnějším způsobem.

## Hostitelé SMTP

Pokud potřebujete použít SMTP s nebo bez "Auth", budete zde muset zadat název serveru. Tento název může být jednoduchý název hostitele nebo adresa IP, nebo může obsahovat další informace o portu a protokolu. Nejjednodušší případ by byl `localhost` pro server SMTP (bez auth), který běží na stejném počítači s webovým serverem.

Při použití SMTP Auth jsou vždy vyžadovány uživatelské jméno SMTP a heslo SMTP. Je možné zadat TLS nebo SSL a také port v konfiguračním poli XOOPS SMTP Hosts.

Toto lze použít k připojení k Gmailu SMTP: `tls://smtp.gmail.com:587`

Další příklad používající SSL: `ssl://mail.example.com:465`

## Tipy pro řešení problémů

Někdy věci nejdou tak hladce, jak bychom mohli doufat. Zde je několik návrhů a zdrojů, které vám mohou pomoci.

### Zkontrolujte dokumentaci poskytovatele hostingu

Když si u poskytovatele vytvoříte hostingovou službu, měl by vám poskytnout informace o přístupu k e-mailovým serverům. Toto chcete mít k dispozici při konfiguraci e-mailu pro váš systém XOOPS.

### XOOPS Používá PHPMailer

XOOPS používá k odesílání e-mailů knihovnu [PHPMailer](https://github.com/PHPMailer/PHPMailer). Sekce [odstraňování problémů](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) na wiki nabízí několik postřehů.