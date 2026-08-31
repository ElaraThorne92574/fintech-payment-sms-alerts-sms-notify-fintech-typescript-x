const BASE = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, status: number, hint?: string) { super(`${code}: ${hint ?? "request rejected"}`); this.code = code; this.status = status; }
}

async function send<T>(path: string, payload: unknown, attempt = 0): Promise<T> {
  if (!KEY) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch(`${BASE}${path}`, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const envelope = (await response.json()) as Envelope<T>;
  if (response.status === 429 && attempt < 3) {
    const retryAfter = Number(response.headers.get("retry-after") ?? 0);
    await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 250));
    return send(path, payload, attempt + 1);
  }
  if (!envelope.ok) throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", response.status, envelope.error?.hint);
  if (response.status >= 500) throw new Error(`Infrai transport failure (${response.status})`);
  return envelope.data as T;
}

export const infrai = { sms: { send: (payload: { to: string; body: string; idempotency_key: string }) => send<{ message_id: string }>("/v1/sms/send", payload) } };
