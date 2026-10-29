# Meu OpenCode Assistant

Um assistente de programação que funciona dentro do VS Code.

Você seleciona um trecho de código, escreve o que quer fazer e recebe a resposta diretamente no arquivo. A parte que conversa com a inteligência artificial roda no seu próprio computador.

## Antes de começar

Você precisa ter:

- Node.js 20 ou mais recente;
- VS Code;
- uma chave de API de um serviço compatível com OpenAI, como OpenAI ou DeepSeek.

## 1. Preparar o servidor

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
npm install
cp .env.example .env
```

Abra o arquivo `backend/.env` e coloque sua chave nesta linha:

```env
OPENAI_API_KEY=sua-chave-aqui
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

## Usando DeepSeek ou outro serviço

O padrão usa OpenAI. Para usar outro serviço compatível, edite o arquivo `backend/.env`:

```env
OPENAI_API_KEY=sua-chave-aqui
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

Depois pare e inicie o servidor novamente.

## Se aparecer um erro

**“Não foi possível conectar ao backend local”**: verifique se `npm run dev` ainda está rodando na pasta `backend`.

**Erro de chave ou modelo**: confira `OPENAI_API_KEY`, `OPENAI_BASE_URL` e `OPENAI_MODEL` no arquivo `.env`.

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

## Licença

Este projeto usa a [licença MIT](LICENSE).
