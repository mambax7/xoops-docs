---
title: "E-Mail konfigurieren"
---

![XOOPS Email Configuration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS ist auf E-Mail für viele kritische Benutzerinteraktionen angewiesen, z. B. zur Validierung einer Registrierung oder zum Zurücksetzen eines Passworts. Daher ist es wichtig, dass es ordnungsgemäß eingerichtet ist.

Die Konfiguration der Website-E-Mail kann in einigen Fällen sehr einfach und in anderen frustrierend schwierig sein.

Hier sind einige Tipps, die Ihnen bei der erfolgreichen Einrichtung helfen.

## E-Mail-Zustellungsmethode

Dieser Konfigurationsabschnitt hat 4 mögliche Werte

* **PHP Mail()** - der einfachste Weg, wenn er verfügbar ist. Hängt vom System _sendmail_ Programm ab.
* **sendmail** - Eine robuste Option, aber oft als Ziel von SPAM-Aktivitäten durch Ausnutzung von Schwachstellen in anderer Software.
* **SMTP** - Simple Mail Transfer Protocol ist normalerweise nicht in neuen Hosting-Konten verfügbar, da Sicherheitsbedenken und Missbrauchspotenzial bestehen. Es wurde weitgehend durch SMTP Auth ersetzt.
* **SMTP Auth** - SMTP mit Autorisierung wird normalerweise gegenüber einfachem SMTP bevorzugt. In diesem Fall verbindet sich XOOPS auf sichere Weise direkt mit dem Mail-Server.

## SMTP-Hosts

Wenn Sie SMTP mit oder ohne „Auth" verwenden müssen, müssen Sie hier einen Servernamen angeben. Dieser Name kann ein einfacher Hostname oder eine IP-Adresse sein, oder er kann zusätzliche Port- und Protokollinformationen enthalten. Der einfachste Fall wäre `localhost` für einen SMTP-Server (ohne Auth) auf derselben Maschine wie dem Webserver.

SMTP-Benutzername und SMTP-Passwort sind bei Verwendung von SMTP Auth immer erforderlich. Im XOOPS-Konfigurationsfeld SMTP Hosts ist es möglich, TLS oder SSL sowie einen Port anzugeben.

Dies könnte verwendet werden, um sich mit Gmails SMTP zu verbinden: `tls://smtp.gmail.com:587`

Ein anderes Beispiel mit SSL: `ssl://mail.example.com:465`

## Tipps zur Fehlerbehebung

Manchmal verläuft nicht alles so reibungslos, wie wir es uns erhoffen. Hier sind einige Vorschläge und Ressourcen, die hilfreich sein könnten.

### Überprüfen Sie die Dokumentation Ihres Hosting-Anbieters

Wenn Sie einen Hosting-Service bei einem Anbieter einrichten, sollte dieser Informationen darüber bereitstellen, wie Sie auf Mail-Server zugreifen. Sie möchten dies verfügbar haben, wenn Sie die E-Mail für Ihr XOOPS-System konfigurieren.

### XOOPS verwendet PHPMailer

XOOPS verwendet die [PHPMailer](https://github.com/PHPMailer/PHPMailer) Bibliothek zum Versenden von E-Mails. Der Abschnitt [Fehlerbehebung](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) im Wiki bietet einige Erkenntnisse.

