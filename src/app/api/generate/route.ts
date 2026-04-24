import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LooseRecord = Record<string, unknown>;

function toObject(value: unknown): LooseRecord {
  return typeof value === "object" && value !== null ? (value as LooseRecord) : {};
}

function extractTaskId(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) return payload.trim();

  const obj = toObject(payload);
  const data = toObject(obj.data);

  const candidates = [
    obj.task_id,
    obj.taskId,
    obj.id,
    obj.result,
    data.task_id,
    data.taskId,
    data.id,
    data.result,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function buildStartUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function readErrorMessage(payload: unknown): string | null {
  const obj = toObject(payload);
  const data = toObject(obj.data);
  const candidates = [obj.error, obj.message, data.error, data.message];

  for (const item of candidates) {
    if (typeof item === "string" && item.trim()) return item;
  }

  return null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const backendBaseUrl = process.env.BACKEND_BASE_URL;

    if (backendBaseUrl) {
      const startPath = process.env.BACKEND_START_PATH ?? "/start-preview-task";
      const endpoint = buildStartUrl(backendBaseUrl, startPath);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "preview", prompt }),
        cache: "no-store",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json(
          { error: readErrorMessage(payload) ?? "Backend request failed." },
          { status: response.status },
        );
      }

      const taskId = extractTaskId(payload);
      if (!taskId) {
        return NextResponse.json(
          { error: "Backend response did not include a task id." },
          { status: 502 },
        );
      }

      return NextResponse.json({ taskId });
    }

    const meshyApiKey = process.env.MESHY_API;
    if (!meshyApiKey) {
      return NextResponse.json(
        {
          error:
            "Server is not configured. Set BACKEND_BASE_URL (preferred) or MESHY_API in environment.",
        },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.meshy.ai/openapi/v2/text-to-3d", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${meshyApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode: "preview", prompt }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: readErrorMessage(payload) ?? "Meshy request failed." },
        { status: response.status },
      );
    }

    const taskId = extractTaskId(payload);
    if (!taskId) {
      return NextResponse.json({ error: "Meshy response did not include a task id." }, { status: 502 });
    }

    return NextResponse.json({ taskId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
