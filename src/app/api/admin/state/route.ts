import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/server/auth";
import { getAdminSnapshot, handleAdminAction } from "@/lib/server/store";

export async function GET() {
  try {
    await assertAdmin();
    return NextResponse.json(await getAdminSnapshot());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await assertAdmin();
    const body = (await request.json()) as { action?: string; payload?: Record<string, unknown> };

    if (!body.action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 });
    }

    const result = await handleAdminAction(body.action, body.payload || {});
    return NextResponse.json({ ok: true, result, snapshot: await getAdminSnapshot() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Action failed." },
      { status: 400 }
    );
  }
}
