---
title: "MVC Patroon in XOOPS"
description: "Implementatie van Model-View-Controller-architectuur in XOOPS-modules"
---
<span class="version-badgeversion-xmf">XMF Vereist</span> <span class="version-badgeversion-40x">4.0.x Native</span>

:::note[Weet je niet zeker of dit het juiste patroon is?]
Zie [Een patroon voor gegevenstoegang kiezen](../Choosing-Data-Access-Pattern.md) voor richtlijnen over wanneer u MVC moet gebruiken in plaats van eenvoudigere patronen.
:::

:::let op[Verduidelijking: XOOPS-architectuur]
**Standaard XOOPS 2.5.x** gebruikt een **Page Controller**-patroon (ook wel transactiescript genoemd), niet MVC. Oudere modules gebruiken `index.php` met directe include, globale objecten (`$xoopsUser`, `$xoopsDB`) en handler-gebaseerde gegevenstoegang.

**Om MVC in XOOPS 2.5.x** te gebruiken, hebt u het **XMF Framework** nodig dat routerings- en controllerondersteuning biedt.

**XOOPS 4.0** ondersteunt standaard MVC met PSR-15 middleware en de juiste routering.

Zie ook: [Huidige XOOPS-architectuur](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Het Model-View-Controller-patroon (MVC) is een fundamenteel architectonisch patroon voor het scheiden van aandachtspunten in XOOPS-modules. Dit patroon verdeelt een applicatie in drie onderling verbonden componenten.

## MVC Uitleg

### Model
Het **Model** vertegenwoordigt de gegevens en bedrijfslogica van uw applicatie. Het:
- Beheert de persistentie van gegevens
- Implementeert bedrijfsregels
- Valideert gegevens
- Communiceert met de database
- Is onafhankelijk van de gebruikersinterface

### Bekijken
De **View** is verantwoordelijk voor het presenteren van gegevens aan de gebruiker. Het:
- Rendert HTML-sjablonen
- Geeft modelgegevens weer
- Verzorgt de presentatie van de gebruikersinterface
- Stuurt gebruikersacties naar de controller
- Moet minimale logica bevatten

### Controleur
De **Controller** handelt gebruikersinteracties af en coördineert tussen Model en Weergave. Het:
- Ontvangt gebruikersverzoeken
- Verwerkt invoergegevens
- Roept modelmethoden op
- Selecteert de juiste weergaven
- Beheert de applicatiestroom

## XOOPS Implementatie

In XOOPS wordt het MVC-patroon geïmplementeerd met behulp van handlers en sjablonen, waarbij de Smarty-engine sjabloonondersteuning biedt.

### Basismodelstructuur
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

### Implementatie van controllers
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

### Sjabloon bekijken
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Beste praktijken

- Behoud bedrijfslogica in modellen
- Houd de presentatie in weergaven  
- Routing/coördinatie behouden in Controllers
- Meng geen zorgen tussen lagen
- Valideer alle invoer op controllerniveau

## Gerelateerde documentatie

Zie ook:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) voor geavanceerde gegevenstoegang
- [Service-Layer](../Patterns/Service-Layer.md) voor bedrijfslogica-abstractie
- [Code-organisatie](../Best-Practices/Code-Organization.md) voor projectstructuur
- [Testen](../Best-Practices/Testing.md) voor MVC-teststrategieën

---

Tags: #mvc #patterns #architectuur #module-ontwikkeling #design-patterns