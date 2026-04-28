---
title: "Configurar Email"
---

![Configuração de Email XOOPS](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS depende de email para muitas interações críticas de usuários, como validar um registro ou redefinir uma senha. Portanto, é importante que seja configurado corretamente.

Configurar email do site pode ser muito fácil em alguns casos e frustrante em outros.

Aqui estão algumas dicas para ajudar a tornar sua configuração um sucesso.

## Método de Entrega de Email

Esta seção da configuração tem 4 valores possíveis

* **PHP Mail()** - a maneira mais fácil, se disponível. Depende do programa _sendmail_ do sistema.
* **sendmail** - Uma opção de força industrial, mas geralmente alvo de SPAM explorando fraquezas em outro software.
* **SMTP** - Simple Mail Transfer Protocol geralmente não está disponível em novas contas de hospedagem devido a preocupações de segurança e potencial de abuso. Tem sido amplamente substituído por SMTP Auth.
* **SMTP Auth** - SMTP com Autorização é geralmente preferido em relação ao SMTP simples. Neste caso, o XOOPS se conecta diretamente ao servidor de email de forma mais segura.

## Hosts SMTP

Se você precisa usar SMTP, com ou sem "Auth", será necessário especificar um nome de servidor aqui. Esse nome pode ser um nome de host ou endereço IP simples, ou pode incluir informações adicionais de porta e protocolo. O caso mais simples seria `localhost` para um servidor SMTP (sem auth) rodando na mesma máquina com o servidor web.

Nome de usuário SMTP e senha SMTP são sempre necessários ao usar SMTP Auth. É possível especificar TLS ou SSL, bem como uma porta no campo de configuração XOOPS Hosts SMTP.

Isso pode ser usado para conectar ao SMTP do Gmail: `tls://smtp.gmail.com:587`

Outro exemplo usando SSL: `ssl://mail.example.com:465`

## Dicas para Solução de Problemas

Às vezes, as coisas não correm tão bem quanto esperamos. Aqui estão algumas sugestões e recursos que podem ajudar.

### Verifique a documentação do seu provedor de hospedagem

Quando você estabelece serviço de hospedagem com um provedor, ele deve fornecer informações sobre como acessar servidores de email. Você deseja ter isso disponível quando configurar o email para seu sistema XOOPS.

### XOOPS Usa PHPMailer

XOOPS usa a biblioteca [PHPMailer](https://github.com/PHPMailer/PHPMailer) para enviar email. A seção [solução de problemas](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) no wiki oferece alguns insights.
