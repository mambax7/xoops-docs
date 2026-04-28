---
title: "XOOPS 2.7.0 Kompatibilitätsprüfung für diesen Leitfaden"
---

Dieses Dokument listet die Änderungen auf, die in diesem Repository erforderlich sind, damit der Installationsleitfaden mit XOOPS 2.7.0 übereinstimmt.

Überprüfungsbasis:

- Aktuelles Leitfaden-Repository: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 Core überprüft unter: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Primäre 2.7.0-Quellen überprüft:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Geltungsbereich

Dieses Repository enthält derzeit:

- Root-Level englische Markdown-Dateien, die als Hauptleitfaden verwendet werden.
- Eine teilweise `en/`-Kopie.
- Vollständige `de/` und `fr/` Bücher mit ihren eigenen Vermögenswerten.

Die Root-Level-Dateien benötigen den ersten Durchgang. Nach dem sollten gleichwertige Änderungen in `de/book/` und `fr/book/` gespiegelt werden. Der `en/`-Baum benötigt auch eine Bereinigung, da er nur teilweise gepflegt zu sein scheint.

## 1. Globale Änderungen im Repository

### 1.1 Versionierung und Metadaten

Aktualisieren Sie alle Guide-Level-Verweise von XOOPS 2.5.x auf XOOPS 2.7.0.

Betroffene Dateien:

- `README.md`
- `SUMMARY.md` — primärer Live-TOC für den Root-Leitfaden; Navigationsbeschriftungen und Abschnittsüberschriften müssen den neuen Kapiteltiteln und dem umbenannten Abschnitt "Historische Upgrade-Hinweise" entsprechen
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- lokalisierte `de/book/*.md` und `fr/book/*.md`

Erforderliche Änderungen:

- Ändern Sie `for XOOPS 2.5.7.x` in `for XOOPS 2.7.0`.
- Aktualisieren Sie das Copyright-Jahr von `2018` auf `2026`.
- Ersetzen Sie alte XOOPS 2.5.x und 2.6.0-Referenzen, in denen sie die aktuelle Version beschreiben.
- Ersetzen Sie SourceForge-Ära-Download-Anleitung durch GitHub Releases:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Link-Aktualisierung

`about-xoops-cms.md` und lokalisierte `10aboutxoops.md`-Dateien verweisen immer noch auf alte 2.5.x und 2.6.0 GitHub-Positionen. Diese Links müssen auf die aktuellen 2.7.x-Projektpositionen aktualisiert werden.

### 1.3 Screenshot-Aktualisierung

Alle Screenshots, die das Installationsprogramm, die Upgrade-UI, das Admin-Dashboard, die Design-Auswahl, die Modul-Auswahl und die Post-Install-Bildschirme anzeigen, sind veraltet.

Betroffene Asset-Bäume:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Dies ist eine vollständige Aktualisierung, keine teilweise. Das 2.7.0-Installationsprogramm verwendet ein anderes Bootstrap-basiertes Layout und eine andere visuelle Struktur.

## 2. Kapitel 2: Einführung

Datei:

- `chapter-2-introduction.md`

### 2.1 Systemanforderungen müssen umgeschrieben werden

Das aktuelle Kapitel sagt nur Apache, MySQL und PHP. XOOPS 2.7.0 hat explizite Mindestwerte:

| Komponente | 2.7.0 Minimum | 2.7.0 Empfehlung |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Webserver | Jeder Server, der erforderliches PHP unterstützt | Apache oder Nginx empfohlen |

Hinweise zum Hinzufügen:

- IIS ist immer noch als möglich im Installationsprogramm aufgelistet, aber Apache und Nginx sind die empfohlenen Beispiele.
- Die Versionshinweise erwähnen auch MySQL 9.0-Kompatibilität.

### 2.2 Erforderliche und empfohlene PHP-Erweiterungs-Checkliste hinzufügen

Das 2.7.0-Installationsprogramm trennt jetzt strenge Anforderungen von empfohlenen Erweiterungen.

Erforderliche Überprüfungen, die das Installationsprogramm anzeigt:

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- fileinfo

Empfohlene Erweiterungen:

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 Checksum-Anweisungen entfernen

Derzeitiger Schritt 5 beschreibt `checksum.php` und `checksum.mdi`. Diese Dateien sind nicht Teil von XOOPS 2.7.0.

Aktion:

- Entfernen Sie den Checksum-Verifizierungsabschnitt vollständig.

### 2.4 Paket- und Upload-Anweisungen aktualisieren

Behalten Sie die `docs/`, `extras/`, `htdocs/`, `upgrade/` Paketlayout-Beschreibung bei, aktualisieren Sie aber den Upload- und Vorbereitungstext, um aktuelle beschreibbare Pfad-Erwartungen widerzuspiegeln:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Der aktuelle Leitfaden unterschätzt dies.

### 2.5 SourceForge-Übersetzungs-/Download-Sprache ersetzen

Derzeitiger Text sagt immer noch, dass man XOOPS auf SourceForge besuchen soll, um andere Sprachpakete zu erhalten. Dies muss durch aktuelle Projekt-/Community-Download-Anleitung ersetzt werden.

## 3. Kapitel 3: Server-Konfigurationsprüfung

Datei:

- `chapter-3-server-configuration-check.md`

Erforderliche Änderungen:

- Schreiben Sie die Seitenbeschreibung um das aktuelle Zwei-Block-Layout:
  - Anforderungen
  - Empfohlene Erweiterungen
- Ersetzen Sie den alten Screenshot.
- Dokumentieren Sie explizit die oben aufgelisteten Anforderungsprüfungen.

## 4. Kapitel 4: Den richtigen Pfad nehmen

Datei:

- `chapter-4-take-the-right-path.md`

Erforderliche Änderungen:

- Fügen Sie das neue Feld `Cookie Domain` hinzu.
- Aktualisieren Sie die Namen und Beschreibungen der Pfadfelder, um mit 2.7.0 übereinzustimmen:
  - XOOPS Root Path
  - XOOPS Data Path
  - XOOPS Library Path
  - XOOPS URL
  - Cookie Domain
- Fügen Sie einen Hinweis hinzu, dass das Ändern des Bibliothekspfads jetzt einen gültigen Composer-Autoloader unter `vendor/autoload.php` erfordert.

Dies ist eine echte Kompatibilitätsprüfung in 2.7.0 und sollte klar dokumentiert werden. Der aktuelle Leitfaden erwähnt Composer überhaupt nicht.

## 5. Kapitel 5: Datenbankverbindungen

Datei:

- `chapter-5-database-connections.md`

Erforderliche Änderungen:

- Behalten Sie die Aussage bei, dass nur MySQL unterstützt wird.
- Aktualisieren Sie den Datenbankonfigurationsabschnitt, um folgendes widerzuspiegeln:
  - Der Standard-Zeichensatz ist jetzt `utf8mb4`
  - Die Sortierungsauswahl wird dynamisch aktualisiert, wenn der Zeichensatz geändert wird
- Ersetzen Sie Screenshots für Datenbankverbindungs- und Konfigurationsseiten.

Der aktuelle Text, dass Zeichensatz und Sortierung keine Aufmerksamkeit benötigen, ist zu schwach für 2.7.0. Er sollte mindestens den neuen `utf8mb4`-Standard und die dynamische Sortierungsauswahl erwähnen.

## 6. Kapitel 6: Finale Systemkonfiguration

Datei:

- `chapter-6-final-system-configuration.md`

### 6.1 Generierte Konfigurationsdateien geändert

Der Leitfaden sagt derzeit, dass das Installationsprogramm `mainfile.php` und `secure.php` schreibt.

In 2.7.0 installiert es auch Konfigurationsdateien in `xoops_data/configs/`, einschließlich:

- `xoopsconfig.php`
- captcha-Konfigurationsdateien
- textsanitizer-Konfigurationsdateien

### 6.2 Vorhandene Konfigurationsdateien in `xoops_data/configs/` werden nicht überschrieben

Das Nicht-Überschreiben-Verhalten ist **begrenzt**, nicht global. Zwei unterschiedliche Code-Pfade in `page_configsave.php` schreiben Konfigurationsdateien:

- `writeConfigurationFile()` (aufgerufen in den Zeilen 59 und 66) **regeneriert immer** `xoops_data/data/secure.php` und `mainfile.php` aus der Assistenten-Eingabe. Es gibt keine Existenzprüfung. Eine vorhandene Kopie wird ersetzt.
- `copyConfigDistFiles()` (aufgerufen in Zeile 62, definiert in Zeile 317) kopiert nur die `xoops_data/configs/`-Dateien (`xoopsconfig.php`, die captcha-Konfigurationen, die textsanitizer-Konfigurationen) **wenn das Ziel nicht bereits existiert**.

Die Kapitelumschreibung muss beide Verhaltensweisen klar widerspiegeln:

- Für `mainfile.php` und `secure.php`: Warnen Sie, dass Handbearbeitungen dieser Dateien überschrieben werden, wenn das Installationsprogramm erneut ausgeführt wird.
- Für die `xoops_data/configs/`-Dateien: Erklären Sie, dass lokale Anpassungen über Neustart und Upgrades erhalten bleiben, und dass das Wiederherstellen der Versandstandards das Löschen der Datei und das erneute Ausführen erfordert (oder das entsprechende `.dist.php` von Hand kopieren).

Generalisieren Sie nicht "vorhandene Dateien werden beibehalten" über alle vom Installationsprogramm geschriebenen Konfigurationsdateien — das ist falsch und würde Administratoren, die `mainfile.php` oder `secure.php` bearbeiten, in die Irre führen.

### 6.3 HTTPS und Reverse-Proxy-Handhabung geändert

Die generierte `mainfile.php` unterstützt jetzt ein umfassenderes Protokoll-Erkennung, einschließlich Reverse-Proxy-Header. Der Leitfaden sollte dies erwähnen, anstatt nur direkte `http`- oder `https`-Erkennung zu implizieren.

### 6.4 Tabellenzahl ist falsch

Das aktuelle Kapitel sagt, eine neue Webseite erstellt `32` Tabellen.

XOOPS 2.7.0 erstellt `33` Tabellen. Die fehlende Tabelle ist:

- `tokens`

Aktion:

- Aktualisieren Sie die Anzahl von 32 auf 33.
- Fügen Sie `tokens` zur Tabellenliste hinzu.

## 7. Kapitel 7: Verwaltungseinstellungen

Datei:

- `chapter-7-administration-settings.md`

### 7.1 Passwort-UI-Beschreibung ist veraltet

Das Installationsprogramm enthält weiterhin Passwort-Generierung, enthält aber jetzt auch:

- zxcvbn-basiertes Passwort-Stärkemeter
- visuelle Stärkebeschriftungen
- 16-Zeichen-Generator- und Kopierfluss

Aktualisieren Sie den Text und die Screenshots, um das aktuelle Passwort-Panel zu beschreiben.

### 7.2 E-Mail-Validierung wird jetzt erzwungen

Admin-E-Mail wird mit `FILTER_VALIDATE_EMAIL` überprüft. Das Kapitel sollte erwähnen, dass ungültige E-Mail-Werte abgelehnt werden.

### 7.3 Lizenzschlüssel-Sektion ist falsch

Dies ist eine der wichtigsten faktischen Korrektionen.

Der aktuelle Leitfaden sagt:

- es gibt einen `License System Key`
- es wird in `/include/license.php` gespeichert
- `/include/license.php` muss während der Installation beschreibbar sein

Das ist nicht länger genau.

Was 2.7.0 wirklich tut:

- Installation schreibt die Lizenzdaten in `xoops_data/data/license.php`
- `htdocs/include/license.php` ist jetzt nur noch ein veralteter Wrapper, der die Datei von `XOOPS_VAR_PATH` lädt
- die alte Formulierung über das Erstellen von `/include/license.php` als beschreibbar sollte entfernt werden

Aktion:

- Schreiben Sie diesen Abschnitt um, anstatt ihn zu löschen.
- Aktualisieren Sie den Pfad von `/include/license.php` zu `xoops_data/data/license.php`.

### 7.4 Design-Liste ist veraltet

Der aktuelle Leitfaden bezieht sich immer noch auf Zetagenesis und die älter 2.5-Ära Design-Set.

Designs in XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Beachten Sie auch:

- `xswatch4` ist das aktuelle Standard-Design, das von Installerdaten eingefügt wird.
- Zetagenesis ist nicht länger Teil der gepackten Design-Liste.

### 7.5 Modulliste ist veraltet

Module in der 2.7.0-Packung:

- `system` — automatisch während der Tabellenausfülls-/Dateneinsatzschritte installiert. Immer vorhanden, niemals im Picker sichtbar.
- `debugbar` — wählbar im Installer-Schritt.
- `pm` — wählbar im Installer-Schritt.
- `profile` — wählbar im Installer-Schritt.
- `protector` — wählbar im Installer-Schritt.

Wichtig: Die Modul-Installer-Seite (`htdocs/install/page_moduleinstaller.php`) erstellt ihre Kandidaten-Liste, indem sie `XoopsLists::getModulesList()` durchläuft und **alles bereits in der Modultabelle vorhandene filtert** (Zeilen 95-102 erfassen `$listed_mods`; Zeile 116 überspringt jedes Verzeichnis, das in dieser Liste vorhanden ist). Da `system` vor diesem Schritt installiert wird, erscheint es nie als Kontrollkästchen.

Erforderliche Leitfaden-Änderungen:

- Hören Sie auf zu sagen, dass es nur drei gebündelte Module gibt.
- Beschreiben Sie den Installer-Schritt als anzeigend **vier wählbare Module** (`debugbar`, `pm`, `profile`, `protector`), nicht fünf.
- Dokumentieren Sie `system` separat als das immer installierte Core-Modul, das nicht im Picker angezeigt wird.
- Fügen Sie `debugbar` zur gebündelten Moduls-Beschreibung als neu in 2.7.0 hinzu.
- Beachten Sie, dass die Standard-Modul-Vorauswahl des Installationsprogramms jetzt leer ist. Module sind verfügbar zum Auswählen, aber nicht im Installer-Konfiguration vorkonfiguriert.

## 8. Kapitel 8: Bereit zu gehen

Datei:

- `chapter-8-ready-to-go.md`

### 8.1 Installationsbereinigungsprozess muss umgeschrieben werden

Der aktuelle Leitfaden sagt, das Installationsprogramm benennt den Installationsordner in einen eindeutigen Namen um.

Dies ist tatsächlich noch in 2.7.0 wahr, aber der Mechanismus hat sich geändert:

- Ein externes Bereinigungs-Skript wird im Webroot erstellt
- Die endgültige Seite löst die Bereinigung via AJAX aus
- Installationsordner wird in `install_remove_<unique suffix>` umbenannt
- Fallback auf `cleanup.php` existiert noch

Aktion:

- Aktualisieren Sie die Erklärung.
- Halten Sie die Benutzer-gerichtete Anweisung einfach: Löschen Sie das umbenannte Installationsverzeichnis nach der Installation.

### 8.2 Admin-Dashboard-Anhang-Verweise sind veraltet

Kapitel 8 verweist die Leser immer noch auf die alte Oxygen-Ära Admin-Erfahrung. Dies muss mit den aktuellen Admin-Designs ausgerichtet werden:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Post-Install-Pfad-Bearbeitungs-Anleitung benötigt Korrektur

Derzeitiger Text teilt Lesern mit, `secure.php` mit Pfaddefinitionen zu aktualisieren. In 2.7.0 werden diese Pfad-Konstanten in `mainfile.php` definiert, während `secure.php` sichere Daten hält. Der Beispielblock in diesem Kapitel sollte dementsprechend korrigiert werden.

### 8.4 Produktionseinstellungen sollten hinzugefügt werden

Der Leitfaden sollte explizit die Produktions-Standardwerte erwähnen, die jetzt in `mainfile.dist.php` vorhanden sind:

- `XOOPS_DB_LEGACY_LOG` sollte `false` bleiben
- `XOOPS_DEBUG` sollte `false` bleiben

## 9. Kapitel 9: Bestehende XOOPS-Installation aktualisieren

Datei:

- `chapter-9-upgrade-existing-xoops-installation.md`

Dieses Kapitel erfordert die größte Umschreibung.

### 9.1 Obligatorischen Smarty 4 Preflight-Schritt hinzufügen

Das XOOPS 2.7.0 Upgrade-Flow erzwingt jetzt den Preflight-Prozess vor Upgrade-Abschluss.

Neuer erforderlicher Flow:

1. Kopieren Sie das `upgrade/`-Verzeichnis in den Webroot.
2. Führen Sie `/upgrade/preflight.php` aus.
3. Scannen Sie `/themes/` und `/modules/` auf alte Smarty-Syntax.
4. Verwenden Sie wenn möglich den optionalen Reparatur-Modus.
5. Führen Sie aus, bis sauber.
6. Fahren Sie in `/upgrade/` fort.

Das aktuelle Kapitel erwähnt dies überhaupt nicht, was es mit 2.7.0-Anleitung inkompatibel macht.

### 9.2 Die manuelle 2.5.2-Ära-Merge-Erzählung ersetzen

Das aktuelle Kapitel beschreibt immer noch ein manuelles 2.5.2-Stil-Upgrade mit Framework-Merges, AltSys-Hinweisen und Hand-verwalteter Datei-Umstrukturierung. Dies sollte durch die eigentliche 2.7.x-Upgrade-Sequenz aus `release_notes.txt` und `upgrade/README.md` ersetzt werden.

Empfohlene Kapitel-Gliederung:

1. Sichern Sie Dateien und Datenbank.
2. Deaktivieren Sie die Webseite.
3. Kopieren Sie `htdocs/` über den Live-Root.
4. Kopieren Sie `htdocs/xoops_lib` in den aktiven Bibliotheks-Pfad.
5. Kopieren Sie `htdocs/xoops_data` in den aktiven Daten-Pfad.
6. Kopieren Sie `upgrade/` zum Webroot.
7. Führen Sie `preflight.php` aus.
8. Führen Sie `/upgrade/` aus.
9. Komplettieren Sie Updater-Aufforderungen.
10. Aktualisieren Sie das `system`-Modul.
11. Aktualisieren Sie `pm`, `profile` und `protector`, falls installiert.
12. Löschen Sie `upgrade/`.
13. Aktivieren Sie die Webseite wieder.

### 9.3 Dokumentieren Sie echte 2.7.0 Upgrade-Änderungen

Der Updater für 2.7.0 enthält mindestens diese konkreten Änderungen:

- Erstellen Sie eine `tokens`-Tabelle
- Verbreitern Sie `bannerclient.passwd` für moderne Passwort-Hashes
- Fügen Sie Session-Cookie-Einstellungs-Voreinstellungen hinzu
- Entfernen Sie veraltete gebündelte Verzeichnisse

Der Leitfaden muss nicht alle Implementierungsdetails verfügbar machen, sollte aber nicht implizieren, dass das Upgrade nur eine Dateikopie plus Modul-Aktualisierung ist.

## 10. Historische Upgrade-Seiten

Dateien:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Status:** Die strukturelle Entscheidung ist bereits behoben — der Root `SUMMARY.md` verschiebt diese in einen dedizierten **Historische Upgrade-Hinweise**-Abschnitt, und jede Datei trägt einen "Historische Referenz"-Hinweis, der Leser zu Kapitel 9 für 2.7.0-Upgrades verweist. Sie sind nicht länger erstklassige Upgrade-Anleitung.

**Verbleibende Arbeit (Konsistenz nur):**

- Stellen Sie sicher, dass `README.md` (Root) diese unter der gleichen "Historische Upgrade-Hinweise"-Überschrift auflistet, nicht unter einer generischen "Upgrades"-Überschrift.
- Spiegeln Sie die gleiche Trennung in `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` und `en/SUMMARY.md`.
- Stellen Sie sicher, dass jede historische Upgrade-Seite (Root und die lokalisierten `de/book/upg*.md` / `fr/book/upg*.md`-Kopien) einen veralteter-Inhalt-Hinweis trägt, der auf Kapitel 9 zurückverweist.

## 11. Anhang 1: Admin GUI

Datei:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Dieser Anhang ist an die Oxygen Admin GUI gebunden und benötigt eine Umschreibung.

Erforderliche Änderungen:

- Ersetzen Sie alle Oxygen-Verweise
- Ersetzen Sie alte Icon/Menü-Screenshots
- Dokumentieren Sie die aktuellen Admin-Designs:
  - default
  - dark
  - modern
  - transition
- Erwähnen Sie aktuelle 2.7.0 Admin-Fähigkeiten, die in Release-Hinweisen aufgerufen werden:
  - Template-Overload-Fähigkeit in System Admin-Designs
  - aktualisierter Admin-Design-Set

## 12. Anhang 2: XOOPS über FTP hochladen

Datei:

- `appendix-2-uploading-xoops-via-ftp.md`

Erforderliche Änderungen:

- Entfernen Sie HostGator-spezifische und cPanel-spezifische Annahmen
- Modernisieren Sie die Datei-Upload-Formulierung
- Beachten Sie, dass `xoops_lib` jetzt Composer-Abhängigkeiten enthält, sodass Uploads größer sind und nicht selektiv gekürzt werden sollten

## 13. Anhang 5: Sicherheit

Datei:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Erforderliche Änderungen:

- Entfernen Sie die `register_globals`-Diskussion vollständig
- Entfernen Sie veraltete Host-Ticket-Sprache
- Korrigieren Sie Berechtigungen-Text von `404` zu `0444`, wo Nur-Lesen beabsichtigt ist
- Aktualisieren Sie die `mainfile.php`- und `secure.php`-Diskussion, um mit 2.7.0-Layout zu entsprechen
- Fügen Sie den neuen Cookie-Domain-Sicherheits-Kontext hinzu:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- Fügen Sie Produktions-Anleitung für folgende hinzu:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Cross-Sprach-Wartungs-Auswirkung

Nach der Behebung der englischen Root-Dateien sind gleichwertige Aktualisierungen erforderlich in:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

Der `en/` Baum benötigt auch eine Überprüfung, weil er ein separates README und Asset-Set enthält, aber nur einen teilweise `book/` Baum zu haben scheint.

## 15. Prioritäts-Reihenfolge

### Kritisch vor Veröffentlichung

1. Aktualisieren Sie Repo/Versions-Verweise auf 2.7.0.
2. Schreiben Sie Kapitel 9 um den echten 2.7.0-Upgrade-Flow und Smarty 4 Preflight.
3. Aktualisieren Sie Systemanforderungen auf PHP 8.2+ und MySQL 5.7.8+.
4. Korrigieren Sie Kapitel 7 Lizenzschlüssel-Dateipfad.
5. Korrigieren Sie Design- und Modul-Bestände.
6. Korrigieren Sie Kapitel 6 Tabellenzahl von 32 auf 33.

### Wichtig für Genauigkeit

7. Schreiben Sie Richtlinien für beschreibbare Pfade um.
8. Fügen Sie Composer-Autoloader-Anforderung zur Pfad-Einrichtung hinzu.
9. Aktualisieren Sie Datenbank-Zeichensatz-Anleitung auf `utf8mb4`.
10. Reparieren Sie Kapitel 8 Pfad-Bearbeitungs-Anleitung, damit Konstanten in der rechten Datei dokumentiert sind.
11. Entfernen Sie Checksum-Anweisungen.
12. Entfernen Sie `register_globals` und andere tote PHP-Anleitung.

### Veröffentlichungs-Qualitäts-Bereinigung

13. Ersetzen Sie alle Installer- und Admin-Screenshots.
14. Verschieben Sie historische Upgrade-Seiten aus dem Hauptfluss.
15. Synchronisieren Sie deutsche und französische Kopien, nachdem Englisch korrigiert ist.
16. Bereinigen Sie veraltete Links und duplizierte README-Zeilen.
