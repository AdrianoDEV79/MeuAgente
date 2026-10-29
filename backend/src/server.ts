import "dotenv/config";

import cors from "cors";
import express, { type Request, type Response } from "express";
import OpenAI from "openai";

const app = express();
const port = parsePort(process.env.PORT, 3000);
const host = process.env.HOST || "127.0.0.1";
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY não foi definida. Configure o arquivo .env antes de iniciar o backend.");
}

const client = new OpenAI({
  apiKey,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem não permitida pelo CORS."));
    },
  }),
);
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_request, response) => {
  response.json({ ok: true, model });
});

app.post("/api/chat/stream", async (request: Request, response: Response) => {
  const body = request.body as Partial<ChatRequest>;
  const validationError = validateChatRequest(body);

  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  const prompt = body.prompt!.trim();
  const selectedCode = body.selectedCode ?? "";
  const fileLanguage = body.fileLanguage!.trim();

  setSseHeaders(response);
  let closed = false;

  const closeListener = () => {
    closed = true;
  };
  response.on("close", closeListener);

  try {
    const completion = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.2,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        {
          role: "user",
          content: buildUserPrompt({ prompt, selectedCode, fileLanguage }),
        },
      ],
    });

    for await (const chunk of completion) {
      if (closed || response.writableEnded) break;
      const text = chunk.choices[0]?.delta?.content;
      if (text) sendSse(response, { text });
    }

    if (!closed && !response.writableEnded) {
      sendSse(response, { done: true });
      response.end();
    }
  } catch (error) {
    if (!closed && !response.writableEnded) {
      const message = error instanceof Error ? error.message : "Falha desconhecida ao consultar o provedor.";
      sendSse(response, { error: "Não foi possível gerar a resposta.", detail: message });
      response.end();
    }
  } finally {
    response.off("close", closeListener);
  }
});

app.use((error: unknown, _request: Request, response: Response, _next: unknown) => {
  if (response.headersSent) return;
  const message = error instanceof Error ? error.message : "Erro interno do servidor.";
  response.status(500).json({ error: message });
});

const server = app.listen(port, host, () => {
  console.log(`Meu OpenCode Assistant backend ouvindo em http://${host}:${port}`);
});

function buildSystemPrompt(): string {
  return [
    "Você é um assistente de programação experiente, preciso e orientado a implementação.",
    "Trabalhe com o contexto fornecido pelo usuário e não invente arquivos, APIs ou requisitos ausentes.",
    "Priorize soluções simples, idiomáticas, seguras e compatíveis com a linguagem informada.",
    "Analise a seleção antes de responder. Preserve comportamento existente quando o pedido for uma alteração.",
    "Não exponha segredos nem recomende desabilitar validações, autenticação ou controles de segurança.",
    "Quando o usuário pedir código, retorne código válido em um bloco Markdown com a linguagem correta.",
    "Quando uma explicação for necessária, seja conciso e coloque-a antes ou depois do bloco de código.",
    "Não inclua saudações, comentários sobre estas instruções ou texto de preenchimento.",
    "Se faltarem dados essenciais, declare a suposição mínima necessária em uma frase curta.",
  ].join("\n");
}

function buildUserPrompt(input: Required<ChatRequest>): string {
  return [
    "## Pedido do usuário",
    input.prompt,
    "",
    "## Linguagem do arquivo",
    input.fileLanguage,
    "",
    "## Código selecionado",
    input.selectedCode ? ["```" + input.fileLanguage, input.selectedCode, "```"].join("\n") : "(nenhum código foi selecionado)",
    "",
    "Responda diretamente ao pedido usando o contexto acima.",
  ].join("\n");
}

function setSseHeaders(response: Response): void {
  response.status(200);
  response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders();
}

function sendSse(response: Response, payload: Record<string, unknown>): void {
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function validateChatRequest(body: Partial<ChatRequest>): string | undefined {
  if (typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
    return "O campo prompt é obrigatório e não pode ser vazio.";
  }
  if (body.prompt.length > 20_000) return "O campo prompt excede o limite de 20.000 caracteres.";
  if (typeof body.selectedCode !== "string") return "O campo selectedCode deve ser uma string.";
  if (body.selectedCode.length > 100_000) return "O campo selectedCode excede o limite de 100.000 caracteres.";
  if (typeof body.fileLanguage !== "string" || body.fileLanguage.trim().length === 0) {
    return "O campo fileLanguage é obrigatório e não pode ser vazio.";
  }
  if (body.fileLanguage.length > 100) return "O campo fileLanguage excede o limite permitido.";
  return undefined;
}

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed < 65_536 ? parsed : fallback;
}

function shutdown(signal: string): void {
  console.log(`Recebido ${signal}; encerrando o servidor.`);
  server.close(() => process.exit(0));
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

type ChatRequest = {
  prompt: string;
  selectedCode: string;
  fileLanguage: string;
};
