---
title: "Pattern MVC in XOOPS"
description: "Implementazione dell'architettura Model-View-Controller nei moduli XOOPS"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[Non sei sicuro se questo sia il pattern giusto?]
Vedi [Scelta di un Modello di Accesso ai Dati](../Choosing-Data-Access-Pattern.md) per una guida su quando usare MVC vs pattern più semplici.
:::

:::caution[Chiarimento: Architettura XOOPS]
**XOOPS 2.5.x Standard** usa un pattern **Page Controller** (anche chiamato Transaction Script), non MVC. I moduli legacy usano `index.php` con include diretti, oggetti globali (`$xoopsUser`, `$xoopsDB`) e accesso ai dati basato su handler.

**Per usare MVC in XOOPS 2.5.x**, hai bisogno del **XMF Framework** che fornisce routing e supporto ai controller.

**XOOPS 4.0** supporterà nativamente MVC con middleware PSR-15 e routing appropriato.

Vedi anche: [Architettura XOOPS Attuale](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Il pattern Model-View-Controller (MVC) è un pattern architetturale fondamentale per la separazione dei compiti nei moduli XOOPS. Questo pattern divide un'applicazione in tre componenti interconnessi.

## Spiegazione MVC

### Model
Il **Model** rappresenta i dati e la logica di business della tua applicazione. È:
- Gestisce la persistenza dei dati
- Implementa regole di business
- Valida i dati
- Comunica con il database
- È indipendente dall'UI

### View
La **View** è responsabile della presentazione dei dati all'utente. È:
- Renderizza i template HTML
- Visualizza i dati del model
- Gestisce la presentazione dell'interfaccia utente
- Invia le azioni dell'utente al controller
- Dovrebbe contenere logica minima

### Controller
Il **Controller** gestisce le interazioni dell'utente e coordina tra Model e View. È:
- Riceve richieste dell'utente
- Elabora i dati di input
- Chiama i metodi del model
- Seleziona le view appropriate
- Gestisce il flusso dell'applicazione

## Implementazione XOOPS

In XOOPS, il pattern MVC è implementato usando handler e template con il motore Smarty che fornisce supporto ai template.

### Struttura di Base del Model
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

### Implementazione del Controller
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

### Template View
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Migliori Pratiche

- Mantieni la logica di business nei Model
- Mantieni la presentazione nelle View
- Mantieni il routing/coordinamento nei Controller
- Non mescolare i compiti tra i livelli
- Valida tutto l'input a livello del Controller

## Documentazione Correlata

Vedi anche:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) per l'accesso ai dati avanzato
- [Service-Layer](../Patterns/Service-Layer.md) per l'astrazione della logica di business
- [Code-Organization](../Best-Practices/Code-Organization.md) per la struttura del progetto
- [Testing](../Best-Practices/Testing.md) per le strategie di testing MVC

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
