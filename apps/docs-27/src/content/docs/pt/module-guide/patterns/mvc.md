---
title: "Padrão MVC em XOOPS"
description: "Implementação de arquitetura Model-View-Controller em módulos XOOPS"
---

<span class="version-badge version-xmf">XMF Required</span> <span class="version-badge version-40x">4.0.x Native</span>

:::note[Não tem certeza se este é o padrão certo?]
Veja [Choosing a Data Access Pattern](../Choosing-Data-Access-Pattern.md) para orientação sobre quando usar MVC versus padrões mais simples.
:::

:::caution[Esclarecimento: Arquitetura XOOPS]
**XOOPS 2.5.x Padrão** usa um padrão **Page Controller** (também chamado Transaction Script), não MVC. Módulos legados usam `index.php` com includes diretos, objetos globais (`$xoopsUser`, `$xoopsDB`) e acesso de dados baseado em handler.

**Para usar MVC em XOOPS 2.5.x**, você precisa do **XMF Framework** que fornece suporte de roteamento e controlador.

**XOOPS 4.0** suportará nativamente MVC com middleware PSR-15 e roteamento apropriado.

Veja também: [Current XOOPS Architecture](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

O padrão Model-View-Controller (MVC) é um padrão arquitetural fundamental para separação de responsabilidades em módulos XOOPS. Este padrão divide uma aplicação em três componentes interconectados.

## Explicação de MVC

### Modelo
O **Modelo** representa os dados e lógica de negócio de sua aplicação. Ele:
- Gerencia persistência de dados
- Implementa regras de negócio
- Valida dados
- Se comunica com o banco de dados
- É independente da UI

### Visualização
A **Visualização** é responsável por apresentar dados ao usuário. Ela:
- Renderiza templates HTML
- Exibe dados do modelo
- Lida com apresentação de interface do usuário
- Envia ações do usuário para o controlador
- Deve conter lógica mínima

### Controlador
O **Controlador** lida com interações do usuário e coordena entre Modelo e Visualização. Ele:
- Recebe solicitações do usuário
- Processa dados de entrada
- Chama métodos do modelo
- Seleciona visualizações apropriadas
- Gerencia fluxo da aplicação

## Implementação XOOPS

Em XOOPS, o padrão MVC é implementado usando handlers e templates com o engine Smarty fornecendo suporte a template.

### Estrutura Básica do Modelo
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Implementação de consulta de banco de dados
    }
    
    public function createUser($data)
    {
        // Implementação de criação de usuário
    }
}
?>
```

### Implementação de Controlador
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

### Template de Visualização
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Melhores Práticas

- Mantenha lógica de negócio em Modelos
- Mantenha apresentação em Visualizações
- Mantenha roteamento/coordenação em Controladores
- Não misture responsabilidades entre camadas
- Valide toda entrada no nível do Controlador

## Documentação Relacionada

Veja também:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) para acesso avançado de dados
- [Service-Layer](../Patterns/Service-Layer.md) para abstração de lógica de negócio
- [Code-Organization](../Best-Practices/Code-Organization.md) para estrutura de projeto
- [Testing](../Best-Practices/Testing.md) para estratégias de teste MVC

---

Tags: #mvc #patterns #architecture #module-development #design-patterns
