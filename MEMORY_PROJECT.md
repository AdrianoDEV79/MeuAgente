# MEMORY_PROJECT

Arquivo de retomada do projeto **BrotherCode**. Leia este arquivo antes de continuar instalações ou implementar novas funcionalidades.

## Objetivo

Construir um assistente de programação privado para VS Code. O usuário seleciona código, escreve um pedido, escolhe um servidor de LLM e recebe a resposta progressivamente abaixo da seleção.

## Local e Git

- Caminho atual: `/home/ubuntu/meu-opencode-assistant`
- Branch: `main`
- Estado no momento desta memória: working tree limpo.
- Não existe remoto Git configurado neste ambiente.
- Último commit: `9ecc759 feat: support multiple LLM providers`

Commits anteriores importantes:

- `a930fb2 feat: add private VS Code coding assistant`
- `7535001 docs: simplify project onboarding`
- `9ecc759 feat: support multiple LLM providers`

## Estrutura atual

- `backend`: servidor local Node.js, Express e TypeScript.
- `backend/src/server.ts`: API, catálogo de provedores, prompt, streaming SSE e encerramento de conexão.
- `backend/.env.example`: modelo de configuração de vários servidores.
- `backend/package.json`: dependências e scripts do backend.
- `extension`: extensão TypeScript para VS Code.
- `extension/src/extension.ts`: comando, captura de contexto, seleção de provedor e inserção incremental.
- `extension/package.json`: comando e configuração `meu-opencode.backendUrl`.
- `docs/architecture.md`: arquitetura.
- `docs/api.md`: endpoints e eventos SSE.
- `README.md`: guia simples para usuários.
- `PROJECT_STATE.md`: resumo curto do estado.
- `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `LICENSE`: organização do repositório.

## Funcionalidades implementadas

### Backend

- Express + TypeScript.
- `GET /health`.
- `GET /api/providers`.
- `POST /api/chat/stream`.
- Streaming com `stream: true` usando o SDK `openai`.
- Eventos SSE com fragmentos `{ "text": "..." }` e final `{ "done": true }`.
- Erros durante o stream enviados como evento SSE.
- Validação de `prompt`, `selectedCode`, `fileLanguage` e `provider`.
- Limites de entrada: prompt de 20.000 caracteres, código selecionado de 100.000 caracteres e linguagem de 100 caracteres.
- CORS configurável.
- Host padrão `127.0.0.1` e porta padrão `3000`.
- Cancelamento lógico quando o cliente fecha a resposta.
- Prompt de sistema orientado a programação segura e concisa.

### Vários provedores

O backend lê os IDs da variável `LLM_PROVIDERS`, separados por vírgula. Cada ID usa variáveis com o mesmo prefixo em maiúsculas:

```env
LLM_PROVIDERS=openai,deepseek,groq,openrouter

OPENAI_API_KEY=sua-chave
OPENAI_MODEL=gpt-4o-mini

DEEPSEEK_API_KEY=sua-chave
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

GROQ_API_KEY=sua-chave
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_NAME=Groq
```

Também são aceitos servidores OpenAI-compatible personalizados. O backend cria um cliente separado por provedor. A extensão recebe somente `id`, `name` e `model`; as API keys nunca são retornadas para ela.

Se `provider` não for enviado no payload, o primeiro provedor configurado é usado. A extensão consulta `/api/providers` e mostra um seletor antes de cada geração.

### Extensão VS Code

- Comando: `meu-opencode.gerarCodigo`.
- Lê o editor ativo, o código selecionado e `languageId`.
- Solicita a instrução do usuário.
- Busca os provedores configurados.
- Permite escolher servidor/modelo.
- Consome SSE com `ReadableStream`.
- Insere os fragmentos em sequência abaixo da seleção.
- Permite cancelar a geração.
- Mostra erros e mensagens no VS Code.

## Instalação do zero

### Requisitos

- Node.js 20 ou superior.
- npm compatível.
- VS Code 1.94 ou superior.
- Pelo menos uma API key de um servidor compatível com OpenAI.

### Backend

```bash
cd /home/ubuntu/meu-opencode-assistant/backend
npm install
cp .env.example .env
```

Edite `.env`, coloque pelo menos um ID em `LLM_PROVIDERS` e preencha a chave, endpoint e modelo correspondentes. Depois execute:

```bash
npm run dev
```

Para produção local compilada:

```bash
npm run build
npm start
```

### Extensão

```bash
cd /home/ubuntu/meu-opencode-assistant/extension
npm install
npm run compile
```

Abra a pasta `extension` no VS Code, pressione `F5`, abra um arquivo na nova janela e execute **BrotherCode: Gerar código** pela Command Palette.

## Dependências já instaladas neste ambiente

As dependências foram instaladas localmente em `backend/node_modules` e `extension/node_modules`, mas esses diretórios não são versionados. Os arquivos `package-lock.json` estão versionados e permitem reinstalar tudo em outro ambiente com `npm install`.

Backend: `cors`, `dotenv`, `express`, `openai`, TypeScript, `tsx` e tipos Node/Express/CORS.

Extensão: TypeScript, `@types/node` e `@types/vscode`.

## Validações já executadas

- `cd backend && npm run build`: passou.
- `cd extension && npm run check-types`: passou.
- `git diff --check`: passou.
- Catálogo runtime testado com dois provedores configurados usando chaves fictícias; nenhuma chamada real a modelo foi feita.

Ainda não foi feita uma geração manual com API key real em uma janela de desenvolvimento do VS Code.

## Pendências

1. Configurar uma chave real em `backend/.env`.
2. Escolher pelo menos um servidor real para o primeiro teste: OpenAI, DeepSeek, Groq, OpenRouter ou outro OpenAI-compatible.
3. Iniciar o backend e testar `GET http://127.0.0.1:3000/api/providers`.
4. Abrir a extensão com `F5` e testar uma geração completa.
5. Confirmar que a resposta é inserida no local esperado em arquivos com seleção de uma ou várias linhas.
6. Adicionar testes automatizados para `/health`, `/api/providers`, validação e SSE.
7. Adicionar testes de integração da extensão.
8. Decidir se haverá suporte a rotação/fallback entre várias chaves do mesmo provedor.
9. Corrigir ou documentar o comportamento de servidores locais que não exigem API key, como algumas instalações do Ollama; atualmente o carregador exige uma variável de chave não vazia para registrar um provedor.
10. Se o projeto for publicado, configurar um remoto Git, revisar o publisher da extensão e criar um processo de release.
11. Antes de expor o backend fora da máquina local, adicionar autenticação, TLS, controle de acesso e política de retenção de dados.

## Regras para continuar

- Nunca commitar `.env`, API keys, tokens ou conteúdo privado.
- Não adicionar `node_modules`, `backend/dist` ou `extension/out` ao Git.
- Atualizar `README.md` quando uma mudança afetar o usuário comum.
- Atualizar `docs/api.md` quando o payload ou eventos SSE mudarem.
- Atualizar `PROJECT_STATE.md` e este arquivo após marcos importantes.
- Rodar `npm run build` no backend e `npm run check-types` na extensão antes de cada commit.
- Usar commits curtos e descritivos.

## Próximo passo recomendado

Começar pela pendência 1: preencher `backend/.env` com uma API key real e um provedor. Depois executar `/api/providers`, abrir a extensão com `F5` e fazer o primeiro teste manual de geração.
