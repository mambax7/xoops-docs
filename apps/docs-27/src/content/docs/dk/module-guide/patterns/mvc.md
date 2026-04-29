---
title: "MVC mønster i XOOPS"
description: "Model-View-Controller-arkitekturimplementering i XOOPS-moduler"
---

<span class="version-badge version-xmf">XMF Påkrævet</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[Ikke sikker på om dette er det rigtige mønster?]
Se [Valg af et dataadgangsmønster](../Choosing-Data-Access-Pattern.md) for vejledning om, hvornår du skal bruge MVC vs. enklere mønstre.
:::

:::forsigtig[Afklaring: XOOPS arkitektur]
**Standard XOOPS 2.5.x** bruger et **Page Controller**-mønster (også kaldet Transaction Script), ikke MVC. Ældre moduler bruger `index.php` med direkte inkluderer, globale objekter (`$xoopsUser`, `$xoopsDB`) og handler-baseret dataadgang.

**For at bruge MVC i XOOPS 2.5.x**, har du brug for **XMF Framework**, som giver routing og controllerunderstøttelse.

**XOOPS 4.0** vil indbygget understøtte MVC med PSR-15 middleware og korrekt routing.

Se også: [Nuværende XOOPS-arkitektur](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Model-View-Controller-mønsteret (MVC) er et grundlæggende arkitektonisk mønster til at adskille bekymringer i XOOPS-moduler. Dette mønster opdeler en applikation i tre indbyrdes forbundne komponenter.

## MVC Forklaring

### Model
**Modellen** repræsenterer dataene og forretningslogikken i din applikation. Det:
- Styrer datapersistens
- Implementerer forretningsregler
- Validerer data
- Kommunikerer med databasen
- Er uafhængig af brugergrænsefladen

### Se
**Visningen** er ansvarlig for at præsentere data for brugeren. Det:
- Gengiver HTML skabeloner
- Viser modeldata
- Håndterer brugergrænsefladepræsentation
- Sender brugerhandlinger til controlleren
- Bør indeholde minimal logik

### Controller
**Controlleren** håndterer brugerinteraktioner og koordinerer mellem Model og View. Det:
- Modtager brugeranmodninger
- Behandler inputdata
- Kalder modelmetoder
- Vælger passende visninger
- Styrer applikationsflow

## XOOPS Implementering

I XOOPS er MVC-mønsteret implementeret ved hjælp af handlere og skabeloner med Smarty-motoren, der giver skabelonunderstøttelse.

### Grundlæggende modelstruktur
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

### Controllerimplementering
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

### Se skabelon
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Bedste praksis

- Bevar forretningslogikken i modeller
- Hold præsentationen i Views  
- Hold routing/koordinering i Controllere
- Bland ikke bekymringer mellem lag
- Valider alle input på controllerniveau

## Relateret dokumentation

Se også:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) til avanceret dataadgang
- [Service-Layer](../Patterns/Service-Layer.md) til abstraktion af forretningslogik
- [Code-Organisation](../Best-Practices/Code-Organization.md) til projektstruktur
- [Test](../Best-Practices/Testing.md) for MVC teststrategier

---

Tags: #mvc #mønstre #arkitektur #modul-udvikling #design-mønstre
