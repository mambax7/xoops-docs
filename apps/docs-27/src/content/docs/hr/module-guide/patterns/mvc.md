---
title: "MVC uzorak u XOOPS"
description: "Implementacija arhitekture Model-View-Controller u XOOPS modules"
---
<span class="version-badge version-xmf">Potreban XMF</span> <span class="version-badge version-40x">4.0.x izvorni</span>

:::note[Niste sigurni je li ovo pravi uzorak?]
Pogledajte [Odabir uzorka za pristup podacima](../Choosing-Data-Access-Pattern.md) za smjernice o tome kada koristiti MVC u odnosu na jednostavnije uzorke.
:::

:::oprez[Pojašnjenje: XOOPS Arhitektura]
**Standardni XOOPS 2.5.x** koristi obrazac **Kontroler stranice** (koji se naziva i Transakcijska skripta), a ne MVC. Naslijeđeni modules koristi `index.php` s izravnim includes, globalnim objektima (`$xoopsUser`, `$xoopsDB`) i pristupom podacima na temelju rukovatelja.

**Za korištenje MVC u XOOPS 2.5.x** potreban vam je **XMF Framework** koji pruža podršku za usmjeravanje i kontroler.

**XOOPS 4.0** izvorno će podržavati MVC sa PSR-15 srednjim softverom i pravilnim usmjeravanjem.

Vidi također: [Trenutna XOOPS arhitektura](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Uzorak Model-View-Controller (MVC) temeljni je arhitektonski obrazac za odvajanje problema u XOOPS modules. Ovaj obrazac dijeli aplikaciju na tri međusobno povezane komponente.

## MVC Objašnjenje

### Model
**Model** predstavlja podatke i poslovnu logiku vaše aplikacije. To:
- Upravlja postojanošću podataka
- Provodi poslovna pravila
- Provjerava podatke
- Komunicira s bazom podataka
- Neovisan je o korisničkom sučelju

### Pogled
**View** je odgovoran za predstavljanje podataka korisniku. To:
- Renderira HTML templates
- Prikazuje podatke o modelu
- Rukuje prezentacijom korisničkog sučelja
- Šalje radnje korisnika kontroleru
- Trebao bi sadržavati minimalnu logiku

### Upravljač
**Kontroler** upravlja interakcijama korisnika i koordinira između modela i prikaza. To:
- Prima zahtjeve korisnika
- Obrađuje ulazne podatke
- Poziva metode modela
- Odabire odgovarajuće poglede
- Upravlja protokom aplikacija

## XOOPS Implementacija

U XOOPS, uzorak MVC implementiran je pomoću rukovatelja i templates s motorom Smarty koji pruža podršku za predložak.

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

### Implementacija kontrolera
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

### Prikaži predložak
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Najbolji primjeri iz prakse

- Držite poslovnu logiku u modelima
- Držite prezentaciju u prikazima  
- Zadržite usmjeravanje/koordinaciju u kontrolerima
- Nemojte miješati brige između slojeva
- Potvrdite sve unose na razini kontrolera

## Povezana dokumentacija

Vidi također:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za napredni pristup podacima
- [Sloj usluge](../Patterns/Service-Layer.md) za apstrakciju poslovne logike
- [Kod-organizacija](../Best-Practices/Code-Organization.md) za strukturu projekta
- [Testiranje](../Best-Practices/Testing.md) za MVC strategije testiranja

---

Oznake: #mvc #uzorci #arhitektura #razvoj-modula #uzorci-dizajna
