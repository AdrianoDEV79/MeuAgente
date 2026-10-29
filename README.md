# Meu OpenCode Assistant

Um assistente de programação que funciona dentro do VS Code.

Você seleciona um trecho de código, escreve o que quer fazer e recebe a resposta diretamente no arquivo. A parte que conversa com a inteligência artificial roda no seu próprio computador.

## Antes de começar

Você precisa ter:

- Node.js 20 ou mais recente;
- VS Code;
- uma ou mais chaves de serviços compatíveis com OpenAI, como OpenAI, DeepSeek, Groq ou OpenRouter.

## 1. Preparar o servidor

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
npm install
cp .env.example .env
```

Abra o arquivo `backend/.env` e configure os servidores que deseja usar. Por exemplo:

```env
LLM_PROVIDERS=openai,deepseek

OPENAI_API_KEY=sua-chave-openai
OPENAI_MODEL=gpt-4o-mini

DEEPSEEK_API_KEY=sua-chave-deepseek
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Depois inicie o servidor:

```bash
npm run dev
```

Deixe esse terminal aberto. O servidor fica disponível em `http://localhost:3000`.

## 2. Preparar a extensão do VS Code

Abra outro terminal e execute:

```bash
cd extension
npm install
npm run compile
```

Depois:

1. abra a pasta `extension` no VS Code;
2. pressione `F5`;
3. uma nova janela do VS Code será aberta;
4. abra um arquivo de código e selecione um trecho;
5. pressione `Ctrl+Shift+P`;
6. procure por **Meu OpenCode: Gerar código**;
7. escreva o que você quer fazer.

A resposta aparecerá abaixo do código selecionado.

## Usando vários servidores

Você pode deixar várias chaves configuradas ao mesmo tempo. O valor de `LLM_PROVIDERS` define quais opções aparecem no VS Code. Ao executar o comando, a extensão mostra uma lista e você escolhe o servidor e o modelo daquela geração.

Cada ID usa variáveis com o mesmo prefixo em letras maiúsculas. Para adicionar outro servidor compatível, acrescente o ID à lista e configure sua chave, endereço e modelo:

```env
LLM_PROVIDERS=openai,deepseek,groq,openrouter

GROQ_API_KEY=sua-chave-groq
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_NAME=Groq

OPENROUTER_API_KEY=sua-chave-openrouter
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
OPENROUTER_NAME=OpenRouter Free
```

Depois de alterar o `.env`, pare e inicie o backend novamente. As chaves nunca são enviadas à extensão nem aparecem no catálogo de provedores; somente o nome, o ID e o modelo são retornados.

## Se aparecer um erro

**“Não foi possível conectar ao backend local”**: verifique se `npm run dev` ainda está rodando na pasta `backend`.

**Erro de chave ou modelo**: confira `LLM_PROVIDERS` e as variáveis do provedor escolhido no arquivo `.env`.

**A extensão não aparece no VS Code**: abra a pasta `extension` e pressione `F5` novamente. O comando só aparece na janela de desenvolvimento aberta pelo VS Code.

**A resposta não aparece no lugar certo**: selecione o código antes de executar o comando. Também verifique se o arquivo não foi alterado enquanto a resposta estava sendo gerada.

## Pastas importantes

- `backend`: servidor local e conexão com o serviço de inteligência artificial.
- `extension`: extensão que funciona dentro do VS Code.
- `docs`: explicações técnicas para quem quiser entender mais.
- `PROJECT_STATE.md`: resumo do estado atual do projeto.

## Comandos para verificar se está tudo certo

```bash
cd backend
npm run build

cd ../extension
npm run check-types
```

Se os dois comandos terminarem sem erro, a parte técnica está compilando corretamente.

## Privacidade

Sua chave fica somente no arquivo `backend/.env` e não deve ser enviada ao Git. O texto selecionado e o pedido que você escrever serão enviados ao serviço de inteligência artificial configurado. Não selecione senhas, tokens ou informações confidenciais.

## Documentação adicional

- [Guia rápido da extensão](extension/vsc-extension-quickstart.md)
- [Como a arquitetura funciona](docs/architecture.md)
- [Detalhes da API](docs/api.md)
- [Como contribuir](CONTRIBUTING.md)
- [Segurança](SECURITY.md)
- [Histórico de mudanças](CHANGELOG.md)
- [Memória do projeto](MEMORY_PROJECT.md): ponto de partida para continuar o trabalho.

## Licença

Este projeto usa a [licença MIT](LICENSE).
