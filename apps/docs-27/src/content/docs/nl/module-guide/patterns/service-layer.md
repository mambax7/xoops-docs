---
title: "Servicelaagpatroon in XOOPS"
description: "Bedrijfslogica-abstractie en afhankelijkheidsinjectie"
---
<span class="version-badge versie-25x">2.5.x ✅</span> <span class="version-badge versie-40x">4.0.x ✅</span>

:::note[Weet je niet zeker of dit het juiste patroon is?]
Zie [Een patroon voor gegevenstoegang kiezen](../Choosing-Data-Access-Pattern.md) voor een beslissingsboom waarin handlers, opslagplaatsen, services en CQRS worden vergeleken.
:::

:::tip[Werkt vandaag en morgen]
Het Service Layer-patroon **werkt in zowel XOOPS 2.5.x als XOOPS 4.0.x**. De concepten zijn universeel, alleen de syntaxis verschilt:

| Kenmerk | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|-----------|
| PHP-versie | 7,4+ | 8,2+ |
| Constructeurinjectie | ✅ Handmatige bedrading | ✅ Automatische bedrading van containers |
| Getypte eigenschappen | `@var` docblokken | Eigen typedeclaraties |
| Alleen-lezen eigenschappen | ❌ Niet beschikbaar | ✅ `readonly` trefwoord |

Codevoorbeelden hieronder gebruiken de syntaxis PHP 8.2+. Voor 2.5.x laat u `readonly` weg en gebruikt u traditionele eigendomsverklaringen.
:::

Het Service Layer Pattern omvat bedrijfslogica in speciale serviceklassen, waardoor een duidelijke scheiding ontstaat tussen controllers en datatoegangslagen. Dit patroon bevordert de herbruikbaarheid, testbaarheid en onderhoudbaarheid van code.

## Servicelaagconcept

### Doel
De servicelaag:
- Bevat domeinbedrijfslogica
- Coördineert meerdere repositories
- Verzorgt complexe operaties
- Beheert transacties
- Voert validatie en autorisatie uit
- Biedt bewerkingen op hoog niveau aan controllers

### Voordelen
- Herbruikbare bedrijfslogica over meerdere controllers
- Gemakkelijk afzonderlijk te testen
- Gecentraliseerde implementatie van bedrijfsregels
- Duidelijke scheiding van zorgen
- Vereenvoudigde controllercode

## Afhankelijkheidsinjectie

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Servicecontainer

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## Gebruik in controllers

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## Beste praktijken

- Elke dienst behandelt één domeinprobleem
- Services zijn afhankelijk van interfaces, niet van implementaties
- Gebruik constructorinjectie voor afhankelijkheden
- Diensten moeten afzonderlijk kunnen worden getest
- Gooi domeinspecifieke uitzonderingen
- Services mogen niet afhankelijk zijn van HTTP-verzoekgegevens
- Houd de dienstverlening gefocust en samenhangend

## Gerelateerde documentatie

Zie ook:
- [MVC-patroon](../Patterns/MVC-Pattern.md) voor controllerintegratie
- [Repository-Pattern](../Patterns/Repository-Pattern.md) voor gegevenstoegang
- [DTO-Patroon](DTO-Pattern.md) voor objecten voor gegevensoverdracht
- [Testen](../Best-Practices/Testing.md) voor servicetests

---

Tags: #servicelaag #bedrijfslogica #afhankelijkheidsinjectie #ontwerppatronen