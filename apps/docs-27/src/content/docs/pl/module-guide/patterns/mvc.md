---
title: "Wzorzec MVC w XOOPS"
description: "Implementacja architektury Model-View-Controller w modułach XOOPS"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::uwaga[Nie jesteś pewny, czy to właściwy wzorzec?]
See [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) for guidance on when to use MVC vs simpler patterns.
:::

:::ostrzeżenie[Wyjaśnienie: Architektura XOOPS]
**Standard XOOPS 2.5.x** używa wzorca **Page Controller** (również zwanego Transaction Script), nie MVC. Starsze moduły używają `index.php` z bezpośrednimi include, globalnymi obiektami (`$xoopsUser`, `$xoopsDB`) i dostępem do danych opartym na handlerkach.

**Aby używać MVC w XOOPS 2.5.x**, potrzebujesz **XMF Framework**, który zapewnia routing i obsługę kontrolera.

**XOOPS 4.0** będzie natywnie obsługiwać MVC z middleware'em PSR-15 i właściwym routingiem.

See also: [Current XOOPS Architecture](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Wzorzec Model-View-Controller (MVC) to fundamentalny wzorzec architektoniczny do rozdzielenia obaw w modułach XOOPS. Ten wzorzec dzieli aplikację na trzy wzajemnie powiązane komponenty.

## Wyjaśnienie MVC

### Model
**Model** reprezentuje dane i logikę biznesową aplikacji. Ono:
- Zarządza trwałością danych
- Implementuje reguły biznesowe
- Waliduje dane
- Komunikuje się z bazą danych
- Jest niezależny od interfejsu użytkownika

### Widok
**Widok** jest odpowiedzialny za prezentowanie danych użytkownikowi. Ono:
- Renderuje szablony HTML
- Wyświetla dane modelu
- Obsługuje prezentację interfejsu użytkownika
- Wysyła działania użytkownika do kontrolera
- Powinien zawierać minimalną logikę

### Kontroler
**Kontroler** obsługuje interakcje użytkownika i koordynuje między Model a Widokiem. Ono:
- Odbiera żądania użytkownika
- Przetwarza dane wejściowe
- Wywołuje metody modelu
- Wybiera odpowiednie widoki
- Zarządza przepływem aplikacji

## Implementacja XOOPS

W XOOPS, wzorzec MVC jest implementowany przy użyciu handlerów i szablonów z silnikiem Smarty zapewniającym obsługę szablonów.

### Podstawowa struktura modelu
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

### Implementacja kontrolera
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

### Szablon widoku
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Najlepsze praktyki

- Trzymaj logikę biznesową w Modelach
- Trzymaj prezentację w Widokach
- Trzymaj routing/koordynację w Kontrolerach
- Nie mieszaj obaw między warstwami
- Waliduj wszystkie dane wejściowe na poziomie Kontrolera

## Powiązana dokumentacja

Zobacz też:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) dla zaawansowanego dostępu do danych
- [Service-Layer](../Patterns/Service-Layer.md) dla abstrakcji logiki biznesowej
- [Code-Organization](../Best-Practices/Code-Organization.md) dla struktury projektu
- [Testing](../Best-Practices/Testing.md) dla strategii testowania MVC

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
