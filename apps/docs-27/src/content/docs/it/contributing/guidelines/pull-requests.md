---
title: "Linee Guida Pull Request"
description: "Linee guida per inviare pull request ai progetti XOOPS"
---

Questo documento fornisce linee guida complete per inviare pull request ai progetti XOOPS. Seguire queste linee guida assicura revisioni di codice fluide e tempi di merge più veloci.

## Prima di Creare una Pull Request

### Step 1: Controlla Problemi Esistenti

```
1. Visita il repository GitHub
2. Vai alla tab Issues
3. Cerca problemi esistenti correlati al tuo cambiamento
4. Controlla sia problemi aperti che chiusi
```

### Step 2: Fork e Clone il Repository

```bash
# Fai fork del repository su GitHub
# Clicca bottone "Fork" sulla pagina repository

# Clona il tuo fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Aggiungi remote upstream
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verifica remote
git remote -v
# Dovrebbe mostrare: origin (tuo fork) e upstream (ufficiale)
```

### Step 3: Crea Branch Feature

```bash
# Aggiorna main branch
git fetch upstream
git checkout main
git merge upstream/main

# Crea branch feature
# Usa nomi descrittivi: bugfix/issue-number o feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Step 4: Fai i Tuoi Cambiamenti

```bash
# Fai cambiamenti ai tuoi file
# Segui linee guida code style

# Stage cambiamenti
git add .

# Commit con messaggio chiaro
git commit -m "Fix database connection timeout issue"

# Crea multipli commit per cambiamenti logici
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Standard Commit Message

### Buoni Commit Message

Usa messaggi chiari e descrittivi seguendo questi pattern:

```
# Formato
<type>: <subject>

<body>

<footer>

# Esempio 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Esempio 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### Categorie Commit Type

| Type | Descrizione | Esempio |
|------|-------------|---------|
| `feat` | Nuova funzionalità | `feat: add user dashboard widget` |
| `fix` | Bug fix | `fix: resolve cache invalidation bug` |
| `docs` | Documentazione | `docs: update API reference` |
| `style` | Code style (no logic change) | `style: format imports` |
| `refactor` | Code refactoring | `refactor: simplify service layer` |
| `perf` | Performance improvement | `perf: optimize database queries` |
| `test` | Test changes | `test: add integration tests` |
| `chore` | Build/tooling changes | `chore: update dependencies` |

## Descrizione Pull Request

### Template PR

```markdown
## Descrizione
Descrizione chiara di cambiamenti fatti e perché.

## Type di Cambiamento
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Breaking change
- [ ] Aggiornamento documentazione

## Problemi Correlati
Closes #123
Related to #456

## Cambiamenti Fatti
- Cambiamento 1
- Cambiamento 2
- Cambiamento 3

## Testing
- [ ] Testato localmente
- [ ] Tutti i test passano
- [ ] Aggiunto nuovi test
- [ ] Step testing manuale inclusi

## Checklist
- [ ] Codice segue linee guida style
- [ ] Auto-review completata
- [ ] Commenti aggiunti per logica complessa
- [ ] Documentazione aggiornata
- [ ] Nessun nuovo avviso generato
- [ ] Aggiunti test per nuova funzionalità
- [ ] Tutti i test passano
```

## Requisiti Qualità Codice

### Code Style

Segui linee guida Code-Style:

```php
<?php
// Buono: stile PSR-12
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## Requisiti Testing

### Unit Test

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### Esegui Test

```bash
# Esegui tutti i test
vendor/bin/phpunit

# Esegui file test specifico
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Esegui con coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Lavorare con Branch

### Mantieni Branch Aggiornato

```bash
# Recupera ultimo da upstream
git fetch upstream

# Rebase su main più recente
git rebase upstream/main

# Oppure merge se preferisci
git merge upstream/main

# Force push se rebasato (attenzione: solo su tuo branch!)
git push -f origin bugfix/123-fix-database-connection
```

## Creare la Pull Request

### Formato Titolo PR

```
[Type] Descrizione breve (fix/feature/docs)

Esempi:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Processo Code Review

### Cosa Cercano i Reviewer

1. **Correttezza**
   - Il codice risolve il problema dichiarato?
   - I casi limite sono gestiti?
   - La gestione errori è appropriata?

2. **Qualità**
   - Segue gli standard di codifica?
   - È mantenibile?
   - È ben testato?

3. **Performance**
   - Regressioni performance?
   - Le query sono ottimizzate?
   - L'utilizzo memoria è ragionevole?

4. **Sicurezza**
   - Validazione input?
   - Prevenzione SQL injection?
   - Autenticazione/autorizzazione?

### Rispondendo al Feedback

```bash
# Affronta il feedback
# Modifica file in base ai commenti di revisione

# Commit cambiamenti
git commit -m "Address code review feedback

- Aggiungi gestione errore aggiuntiva
- Migliora coverage test per casi limite
- Aggiorna documentazione"

# Push cambiamenti
git push origin bugfix/123-fix-database-connection
```

## Problemi Comuni PR e Soluzioni

### Problema 1: PR è Troppo Grande

**Problema:** I reviewer non possono revisionare massicce PR efficacemente

**Soluzione:** Spezza in PR più piccole
- Prima PR: Cambiamenti principali
- Seconda PR: Test
- Terza PR: Documentazione

### Problema 2: Nessun Test Incluso

**Problema:** I reviewer non possono verificare la funzionalità

**Soluzione:** Aggiungi test completi prima di inviare

### Problema 3: Conflitti con Main

**Problema:** Il tuo branch è fuori sync con main

**Soluzione:** Rebase su main più recente

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Dopo Merge

### Cleanup

```bash
# Passa a main
git checkout main

# Aggiorna main
git pull upstream main

# Elimina local branch
git branch -d bugfix/123-fix-database-connection

# Elimina remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## Riassunto Best Practice

### Da Fare

- Crea commit message descrittivi
- Fai PR focalizzate, single-purpose
- Includi test per nuova funzionalità
- Aggiorna documentazione
- Riferisci problemi correlati
- Mantieni descrizioni PR chiare
- Rispondi prontamente alle revisioni

### Da Non Fare

- Includi cambiamenti non correlati
- Merge main nel tuo branch (usa rebase)
- Force push dopo che la revisione inizia
- Salta test
- Invia work in progress
- Ignora feedback code review

## Documentazione Correlata

- ../Contributing - Panoramica contribuzione
- Code-Style - Linee guida code style
- ../../03-Module-Development/Best-Practices/Testing - Best practice testing
- ../Architecture-Decisions/ADR-Index - Linee guida architettura

## Risorse

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**Ultimo Aggiornamento:** 2026-01-31
**Applicabile a:** Tutti i progetti XOOPS
**Repository:** https://github.com/XOOPS/XOOPS
