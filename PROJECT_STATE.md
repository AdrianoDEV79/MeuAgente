# Estado do projeto

## Objetivo

Assistente de código privado para VS Code, com backend local e geração incremental via SSE.

## Entregável

Monorepo mínimo em `/home/ubuntu/meu-opencode-assistant` com backend Express + TypeScript e extensão VS Code TypeScript.

## Invariantes

- Backend padrão: `http://127.0.0.1:3000`.
- Endpoint: `POST /api/chat/stream`.
- Entrada: `prompt`, `selectedCode`, `fileLanguage`.
- Resposta: eventos SSE `data: {"text":"..."}` e evento final `{"done":true}`.
- Chave de API somente no backend via `.env`; nunca no código da extensão.
- Código-fonte não deve ser compactado nem reescrito automaticamente.

## Decisões

- Usar SDK oficial `openai` com `OPENAI_BASE_URL` opcional para provedores compatíveis.
- Usar `fetch` nativo da extensão para consumir o corpo SSE.
- Inspirar o prompt, contexto e eventos no OpenCode oficial sem copiar o monorepo.
- Inserir fragmentos em sequência após a seleção, mantendo a posição atualizada.
- Ignorar `node_modules`, builds e `.env` no Git.

## Estado

- backend: implementado e compilado.
- extensão: implementada e verificada com TypeScript.
- documentação: criada em `README.md` e `vsc-extension-quickstart.md`.
- segredos: não fornecidos nem versionados.

## Evidências

- `backend/src/server.ts`: servidor, validação e streaming.
- `extension/src/extension.ts`: comando, contexto e inserção incremental.
- `backend/package-lock.json`, `extension/package-lock.json`: dependências fixadas.
- Referência: https://github.com/anomalyco/opencode

## Pendências

- Configurar uma chave real em `backend/.env` localmente.
- Testar manualmente em uma janela de desenvolvimento do VS Code com um provedor ativo.
- Opcional: adicionar testes automatizados HTTP e testes de integração da extensão.

## Próxima ação

Executar backend e extensão em ambiente local, validar uma geração completa e registrar eventuais ajustes em novo commit.
