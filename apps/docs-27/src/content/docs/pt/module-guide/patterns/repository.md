---
title: "Padrão Repositório em XOOPS"
description: "Implementação de camada de abstração de acesso de dados"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Não tem certeza se este é o padrão certo?]
Veja [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) para árvore de decisão comparando handlers, repositórios, serviços e CQRS.
:::

:::tip[Funciona Hoje e Amanhã]
O padrão Repositório **funciona em XOOPS 2.5.x e XOOPS 4.0.x**. Em 2.5.x, envolva seu `XoopsPersistableObjectHandler` existente em uma classe Repository para obter os benefícios de abstração:

| Abordagem | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Acesso direto de handler | `xoops_getModuleHandler()` | Via DI container |
| Wrapper de repositório | ✅ Recomendado | ✅ Padrão nativo |
| Teste com mocks | ✅ Com DI manual | ✅ Autowiring de container |

**Comece com padrão Repositório hoje** para preparar seus módulos para migração XOOPS 4.0.
:::

O Padrão Repositório é um padrão de acesso de dados que abstrai operações de banco de dados, fornecendo uma interface limpa para acessar dados. Ele atua como um intermediário entre a lógica de negócio e as camadas de mapeamento de dados.

## Conceito de Repositório

O Padrão Repositório fornece:
- Abstração de detalhes de implementação de banco de dados
- Mock fácil para testes unitários
- Lógica centralizada de acesso de dados
- Flexibilidade para alterar banco de dados sem afetar lógica de negócio
- Lógica de acesso a dados reutilizável em toda a aplicação

## Quando Usar Repositórios

**Use Repositórios quando:**
- Transferindo dados entre camadas de aplicação
- Precisando alterar implementação de banco de dados
- Escrevendo código testável com mocks
- Abstraindo padrões de acesso de dados

## Padrão de Implementação

```php
<?php
// Definir interface de repositório
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implementar repositório
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementação
    }
    
    public function save($entity)
    {
        // Implementação
    }
}
?>
```

## Uso em Serviços

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Verificar se usuário existe
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Criar usuário
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## Melhores Práticas

- Use interfaces para definir contratos de repositório
- Cada repositório lida com um tipo de entidade
- Mantenha lógica de negócio em serviços, não em repositórios
- Use objetos de entidade para mapeamento de dados
- Lance exceções apropriadas para operações inválidas

## Documentação Relacionada

Veja também:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) para integração de controlador
- [Service-Layer](../Patterns/Service-Layer.md) para implementação de serviço
- [DTO-Pattern](DTO-Pattern.md) para data transfer objects
- [Testing](../Best-Practices/Testing.md) para teste de repositório

---

Tags: #repository-pattern #data-access #design-patterns #module-development
