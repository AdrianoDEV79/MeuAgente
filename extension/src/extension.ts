import * as vscode from "vscode";

const DEFAULT_BACKEND_URL = "http://localhost:3000";
const STREAM_PATH = "/api/chat/stream";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand("meu-opencode.gerarCodigo", async () => {
    await generateCode();
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}

async function generateCode(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showErrorMessage("Abra um arquivo no editor antes de usar o BrotherCode.");
    return;
  }

  const prompt = await vscode.window.showInputBox({
    prompt: "O que você deseja fazer com o código selecionado?",
    placeHolder: "Ex.: refatore para async/await e adicione tratamento de erros",
    ignoreFocusOut: true,
    validateInput: (value) => (value.trim() ? undefined : "Digite uma instrução."),
  });
  if (prompt === undefined) return;

  const providers = await loadProviders(getBackendUrl());
  if (providers.length === 0) {
    void vscode.window.showErrorMessage("Nenhum provedor foi configurado no backend.");
    return;
  }
  const selectedProvider = await vscode.window.showQuickPick(
    providers.map((provider) => ({
      label: provider.name,
      description: `${provider.model} (${provider.id})`,
      provider,
    })),
    { placeHolder: "Escolha o provedor de inteligência artificial" },
  );
  if (!selectedProvider) return;

  const selectedCode = editor.document.getText(editor.selection);
  const fileLanguage = editor.document.languageId || "plaintext";
  const insertionPoint = editor.selection.end;
  const backendUrl = getBackendUrl();
  const controller = new AbortController();
  const progress = vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "BrotherCode está gerando código",
      cancellable: true,
    },
    async (_progress, cancellationToken) => {
      const cancellationListener = cancellationToken.onCancellationRequested(() => controller.abort());
      try {
        await consumeStream(editor, insertionPoint, {
          prompt,
          selectedCode,
          fileLanguage,
          provider: selectedProvider.provider.id,
          backendUrl,
          signal: controller.signal,
        });
      } finally {
        cancellationListener.dispose();
      }
    },
  );

  try {
    await progress;
  } catch (error) {
    if (controller.signal.aborted) {
      void vscode.window.showInformationMessage("Geração cancelada.");
      return;
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    void vscode.window.showErrorMessage(`Não foi possível conectar ao backend local: ${message}`);
  }
}

async function consumeStream(
  editor: vscode.TextEditor,
  insertionPoint: vscode.Position,
  input: StreamInput,
): Promise<void> {
  const response = await fetch(`${input.backendUrl}${STREAM_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      prompt: input.prompt,
      selectedCode: input.selectedCode,
      fileLanguage: input.fileLanguage,
      provider: input.provider,
    }),
    signal: input.signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`backend respondeu HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  if (!response.body) throw new Error("o backend não retornou um corpo de streaming");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let hasInsertedText = false;
  let currentInsertionPoint = insertionPoint;

  try {
    while (true) {
      const { done, value } = await reader.read();
      pending += decoder.decode(value, { stream: !done });
      const events = pending.split("\n\n");
      pending = events.pop() ?? "";

      for (const event of events) {
        const payload = parseSseEvent(event);
        if (!payload) continue;
        if (payload.error) throw new Error(String(payload.detail || payload.error));
        if (payload.done) return;
        if (typeof payload.text !== "string" || payload.text.length === 0) continue;

        const text = hasInsertedText ? payload.text : "\n" + payload.text;
        const inserted = await editor.edit((editBuilder) => {
          editBuilder.insert(currentInsertionPoint, text);
        });
        if (!inserted) throw new Error("o documento foi alterado e a edição não pôde ser aplicada");
        hasInsertedText = true;
        const offsetAfterInsert = editor.document.offsetAt(currentInsertionPoint) + text.length;
        currentInsertionPoint = editor.document.positionAt(offsetAfterInsert);
      }

      if (done) break;
    }
  } finally {
    reader.releaseLock();
  }
}

function parseSseEvent(event: string): SsePayload | undefined {
  const data = event
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data || data === "[DONE]") return undefined;

  try {
    return JSON.parse(data) as SsePayload;
  } catch {
    throw new Error("o backend enviou um evento SSE inválido");
  }
}

function getBackendUrl(): string {
  const configured = vscode.workspace.getConfiguration("meu-opencode").get<string>("backendUrl");
  return (configured || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

type StreamInput = {
  prompt: string;
  selectedCode: string;
  fileLanguage: string;
  provider: string;
  backendUrl: string;
  signal: AbortSignal;
};

type SsePayload = {
  text?: string;
  done?: boolean;
  error?: string;
  detail?: string;
};

type Provider = {
  id: string;
  name: string;
  model: string;
};

async function loadProviders(backendUrl: string): Promise<Provider[]> {
  try {
    const response = await fetch(`${backendUrl}/api/providers`);
    if (!response.ok) return [];
    const body = (await response.json()) as { providers?: Provider[] };
    return Array.isArray(body.providers) ? body.providers : [];
  } catch {
    return [];
  }
}
