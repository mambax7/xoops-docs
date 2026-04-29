---
title: "MVC Vzorec v XOOPS"
description: "Implementacija arhitekture Model-View-Controller v XOOPS modulih"
---
<span class="version-badge version-XMF">XMF Zahtevano</span> <span class="version-badge version-40x">4.0.x Native</span>

:::opomba[Niste prepričani, ali je to pravi vzorec?]
Glejte [Izbira vzorca za dostop do podatkov](../Choosing-Data-Access-Pattern.md) za navodila o tem, kdaj uporabiti MVC v primerjavi s preprostejšimi vzorci.
:::

:::pozor [Pojasnilo: XOOPS Arhitektura]
**Standard XOOPS 2.5.x** uporablja vzorec **Page Controller** (imenovan tudi transakcijski skript), ne MVC. Podedovani moduli uporabljajo `index.php` z neposrednimi vključitvami, globalnimi objekti (`$xoopsUser`, `$xoopsDB`) in dostopom do podatkov na podlagi upravljavca.

**Za uporabo MVC v XOOPS 2.5.x** potrebujete **XMF Framework**, ki zagotavlja podporo za usmerjanje in krmilnik.

**XOOPS 4.0** bo izvorno podpiral MVC z vmesno programsko opremo PSR-15 in pravilnim usmerjanjem.

Glej tudi: [Trenutna XOOPS arhitektura](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Vzorec Model-View-Controller (MVC) je temeljni arhitekturni vzorec za ločevanje zadev v modulih XOOPS. Ta vzorec razdeli aplikacijo na tri med seboj povezane komponente.

## MVC Pojasnilo

### Model
**Model** predstavlja podatke in poslovno logiko vaše aplikacije. To:
- Upravlja obstojnost podatkov
- Izvaja pravila poslovanja
- Potrjuje podatke
- Komunicira z bazo podatkov
- Je neodvisen od uporabniškega vmesnika### Pogled
**Pogled** je odgovoren za predstavitev podatkov uporabniku. To:
- Upodablja HTML predlog
- Prikaže podatke o modelu
- Obvladuje predstavitev uporabniškega vmesnika
- Pošilja dejanja uporabnika krmilniku
- Vsebovati mora minimalno logiko

### Krmilnik
**Krmilnik** upravlja uporabniške interakcije in koordinate med modelom in pogledom. To:
- Sprejema zahteve uporabnikov
- Obdeluje vhodne podatke
- Kliče metode modela
- Izbere ustrezne poglede
- Upravlja pretok aplikacij

## XOOPS Implementacija

V XOOPS je vzorec MVC implementiran z obdelovalniki in predlogami z motorjem Smarty, ki zagotavlja podporo za predloge.

### Osnovna struktura modela
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
### Implementacija krmilnika
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
### Prikaži predlogo
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```
## Najboljše prakse

- Ohranite poslovno logiko v modelih
- Ohranite predstavitev v Pogledih  
- Hranite routing/coordination v krmilnikih
- Ne mešajte skrbi med plastmi
- Preverjanje vseh vnosov na ravni krmilnika

## Povezana dokumentacija

Glej tudi:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za napreden dostop do podatkov
- [Storitvena plast](../Patterns/Service-Layer.md) za abstrakcijo poslovne logike
- [Code-Organization](../Best-Practices/Code-Organization.md) za strukturo projekta
- [Testiranje](../Best-Practices/Testing.md) za MVC strategije testiranja

---

Oznake: #mvc #vzorci #arhitektura #razvoj modulov #vzorci-oblikovanje