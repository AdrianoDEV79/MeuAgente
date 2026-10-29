# Estado do projeto

## O que é

Assistente de programação para VS Code. O usuário seleciona código, escreve um pedido e recebe a resposta no mesmo arquivo.

## Como funciona

- `backend`: servidor local em `http://127.0.0.1:3000`.
- `extension`: extensão do VS Code.
- Comunicação: `GET /api/providers` para catálogo e `POST /api/chat/stream` com resposta em tempo real via SSE.
- Chave de API: somente em `backend/.env`; nunca deve ir para o Git.

## Já pronto

- Backend Express + TypeScript.
- Integração com SDK compatível com OpenAI.
- Suporte a `OPENAI_BASE_URL` para serviços como DeepSeek.
- Catálogo de vários provedores via `LLM_PROVIDERS`, com seleção no VS Code.
- Suporte a servidores OpenAI-compatible personalizados por prefixo de variáveis.
- Extensão com comando `meu-opencode.gerarCodigo`.
- Captura de seleção e linguagem do arquivo.
- Inserção progressiva da resposta no editor.
- README e guias simplificados.
- Build do backend e verificação de tipos da extensão funcionando.

## Falta fazer

- Testar manualmente no VS Code com uma chave válida.
- Criar testes automatizados HTTP.
- Criar testes de integração da extensão.
- Adicionar sessões, histórico e painel visual, se forem necessários no futuro.

## Documentos principais

- `README.md`: guia para começar.
- `docs/architecture.md`: explicação técnica.
- `docs/api.md`: contrato do backend.
- `CONTRIBUTING.md`: contribuição e revisão.
- `SECURITY.md`: segurança e privacidade.
- `CHANGELOG.md`: histórico de mudanças.
- `MEMORY_PROJECT.md`: memória completa para instalações e implementações futuras.
