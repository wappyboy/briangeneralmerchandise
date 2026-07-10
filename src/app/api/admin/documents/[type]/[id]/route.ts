import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/server/auth";
import { createBusinessPdf } from "@/lib/server/pdf";
import { getBookingDocument } from "@/lib/server/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> }
) {
  try {
    await assertAdmin();
    const { type, id } = await context.params;
    if (type !== "quotation" && type !== "contract") {
      return NextResponse.json({ error: "Unsupported document type." }, { status: 400 });
    }
    const documentData = await getBookingDocument(type, id);
    const pdf = createBusinessPdf({
      title: type === "quotation" ? "Quotation" : "Event Rental Contract",
      ...documentData,
    });

    return new NextResponse(pdf, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="${type}-${id}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document export failed." },
      { status: 400 }
    );
  }
}
