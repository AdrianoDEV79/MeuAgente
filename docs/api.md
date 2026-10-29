# API

## `GET /health`

Retorna o estado básico do servidor:

```json
{
  "ok": true,
  "model": "gpt-4o-mini"
}
```

## `POST /api/chat/stream`

Content-Type da requisição: `application/json`.

Payload:

```json
{
  "prompt": "Explique e corrija este trecho",
  "selectedCode": "const value = input;",
  "fileLanguage": "typescript"
}
```

`prompt` e `fileLanguage` são obrigatórios. `selectedCode` pode ser vazio, mas deve ser uma string. O backend limita `prompt` a 20.000 caracteres, a seleção a 100.000 caracteres e o idioma a 100 caracteres.

A resposta tem os cabeçalhos `Content-Type: text/event-stream`, `Cache-Control: no-cache` e `Connection: keep-alive`. Cada evento é encerrado por duas quebras de linha:

```text
data: {"text":"const "}

data: {"text":"value = 1;"}

data: {"done":true}
```

Quando o provedor falha depois do início da resposta, o backend envia:

```text
data: {"error":"Não foi possível gerar a resposta.","detail":"mensagem técnica"}
```

O cliente deve tratar `detail` como informação de diagnóstico e não como texto para inserir no editor. O cliente também deve cancelar a leitura quando o usuário abortar a operação.

## Exemplo com cURL

Com o backend em execução:

```bash
curl -N http://127.0.0.1:3000/api/chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Adicione um comentário curto","selectedCode":"const answer = 42;","fileLanguage":"javascript"}'
```
