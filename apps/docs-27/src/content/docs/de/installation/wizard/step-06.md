---
title: "Datenbankkonfiguration"
---

Diese Seite erfasst Informationen über die Datenbank, die XOOPS verwenden wird.

Geben Sie die angeforderten Informationen ein und korrigieren Sie nach Bedarf Probleme, und wählen Sie dann die Schaltfläche "Weiter", um fortzufahren.

![XOOPS-Installationsprogramm-Datenbankkonfiguration](/xoops-docs/2.7/img/installation/installer-06.png)

## In diesem Schritt erfasste Daten

### Datenbank

#### Datenbankname

Der Name der Datenbank auf dem Host, die XOOPS verwenden soll. Der in dem vorherigen Schritt eingegebene Datenabnutzer sollte alle Berechtigungen für diese Datenbank haben. Das Installationsprogramm versucht, diese Datenbank zu erstellen, falls sie nicht vorhanden ist.

#### Tabellenpräfix

Dieses Präfix wird den Namen aller neuen XOOPS-Tabellen hinzugefügt. Dies hilft, Namenskonflikte zu vermeiden, wenn die Datenbank mit anderen Anwendungen gemeinsam genutzt wird. Ein eindeutiges Präfix erschwert auch das Erraten von Tabellennamen, was Sicherheitsvorteile hat. Wenn Sie unsicher sind, behalten Sie einfach die Standardeinstellung

#### Datenbankzeichensatz

Das Installationsprogramm wird standardmäßig auf `utf8mb4` gesetzt, das den vollständigen Unicode-Bereich einschließlich Emoji und ergänzender Zeichen unterstützt. Sie können hier einen anderen Zeichensatz auswählen, aber `utf8mb4` wird für praktisch alle Sprachen und Gebietsschemata empfohlen und sollte unverändert bleiben, es sei denn, Sie haben einen spezifischen Grund, dies zu ändern.

#### Datenbank-Sortierung

Das Kollationierungsfeld wird standardmäßig leer gelassen. Wenn es leer ist, wendet MySQL die Standardsortierung für jeden oben ausgewählten Zeichensatz an (für `utf8mb4` sind dies normalerweise `utf8mb4_general_ci` oder `utf8mb4_0900_ai_ci`, je nach MySQL-Version). Wenn Sie eine bestimmte Sortierung benötigen - z.B. um mit einer vorhandenen Datenbank übereinzustimmen - wählen Sie sie hier aus. Ansonsten wird empfohlen, dies leer zu lassen.

