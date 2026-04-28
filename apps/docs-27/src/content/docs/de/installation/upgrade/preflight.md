---
title: "Preflight-Check"
---

XOOPS 2.7.0 hat seine Template-Engine von Smarty 3 auf Smarty 4 aktualisiert. Smarty 4 ist strenger bei der Template-Syntax als Smarty 3, und einige benutzerdefinierte Designs und Modulvorlagen müssen möglicherweise angepasst werden, bevor sie auf XOOPS 2.7.0 korrekt funktionieren.

Um diese Probleme zu identifizieren und zu beheben, _bevor_ Sie das Hauptupgrade ausführen, wird XOOPS 2.7.0 mit einem **Preflight-Scanner** im `upgrade/`-Verzeichnis ausgeliefert. Sie müssen den Preflight-Scanner mindestens einmal ausführen, bevor der Hauptupgrade-Workflow Ihnen erlaubt, fortzufahren.

## Was der Scanner tut

Der Preflight-Scanner durchsucht Ihre bestehenden Designs und Modulvorlagen nach bekannten Smarty 4-Inkompatibilität. Er kann:

* **Scannen** Sie Ihre `themes/` und `modules/` Verzeichnisse nach `.tpl` und `.html` Template-Dateien, die möglicherweise Änderungen benötigen
* **Probleme berichten**, gruppiert nach Datei und Problemtyp
* **Viele häufige Probleme automatisch reparieren**, wenn Sie darum bitten

Nicht jedes Problem kann automatisch repariert werden. Einige Templates müssen manuell bearbeitet werden, besonders wenn sie ältere Smarty 3-Idiomen verwenden, die keine direkte Entsprechung in Smarty 4 haben.

## Scanner ausführen

1. Kopieren Sie das Distributions-`upgrade/`-Verzeichnis in Ihr Websites-Web-Root (falls Sie dies nicht bereits als Teil des [Vorbereitung zum Upgrade](ustep-01.md) Schritts getan haben).
2. Zeigen Sie Ihren Browser auf die Preflight-URL:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Melden Sie sich mit einem Administrator-Konto an, wenn Sie dazu aufgefordert werden.
4. Der Scanner zeigt ein Formular mit drei Steuerelementen an:
   * **Template-Verzeichnis** — lassen Sie leer, um sowohl `themes/` als auch `modules/` zu scannen. Geben Sie einen Pfad wie `/themes/mytheme/` ein, um den Scan auf ein einzelnes Verzeichnis zu beschränken.
   * **Template-Erweiterung** — lassen Sie leer, um sowohl `.tpl` als auch `.html` Dateien zu scannen. Geben Sie eine einzelne Erweiterung ein, um den Scan zu beschränken.
   * **Automatische Reparatur versuchen** — aktivieren Sie dieses Kontrollkästchen, wenn der Scanner Probleme reparieren soll, die er beheben kann. Lassen Sie es deaktiviert für einen schreibgeschützten Scan.
5. Drücken Sie die Schaltfläche **Ausführen**. Der Scanner durchsucht die ausgewählten Verzeichnisse und meldet jedes gefundene Problem.

## Ergebnisse interpretieren

Der Scan-Bericht listet jede überprüfte Datei und jedes gefundene Problem auf. Jeder Problemeingang informiert Sie über:

* Welche Datei das Problem enthält
* Welche Smarty 4-Regel sie verletzt
* Ob der Scanner es automatisch reparieren könnte

Wenn Sie den Scan mit _Automatische Reparatur versuchen_ aktiviert haben, bestätigt der Bericht auch, welche Dateien umgeschrieben wurden.

## Probleme manuell beheben

Für Probleme, die der Scanner nicht automatisch reparieren kann, öffnen Sie die gekennzeichnete Template-Datei in einem Editor und nehmen Sie die erforderlichen Änderungen vor. Häufige Smarty 4-Inkompatibilität umfassen:

* `{php} ... {/php}` Blöcke (in Smarty 4 nicht mehr unterstützt)
* Veraltete Modifizierer und Funktionsaufrufe
* Leerzeichen-empfindliche Trennzeichenverwendung
* Register-Zeit-Plugin-Annahmen, die sich in Smarty 4 geändert haben

Wenn Sie sich nicht wohl fühlen, Templates zu bearbeiten, ist der sicherste Ansatz, zu einem mitgelieferten Design (`xbootstrap5`, `default`, `xswatch5` usw.) zu wechseln und sich später nach dem Upgrade mit dem benutzerdefinierten Design zu befassen.

## Erneutes Ausführen bis sauber

Nachdem Sie Fixes vorgenommen haben — ob automatisch oder manuell — führen Sie den Preflight-Scanner erneut aus. Wiederholen Sie dies, bis der Scan keine verbleibenden Probleme meldet.

Nachdem der Scan sauber ist, können Sie die Preflight-Sitzung durch Drücken der Schaltfläche **Scanner beenden** in der Scanner-Benutzeroberfläche beenden. Dies markiert Preflight als abgeschlossen und ermöglicht dem Hauptupgrade unter `/upgrade/` fortzufahren.

## Upgrade fortsetzen

Mit vollständigem Preflight können Sie das Hauptupgrade unter starten:

```text
http://example.com/upgrade/
```

Siehe [Upgrade ausführen](ustep-02.md) für die nächsten Schritte.

## Wenn Sie Preflight überspringen

Das Überspringen des Preflight wird dringend nicht empfohlen, aber wenn Sie ein Upgrade durchgeführt haben, ohne es auszuführen, und jetzt Template-Fehler sehen, siehe den Abschnitt Smarty 4 Template-Fehler unter [Troubleshooting](ustep-03.md). Sie können Preflight im Nachhinein ausführen und `xoops_data/caches/smarty_compile/` löschen, um es zu beheben.
