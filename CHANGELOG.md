# Changelog

O formato segue a ideia de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e usa versionamento semântico quando houver releases publicadas.

## [Não lançado]

### Adicionado

- Catálogo de múltiplos provedores e seleção de servidor antes de cada geração.
- Configuração de vários IDs, chaves, endpoints e modelos usando `LLM_PROVIDERS`.
- Backend Express + TypeScript com integração `openai` e suporte a `OPENAI_BASE_URL`.
- Endpoint `POST /api/chat/stream` com resposta SSE.
- Endpoint `GET /health`.
- Extensão VS Code com o comando `meu-opencode.gerarCodigo`.
- Captura de seleção, linguagem do documento e instrução do usuário.
- Inserção incremental da resposta no editor com cancelamento.
- Documentação de arquitetura, API, contribuição e segurança.
- Estado operacional compacto em `PROJECT_STATE.md`.

### Pendente

- Testes automatizados HTTP e testes de integração da extensão.
- Teste manual com um provedor de LLM configurado.
- Sessões persistentes, histórico, LSP, MCP e painel Webview.
