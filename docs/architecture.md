# Arquitetura

## Visão geral

O projeto tem dois componentes executados separadamente:

1. A extensão `extension` roda no host do VS Code e possui acesso ao editor ativo.
2. O backend `backend` roda localmente e possui a única cópia da chave do provedor de LLM.

O fluxo é deliberadamente simples: VS Code → HTTP POST local → provedor compatível → SSE → VS Code.

## Fluxo de uma solicitação

Ao executar `meu-opencode.gerarCodigo`, a extensão valida a existência de um editor, coleta `document.getText(selection)` e `document.languageId`, solicita uma instrução e cria um `AbortController`. A requisição é enviada para `/api/chat/stream`.

O backend valida tamanho e tipo dos campos, compõe um prompt de sistema e um prompt de usuário com a seleção delimitada por Markdown, e chama `client.chat.completions.create` com `stream: true`. Cada fragmento textual é serializado como um evento SSE.

A extensão lê o corpo com `ReadableStream`, agrupa eventos separados por linha em branco, decodifica o JSON e aplica cada fragmento com `TextEditor.edit`. A posição de inserção é avançada depois de cada edição para impedir que os fragmentos sejam invertidos. O cancelamento da notificação aborta a requisição.

## Limites atuais

O MVP não mantém sessões persistentes, histórico local, ferramentas de edição de arquivos, LSP, MCP, autenticação entre extensão e backend ou painel Webview. O contexto enviado é limitado à instrução atual, à seleção e à linguagem do arquivo.

Esses limites são intencionais. Eles mantêm o projeto pequeno e auditável. Uma evolução para sessões e eventos duráveis deve introduzir módulos separados para sessão, armazenamento, protocolo e transporte, em vez de ampliar indefinidamente `server.ts`.

## Decisões de segurança

O host padrão é `127.0.0.1`, o CORS é limitado por configuração, a chave fica em `.env` e o corpo JSON possui limite de 256 KiB. O backend encerra a geração quando o cliente fecha a resposta. Antes de disponibilizar o serviço fora da máquina local, é obrigatório adicionar autenticação, TLS e uma política explícita de retenção de dados.
