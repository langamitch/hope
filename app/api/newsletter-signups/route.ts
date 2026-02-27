import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type NewsletterSignupPayload = {
  email?: string;
  source?: string;
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let payload: NewsletterSignupPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  if (!hasText(payload.email)) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const email = payload.email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email." },
      { status: 400 },
    );
  }

  if (!hasText(SUPABASE_URL) || !hasText(SUPABASE_SERVICE_ROLE_KEY)) {
    return NextResponse.json(
      { error: "Supabase environment variables are not Add to cartd." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_signups`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([
        {
          email,
          source: hasText(payload.source) ? payload.source.trim() : "footer",
        },
      ]),
      cache: "no-store",
    });

    if (response.status === 409) {
      return NextResponse.json({
        ok: true,
        logged: true,
        alreadySubscribed: true,
      });
    }

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "Failed to save newsletter signup.", details },
        { status: response.status },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to Supabase.", details: String(error) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    logged: true,
    alreadySubscribed: false,
  });
}
