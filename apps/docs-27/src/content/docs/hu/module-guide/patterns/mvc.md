---
title: "MVC minta XOOPS-ban"
description: "Modell-View-Controller architektúra megvalósítása XOOPS modulokban"
---
<span class="version-badge version-xmf">XMF szükséges</span> <span class="version-badge version-40x">4.0.x natív</span>

:::megjegyzés[Nem biztos benne, hogy ez a megfelelő minta?]
Tekintse meg az [Adat-hozzáférési minta kiválasztása](../Choosing-Data-Access-Pattern.md) című részt, hogy útmutatást kapjon a MVC használatáról az egyszerűbb mintákhoz képest.
:::

:::vigyázat [Tisztázat: XOOPS Architecture]
**A szabványos XOOPS 2.5.x** **Page Controller** mintát használ (más néven Tranzakciós szkriptet), nem pedig MVC-t. A régebbi modulok `index.php`-t használnak közvetlen belefoglalással, globális objektumokkal (`$xoopsUser`, `$xoopsDB`) és kezelő alapú adathozzáféréssel.

**A MVC XOOPS 2.5.x** verzióban való használatához szükség van a **XMF Framework**-ra, amely biztosítja az útválasztást és a vezérlők támogatását.

**XOOPS 4.0** natívan támogatja a MVC PSR-15 köztes szoftverrel és a megfelelő útválasztással.

Lásd még: [Jelenlegi XOOPS architektúra](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

A Model-View-Controller (MVC) minta egy alapvető építészeti minta a XOOPS modulok problémáinak szétválasztására. Ez a minta három, egymással összefüggő összetevőre osztja az alkalmazást.

## MVC Magyarázat

### Modell
A **Modell** az alkalmazás adatait és üzleti logikáját képviseli. Ez:
- Kezeli az adatok fennmaradását
- Az üzletszabályzatot végrehajtja
- Érvényesíti az adatokat
- Kommunikál az adatbázissal
- Független a felhasználói felülettől

### Megtekintés
A **Nézet** felelős az adatoknak a felhasználó számára történő megjelenítéséért. Ez:
- HTML sablonokat jelenít meg
- Modelladatokat jelenít meg
- Kezeli a felhasználói felület bemutatását
- Felhasználói műveleteket küld a vezérlőnek
- Minimális logikát kell tartalmaznia

### Vezérlő
A **Controller** kezeli a felhasználói interakciókat, és koordinálja a modell és a nézet között. Ez:
- Fogadja a felhasználói kéréseket
- Feldolgozza a bemeneti adatokat
- Modellmetódusokat hív meg
- Kiválasztja a megfelelő nézeteket
- Kezeli az alkalmazás áramlását

## XOOPS Megvalósítás

A XOOPS-ban a MVC mintát kezelők és sablonok segítségével valósítják meg a Smarty motorral, amely sablontámogatást biztosít.

### Alapvető modellstruktúra
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

### Vezérlő megvalósítása
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

### Sablon megtekintése
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Bevált gyakorlatok

- Tartsa meg az üzleti logikát a Modellekben
- Tartsa a prezentációt a Views alkalmazásban  
- Tartsa a routing/coordination-t a vezérlőkben
- Ne keverje az aggodalmakat a rétegek között
- Érvényesítse az összes bemenetet a vezérlő szintjén

## Kapcsolódó dokumentáció

Lásd még:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) a speciális adathozzáféréshez
- [Szolgáltatási réteg](../Patterns/Service-Layer.md) az üzleti logikai absztrakcióhoz
- [Code-Organization](../Best-Practices/Code-Organization.md) a projekt szerkezetéhez
- [Tesztelés](../Best-Practices/Testing.md) a MVC tesztelési stratégiákhoz

---

Címkék: #mvc #minták #architektúra #modul-fejlesztés #design-minták
