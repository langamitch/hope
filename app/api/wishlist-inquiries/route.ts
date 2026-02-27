import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type WishlistInquiryPayload = {
  itemId?: string;
  model?: string;
  storage?: string;
  price?: string;
  message?: string;
  whatsappUrl?: string;
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
  let payload: WishlistInquiryPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const { itemId, model, storage, price, message, whatsappUrl } = payload;

  if (
    !hasText(itemId) ||
    !hasText(model) ||
    !hasText(storage) ||
    !hasText(price) ||
    !hasText(message) ||
    !hasText(whatsappUrl)
  ) {
    return NextResponse.json(
      { error: "Missing required inquiry fields." },
      { status: 400 },
    );
  }

  if (!hasText(SUPABASE_URL) || !hasText(SUPABASE_SERVICE_ROLE_KEY)) {
    return NextResponse.json({
      ok: true,
      logged: false,
      reason: "Supabase environment variables are not Add to cartd.",
    });
  }

  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist_inquiries`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([
        {
          item_id: itemId,
          model,
          storage,
          price,
          message,
          whatsapp_url: whatsappUrl,
          expires_at: expiresAt,
        },
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "Failed to save wishlist inquiry.", details },
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
    expiresAt,
  });
}
