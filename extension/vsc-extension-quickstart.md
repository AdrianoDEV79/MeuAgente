# Guia rápido

## O que você precisa

- Node.js 20 ou mais recente;
- VS Code;
- o backend funcionando na porta 3000.

## Instalar

Na pasta `extension`, execute:

```bash
npm install
npm run compile
```

## Abrir no VS Code

1. Abra a pasta `extension` no VS Code.
2. Pressione `F5`.
3. O VS Code abrirá uma nova janela para testar a extensão.
4. Abra um arquivo de código nessa nova janela.
5. Selecione o trecho que deseja alterar.
6. Pressione `Ctrl+Shift+P`.
7. Execute **BrotherCode: Gerar código**.
8. Escreva o pedido, por exemplo: `adicione tratamento de erro`.
9. Escolha um dos provedores configurados no backend.

A resposta será inserida abaixo da seleção.

Para mostrar mais opções nessa lista, configure `LLM_PROVIDERS` e as chaves correspondentes em `backend/.env`. Consulte o README principal para ver um exemplo com OpenAI, DeepSeek e outros servidores compatíveis.

## Se o backend estiver em outro endereço

O endereço padrão é `http://localhost:3000`. Para mudar:

1. abra as configurações da janela de desenvolvimento;
2. procure por `BrotherCode`;
3. altere `meu-opencode.backendUrl`.

## Desenvolvimento

Use `npm run watch` para recompilar automaticamente enquanto edita o código. Use `npm run check-types` para verificar os tipos sem gerar arquivos.
