---
title: "Vzor MVC v XOOPS"
description: "Implementace architektury Model-View-Controller v modulech XOOPS"
---

<span class="version-badge version-xmf">Vyžadováno XMF</span> <span class="version-badge version-40x">4.0.x Nativní</span>

:::poznámka[Nejste si jisti, zda je to správný vzor?]
Pokyny k použití MVC a jednodušších vzorů naleznete v části [Výběr vzoru přístupu k datům](../Choosing-Data-Access-Pattern.md).
:::

:::upozornění[Upřesnění: Architektura XOOPS]
**Standardní XOOPS 2.5.x** používá vzor **Page Controller** (také nazývaný Transaction Script), nikoli MVC. Starší moduly používají `index.php` s přímým zahrnutím, globálními objekty (`$xoopsUser`, `$xoopsDB`) a přístupem k datům na základě obsluhy.

**Chcete-li použít MVC v XOOPS 2.5.x**, potřebujete **XMF Framework**, který poskytuje podporu směrování a řadiče.

**XOOPS 4.0** bude nativně podporovat MVC s middlewarem PSR-15 a správným směrováním.

Viz také: [Aktuální architektura XOOPS](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Vzor Model-View-Controller (MVC) je základním architektonickým vzorem pro oddělení zájmů v modulech XOOPS. Tento vzor rozděluje aplikaci na tři vzájemně propojené komponenty.

## MVC Vysvětlení

### Modelka
**Model** představuje data a obchodní logiku vaší aplikace. to:
- Spravuje perzistenci dat
- Implementuje obchodní pravidla
- Ověřuje data
- Komunikuje s databází
- Je nezávislý na uživatelském rozhraní

### Zobrazit
**View** odpovídá za prezentaci dat uživateli. to:
- Vykresluje šablony HTML
- Zobrazuje data modelu
- Zvládá prezentaci uživatelského rozhraní
- Odesílá uživatelské akce do ovladače
- Měl by obsahovat minimální logiku

### Ovladač
**Ovladač** zpracovává uživatelské interakce a souřadnice mezi modelem a pohledem. to:
- Přijímá požadavky uživatelů
- Zpracovává vstupní data
- Volání metod modelu
- Vybírá vhodné pohledy
- Řídí tok aplikací

## Implementace XOOPS

V XOOPS je vzor MVC implementován pomocí ovladačů a šablon s enginem Smarty poskytujícím podporu šablon.

### Základní struktura modelu
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

### Implementace ovladače
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

### Zobrazit šablonu
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Nejlepší postupy

- Udržujte obchodní logiku v Modelech
- Udržujte prezentaci v zobrazeních  
- Ponechejte routing/coordination v ovladačích
- Nemíchejte obavy mezi vrstvami
- Ověřte všechny vstupy na úrovni ovladače

## Související dokumentace

Viz také:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) pro pokročilý přístup k datům
- [Service-Layer](../Patterns/Service-Layer.md) pro abstrakci obchodní logiky
- [Code-Organization](../Best-Practices/Code-Organization.md) pro strukturu projektu
- [Testování](../Best-Practices/Testing.md) pro strategie testování MVC

---

Tagy: #mvc #patterns #architecture #module-development #design-patterns