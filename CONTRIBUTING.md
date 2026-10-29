# Contribuindo

## Antes de começar

Use Node.js 20 ou superior. Instale as dependências em `backend` e `extension`. Não commite chaves, arquivos `.env`, `node_modules`, diretórios de build ou logs.

## Fluxo recomendado

Crie uma branch com nome descritivo, faça uma alteração pequena e atualize a documentação quando o comportamento público mudar. Preserve o contrato de `POST /api/chat/stream` ou documente explicitamente qualquer mudança incompatível.

Antes de abrir uma contribuição, execute:

```bash
cd backend
npm run build
cd ../extension
npm run check-types
```

Também execute `git diff --check` e confirme que `git status` não mostra arquivos sensíveis ou gerados.

## Critérios de revisão

A revisão deve verificar tipagem, tratamento de erros, cancelamento do stream, limites de entrada, privacidade da chave de API e compatibilidade com Node.js 20. Alterações no protocolo SSE precisam atualizar `docs/api.md` e, quando necessário, a extensão e os exemplos do README.

Mensagens de commit devem ser curtas e descritivas. Prefira o formato `tipo: descrição`, como `fix: handle closed SSE clients` ou `docs: explain local setup`.

## Reporte de problemas

Inclua sistema operacional, versão do Node.js, versão do VS Code, comando executado, comportamento esperado, comportamento observado e logs sem segredos. Nunca cole chaves de API ou conteúdo privado do projeto.
