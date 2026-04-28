---
title: "Richtlinien zur Meldung von Problemen"
description: "Wie man Fehler, Feature-Anfragen und andere Probleme effektiv meldet"
---

> Effektive Fehlerberichte und Feature-Anfragen sind entscheidend für die XOOPS-Entwicklung. Dieser Leitfaden hilft dir, qualitativ hochwertige Probleme zu erstellen.

---

## Vor der Meldung

### Bestehende Probleme überprüfen

**Suche immer zuerst:**

1. Gehe zu [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
2. Suche nach Schlüsselwörtern im Zusammenhang mit deinem Problem
3. Überprüfe geschlossene Probleme - könnten bereits gelöst sein
4. Schau Pull Requests an - könnten in Arbeit sein

Verwende Suchfilter:
- `is:issue is:open label:bug` - Offene Fehler
- `is:issue is:open label:feature` - Offene Feature-Anfragen
- `is:issue sort:updated` - Kürzlich aktualisierte Probleme

### Ist es wirklich ein Problem?

Überleg zunächst:

- **Konfigurationsproblem?** - Überprüfe die Dokumentation
- **Nutzungsfrage?** - Frage in Foren oder Discord Gemeinschaft
- **Sicherheitsproblem?** - Siehe Abschnitt #Sicherheitsprobleme unten
- **Modul-spezifisch?** - Melde dem Modul-Verwalter
- **Theme-spezifisch?** - Melde dem Theme-Autor

---

## Problemtypen

### Fehlerbericht

Ein Fehler ist ein unerwartetes Verhalten oder ein Defekt.

**Beispiele:**
- Login funktioniert nicht
- Datenbankfehler
- Fehlende Formularvalidierung
- Sicherheitslücke

### Feature-Anfrage

Eine Feature-Anfrage ist ein Vorschlag für neue Funktionalität.

**Beispiele:**
- Unterstützung für neue Funktion hinzufügen
- Bestehende Funktionalität verbessern
- Fehlende Dokumentation hinzufügen
- Leistungsverbesserungen

### Verbesserung

Eine Verbesserung verbessert bestehende Funktionalität.

**Beispiele:**
- Bessere Fehlermeldungen
- Verbesserte Leistung
- Besseres API-Design
- Bessere Benutzererfahrung

### Dokumentation

Dokumentationsprobleme sind fehlende oder falsche Dokumentation.

**Beispiele:**
- Unvollständige API-Dokumentation
- Veraltete Guides
- Fehlende Code-Beispiele
- Tippfehler in der Dokumentation

---

## Fehler melden

### Fehlerberichts-Vorlage

```markdown
## Beschreibung
Kurze, klare Beschreibung des Fehlers.

## Schritte zum Reproduzieren
1. Schritt eins
2. Schritt zwei
3. Schritt drei

## Erwartetes Verhalten
Was sollte passieren.

## Tatsächliches Verhalten
Was tatsächlich passiert.

## Umgebung
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Datenbank: MySQL/MariaDB Version
- Betriebssystem: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
Falls zutreffend, füge Screenshots ein, die das Problem zeigen.

## Zusätzlicher Kontext
Andere relevante Informationen.

## Mögliche Lösung
Falls du Vorschläge zur Fehlerbehebung hast (optional).
```

### Gutes Fehlerberichts-Beispiel

```markdown
## Beschreibung
Die Login-Seite zeigt eine leere Seite, wenn die Datenbankverbindung fehlschlägt.

## Schritte zum Reproduzieren
1. Stoppe den MySQL-Service
2. Navigiere zur Login-Seite
3. Beobachte das Verhalten

## Erwartetes Verhalten
Zeige eine benutzerfreundliche Fehlermeldung, die das Datenbankverbindungsproblem erklärt.

## Tatsächliches Verhalten
Die Seite ist komplett leer - keine Fehlermeldung, keine Benutzeroberfläche sichtbar.

## Umgebung
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Datenbank: MySQL 5.7
- Betriebssystem: Ubuntu 20.04
- Browser: Chrome 120

## Zusätzlicher Kontext
Dies betrifft wahrscheinlich auch andere Seiten. Der Fehler sollte an Admins angezeigt oder angemessen protokolliert werden.

## Mögliche Lösung
Überprüfe die Datenbankverbindung in header.php vor dem Rendern des Templates.
```

### Schlechtes Fehlerberichts-Beispiel

```markdown
## Beschreibung
Login funktioniert nicht

## Schritte zum Reproduzieren
Es funktioniert nicht

## Erwartetes Verhalten
Es sollte funktionieren

## Tatsächliches Verhalten
Es funktioniert nicht

## Umgebung
Neueste Version
```

---

## Feature-Anfrage melden

### Feature-Anfrage-Vorlage

```markdown
## Beschreibung
Klare, prägnante Beschreibung der Funktion.

## Problembeschreibung
Warum wird diese Funktion benötigt? Welches Problem löst sie?

## Vorgeschlagene Lösung
Beschreibe deine ideale Implementierung oder UX.

## Überlegte Alternativen
Gibt es andere Wege, dieses Ziel zu erreichen?

## Zusätzlicher Kontext
Irgendwelche Mockups, Beispiele oder Referenzen.

## Erwarteter Impact
Wie würde dies den Benutzern nutzen? Wäre es breaking?
```

### Gutes Feature-Anfrage-Beispiel

```markdown
## Beschreibung
Zwei-Faktor-Authentifizierung (2FA) für Benutzerkonten hinzufügen.

## Problembeschreibung
Mit zunehmenden Sicherheitsverletzungen bieten viele CMS-Plattformen nun 2FA an. XOOPS-Benutzer wollen bessere Kontosicherheit jenseits von Passwörtern.

## Vorgeschlagene Lösung
Implementiere TOTP-basierte 2FA (kompatibel mit Google Authenticator, Authy, etc.).
- Benutzer können 2FA in ihrem Profil aktivieren
- Zeige QR-Code für Einrichtung
- Generiere Backup-Codes zur Wiederherstellung
- Erfordere 2FA-Code bei Login

## Überlegte Alternativen
- SMS-basierte 2FA (erfordert Träger-Integration, weniger sicher)
- Hardware-Keys (zu komplex für durchschnittliche Benutzer)

## Zusätzlicher Kontext
Ähnlich wie GitHub, GitLab und WordPress Implementierungen.
Referenz: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Erwarteter Impact
Erhöht die Kontosicherheit. Könnte zunächst optional sein, später zwingend erforderlich.
```

---

## Sicherheitsprobleme

### NICHT öffentlich melden

**Erstelle niemals ein öffentliches Problem für Sicherheitslücken.**

### Privat melden

1. **E-Mail an das Sicherheitsteam:** security@xoops.org
2. **Schließe ein:**
   - Beschreibung der Sicherheitslücke
   - Schritte zum Reproduzieren
   - Potenzieller Impact
   - Deine Kontaktinformationen

### Verantwortungsvolle Offenlegung

- Wir bestätigen den Empfang innerhalb von 48 Stunden
- Wir geben alle 7 Tage Updates
- Wir arbeiten an einem Lösungs-Zeitrahmen
- Du kannst um Anerkennung für die Entdeckung anfordern
- Koordiniere den Zeitpunkt der öffentlichen Offenlegung

### Sicherheitsproblem-Beispiel

```
Betreff: [SECURITY] XSS-Sicherheitslücke in Kommentarformular

Beschreibung:
Das Kommentarformular im Publisher-Modul bereinigt Benutzereingaben nicht richtig,
was gespeicherte XSS-Angriffe ermöglicht.

Schritte zum Reproduzieren:
1. Erstelle einen Kommentar mit: <img src=x onerror="alert('xss')">
2. Reiche das Formular ein
3. Das JavaScript wird ausgeführt, wenn du den Kommentar ansiehst

Impact:
Angreifer können Benutzer-Session-Tokens stehlen, als Benutzer handeln,
oder die Website verunstalten.

Umgebung:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## Best Practices für Problem-Titel

### Gute Titel

```
OK - Die Login-Seite zeigt einen leeren Fehler, wenn die Datenbankverbindung fehlschlägt
OK - Zwei-Faktor-Authentifizierung Unterstützung hinzufügen
OK - Formularvalidierung verhindert SQL-Injection nicht im Namensfeld
OK - Leistung der Benutzerlisten-Abfrage verbesseren
OK - Installationsdokumentation für PHP 8.2 aktualisieren
```

### Schlechte Titel

```
NICHT OK - Fehler im System
NICHT OK - Hilf mir!!
NICHT OK - Es funktioniert nicht
NICHT OK - Frage zu XOOPS
NICHT OK - Fehler
```

### Titel-Richtlinien

- **Sei spezifisch** - Erwähne was und wo
- **Sei prägnant** - Unter 75 Zeichen
- **Verwende Präsens** - "zeigt leere Seite" nicht "zeigte leer"
- **Schließe Kontext ein** - "im Admin-Panel", "während Installation"
- **Meide generische Wörter** - Nicht "fix", "help", "problem"

---

## Best Practices für Problembeschreibung

### Schließe wesentliche Informationen ein

1. **Was** - Klare Beschreibung des Problems
2. **Wo** - Welche Seite, Modul oder Funktion
3. **Wann** - Schritte zum Reproduzieren
4. **Umgebung** - Version, Betriebssystem, Browser, PHP
5. **Warum** - Warum ist dies wichtig

### Verwende Code-Formatierung

```markdown
Fehlermeldung: `Error: Cannot find user`

Code-Snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Schließe Screenshots ein

Für UI-Probleme schließe ein:
- Screenshot des Problems
- Screenshot des erwarteten Verhaltens
- Annotiere, was falsch ist (Pfeile, Kreise)

### Verwende Labels

Füge Labels hinzu zur Kategorisierung:
- `bug` - Fehlerbericht
- `enhancement` - Verbesserungsanfrage
- `documentation` - Dokumentationsproblem
- `help wanted` - Suche nach Hilfe
- `good first issue` - Gut für neue Beiträger

---

## Nach der Meldung

### Sei reaktionsfreeudig

- Überprüfe auf Fragen in den Problem-Kommentaren
- Gib zusätzliche Informationen, wenn angefordert
- Teste vorgeschlagene Lösungen
- Verifiziere, ob der Fehler in neuen Versionen noch besteht

### Befolge Etikette

- Sei respektvoll und professionell
- Nimm gute Absichten an
- Fordere nicht Fixes ein - Entwickler sind Freiwillige
- Biete Hilfe an, falls möglich
- Danke Beitragenden für ihre Arbeit

### Halte Problem fokussiert

- Bleibe thematisch
- Diskutiere nicht zusammenhanglose Probleme
- Verlinke stattdessen zu verwandten Problemen
- Verwende Probleme nicht für Feature-Abstimmungen

---

## Was passiert mit Problemen

### Triaging-Prozess

1. **Neues Problem erstellt** - GitHub benachrichtigt Verwalter
2. **Initiale Überprüfung** - Überprüfung auf Klarheit und Duplikate
3. **Label-Zuweisung** - Kategorisierung und Priorisierung
4. **Zuweisung** - Zuweisung an jemanden, falls angemessen
5. **Diskussion** - Weitere Info wird eingesammelt, falls nötig

### Prioritätsstufen

- **Kritisch** - Datenverlust, Sicherheit, vollständiger Ausfall
- **Hoch** - Hauptfunktion kaputt, betrifft viele Benutzer
- **Mittel** - Teil der Funktion kaputt, Workaround verfügbar
- **Niedrig** - Geringes Problem, kosmetisch, oder Nischen-Anwendungsfall

### Lösungs-Ergebnisse

- **Behoben** - Problem gelöst in einem PR
- **Wird nicht behoben** - Abgelehnt aus technischen oder strategischen Gründen
- **Duplikat** - Gleiches wie anderes Problem
- **Ungültig** - Nicht wirklich ein Problem
- **Mehr Info erforderlich** - Warte auf zusätzliche Details

---

## Problem-Beispiele

### Beispiel: Guter Fehlerbericht

```markdown
## Beschreibung
Admin-Benutzer können Elemente nicht löschen, wenn MySQL mit strict mode aktiviert ist.

## Schritte zum Reproduzieren
1. Aktiviere `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigiere zu Publisher Admin Panel
3. Klicke Löschen-Button auf irgendeinem Artikel
4. Fehler wird angezeigt

## Erwartetes Verhalten
Artikel sollte gelöscht werden oder aussagekräftigen Fehler zeigen.

## Tatsächliches Verhalten
Fehler: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Umgebung
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Datenbank: MySQL 8.0.32 mit STRICT_TRANS_TABLES
- Betriebssystem: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot der Fehlermeldung]

## Zusätzlicher Kontext
Dies passiert nur mit strict SQL mode. Funktioniert mit Standard-Einstellungen.
Die Abfrage ist in class/PublisherItem.php:248

## Mögliche Lösung
Verwende einfache Anführungszeichen um 'deleted_at' oder verwende Backticks für alle Spaltennamen.
```

### Beispiel: Gute Feature-Anfrage

```markdown
## Beschreibung
REST API Endpoints für Read-Only Zugriff auf öffentliche Inhalte hinzufügen.

## Problembeschreibung
Entwickler möchten mobile Apps und externe Services mit XOOPS Daten erstellen.
Aktuell beschränkt auf SOAP API, die veraltet und schlecht dokumentiert ist.

## Vorgeschlagene Lösung
Implementiere RESTful API mit:
- Endpoints für Artikel, Benutzer, Kommentare (nur Lesen)
- Token-basierte Authentifizierung
- Standard HTTP Status Codes und Fehler
- OpenAPI/Swagger Dokumentation
- Pagination Unterstützung

## Überlegte Alternativen
- Verbesserte SOAP API (Legacy, nicht Standards-konform)
- GraphQL (komplexer, vielleicht später)

## Zusätzlicher Kontext
Siehe Publisher Module API Refactoring für ähnliche Muster.
Würde sich mit modernen Web-Entwicklungs-Praktiken ausrichten.

## Erwarteter Impact
Ermögliche Ökosystem von Third-Party Tools und Mobile Apps.
Würde XOOPS Adoption und Ökosystem verbessern.
```

---

## Verwandte Dokumentation

- Code of Conduct
- Contribution Workflow
- Pull Request Guidelines
- Contributing Overview

---

#xoops #issues #bug-reporting #feature-requests #github
