---
title: "Revisão de Compatibilidade XOOPS 2.7.0 Para Este Guia"
---

Este documento lista as mudanças necessárias neste repositório para que o Guia de Instalação corresponda ao XOOPS 2.7.0.

Base de revisão:

- Repositório de guia atual
- XOOPS 2.7.0 core revisado
- Principais fontes 2.7.0 verificadas

## Escopo

Este repositório atualmente contém:

- Arquivos Markdown em nível raiz usados como guia principal.
- Uma cópia parcial `en/`.
- Árvores de livro completas `de/` e `fr/` com seus próprios ativos.

Os arquivos em nível raiz precisam da primeira passagem. Depois disso, mudanças equivalentes precisam ser espelhadas em `de/book/` e `fr/book/`. A árvore `en/` também precisa de limpeza porque parece ser apenas parcialmente mantida.

## 1. Mudanças Globais de Repositório

### 1.1 Versionamento e metadados

Atualizar todas as referências de nível de guia de XOOPS 2.5.x para XOOPS 2.7.0.

### 1.2 Atualização de link

Arquivos que apontam para locais antigos do GitHub precisam ser atualizados para locais de projeto 2.7.x atuais.

### 1.3 Atualização de screenshot

Todos os screenshots mostrando o instalador, UI de upgrade, painel de admin, seletor de tema, seletor de módulo e telas pós-instalação estão desatualizados.

## 2. Capítulo 2: Introdução

### 2.1 Requisitos de sistema devem ser reescritos

| Componente | 2.7.0 mínimo | 2.7.0 recomendado |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Servidor web | Qualquer servidor suportando PHP necessário | Apache ou Nginx recomendado |

### 2.2 Adicionar checklist de extensão PHP obrigatória e recomendada

Verificações obrigatórias mostradas pelo instalador:

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- fileinfo

Extensões recomendadas:

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 Remover instruções de checksum

Arquivos `checksum.php` e `checksum.mdi` não são parte de XOOPS 2.7.0.

---

## Referências

- [XOOPS 2.7.0 Core](https://github.com/XOOPS/XoopsCore27)
- [Notas de Lançamento](https://github.com/XOOPS/XoopsCore27/releases)

---

#xoops #compatibility #2.7.0 #reference
