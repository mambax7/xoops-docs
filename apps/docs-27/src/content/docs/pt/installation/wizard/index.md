---
title: "Assistente de Instalação"
description: "Guia passo a passo do assistente de instalação XOOPS — 15 telas explicadas."
---

O assistente de instalação XOOPS o orienta através de um processo de 15 etapas que configura seu banco de dados, cria a conta de administrador e prepara seu site para o primeiro uso.

## Antes de começar

- Você [fez upload do XOOPS para seu servidor](/xoops-docs/2.7/installation/ftp-upload/) ou configurou um ambiente local
- Você [verificou os requisitos](/xoops-docs/2.7/installation/requirements/)
- Você tem suas credenciais de banco de dados prontas

## Etapas do Assistente

| Etapa | Tela | O que acontece |
|------|--------|--------------|
| 1 | [Seleção de Idioma](./step-01/) | Escolha idioma de instalação |
| 2 | [Bem-vindo](./step-02/) | Acordo de licença |
| 3 | [Verificação de Configuração](./step-03/) | Verificação do ambiente PHP/servidor |
| 4 | [Configuração de Caminho](./step-04/) | Defina caminho raiz e URL |
| 5 | [Conexão de Banco de Dados](./step-05/) | Digite host, usuário, senha do banco de dados |
| 6 | [Configuração de Banco de Dados](./step-06/) | Defina nome do banco de dados e prefixo de tabela |
| 7 | [Salvar Configuração](./step-07/) | Escrever mainfile.php |
| 8 | [Criação de Tabela](./step-08/) | Criar o esquema do banco de dados |
| 9 | [Configurações Iniciais](./step-09/) | Nome do site, email do administrador |
| 10 | [Inserção de Dados](./step-10/) | Preencher dados padrão |
| 11 | [Configuração de Site](./step-11/) | URL, fuso horário, idioma |
| 12 | [Selecionar Tema](./step-12/) | Escolha um tema padrão |
| 13 | [Instalação de Módulo](./step-13/) | Instalar módulos agrupados |
| 14 | [Bem-vindo](./step-14/) | Mensagem de instalação completa |
| 15 | [Limpeza](./step-15/) | Remover pasta de instalação |

:::caution[Segurança]
Após concluir o assistente, **delete ou renomeie a pasta `install/`** — a etapa 15 o orienta através disso. Deixar acessível é um risco de segurança.
:::
