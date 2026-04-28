---
title: "Anhang 3: XOOPS in eine lokale Sprache übersetzen"
---

XOOPS 2.7.0 wird mit nur englischen Sprachdateien ausgeliefert. Übersetzungen in andere Sprachen werden von der Gemeinschaft gepflegt und über GitHub und verschiedene lokale XOOPS Unterstützungsseiten verteilt.

## Wo man bestehende Übersetzungen findet

- **GitHub** — Gemeinschafts-Übersetzungen werden zunehmend als separate Repositories unter der [XOOPS-Organisation](https://github.com/XOOPS) und auf den Konten einzelner Beiträger veröffentlicht. Suche auf GitHub nach `xoops-language-<deine-sprache>` oder durchsuche die XOOPS-Organisation nach aktuellen Paketen.
- **Lokale XOOPS Unterstützungsseiten** — viele regionale XOOPS-Gemeinschaften veröffentlichen Übersetzungen auf ihren eigenen Seiten. Besuche [https://xoops.org](https://xoops.org) und folge den Links zu lokalen Gemeinschaften.
- **Modul-Übersetzungen** — Übersetzungen für einzelne Gemeinschaftsmodule leben normalerweise neben dem Modul selbst in der `XoopsModules25x` GitHub-Organisation (die `25x` im Namen ist historisch; Module dort werden für XOOPS 2.5.x und 2.7.x gepflegt).

Wenn eine Übersetzung für deine Sprache bereits vorhanden ist, lege die Sprache-Verzeichnisse in deine XOOPS-Installation (siehe "Wie man eine Übersetzung installiert" unten).

## Was übersetzt werden muss

XOOPS 2.7.0 hält Sprachdateien neben dem Code, der sie verbraucht. Eine vollständige Übersetzung deckt alle diese Orte ab:

- **Kern** — `htdocs/language/english/` — Site-weite Konstanten, die von jeder Seite verwendet werden (Login, häufige Fehler, Daten, Mail-Vorlagen usw.).
- **Installer** — `htdocs/install/language/english/` — Strings, die vom Installations-Wizard angezeigt werden. Übersetze diese *bevor* du den Installer ausführst, wenn du ein lokalisiertes Installationserlebnis möchtest.
- **System Modul** — `htdocs/modules/system/language/english/` — bei weitem die größte Menge; deckt das gesamte Admin-Control Panel ab.
- **Gebündelte Module** — jedes von `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` und `htdocs/modules/debugbar/language/english/`.
- **Themes** — einige Themes liefern ihre eigenen Sprachdateien; überprüfe `htdocs/themes/<theme>/language/` falls vorhanden.

Eine "Kern-Only" Übersetzung ist die kleinste nützliche Einheit und entspricht den ersten zwei Kugelpunkten oben.

## Wie man übersetzt

1. Kopiere das `english/` Verzeichnis neben es und benenne die Kopie nach deiner Sprache um. Der Verzeichnisname sollte der englische Kleinbuchstabenname der Sprache sein (`spanish`, `german`, `french`, `japanese`, `arabic` usw.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Öffne jede `.php` Datei im neuen Verzeichnis und übersetze die **String-Werte** in den `define()` Aufrufen. Ändere NICHT die Konstanten-Namen — sie werden von PHP-Code überall in der Kern referenziert.

   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Speichere jede Datei als UTF-8 *ohne* BOM.** XOOPS 2.7.0 nutzt `utf8mb4` durchgehend (Datenbank, Sessions, Output) und lehnt Dateien mit einer Byte-Order-Mark ab. In Notepad++ ist dies die **"UTF-8"** Option, *nicht* "UTF-8-BOM". In VS Code ist es Standard; nur das Encoding in der Statusleiste bestätigen.

4. Aktualisiere die Sprach- und Charset-Metadaten am Anfang jeder Datei, um mit deiner Sprache übereinzustimmen:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` sollte der [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) Code für deine Sprache sein. `_CHARSET` ist immer `UTF-8` in XOOPS 2.7.0 — es gibt keine ISO-8859-1 Variante mehr.

5. Wiederhole für den Installer, das System Modul und irgendwelche gebündelten Module, die du brauchst.

## Wie man eine Übersetzung installiert

Wenn du eine fertige Übersetzung als Verzeichnis-Baum erhalten hast:

1. Kopiere jedes `<language>/` Verzeichnis in die passende `language/english/` Parent in deiner XOOPS-Installation. Zum Beispiel, kopiere `language/spanish/` in `htdocs/language/`, `install/language/spanish/` in `htdocs/install/language/` usw.
2. Stelle sicher, dass Dateiberechtigung von dem Webserver lesbar sind.
3. Entweder wähle die neue Sprache bei der Installation (der Wizard scannt `htdocs/language/` auf verfügbare Sprachen) oder, auf einer bestehenden Seite, ändere die Sprache in **Admin → System → Preferences → General Settings**.

## Deine Übersetzung zurück teilen

Bitte trage deine Übersetzung zur Gemeinschaft bei.

1. Erstelle ein GitHub Repository (oder forke ein bestehendes Sprach-Repository, falls eins für deine Sprache vorhanden ist).
2. Nutze einen klaren Namen wie `xoops-language-<language-code>` (z.B. `xoops-language-es`, `xoops-language-pt-br`).
3. Spiegele die XOOPS Verzeichnis-Struktur in deinem Repository, damit Dateien ausrichten, wo sie kopiert werden:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Schließe eine `README.md` ein, die dokumentiert:
   - Sprach-Name und ISO-Code
   - XOOPS Versions-Kompatibilität (z.B. `XOOPS 2.7.0+`)
   - Übersetzer und Credits
   - Ob die Übersetzung Kern-Only oder gebündelte Module deckt
5. Öffne einen Pull Request gegen das relevante Modul/Kern Repository auf GitHub oder veröffentliche eine Ankündigung auf [https://xoops.org](https://xoops.org), damit die Gemeinschaft es finden kann.

> **Note**
>
> Falls deine Sprache Änderungen zum Kern für Datums- oder Kalender-Formatierung erfordert, schließe diese Änderungen im Paket ein. Sprachen mit Rechts-zu-Links Skripten (Arabisch, Hebräisch, Persisch, Urdu) funktionieren in XOOPS 2.7.0 direkt — RTL Unterstützung wurde in dieser Release hinzugefügt und einzelne Themes holen es automatisch ab.
