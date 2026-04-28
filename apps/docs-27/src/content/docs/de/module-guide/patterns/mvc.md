---
title: "MVC-Muster in XOOPS"
description: "Model-View-Controller-Architektur-Implementierung in XOOPS-Modulen"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[Not sicher, ob dies das richtige Muster ist?]
Siehe [Auswahl eines Datenzugriffsmuster](../Choosing-Data-Access-Pattern.md) für Hinweise zur Verwendung von MVC vs. einfacheren Mustern.
:::

:::caution[Klarstellung: XOOPS-Architektur]
**Standard-XOOPS 2.5.x** verwendet ein **Page Controller**-Muster (auch als Transaction Script bezeichnet), nicht MVC. Legacy-Module verwenden `index.php` mit direkten Includes, globalen Objekten (`$xoopsUser`, `$xoopsDB`) und Handler-basiertem Datenzugriff.

**Um MVC in XOOPS 2.5.x zu verwenden**, benötigen Sie das **XMF Framework**, das Routing und Controller-Unterstützung bietet.

**XOOPS 4.0** wird nativ MVC mit PSR-15-Middleware und ordnungsgemäßem Routing unterstützen.

Siehe auch: [Aktuelle XOOPS-Architektur](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Das Model-View-Controller (MVC)-Muster ist ein grundlegendes Architekturmuster zur Trennung von Bedenken in XOOPS-Modulen. Dieses Muster teilt eine Anwendung in drei miteinander verbundene Komponenten auf.

## MVC-Erklärung

### Modell
Das **Modell** stellt die Daten und die Geschäftslogik Ihrer Anwendung dar. Es:
- Verwaltet die Datenpersistenz
- Implementiert Geschäftsregeln
- Validiert Daten
- Kommuniziert mit der Datenbank
- Ist unabhängig von der Benutzeroberfläche

### Ansicht
Die **Ansicht** ist für die Darstellung von Daten für den Benutzer verantwortlich. Sie:
- Rendert HTML-Templates
- Zeigt Modelldaten an
- Behandelt die Präsentation der Benutzeroberfläche
- Sendet Benutzeraktionen an den Controller
- Sollte minimale Logik enthalten

### Regler
Der **Controller** verarbeitet Benutzerinteraktionen und koordiniert zwischen Modell und Ansicht. Er:
- Empfängt Benutzeranfragen
- Verarbeitet Eingabedaten
- Ruft Modellmethoden auf
- Wählt geeignete Ansichten aus
- Verwaltet den Anwendungsfluss

## XOOPS-Implementierung

In XOOPS wird das MVC-Muster mit Handlern und Templates implementiert, wobei die Smarty-Engine Template-Unterstützung bietet.

### Grundlegende Modellstruktur
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### Controller-Implementierung
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### View-Template
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Best Practices

- Halten Sie Geschäftslogik in Modellen
- Halten Sie Präsentation in Ansichten
- Halten Sie Routing/Koordination in Controllern
- Vermischen Sie keine Bedenken zwischen Schichten
- Validieren Sie alle Eingaben auf Controller-Ebene

## Verwandte Dokumentation

Siehe auch:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) für erweiterten Datenzugriff
- [Service-Layer](../Patterns/Service-Layer.md) für Abstrahierung von Geschäftslogik
- [Code-Organization](../Best-Practices/Code-Organization.md) für Projektstruktur
- [Testing](../Best-Practices/Testing.md) für MVC-Test-Strategien

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
