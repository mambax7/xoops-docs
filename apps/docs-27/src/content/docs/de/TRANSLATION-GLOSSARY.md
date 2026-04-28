---
title: "Übersetzungsglossар — XOOPS Deutsch"
description: "Verbindliche Terminologie für die deutsche XOOPS-Dokumentation. Alle Übersetzer und Redakteure sollten diese Begriffe einheitlich verwenden."
---

# Übersetzungsglossар — XOOPS Deutsch

Dieses Glossar legt die **verbindliche deutsche Terminologie** für alle XOOPS-Dokumentationsdateien fest. Ziel ist eine konsistente Sprache über alle Dateien hinweg. Begriffe, die **nicht übersetzt** werden sollen, sind in der Spalte „Deutsch" mit dem Originalterm aufgeführt.

---

## Leitprinzipien

1. **Fachbegriffe, die im Deutschen als Lehnwort etabliert sind**, werden nicht übersetzt (z. B. *Cache*, *Template*, *Hook*, *Plugin*).
2. **Produktnamen und Eigennamen** werden nie übersetzt (XOOPS, PHP, Smarty, MySQL, MariaDB, Composer, Apache, Nginx, XMF, Ray).
3. **Abkürzungen** behalten ihre englische Form (API, MVC, DTO, CSRF, XSS, JWT, CLI, FTP, SSH, CDN, OOP, PSR).
4. **Codebezeichner** (Klassen-, Methoden-, Variablennamen) werden niemals übersetzt.
5. Im Zweifel gilt: Lesbarkeit für deutschsprachige PHP-Entwickler geht vor wörtlicher Übersetzung.

---

## Kernkonzepte von XOOPS

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Module | Modul | Pl.: Module |
| Block | Block | Pl.: Blöcke |
| Theme | Theme | Nicht „Thema" — im CMS-Kontext etabliertes Lehnwort |
| Template | Template | Nicht „Vorlage" — zu generisch |
| Hook | Hook | Pl.: Hooks |
| Event | Ereignis | Oder „Event" wenn im Code-Kontext |
| Plugin | Plugin | Pl.: Plugins |
| Handler | Handler | Pl.: Handler |
| Preload | Preload | Technischer Begriff, bleibt englisch |
| Core | Kern | Oder „Core" wenn als Eigenname (XOOPS Core) |
| Trust path | Trust-Pfad | |
| Web path | Web-Pfad | |
| Root path | Wurzelpfad | |
| Module manifest | Modul-Manifest | |
| Module version file | Modul-Versionsdatei | |
| Block position | Blockposition | |
| Side block | Seitenblock | |
| Center block | Zentralblock | |

---

## Benutzerverwaltung & Berechtigungen

| Englisch | Deutsch | Hinweis |
|---|---|---|
| User | Benutzer | Pl.: Benutzer |
| Admin / Administrator | Administrator | |
| Group | Gruppe | Pl.: Gruppen |
| Permission | Berechtigung | Pl.: Berechtigungen |
| Role | Rolle | Pl.: Rollen |
| Authentication | Authentifizierung | |
| Authorization | Autorisierung | |
| Login | Anmeldung | Verb: sich anmelden |
| Logout | Abmeldung | Verb: sich abmelden |
| Password | Passwort | |
| Session | Sitzung | |
| Token | Token | Pl.: Token (nicht „Tokens") |
| Avatar | Avatar | |
| Rank | Rang | |
| Registration | Registrierung | |
| Profile | Profil | |
| Anonymous user | Anonymer Benutzer | |

---

## Datenbankschicht

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Database | Datenbank | Abk.: DB |
| Table | Tabelle | |
| Row / Record | Datensatz | „Zeile" nur im Kontext von Rohdaten |
| Column / Field | Spalte / Feld | |
| Primary key | Primärschlüssel | |
| Foreign key | Fremdschlüssel | |
| Index | Index | Pl.: Indizes |
| Query | Abfrage | Oder „Query" wenn direkt auf SQL bezogen |
| Query Builder | Query-Builder | Eigenname, bleibt englisch |
| Criteria | Kriterien | Singular: Kriterium |
| Result set | Ergebnismenge | |
| Connection | Verbindung | |
| Migration | Migration | |
| Schema | Schema | |
| Transaction | Transaktion | |
| Stored procedure | Gespeicherte Prozedur | |
| Pagination | Paginierung | |
| Sorting | Sortierung | |
| Filtering | Filterung | |

---

## Architektur & Entwurfsmuster

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Architecture | Architektur | |
| Design pattern | Entwurfsmuster | |
| MVC (Model-View-Controller) | MVC (Modell-View-Controller) | Abk. bleibt MVC |
| Repository pattern | Repository-Muster | |
| Service layer | Service-Schicht | |
| Domain model | Domain-Modell | |
| DTO (Data Transfer Object) | DTO (Datentransferobjekt) | Abk. DTO |
| Unit of Work | Unit-of-Work | Eigenname, bleibt englisch |
| Dependency Injection | Dependency Injection | Abk. DI |
| Active Record | Active Record | Eigenname |
| Observer | Observer | Entwurfsmuster-Eigenname |
| Factory | Factory | Entwurfsmuster-Eigenname |
| Singleton | Singleton | Entwurfsmuster-Eigenname |
| Middleware | Middleware | Pl.: Middlewares |
| Interface | Schnittstelle | Im PHP-Kontext auch „Interface" |
| Abstract class | Abstrakte Klasse | |
| Trait | Trait | Pl.: Traits |
| Namespace | Namespace | |
| Autoloader | Autoloader | |

---

## Sicherheit

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Security | Sicherheit | |
| CSRF (Cross-Site Request Forgery) | CSRF | Abk. bleibt CSRF |
| XSS (Cross-Site Scripting) | XSS | Abk. bleibt XSS |
| SQL injection | SQL-Injection | |
| Input sanitization | Eingabe-Bereinigung | |
| Input validation | Eingabe-Validierung | |
| Escaping | Escaping | Technischer Begriff |
| Hashing | Hashing | |
| Encryption | Verschlüsselung | |
| SSL / TLS | SSL / TLS | |
| HTTPS | HTTPS | |
| Firewall | Firewall | |
| Hardening | Absicherung | |
| Vulnerability | Sicherheitslücke | |
| Exploit | Exploit | |
| Brute force | Brute-Force | |
| Rate limiting | Ratenbegrenzung | |
| Two-factor authentication (2FA) | Zwei-Faktor-Authentifizierung (2FA) | |

---

## Templates & Themes

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Template engine | Template-Engine | |
| Template variable | Template-Variable | |
| Template cache | Template-Cache | |
| Layout | Layout | |
| Smarty block | Smarty-Block | |
| Smarty modifier | Smarty-Modifikator | |
| Smarty plugin | Smarty-Plugin | |
| Stylesheet | Stylesheet | |
| Breakpoint | Breakpoint | |
| Responsive design | Responsives Design | |
| Asset | Asset | Pl.: Assets |
| Minification | Minifizierung | |

---

## Formulare & Validierung

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Form | Formular | |
| Form element | Formularelement | |
| Form validation | Formularvalidierung | |
| Input | Eingabe | Oder „Input" im HTML-Kontext |
| Checkbox | Kontrollkästchen | Oder „Checkbox" in technischen Kontexten |
| Dropdown / Select | Auswahlfeld | |
| Radio button | Optionsfeld | |
| Submit button | Absenden-Schaltfläche | |
| Error message | Fehlermeldung | |
| Required field | Pflichtfeld | |
| Custom renderer | Benutzerdefinierter Renderer | |

---

## Administration & Konfiguration

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Admin panel | Admin-Panel | Oder „Verwaltungsbereich" in Fließtext |
| Dashboard | Dashboard | |
| Settings | Einstellungen | |
| Configuration | Konfiguration | |
| System settings | Systemeinstellungen | |
| Preferences | Einstellungen | |
| Module management | Modulverwaltung | |
| User management | Benutzerverwaltung | |
| Cache management | Cacheverwaltung | |
| Log | Protokoll | Verb: protokollieren |
| Debug mode | Debug-Modus | |
| Maintenance mode | Wartungsmodus | |
| Backup | Datensicherung | Oder „Backup" in technischen Kontexten |
| Restore | Wiederherstellung | |
| Upgrade | Aktualisierung | Oder „Upgrade" wenn Eigenname |
| Install / Installation | Installation | Verb: installieren |
| Uninstall | Deinstallation | |
| Activate | Aktivieren | |
| Deactivate | Deaktivieren | |

---

## Entwicklerwerkzeuge & Infrastruktur

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Command line / CLI | Befehlszeile / CLI | |
| Shell | Shell | |
| Script | Skript | |
| Cron job | Cron-Job | |
| Cache | Cache | Verb: zwischenspeichern |
| CDN | CDN | |
| API | API | |
| REST | REST | |
| Endpoint | Endpunkt | |
| Payload | Payload | Technischer Begriff |
| Response | Antwort | |
| Request | Anfrage | |
| Header | Header | Im HTTP-Kontext |
| Callback | Callback | |
| Dependency | Abhängigkeit | |
| Composer package | Composer-Paket | |
| Unit test | Unit-Test | |
| Integration test | Integrationstest | |
| Code smell | Code Smell | Eigenname aus der Fachliteratur |
| Refactoring | Refactoring | |
| Linting | Linting | |
| CI/CD | CI/CD | |
| Pull request | Pull Request | |
| Branch | Branch | Im Git-Kontext |
| Commit | Commit | Im Git-Kontext |
| Release | Release | |
| Changelog | Changelog | |
| Deprecation | Veraltung | Adjektiv: veraltet |

---

## Inhalt & Benutzererfahrung

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Content | Inhalt | |
| Article | Artikel | |
| Category | Kategorie | |
| Tag | Schlagwort | Oder „Tag" in technischen Kontexten |
| Comment | Kommentar | |
| Notification | Benachrichtigung | |
| Breadcrumb | Breadcrumb | Oder „Navigationspfad" in Fließtext |
| Pagination | Seitennavigation | Oder „Paginierung" |
| Search | Suche | |
| Filter | Filter | |
| Sort | Sortieren | |
| Upload | Hochladen | Substantiv: Upload |
| Download | Herunterladen | Substantiv: Download |

---

## Fehlerbehebung

| Englisch | Deutsch | Hinweis |
|---|---|---|
| Error | Fehler | |
| Warning | Warnung | |
| Notice | Hinweis | Im PHP-Kontext auch „Notice" |
| Exception | Ausnahme | Oder „Exception" im Code-Kontext |
| Stack trace | Stack-Trace | |
| White screen of death | White Screen of Death | Eigenname, Abk. WSOD |
| Debugging | Debuggen | |
| Troubleshooting | Fehlerbehebung | |
| Log file | Protokolldatei | |
| Error message | Fehlermeldung | |
| Workaround | Workaround | Oder „Behelfslösung" in Fließtext |
| Known issue | Bekanntes Problem | |
| Bug | Fehler / Bug | „Bug" im informellen Kontext akzeptabel |
| Fix | Behebung | Verb: beheben |

---

## Häufige Konstruktionen

Einige Phrasen tauchen in der Dokumentation wiederholt auf. Hier die bevorzugte Übersetzung:

| Englisch | Deutsch |
|---|---|
| For example, … | Zum Beispiel … |
| Note: … | Hinweis: … |
| Warning: … | Warnung: … |
| Tip: … | Tipp: … |
| See also | Siehe auch |
| Learn more | Weitere Informationen |
| Getting started | Erste Schritte |
| Best practices | Best Practices |
| Step-by-step | Schritt für Schritt |
| In this section | In diesem Abschnitt |
| As of version X | Ab Version X |
| Deprecated since X | Veraltet seit X |
| This is required | Dies ist erforderlich |
| This is optional | Dies ist optional |
| Make sure that … | Stellen Sie sicher, dass … |
| It is recommended to … | Es wird empfohlen, … |

---

*Letzte Aktualisierung: April 2026 — Bei Unklarheiten oder Ergänzungsvorschlägen bitte ein Issue im XOOPS-Repository öffnen.*
