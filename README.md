# Meu OpenCode Assistant

Assistente de código privado para VS Code com backend local em Node.js, integração com provedores compatíveis com a API da OpenAI e resposta incremental via Server-Sent Events (SSE).

## Estrutura

- `backend/src/server.ts`: API Express local, validação de entrada, prompt de sistema, chamada `stream: true`, eventos SSE e encerramento limpo da conexão.
- `extension/src/extension.ts`: comando `meu-opencode.gerarCodigo`, captura da seleção e linguagem do arquivo, requisição ao backend e inserção incremental no editor.
- `PROJECT_STATE.md`: estado compacto e recuperável do projeto.

A implementação é um recorte independente inspirado nos princípios do OpenCode oficial — contexto explícito, sessões/eventos e streaming — e não uma cópia integral do monorepo ou da extensão oficial.

## Executar o backend

```bash
cd backend
npm install
cp .env.example .env
# edite .env e defina OPENAI_API_KEY
npm run dev
```

O servidor escuta por padrão em `http://127.0.0.1:3000`. O endpoint de streaming é `POST /api/chat/stream`. O provedor pode ser OpenAI ou outro endpoint compatível, como DeepSeek, usando `OPENAI_BASE_URL` e `OPENAI_MODEL`.

## Executar a extensão

```bash
cd extension
npm install
npm run compile
```

Abra a pasta `extension` no VS Code, pressione `F5` e execute **Meu OpenCode: Gerar código** pela Command Palette. O backend mantém a chave do provedor; a extensão envia somente o pedido, o código selecionado e a linguagem.

## Verificações

```bash
cd backend && npm run build
cd ../extension && npm run check-types
```

## Referência técnica

A arquitetura foi conferida no [repositório oficial do OpenCode](https://github.com/anomalyco/opencode), na documentação oficial de [plugins e eventos](https://opencode.ai/docs/plugins/) e na extensão publicada para [VS Code](https://marketplace.visualstudio.com/items?itemName=sst-dev.opencode).
