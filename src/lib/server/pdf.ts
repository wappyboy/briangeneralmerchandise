import "server-only";

import { summarizeBookingForDocument } from "@/lib/domain";
import type { Booking, Contract, Quotation } from "@/types/admin";

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function wrapLine(line: string, limit = 92) {
  const words = line.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (`${current} ${word}`.trim().length > limit) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

export function createBusinessPdf({
  title,
  booking,
  quotation,
  contract,
}: {
  title: string;
  booking: Booking;
  quotation?: Quotation;
  contract?: Contract;
}) {
  const documentText = summarizeBookingForDocument(booking, quotation, contract);
  const logicalLines = [
    "Brian's General Merchandise",
    "Event Rental Services",
    "Sounds, lights, tables, chairs, tents, stage setup, and event packages",
    "",
    title,
    `Generated: ${new Date().toLocaleString("en-PH")}`,
    "",
    ...documentText.split("\n"),
  ].flatMap((line) => wrapLine(line));

  const pages: string[][] = [];
  let page: string[] = [];

  for (const line of logicalLines) {
    if (page.length >= 42) {
      pages.push(page);
      page = [];
    }
    page.push(line);
  }

  if (page.length > 0) {
    pages.push(page);
  }

  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pages.forEach((lines, pageIndex) => {
    const content = [
      "BT",
      "/F1 11 Tf",
      "50 790 Td",
      "14 TL",
      ...lines.map((line) => `(${escapePdfText(line)}) Tj T*`),
      "",
      `(${escapePdfText(`Page ${pageIndex + 1} of ${pages.length}`)}) Tj`,
      "ET",
    ].join("\n");

    const pageObjectId = objects.length + 1;
    const contentObjectId = objects.length + 2;
    pageObjectIds.push(pageObjectId);
    contentObjectIds.push(contentObjectId);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    );
    objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds
    .map((id) => `${id} 0 R`)
    .join(" ")}] /Count ${pages.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}
