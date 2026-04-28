---
title: "Notizen für Entwickler"
---

Während die tatsächliche Installation von XOOPS für Entwicklungsgebrauch der bereits beschriebenen normalen Installation ähnlich ist, gibt es wichtige Unterschiede beim Aufbau eines entwicklergerechten Systems.

Ein großer Unterschied bei einer Entwickler-Installation ist, dass man sich nicht nur auf den Inhalt des _htdocs_ Verzeichnisses konzentriert, sondern alle Dateien behält und sie unter Quellcodeverwaltung mit Git hält.

Ein anderer Unterschied ist, dass die _xoops_data_ und _xoops_lib_ Verzeichnisse normalerweise an Ort und Stelle bleiben können, ohne umbenannt zu werden, solange dein Entwicklungssystem nicht direkt im offenen Internet erreichbar ist (d.h. in einem privaten Netzwerk, wie hinter einem Router.)

Die meisten Entwickler arbeiten auf einem _localhost_ System, das den Quellcode, einen Webserver-Stack und alle Tools enthält, die zum Arbeiten mit dem Code und der Datenbank benötigt werden.

Du kannst mehr Informationen im Kapitel [Tools of the Trade](../tools/tools.md) finden.

## Git und Virtual Hosts

Die meisten Entwickler möchten mit den aktuellen Quellen auf dem neuesten Stand bleiben und Änderungen zurück zum upstream [XOOPS/XoopsCore27 Repository auf GitHub](https://github.com/XOOPS/XoopsCore27) beitragen. Das bedeutet, dass du statt ein Release-Archiv herunterzuladen, [einen Fork](https://help.github.com/articles/fork-a-repo/) von XOOPS erstellen und **git** verwenden wirst, um [diese Repository zu clonen](https://help.github.com/categories/bootcamp/) auf deinen Dev-Box.

Da das Repository eine spezifische Struktur hat, ist es besser, deine Dateien nicht aus dem _htdocs_ Verzeichnis auf deinen Webserver zu _kopieren_, sondern deinen Webserver auf den htdocs Ordner innerhalb deiner lokal geclonten Repository zu verweisen. Um dies zu erreichen, erstellen wir normalerweise einen neuen _Virtual Host_, oder _vhost_, der auf unseren git-gesteuerten Quellcode verweist.

In einer [WAMP](http://www.wampserver.com/) Umgebung hat die Standard [localhost](http://localhost/) Seite im _Tools_ Bereich einen Link zu _Add a Virtual Host_, der hier führt:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Mit diesem kannst du einen VirtualHost-Eintrag einrichten, der direkt in deine (immer noch) git-gesteuerte Repository führt.

Hier ist ein Beispiel-Eintrag in `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

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

Du könntest auch einen Eintrag in `Windows/System32/drivers/etc/hosts` hinzufügen:

```text
127.0.0.1    xoops.localhost
```

Jetzt kannst du auf `http://xoops.localhost/` testen, während du deine Repository intakt hältst und den Webserver im htdocs Verzeichnis mit einer einfachen URL behältst. Außerdem kannst du deine lokale XOOPS-Kopie jederzeit auf die neueste Master aktualisieren, ohne neu zu installieren oder Dateien zu kopieren. Und du kannst Verbesserungen und Fixes zum Code machen, um sie über GitHub zu XOOPS beizutragen.

## Composer Dependencies

XOOPS 2.7.0 nutzt [Composer](https://getcomposer.org/) zur Verwaltung seiner PHP Dependencies. Der Abhängigkeitsbaum lebt in `htdocs/xoops_lib/` innerhalb der Quell-Repository:

* `composer.dist.json` ist die Master-Liste der mit der Release ausgelieferten Dependencies.
* `composer.json` ist die lokale Kopie, die du bei Bedarf für deine Entwicklungsumgebung anpassen kannst.
* `composer.lock` pinned exakte Versionen, damit Installationen reproduzierbar sind.
* `vendor/` enthält die installierten Bibliotheken (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom und andere).

Für einen frischen Git Clone von XOOPS 2.7.0, starte vom Repository Root:

```text
cd htdocs/xoops_lib
composer install
```

Beachte, dass es keine `composer.json` im Repository Root gibt — das Projekt lebt unter `htdocs/xoops_lib/`, also musst du `cd` in dieses Verzeichnis gehen, bevor du Composer ausführst.

Release Tarballs liefern `vendor/` vorpopuliert aus, aber Git Clones möglicherweise nicht. Halte `vendor/` auf Entwicklungs-Installationen intakt — XOOPS wird seine Dependencies von dort zur Laufzeit laden.

Die [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) Bibliothek wird als Composer Dependency in 2.7.0 ausgeliefert, also kannst du `Xmf\Request`, `Xmf\Database\TableLoad` und verwandte Klassen in deinem Modul-Code verwenden, ohne zusätzliche Installation.

## DebugBar Module

XOOPS 2.7.0 liefert ein **DebugBar** Modul basierend auf Symfony VarDumper. Es fügt eine Debug-Toolbar zu gerenderten Seiten hinzu, die Request-, Datenbank- und Template-Informationen verfügbar macht. Installiere es aus dem Module Admin Bereich auf Entwicklungs- und Staging-Seiten. Lasse es nicht auf einer öffentlich zugänglichen Produktionsseite installiert, es sei denn, du weißt, dass du es willst.
