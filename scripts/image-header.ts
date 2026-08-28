/**
 * Minimal image header reader: format sniffing and intrinsic dimensions for
 * the three formats the member ingest accepts.
 *
 * Split out of ingest-member-images.ts so it can be exercised directly
 * (`npx tsx scripts/image-header.test.ts`) against real files.
 *
 * Why not an image library: the site's convention is that every <Image>
 * carries explicit width/height, and reading three well-specified headers is
 * a few dozen lines against a native dependency that has to build on every
 * CI machine.
 */

/* ------------------------------------------------------------------ *
 * Image sniffing
 *
 * Content-Type from Drive is unreliable (it happily says text/html, or
 * application/octet-stream). The first bytes are authoritative.
 * ------------------------------------------------------------------ */

export type Ext = 'jpg' | 'png' | 'webp';

export function sniff(buf: Buffer): Ext | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'png';
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

export interface Dims {
  width: number;
  height: number;
}

export function pngSize(buf: Buffer): Dims | null {
  // IHDR is always the first chunk: 8-byte signature, 4-byte length,
  // 4-byte type, then width and height as big-endian uint32.
  if (buf.length < 24 || buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export function jpegSize(buf: Buffer): Dims | null {
  // Walk the marker segments until a Start Of Frame carries the dimensions.
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) {
      off += 1;
      continue;
    }
    const marker = buf[off + 1];

    // Standalone markers: no length field follows.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      off += 2;
      continue;
    }
    if (marker === 0xff) {
      off += 1; // fill byte
      continue;
    }

    const len = buf.readUInt16BE(off + 2);
    if (len < 2) return null;

    // SOF0-SOF15, excluding the arithmetic/huffman tables that share the range.
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      if (off + 9 > buf.length) return null;
      return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
    }

    off += 2 + len;
  }
  return null;
}

export function webpSize(buf: Buffer): Dims | null {
  const chunk = buf.toString('ascii', 12, 16);

  if (chunk === 'VP8X') {
    // Extended format: 24-bit little-endian width-1 / height-1 at offset 24.
    if (buf.length < 30) return null;
    const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
    const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
    return { width: w + 1, height: h + 1 };
  }

  if (chunk === 'VP8 ') {
    // Lossy: 3-byte start code 0x9d012a, then 14-bit width and height.
    if (buf.length < 30) return null;
    const start = buf.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (start < 0 || start + 7 > buf.length) return null;
    return {
      width: buf.readUInt16LE(start + 3) & 0x3fff,
      height: buf.readUInt16LE(start + 5) & 0x3fff,
    };
  }

  if (chunk === 'VP8L') {
    // Lossless: 0x2f signature, then 14 bits of width-1 and 14 of height-1.
    if (buf.length < 25 || buf[20] !== 0x2f) return null;
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }

  return null;
}

export function measure(buf: Buffer, ext: Ext): Dims | null {
  const dims = ext === 'png' ? pngSize(buf) : ext === 'jpg' ? jpegSize(buf) : webpSize(buf);
  if (!dims || !dims.width || !dims.height) return null;
  return dims;
}

