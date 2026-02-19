export type WebhookEvent = "ORDER_CREATED" | "STATUS_UPDATED" | "CART_OPENED";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface WebhookPayload {
    eventId: string;
    event: WebhookEvent;
    data: Record<string, unknown>;
    timestamp: string;
    source: string;
    userAgent: string;
    pageUrl?: string;
    referrer?: string;
    app?: {
        name: string;
        version?: string;
        env?: string;
    };
}

type WebhookServiceOptions = {
    url?: string;
    appName?: string;
    appVersion?: string;
    env?: string;
    timeoutMs?: number;
    enableQueue?: boolean;
    queueKey?: string;
    maxQueueSize?: number;
};

function uuid(): string {
    // Usa crypto.randomUUID si está disponible
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as Crypto).randomUUID();
    }
    // Fallback simple
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeJsonStringify(value: unknown): string {
    const seen = new WeakSet<object>();
    return JSON.stringify(value, (_key, val) => {
        if (typeof val === "bigint") return val.toString();
        if (typeof val === "object" && val !== null) {
            if (seen.has(val as object)) return "[Circular]";
            seen.add(val as object);
        }
        return val;
    });
}

function isBrowser(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
}

class WebhookService {
    private url?: string;
    private timeoutMs: number;
    private enableQueue: boolean;
    private queueKey: string;
    private maxQueueSize: number;

    private appName: string;
    private appVersion?: string;
    private env?: string;

    constructor(opts: WebhookServiceOptions = {}) {
        this.url = opts.url ?? process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

        this.timeoutMs = opts.timeoutMs ?? 6000;
        this.enableQueue = opts.enableQueue ?? true;
        this.queueKey = opts.queueKey ?? "pp:webhookQueue:v1";
        this.maxQueueSize = opts.maxQueueSize ?? 50;

        this.appName = opts.appName ?? "PuntoPizza-Web";
        this.appVersion = opts.appVersion;
        this.env = opts.env ?? process.env.NODE_ENV;

        // Flush automático en cliente
        if (isBrowser() && this.enableQueue) {
            window.addEventListener("online", () => void this.flushQueue());
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") void this.flushQueue();
            });
        }
    }

    private buildPayload(event: WebhookEvent, data: Record<string, unknown>): WebhookPayload {
        const source = isBrowser() ? window.location.origin : "server";
        const userAgent = isBrowser() ? window.navigator.userAgent : "server-side";

        return {
            eventId: uuid(),
            event,
            data,
            timestamp: new Date().toISOString(),
            source,
            userAgent,
            pageUrl: isBrowser() ? window.location.href : undefined,
            referrer: isBrowser() ? document.referrer || undefined : undefined,
            app: {
                name: this.appName,
                version: this.appVersion,
                env: this.env
            }
        };
    }

    private readQueue(): WebhookPayload[] {
        if (!isBrowser()) return [];
        try {
            const raw = window.localStorage.getItem(this.queueKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as unknown;
            if (!Array.isArray(parsed)) return [];
            return parsed as WebhookPayload[];
        } catch {
            return [];
        }
    }

    private writeQueue(queue: WebhookPayload[]) {
        if (!isBrowser()) return;
        try {
            window.localStorage.setItem(this.queueKey, JSON.stringify(queue.slice(-this.maxQueueSize)));
        } catch {
            // Si localStorage está lleno o bloqueado, no hacemos nada
        }
    }

    private enqueue(payload: WebhookPayload) {
        if (!this.enableQueue || !isBrowser()) return;
        const q = this.readQueue();
        q.push(payload);
        this.writeQueue(q);
    }

    private dequeueAll(): WebhookPayload[] {
        if (!isBrowser()) return [];
        const q = this.readQueue();
        this.writeQueue([]);
        return q;
    }

    private async postPayload(payload: WebhookPayload): Promise<void> {
        if (!this.url) throw new Error("n8n URL missing");

        const body = safeJsonStringify(payload);

        // 1) Intento con Beacon (best effort; sin headers custom)
        if (isBrowser() && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            const blob = new Blob([body], { type: "application/json" });
            const sent = navigator.sendBeacon(this.url, blob);
            if (sent) return;
        }

        // 2) Fetch con timeout + keepalive
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const res = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Source": this.appName
                },
                body,
                keepalive: true,
                signal: controller.signal
            });

            if (!res.ok) {
                // lee body si existe para debug (sin romper)
                let text = "";
                try {
                    text = await res.text();
                } catch { }
                throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
            }
        } finally {
            clearTimeout(t);
        }
    }

    /**
     * Envía un evento. Si falla, opcionalmente lo encola para reintentar luego (cliente).
     */
    async sendEvent(event: WebhookEvent, data: Record<string, unknown>) {
        if (!this.url) {
            console.warn(`[WebhookService] n8n URL missing. Event '${event}' skipped.`);
            return;
        }

        const payload = this.buildPayload(event, data);

        try {
            await this.postPayload(payload);
            // log opcional (yo lo dejaría detrás de un flag)
            // console.log(`[WebhookService] Sent '${event}'`, payload.eventId);
        } catch (err) {
            console.error(`[WebhookService] Failed '${event}' (${payload.eventId})`, err);
            this.enqueue(payload);
        }
    }

    /**
     * Reintenta enviar lo que quedó en cola.
     */
    async flushQueue() {
        if (!this.enableQueue || !isBrowser()) return;
        if (!navigator.onLine) return;

        const queued = this.dequeueAll();
        if (queued.length === 0) return;

        // Reintento secuencial para no saturar
        for (const payload of queued) {
            try {
                await this.postPayload(payload);
            } catch (err) {
                // si vuelve a fallar, lo reencolamos al final
                console.error(`[WebhookService] Flush failed (${payload.eventId})`, err);
                this.enqueue(payload);
                // corta para evitar loop si el endpoint está caído
                break;
            }
        }
    }
}

export const webhookService = new WebhookService();
