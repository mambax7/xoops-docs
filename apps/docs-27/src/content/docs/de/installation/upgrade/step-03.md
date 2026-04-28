---
title: "Troubleshooting"
---

## Smarty 4 Template-Fehler

Die häufigste Problemklasse beim Upgrade von XOOPS 2.5.x auf 2.7.0 ist die Inkompatibilität von Smarty 4-Templates. Wenn Sie den [Preflight-Check](preflight.md) übersprungen oder nicht abgeschlossen haben, sehen Sie möglicherweise Template-Fehler auf der Vorderseite oder im Admin-Bereich nach dem Upgrade.

Zur Behebung:

1. **Führen Sie den Preflight-Scanner erneut aus** unter `/upgrade/preflight.php`. Wenden Sie automatische Reparaturen an, die angeboten werden, oder beheben Sie gekennzeichnete Templates manuell.
2. **Leeren Sie den kompilierten Template-Cache.** Entfernen Sie alles außer `index.html` aus `xoops_data/caches/smarty_compile/`. Von Smarty 3 kompilierte Templates sind nicht mit Smarty 4 kompatibel, und veraltete Dateien können verwirrenede Fehler verursachen.
3. **Wechseln Sie vorübergehend zu einem mitgelieferten Design.** Wählen Sie im Admin-Bereich `xbootstrap5` oder `default` als aktives Design. Dies bestätigt, ob das Problem auf ein benutzerdefiniertes Design beschränkt ist oder site-weit ist.
4. **Überprüfen Sie alle benutzerdefinierten Designs und Modulvorlagen**, bevor Sie den Produktionsdatenverkehr wieder einschalten. Achten Sie besonders auf Templates, die `{php}`-Blöcke, veraltete Modifizierer oder nicht-Standard-Trennzeichensyntax verwenden - diese sind die häufigsten Smarty 4-Brüche.

Siehe auch den Smarty 4-Abschnitt in [Spezielle Themen](../../installation/specialtopics.md).

## Berechtigungsprobleme

Das XOOPS-Upgrade muss möglicherweise in Dateien schreiben, die zuvor schreibgeschützt gemacht wurden. In diesem Fall sehen Sie eine Meldung wie diese:

![XOOPS Upgrade Fehler "Schreibbar machen"](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Die Lösung besteht darin, die Berechtigungen zu ändern. Sie können Berechtigungen mit FTP ändern, wenn Sie keinen direkteren Zugriff haben. Hier ist ein Beispiel mit FileZilla:

![FileZilla-Berechtigung ändern](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Debugausgabe

Sie können zusätzliche Debugausgabe im Logger aktivieren, indem Sie einen Debug-Parameter zur URL hinzufügen, die zum Starten des Upgrades verwendet wird:

```text
http://example.com/upgrade/?debug=1
```

