---
title: Início Rápido
description: Coloque o XOOPS 2.7 em funcionamento em menos de 5 minutos.
---

## Requisitos

| Componente | Mínimo                   | Recomendado    |
|------------|-------------------------|-----------------|
| PHP        | 8.2                     | 8.4+            |
| MySQL      | 5.7                     | 8.0+            |
| MariaDB    | 10.4                    | 10.11+          |
| Servidor web | Apache 2.4 / Nginx 1.20 | Última estável |

## Download

Baixar a versão mais recente de [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Ou clonar diretamente
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Etapas de Instalação

1. **Fazer upload dos arquivos** para a raiz de documentos do seu servidor web (ex. `public_html/`).
2. **Criar um banco de dados MySQL** e um usuário com privilégios totais nele.
3. **Abrir seu navegador** e navegar para seu domínio — o instalador do XOOPS inicia automaticamente.
4. **Seguir o assistente de 5 etapas** — configura caminhos, cria tabelas e configura sua conta de admin.
5. **Deletar a pasta `install/`** quando solicitado. Isto é obrigatório para segurança.

## Verificar a Instalação

Após a configuração, visite:

- **Página inicial:** `https://seudominio.com/`
- **Painel admin:** `https://seudominio.com/xoops_data/` *(caminho que você escolheu durante instalação)*

## Próximos Passos

- [Guia de Instalação Completo](./installation/) — config de servidor, permissões, solução de problemas
- [Guia de Módulo](./module-guide/introduction/) — construir seu primeiro módulo
- [Guia de Tema](./theme-guide/introduction/) — criar ou customizar um tema
