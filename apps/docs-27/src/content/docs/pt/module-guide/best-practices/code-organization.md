---
title: "Boas Práticas de Organização de Código"
description: "Estrutura de módulo, convenções de nomenclatura e carregamento automático PSR-4"
---

# Boas Práticas de Organização de Código em XOOPS

A organização adequada do código é essencial para manutenibilidade, escalabilidade e colaboração em equipe.

## Estrutura de Diretório do Módulo

Um módulo XOOPS bem organizado deve seguir esta estrutura:

```
mymodule/
├── xoops_version.php           # Metadados do módulo
├── index.php                    # Ponto de entrada do frontend
├── admin.php                    # Ponto de entrada do administrador
├── class/
│   ├── Controller/             # Manipuladores de requisição
│   ├── Handler/                # Manipuladores de dados
│   ├── Repository/             # Acesso a dados
│   ├── Entity/                 # Objetos de domínio
│   ├── Service/                # Lógica de negócios
│   ├── DTO/                    # Objetos de transferência de dados
│   └── Exception/              # Exceções personalizadas
├── templates/                  # Templates Smarty
│   ├── admin/                  # Templates de administrador
│   └── blocks/                 # Templates de bloco
├── assets/
│   ├── css/                    # Folhas de estilo
│   ├── js/                     # JavaScript
│   └── images/                 # Imagens
├── sql/                        # Esquemas de banco de dados
├── tests/                      # Testes unitários e integração
├── docs/                       # Documentação
└── composer.json              # Configuração do Composer
```

## Convenções de Nomenclatura

### Padrões PHP (PSR-12)

```
Classes:      PascalCase         (UserController, PostRepository)
Métodos:      camelCase          (getUserById, createUser)
Propriedades: camelCase          ($userId, $username)
Constantes:   UPPER_SNAKE_CASE   (DEFAULT_LIMIT, MAX_USERS)
Funções:      snake_case         (get_user_data, validate_email)
Arquivos:     PascalCase.php     (UserController.php)
```

### Organização de Arquivo e Diretório

- Uma classe por arquivo
- Nome do arquivo corresponde ao nome da classe
- Estrutura de diretório corresponde à hierarquia de namespace
- Manter classes relacionadas juntas
- Usar nomenclatura consistente em todo o módulo

## Carregamento Automático PSR-4

### Configuração do Composer

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### Carregador Automático Manual

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## Boas Práticas

### 1. Responsabilidade Única
- Cada classe deve ter um motivo para mudar
- Separar preocupações em diferentes classes
- Manter classes focadas e coesas

### 2. Nomenclatura Consistente
- Usar nomes significativos e descritivos
- Seguir padrões de codificação PSR-12
- Evitar abreviações a menos que óbvias
- Usar padrões consistentes

### 3. Organização de Diretório
- Agrupar classes relacionadas
- Separar preocupações em subdiretórios
- Manter templates e assets organizados
- Usar nomeação de arquivo consistente

### 4. Uso de Namespace
- Usar namespaces apropriados para todas as classes
- Seguir carregamento automático PSR-4
- Namespace corresponde à estrutura de diretório

### 5. Gerenciamento de Configuração
- Centralizar configuração em diretório de configuração
- Usar configuração baseada em ambiente
- Não codificar configurações

## Bootstrap do Módulo

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## Documentação Relacionada

Veja também:
- Tratamento-de-Erros para gerenciamento de exceção
- Testes para organização de testes
- ../Padrões/Padrão-MVC para estrutura de controller

---

Tags: #boas-práticas #organização-de-código #psr-4 #desenvolvimento-de-módulo
