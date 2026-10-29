# Meu OpenCode Assistant

## Backend

1. Entre em `../backend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e configure `OPENAI_API_KEY`.
4. Execute `npm run dev`.

O backend escuta por padrão em `http://localhost:3000`.

## Extensão

1. Entre em `extension`.
2. Execute `npm install` e depois `npm run compile`.
3. Abra a pasta `extension` no VS Code.
4. Pressione `F5` para abrir uma janela de desenvolvimento.
5. Em um editor com código selecionado, execute **Meu OpenCode: Gerar código** pela Command Palette.

A extensão envia apenas o prompt, a seleção e a linguagem do arquivo ao backend. A chave do provedor permanece no backend local e nunca é exposta à extensão.
