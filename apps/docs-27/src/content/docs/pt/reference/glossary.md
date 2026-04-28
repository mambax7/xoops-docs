---
title: "Glossário XOOPS"
description: "Definições de termos e conceitos específicos do XOOPS"
---

> Glossário abrangente de terminologia e conceitos específicos do XOOPS.

---

## A

### Admin Framework
A interface administrativo padronizada introduzida no XOOPS 2.3, fornecendo páginas de admin consistentes entre módulos.

### Autoloading
O carregamento automático de classes PHP quando elas são necessárias, usando padrão PSR-4 no XOOPS moderno.

---

## B

### Block (Bloco)
Uma unidade de conteúdo auto-contida que pode ser posicionada em regiões de tema. Blocos podem exibir conteúdo de módulo, HTML customizado ou dados dinâmicos.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
O processo de inicializar o núcleo do XOOPS antes de executar código do módulo, tipicamente através de `mainfile.php` e `header.php`.

---

## C

### Criteria / CriteriaCompo
Classes para construir condições de query de banco de dados de maneira orientada a objetos.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Um ataque de segurança prevenido no XOOPS usando tokens de segurança via `XoopsFormHiddenToken`.

---

## D

### DI (Injeção de Dependência)
Um padrão de design planejado para XOOPS 4.0 onde dependências são injetadas em vez de criadas internamente.

### Dirname
O nome do diretório de um módulo, usado como identificador único em todo o sistema.

### DTYPE (Tipo de Dados)
Constantes definindo como variáveis XoopsObject são armazenadas e sanitizadas:
- `XOBJ_DTYPE_INT` - Inteiro
- `XOBJ_DTYPE_TXTBOX` - Texto (linha única)
- `XOBJ_DTYPE_TXTAREA` - Texto (multi-linha)
- `XOBJ_DTYPE_EMAIL` - Endereço de email

---

## E

### Event (Evento)
Uma ocorrência no ciclo de vida do XOOPS que pode disparar código customizado através de preloads ou hooks.

---

## F

### Framework
Ver XMF (XOOPS Module Framework).

### Form Element (Elemento de Formulário)
Um componente do sistema de formulário do XOOPS representando um campo de formulário HTML.

---

## G

### Group (Grupo)
Uma coleção de usuários com permissões compartilhadas. Grupos principais incluem: Webmasters, Usuários Registrados, Anônimo.

---

## H

### Handler
Uma classe que gerencia operações CRUD para instâncias XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Uma classe utilitária fornecendo acesso fácil aos handlers de módulo, configurações e serviços.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
As classes principais do XOOPS fornecendo funcionalidade fundamental: acesso a banco de dados, gerenciamento de usuário, segurança, etc.

---

## L

### Language File (Arquivo de Idioma)
Arquivos PHP contendo constantes para internacionalização, armazenados em diretórios `language/[code]/`.

---

## M

### mainfile.php
O arquivo de configuração primário para XOOPS contendo credenciais de banco de dados e definições de caminho.

### MCP (Model-Controller-Presenter)
Um padrão arquitetural similar a MVC, frequentemente usado em desenvolvimento de módulo XOOPS.

### Middleware
Software que fica entre a requisição e resposta, planejado para XOOPS 4.0 usando PSR-15.

### Module (Módulo)
Um pacote auto-contido que estende funcionalidade do XOOPS, instalado no diretório `modules/`.

---

## N

### Namespace
Recurso PHP para organizar classes, usado no XOOPS 2.5+

---

#xoops #glossary #reference #terminology
