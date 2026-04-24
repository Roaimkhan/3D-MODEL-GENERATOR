import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LooseRecord = Record<string, unknown>;

type ModelUrls = {
  glb?: string;
  fbx?: string;
  obj?: string;
  stl?: string;
  usdz?: string;
};

function toObject(value: unknown): LooseRecord {
  return typeof value === "object" && value !== null ? (value as LooseRecord) : {};
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

function normalizeStatus(payload: unknown): string {
  const obj = toObject(payload);
  const data = toObject(obj.data);
  const candidate = obj.status ?? data.status ?? obj.state ?? data.state;
  return typeof candidate === "string" ? candidate.toUpperCase() : "UNKNOWN";
}

function normalizeModelUrls(payload: unknown): ModelUrls {
  const obj = toObject(payload);
  const data = toObject(obj.data);
  const urls = toObject(obj.model_urls ?? obj.modelUrls ?? data.model_urls ?? data.modelUrls);

  const out: ModelUrls = {};

  const keys: Array<keyof ModelUrls> = ["glb", "fbx", "obj", "stl", "usdz"];
  for (const key of keys) {
    const value = urls[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value;
    }
  }

  return out;
}

function buildStatusUrl(base: string, pathTemplate: string, taskId: string): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = pathTemplate.startsWith("/") ? pathTemplate : `/${pathTemplate}`;

  if (normalizedPath.includes("{taskId}")) {
    return `${normalizedBase}${normalizedPath.replace("{taskId}", encodeURIComponent(taskId))}`;
  }

  return `${normalizedBase}${normalizedPath.replace(/\/+$/, "")}/${encodeURIComponent(taskId)}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;

  if (!taskId) {
    return NextResponse.json({ error: "Task id is required." }, { status: 400 });
  }

  try {
    const backendBaseUrl = process.env.BACKEND_BASE_URL;

    if (backendBaseUrl) {
      const statusPath = process.env.BACKEND_STATUS_PATH ?? "/preview-task/{taskId}";
      const endpoint = buildStatusUrl(backendBaseUrl, statusPath, taskId);

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json(
          { error: readErrorMessage(payload) ?? "Backend status request failed." },
          { status: response.status },
        );
      }

      return NextResponse.json({
        status: normalizeStatus(payload),
        modelUrls: normalizeModelUrls(payload),
      });
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

    const response = await fetch(`https://api.meshy.ai/openapi/v2/text-to-3d/${encodeURIComponent(taskId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${meshyApiKey}`,
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: readErrorMessage(payload) ?? "Meshy status request failed." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      status: normalizeStatus(payload),
      modelUrls: normalizeModelUrls(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
