---
title: "Was ist neu in XOOPS 2.7.0"
---

XOOPS 2.7.0 ist ein signifikantes Update der 2.5.x-Reihe. Bevor Sie installieren oder aktualisieren, überprüfen Sie die Änderungen auf dieser Seite, damit Sie wissen, was zu erwarten ist. Die untenstehende Liste konzentriert sich auf Elemente, die Installation und Webseitenverwaltung beeinflussen — eine vollständige Liste der Änderungen finden Sie in den Release-Hinweisen, die mit der Distribution ausgeliefert werden.

## PHP 8.2 ist das neue Minimum

XOOPS 2.7.0 erfordert **PHP 8.2 oder neuer**. PHP 7.x und früher werden nicht mehr unterstützt. PHP 8.4 oder höher ist stark empfohlen.

**Aktion:** Bestätigen Sie, dass Ihr Host PHP 8.2+ anbietet, bevor Sie beginnen. Siehe [Anforderungen](installation/requirements.md).

## MySQL 5.7 ist das neue Minimum

Das neue Minimum ist **MySQL 5.7** (oder eine kompatible MariaDB). MySQL 8.4 oder höher ist stark empfohlen. MySQL 9.0 wird auch unterstützt.

Die alten Warnungen vor PHP/MySQL 8-Kompatibilitätsproblemen gelten nicht mehr, weil die betroffenen PHP-Versionen von XOOPS nicht mehr unterstützt werden.

## Smarty 4 ersetzt Smarty 3

Dies ist die einzelne größte Änderung für bestehende Webseiten. XOOPS 2.7.0 verwendet **Smarty 4** als sein Template-Engine. Smarty 4 ist strenger über Template-Syntax als Smarty 3, und einige benutzerdefinierte Designs und Modul-Templates müssen möglicherweise angepasst werden, bevor sie korrekt rendern.

Um Ihnen zu helfen, diese Probleme zu identifizieren und zu beheben, wird XOOPS 2.7.0 mit einem **Preflight-Scanner** im `upgrade/`-Verzeichnis ausgeliefert, der Ihre bestehenden Templates auf bekannte Smarty 4-Inkompatibilitäten überprüft und viele von ihnen automatisch reparieren kann.

**Aktion:** Wenn Sie ein Upgrade von 2.5.x durchführen und benutzerdefinierte Designs oder ältere Module haben, führen Sie die [Preflight-Überprüfung](upgrading/upgrade/preflight.md) _vor_ der Ausführung des Haupt-Upgraders durch.

## Composer-verwaltete Abhängigkeiten

XOOPS 2.7.0 verwendet **Composer** zum Verwalten seiner PHP-Abhängigkeiten. Diese leben in `xoops_lib/vendor/`. Drittanbieter-Bibliotheken, die zuvor im Core oder in Modulen gebündelt waren — PHPMailer, HTMLPurifier, Smarty und andere — werden jetzt über Composer bereitgestellt.

**Aktion:** Die meisten Webseiten-Operatoren müssen nichts tun — Release-Tarballs werden mit `vendor/` bereits gefüllt ausgeliefert. Wenn Sie eine Webseite verschieben oder aktualisieren, kopieren Sie den gesamten `xoops_lib/`-Baum, einschließlich `vendor/`. Entwickler, die das git-Repository klonen, sollten `composer install` in `htdocs/xoops_lib/` ausführen. Siehe [Hinweise für Entwickler](notes-for-developers/developers.md).

## Neue gehärtete Session-Cookie-Einstellungen

Zwei neue Einstellungen werden während des Upgrades hinzugefügt:

* **`session_cookie_samesite`** — kontrolliert das SameSite-Attribut auf Session-Cookies (`Lax`, `Strict` oder `None`).
* **`session_cookie_secure`** — wenn aktiviert, werden Session-Cookies nur über HTTPS gesendet.

**Aktion:** Nach dem Upgrade überprüfen Sie diese unter System-Optionen → Einstellungen → Allgemeine Einstellungen. Siehe [Nach dem Upgrade](upgrading/upgrade/ustep-04.md).

## Neue `tokens`-Tabelle

XOOPS 2.7.0 fügt eine `tokens`-Datenbanktabelle für generische scoped Token-Speicherung hinzu. Der Upgrader erstellt diese Tabelle automatisch als Teil des 2.5.11 → 2.7.0-Upgrades.

## Modernisierte Passwort-Speicherung

Die Spalte `bannerclient.passwd` wurde auf `VARCHAR(255)` verbreitert, damit sie moderne Passwort-Hashes (bcrypt, argon2) speichern kann. Der Upgrader verbreitert die Spalte automatisch.

## Aktualisiertes Design- und Modul-Lineup

XOOPS 2.7.0 wird mit aktualisierten Frontend-Designs ausgeliefert:

* `default`, `xbootstrap` (legacy), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Ein neues **Modern** Admin-Design ist neben dem bestehenden Transition-Design enthalten.

Ein neues **DebugBar**-Modul basierend auf Symfony VarDumper wird als eines der optionalen installierbaren Module ausgeliefert. Es ist nützlich für Entwicklungs- und Staging-Umgebungen, wird aber typischerweise nicht auf öffentlichen Produktions-Webseiten installiert.

Siehe [Design wählen](installation/installation/step-12.md) und [Module-Installation](installation/installation/step-13.md).

## Kopieren einer neuen Version überschreibt Konfiguration nicht mehr

Zuvor erforderte das Kopieren einer neuen XOOPS-Distribution auf eine bestehende Webseite sorgfältig, um das Überschreiben von `mainfile.php` und anderen Konfigurationsdateien zu vermeiden. In 2.7.0 lässt der Kopierungsprozess bestehende Konfigurationsdateien intakt, was Upgrades deutlich sicherer macht.

Sie sollten trotzdem eine vollständige Sicherung vor jedem Upgrade durchführen.

## Template-Overload-Fähigkeit in System-Admin-Designs

Admin-Designs in XOOPS 2.7.0 können jetzt einzelne System-Admin-Templates überschreiben, was es einfacher macht, die Admin-Benutzeroberfläche anzupassen, ohne das gesamte System-Modul zu forken.

## Was sich nicht geändert hat

Zur Beruhigung funktionieren diese Teile von XOOPS in XOOPS 2.7.0 genauso wie in XOOPS 2.5.x:

* Die Installer-Seitenreihenfolge und gesamter Flow
* Die `mainfile.php` plus `xoops_data/data/secure.php` Konfiguration-Aufteilung
* Die empfohlene Praxis der Verlagerung von `xoops_data` und `xoops_lib` außerhalb der Webroot
* Das Modul-Installations-Modell und das `xoops_version.php` Manifest-Format
* Der Webseitenverschiekungs-Workflow (Sicherung, Bearbeiten von `mainfile.php`/`secure.php`, Verwendung von SRDB oder ähnlich)

## Wohin als nächstes

* Neuer Start? Fahren Sie fort mit [Anforderungen](installation/requirements.md).
* Upgrade von 2.5.x? Beginnen Sie mit [Upgraden](upgrading/upgrade/README.md), dann führen Sie die [Preflight-Überprüfung](upgrading/upgrade/preflight.md) aus.
