export async function parseFormData(request: Request): Promise<{ file: Buffer | null; fileName: string; fields: Record<string, string> }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.startsWith("application/json")) {
    const body = await request.json();
    const { file: b64, fileName, ...fields } = body;
    if (b64) {
      return { file: Buffer.from(b64, "base64"), fileName: fileName || "upload", fields };
    }
    return { file: null, fileName: "", fields };
  }

  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    throw new Error("No multipart boundary found in Content-Type");
  }
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const raw = Buffer.from(await request.arrayBuffer());

  const parts = splitBuffer(raw, `--${boundary}`);
  let file: Buffer | null = null;
  let fileName = "";
  const fields: Record<string, string> = {};

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;
    const headerSection = part.subarray(0, headerEnd).toString("latin1");
    const bodySection = part.subarray(headerEnd + 4);

    const dispositionMatch = headerSection.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"/i);
    if (!dispositionMatch) continue;
    const name = dispositionMatch[1];

    if (headerSection.toLowerCase().includes("content-type")) {
      const fnMatch = headerSection.match(/filename="([^"]*)"/i);
      fileName = fnMatch?.[1] || "upload";
      file = bodySection.subarray(0, bodySection.length - 2);
    } else {
      fields[name] = bodySection.toString("utf8").replace(/\r\n$/, "");
    }
  }

  return { file, fileName, fields };
}

function splitBuffer(buf: Buffer, delimiter: string): Buffer[] {
  const delim = Buffer.from(delimiter);
  const parts: Buffer[] = [];
  let start = 0;
  while (start < buf.length) {
    const idx = buf.indexOf(delim, start);
    if (idx === -1) break;
    parts.push(buf.subarray(start, idx));
    start = idx + delim.length;
  }
  if (start <= buf.length) parts.push(buf.subarray(start));
  return parts;
}
