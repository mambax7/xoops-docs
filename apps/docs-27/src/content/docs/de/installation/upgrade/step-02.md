---
title: "Upgrade ausführen"
---

Bevor Sie das Hauptupgrade ausführen, stellen Sie sicher, dass Sie den [Preflight-Check](preflight.md) abgeschlossen haben. Die Upgrade-Benutzeroberfläche erfordert, dass Preflight mindestens einmal ausgeführt wird, und leitet Sie dorthin weiter, wenn Sie dies nicht getan haben.

Starten Sie das Upgrade, indem Sie Ihren Browser auf das _upgrade_-Verzeichnis Ihrer Website zeigen:

```text
http://example.com/upgrade/
```

Dies sollte eine Seite wie diese anzeigen:

![XOOPS Upgrade-Start](/xoops-docs/2.7/img/installation/upgrade-01.png)

Wählen Sie die Schaltfläche "Weiter", um fortzufahren.

Jedes "Weiter" führt zu einem anderen Patch. Fahren Sie fort, bis alle Patches angewendet sind und die Seite zum Aktualisieren des System-Moduls angezeigt wird.

![XOOPS Upgrade Patch angewendet](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Was das 2.5.11 → 2.7.0 Upgrade anwendet

Wenn Sie ein Upgrade von XOOPS 2.5.11 auf 2.7.0 durchführen, wendet das Upgrade-Programm die folgenden Patches an. Jeder wird als separater Schritt im Assistent angezeigt, damit Sie bestätigen können, was geändert wird:

1. **Entfernen Sie veraltete gebündelte PHPMailer.** Die gebündelte Kopie von PHPMailer im Protector-Modul wird gelöscht. PHPMailer wird jetzt durch Composer in `xoops_lib/vendor/` bereitgestellt.
2. **Entfernen Sie veralteten HTMLPurifier-Ordner.** Ebenso wird der alte HTMLPurifier-Ordner im Protector-Modul gelöscht. HTMLPurifier wird jetzt durch Composer bereitgestellt.
3. **Erstellen Sie die `tokens`-Tabelle.** Eine neue `tokens`-Tabelle wird für generische Token-Speicherung mit Bereich hinzugefügt. Die Tabelle hat Spalten für Token-ID, Benutzer-ID, Bereich, Hash und ausgegebene/ablauf/verwendet-Zeitstempel und wird von Token-basierten Features in XOOPS 2.7.0 verwendet.
4. **Verbreitern Sie `bannerclient.passwd`.** Die Spalte `bannerclient.passwd` wird auf `VARCHAR(255)` verbreitert, damit sie moderne Passwort-Hashes (bcrypt, argon2) speichern kann, anstelle der älteren schmalen Spalte.
5. **Fügen Sie Session-Cookie-Einstellungen hinzu.** Zwei neue Einstellungen werden eingefügt: `session_cookie_samesite` (für das SameSite-Cookie-Attribut) und `session_cookie_secure` (um HTTPS-Only-Cookies zu erzwingen). Siehe [Nach dem Upgrade](ustep-04.md) für Anweisungen zum Überprüfen dieser Einstellungen nach Abschluss des Upgrades.

Keiner dieser Schritte berührt Ihre Inhaltsdaten. Ihre Benutzer, Beiträge, Bilder und Moduldaten bleiben unverändert.

## Sprache auswählen

Die wichtigste XOOPS-Distribution wird mit englischer Unterstützung ausgeliefert. Unterstützung für weitere Gebietsschemata wird von [XOOPS-Websites mit lokaler Unterstützung](https://xoops.org/modules/xoopspartners/) bereitgestellt. Diese Unterstützung kann in Form einer angepassten Distribution oder zusätzlicher Dateien erfolgen, die zur hauptvertriebenen Distribution hinzugefügt werden.

XOOPS-Übersetzungen werden auf [transifex](https://www.transifex.com/xoops/public/) gepflegt

Wenn Ihr XOOPS-Upgrader zusätzliche Sprachunterstützung hat, können Sie die Sprache ändern, indem Sie das Sprachsymbol in den oberen Menüs auswählen und eine andere Sprache auswählen.

![XOOPS Upgrade-Sprache](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)

