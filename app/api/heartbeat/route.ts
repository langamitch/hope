import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEARTBEAT_INTERVAL_MS = (6 * 24 + 23) * 60 * 60 * 1000;
const HEARTBEAT_INTERVAL_SECONDS = Math.floor(HEARTBEAT_INTERVAL_MS / 1000);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HEARTBEAT_SECRET = process.env.HEARTBEAT_SECRET;

type HeartbeatResult = {
  logged: boolean;
  created_at: string;
  last_created_at: string | null;
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const getBearerToken = (value: string | null) => {
  if (!hasText(value) || !value.startsWith("Bearer ")) {
    return null;
  }

  return value.slice("Bearer ".length).trim();
};

const getRequestSecret = (request: Request) => {
  const headerSecret = request.headers.get("x-heartbeat-secret")?.trim();
  if (hasText(headerSecret)) {
    return headerSecret;
  }

  return getBearerToken(request.headers.get("authorization"));
};

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });

export async function GET(request: Request) {
  if (!hasText(HEARTBEAT_SECRET)) {
    return json({ error: "Heartbeat secret is not configured." }, 500);
  }

  if (getRequestSecret(request) !== HEARTBEAT_SECRET) {
    return json({ error: "Unauthorized." }, 401);
  }

  if (!hasText(SUPABASE_URL) || !hasText(SUPABASE_SERVICE_ROLE_KEY)) {
    return json({ error: "Supabase environment variables are not configured." }, 500);
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .rpc("log_heartbeat_if_due", {
        p_status: "alive",
        p_interval_seconds: HEARTBEAT_INTERVAL_SECONDS,
      })
      .single<HeartbeatResult>();

    if (error) {
      console.error("Heartbeat RPC failed:", error.message);
      return json({ error: "Failed to log heartbeat." }, 500);
    }

    return json({
      ok: true,
      logged: data.logged,
      createdAt: data.logged ? data.created_at : null,
      lastCreatedAt: data.last_created_at,
      intervalMs: HEARTBEAT_INTERVAL_MS,
    });
  } catch (error) {
    console.error("Unexpected heartbeat error:", error);
    return json({ error: "Unexpected heartbeat failure." }, 500);
  }
}
