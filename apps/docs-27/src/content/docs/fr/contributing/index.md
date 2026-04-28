---
title: "Directives de Contribution"
description: "Comment contribuer au développement de XOOPS CMS, normes de codage et directives communautaires"
---

# Contribution à XOOPS

> Rejoignez la communauté XOOPS et aidez à en faire le meilleur CMS du monde.

---

## Aperçu

XOOPS est un projet open-source qui prospère grâce aux contributions communautaires. Que vous corrigiez des bogues, ajoutiez des fonctionnalités, amélioriez la documentation ou aidiez les autres, vos contributions sont précieuses.

---

## Contenu de la Section

### Directives
- Code de Conduite
- Flux de Travail de Contribution
- Directives des Demandes de Tirage
- Rapport de Problèmes

### Style de Code
- Normes de Codage PHP
- Normes JavaScript
- Directives CSS
- Normes de Modèles Smarty

### Décisions Architecturales
- Index ADR
- Modèle ADR
- ADR-001: Architecture Modulaire
- ADR-002: Abstraction de Base de Données

---

## Démarrage

### 1. Configurez l'Environnement de Développement

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```

### 2. Créer une Branche de Fonctionnalité

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Apportez des Modifications

Suivez les normes de codage et écrivez des tests pour les nouvelles fonctionnalités.

### 4. Soumettre une Demande de Tirage

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

Créez ensuite une Demande de Tirage sur GitHub.

---

## Normes de Codage

### Normes PHP

XOOPS suit les normes de codage PSR-1, PSR-4 et PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### Conventions Clés

| Règle | Exemple |
|------|---------|
| Noms de classe | `PascalCase` |
| Noms de méthode | `camelCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Variables | `$camelCase` |
| Fichiers | `ClassName.php` |
| Indentation | 4 espaces |
| Longueur de ligne | Max 120 caractères |

### Modèles Smarty

```smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## Flux de Travail Git

### Dénomination des Branches

| Type | Motif | Exemple |
|------|-------|---------|
| Fonctionnalité | `feature/description` | `feature/add-user-export` |
| Correction | `fix/description` | `fix/login-validation` |
| Correctif d'Urgence | `hotfix/description` | `hotfix/security-patch` |
| Version | `release/version` | `release/2.7.0` |

### Messages de Commit

Suivez les commits conventionnels :

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bogue
- `docs`: Documentation
- `style`: Style de code (formatage)
- `refactor`: Refactorisation du code
- `test`: Ajout de tests
- `chore`: Maintenance

**Exemples:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```

---

## Tests

### Exécuter les Tests

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Écrire des Tests

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## Liste de Contrôle de Demande de Tirage

Avant de soumettre une PR, assurez-vous que :

- [ ] Le code suit les normes de codage XOOPS
- [ ] Tous les tests passent
- [ ] Les nouvelles fonctionnalités ont des tests
- [ ] La documentation est mise à jour si nécessaire
- [ ] Aucun conflit de fusion avec la branche principale
- [ ] Les messages de commit sont descriptifs
- [ ] La description de PR explique les modifications
- [ ] Les problèmes connexes sont liés

---

## Enregistrements des Décisions Architecturales

Les ADR documentent les décisions architecturales importantes.

### Modèle ADR

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```

### ADRs Actuels

| ADR | Titre | Statut |
|-----|-------|--------|
| ADR-001 | Architecture Modulaire | Acceptée |
| ADR-002 | Accès à la Base de Données Orienté Objet | Acceptée |
| ADR-003 | Moteur de Modèles Smarty | Acceptée |
| ADR-004 | Conception du Système de Sécurité | Acceptée |
| ADR-005 | Intergiciel PSR-15 (4.0.x) | Proposée |

---

## Reconnaissance

Les contributeurs sont reconnus par :

- **Liste des Contributeurs** - Listés dans le référentiel
- **Notes de Version** - Crédité dans les versions
- **Galerie de Gloire** - Contributeurs Exceptionnels
- **Certification de Module** - Badge de Qualité pour les Modules

---

## Documentation Connexe

- Feuille de Route XOOPS 4.0
- Concepts Fondamentaux
- Développement de Module

---

## Ressources

- [Référentiel GitHub](https://github.com/XOOPS/XoopsCore27)
- [Suivi des Problèmes](https://github.com/XOOPS/XoopsCore27/issues)
- [Forums XOOPS](https://xoops.org/modules/newbb/)
- [Communauté Discord](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
