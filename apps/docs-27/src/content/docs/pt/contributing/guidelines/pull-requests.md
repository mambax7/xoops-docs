---
title: "Diretrizes de Pull Request"
description: "Diretrizes para submeter pull requests para projetos XOOPS"
---

Este documento fornece diretrizes abrangentes para submeter pull requests para projetos XOOPS. Seguir estas diretrizes garante revisões de código suaves e tempos de merge mais rápidos.

## Antes de Criar uma Pull Request

### Passo 1: Verificar Problemas Existentes

```
1. Visite o repositório GitHub
2. Vá para a aba Issues
3. Procure por problemas existentes relacionados à sua mudança
4. Verifique problemas abertos e fechados
```

### Passo 2: Fork e Clonar o Repositório

```bash
# Faça fork do repositório no GitHub
# Clique no botão "Fork" na página do repositório

# Clone seu fork
git clone https://github.com/SEU_USUARIO/XOOPS.git
cd XOOPS

# Adicionar remote upstream
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verificar remotes
git remote -v
# Deve mostrar: origin (seu fork) e upstream (oficial)
```

### Passo 3: Criar uma Branch de Recurso

```bash
# Atualizar branch principal
git fetch upstream
git checkout main
git merge upstream/main

# Criar branch de recurso
# Use nomes descritivos: bugfix/numero-problema ou feature/descricao
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Passo 4: Fazer Suas Mudanças

```bash
# Fazer mudanças em seus arquivos
# Seguir diretrizes de estilo de código

# Preparar mudanças
git add .

# Fazer commit com mensagem clara
git commit -m "Corrigir problema de timeout de conexão com banco de dados"

# Criar múltiplos commits para mudanças lógicas
git commit -m "Adicionar lógica de retry de conexão"
git commit -m "Melhorar mensagens de erro para debugging"
```

## Padrões de Mensagem de Commit

### Boas Mensagens de Commit

Use mensagens claras e descritivas seguindo estes padrões:

```
# Formato
<tipo>: <assunto>

<corpo>

<rodapé>

# Exemplo 1: Correção de bug
fix: resolver timeout de conexão com banco de dados

Adicionar mecanismo de retry com backoff exponencial à conexão com banco de dados.
Conexões agora tentam novamente até 3 vezes com atrasos crescentes.

Fixes #123
```

```
# Exemplo 2: Recurso
feat: implementar interfaces de mensagem HTTP PSR-7

Implementar interfaces Psr\Http\Message para manipulação de request/response.
Fornece manipulação de mensagem HTTP segura em tipo em todo o framework.

BREAKING CHANGE: Assinatura de RequestHandler foi atualizada
```

### Categorias de Tipo de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Novo recurso | `feat: adicionar widget de dashboard do usuário` |
| `fix` | Correção de bug | `fix: resolver bug de invalidação de cache` |
| `docs` | Documentação | `docs: atualizar referência de API` |
| `style` | Estilo de código (sem mudança de lógica) | `style: formatar imports` |
| `refactor` | Refatoração de código | `refactor: simplificar camada de serviço` |
| `perf` | Melhoria de performance | `perf: otimizar consultas de banco de dados` |
| `test` | Mudanças de teste | `test: adicionar testes de integração` |
| `chore` | Mudanças de build/tooling | `chore: atualizar dependências` |

## Descrição de Pull Request

### Modelo de PR

```markdown
## Descrição
Descrição clara das mudanças feitas e por quê.

## Tipo de Mudança
- [ ] Correção de bug
- [ ] Novo recurso
- [ ] Mudança quebra-compatibilidade
- [ ] Atualização de documentação

## Problemas Relacionados
Fecha #123
Relacionado a #456

## Mudanças Feitas
- Mudança 1
- Mudança 2
- Mudança 3

## Testes
- [ ] Testado localmente
- [ ] Todos os testes passam
- [ ] Adicionados novos testes
- [ ] Passos de teste manual inclusos

## Lista de Verificação
- [ ] Código segue diretrizes de estilo
- [ ] Autorrevisão concluída
- [ ] Comentários adicionados para lógica complexa
- [ ] Documentação atualizada
- [ ] Nenhum novo aviso gerado
- [ ] Adicionados testes para nova funcionalidade
- [ ] Todos os testes passando
```

## Requisitos de Qualidade de Código

### Estilo de Código

Siga diretrizes de Estilo-de-Código:

```php
<?php
// Bom: estilo PSR-12
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

## Requisitos de Testes

### Testes Unitários

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

### Executando Testes

```bash
# Executar todos os testes
vendor/bin/phpunit

# Executar arquivo de teste específico
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Executar com cobertura
vendor/bin/phpunit --coverage-html coverage/
```

## Trabalhando com Branches

### Manter Branch Atualizada

```bash
# Buscar último do upstream
git fetch upstream

# Fazer rebase na main mais recente
git rebase upstream/main

# Ou fazer merge se preferir
git merge upstream/main

# Force push se fez rebase (aviso: apenas na sua branch!)
git push -f origin bugfix/123-fix-database-connection
```

## Criando a Pull Request

### Formato de Título de PR

```
[Tipo] Descrição curta (fix/feature/docs)

Exemplos:
- [FIX] Resolver problema de timeout de conexão com banco de dados (#123)
- [FEATURE] Implementar interfaces de mensagem HTTP PSR-7
- [DOCS] Atualizar referência de API para classe Criteria
```

## Processo de Revisão de Código

### O Que Revisores Procuram

1. **Correção**
   - O código resolve o problema declarado?
   - Casos extremos são manipulados?
   - Manipulação de erro é apropriada?

2. **Qualidade**
   - Segue padrões de codificação?
   - É mantível?
   - Está bem testado?

3. **Performance**
   - Alguma regressão de performance?
   - As consultas são otimizadas?
   - O uso de memória é razoável?

4. **Segurança**
   - Validação de entrada?
   - Prevenção de injeção SQL?
   - Autenticação/autorização?

### Respondendo ao Feedback

```bash
# Endereçar feedback
# Editar arquivos baseado em comentários de revisão

# Fazer commit das mudanças
git commit -m "Endereçar feedback de revisão de código

- Adicionar manipulação de erro adicional
- Melhorar cobertura de teste para casos extremos
- Atualizar documentação"

# Fazer push das mudanças
git push origin bugfix/123-fix-database-connection
```

## Problemas Comuns de PR e Soluções

### Problema 1: PR Muito Grande

**Problema:** Revisores não conseguem revisar PRs massivos efetivamente

**Solução:** Quebrar em PRs menores
- Primeiro PR: Mudanças principais
- Segundo PR: Testes
- Terceiro PR: Documentação

### Problema 2: Nenhum Teste Incluído

**Problema:** Revisores não conseguem verificar funcionalidade

**Solução:** Adicionar testes abrangentes antes de submeter

### Problema 3: Conflitos com Main

**Problema:** Sua branch está fora de sincronização com main

**Solução:** Fazer rebase na main mais recente

```bash
git fetch upstream
git rebase upstream/main
git push -f origin sua-branch
```

## Depois do Merge

### Limpeza

```bash
# Mudar para main
git checkout main

# Atualizar main
git pull upstream main

# Deletar branch local
git branch -d bugfix/123-fix-database-connection

# Deletar branch remota
git push origin --delete bugfix/123-fix-database-connection
```

## Resumo de Melhores Práticas

### Faça

- Criar mensagens de commit descritivas
- Fazer PRs focadas e com propósito único
- Incluir testes para nova funcionalidade
- Atualizar documentação
- Referenciar problemas relacionados
- Manter descrições de PR claras
- Responder prontamente a revisões

### Não Faça

- Incluir mudanças não relacionadas
- Fazer merge de main em sua branch (use rebase)
- Force push depois que revisão começa
- Pular testes
- Submeter work in progress
- Ignorar feedback de revisão de código

## Documentação Relacionada

- ../Contributing - Visão geral de contribuição
- Code-Style - Diretrizes de estilo de código
- ../../03-Module-Development/Best-Practices/Testing - Melhores práticas de testes
- ../Architecture-Decisions/ADR-Index - Diretrizes arquiteturais

## Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**Última Atualização:** 2026-01-31
**Aplica a:** Todos os projetos XOOPS
**Repositório:** https://github.com/XOOPS/XOOPS
