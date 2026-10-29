# Segurança

## Proteção de credenciais

Nunca versione `backend/.env`, chaves de API, tokens, cookies ou conteúdo confidencial. Use `backend/.env.example` somente como modelo. Se uma chave for exposta, revogue-a imediatamente no provedor e substitua-a localmente; apagar o arquivo do Git não invalida uma credencial já publicada.

## Rede e dados

O backend escuta em loopback por padrão. O conteúdo do pedido e do código selecionado é enviado ao provedor configurado. Não use o projeto com dados sensíveis sem verificar a política de retenção e treinamento do provedor. Não exponha a porta do backend à internet sem autenticação, TLS, controle de origem e revisão de autorização.

## Reporte responsável

Para reportar uma vulnerabilidade, não abra uma issue pública com credenciais, dados privados ou uma exploração reproduzível antes de haver um canal privado. Até que um canal específico seja configurado, abra uma issue sem dados sensíveis solicitando contato privado e descreva apenas o impacto geral.

Este projeto é um MVP local e não declara suporte a multiusuário, autenticação ou execução segura em ambiente compartilhado.
