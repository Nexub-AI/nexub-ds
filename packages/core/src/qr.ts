// QR Code encoder (ISO/IEC 18004:2015, Model 2). Pure and dependency-free, shared by
// the web and native `QRCode`.
// Ceiling: byte mode only (UTF-8, no ECI header: what phone cameras assume), versions
// 1–40 picked automatically. No numeric/alphanumeric/Kanji modes, ECI, structured
// append, Micro QR or FNC1. Digits-only payloads therefore come out a version or two
// larger than the optimum; add segment modes here if that ever matters.

export type QRErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QRMatrix {
  /** Modules per side: 17 + 4 × version. */
  size: number;
  /** 1–40. */
  version: number;
  ecc: QRErrorCorrection;
  /** The mask pattern that scored best, 0–7. */
  mask: number;
  /** `modules[y][x]`, true = dark. No quiet zone. */
  modules: boolean[][];
}

const LEVELS = 'LMQH';
/** The two format bits of each level, in `LEVELS` order. */
const FORMAT_BITS = [1, 0, 3, 2];

// Table 9 of the standard: error correction codewords per block, and number of
// blocks, for versions 1–40 at each level (rows in `LEVELS` order).
const ECC_PER_BLOCK = [
  [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const BLOCKS = [
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

/** Centres of the alignment patterns along one axis (empty for version 1). */
function alignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const out = [6];
  for (let pos = version * 4 + 10; out.length < count; pos -= step) out.splice(1, 0, pos);
  return out;
}

/** Codewords (data + error correction) a version holds: the modules left after the function patterns, over 8. */
function rawCodewords(version: number): number {
  let bits = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    bits -= (25 * align - 10) * align - 55;
    if (version >= 7) bits -= 36;
  }
  return bits >> 3;
}

const dataCodewords = (version: number, level: number) =>
  rawCodewords(version) - ECC_PER_BLOCK[level]![version - 1]! * BLOCKS[level]![version - 1]!;

// GF(256) with the QR polynomial x^8 + x^4 + x^3 + x^2 + 1 (0x11D).
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = EXP[i + 255] = x;
  LOG[x] = i;
  x = x & 0x80 ? (x << 1) ^ 0x11d : x << 1;
}
const mul = (a: number, b: number) => (a && b ? EXP[LOG[a]! + LOG[b]!]! : 0);

/** Reed–Solomon remainder: `degree` error correction codewords for `data` (generator roots α^0 … α^(degree−1)). */
function reedSolomon(data: number[], degree: number): number[] {
  // Generator polynomial, highest power first, without the leading 1.
  const gen = new Array<number>(degree).fill(0);
  gen[degree - 1] = 1;
  for (let i = 0, root = 1; i < degree; i++, root = mul(root, 2)) {
    for (let j = 0; j < degree; j++) gen[j] = mul(gen[j]!, root) ^ (gen[j + 1] ?? 0);
  }
  const rem = new Array<number>(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ rem.shift()!;
    rem.push(0);
    for (let j = 0; j < degree; j++) rem[j] = rem[j]! ^ mul(gen[j]!, factor);
  }
  return rem;
}

function utf8(text: string): number[] {
  const out: number[] = [];
  for (const ch of text) {
    let c = ch.codePointAt(0)!;
    if (c >= 0xd800 && c <= 0xdfff) c = 0xfffd; // a lone surrogate
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

/** Mode, length, bytes, terminator and pad codewords, then the blocks with their error correction, interleaved. */
function codewords(bytes: number[], version: number, level: number): number[] {
  const capacity = dataCodewords(version, level);
  const bits: number[] = [];
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(4, 4); // byte mode
  push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, capacity * 8 - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((n, b) => (n << 1) | b, 0));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad);

  const blocks = BLOCKS[level]![version - 1]!;
  const eccLength = ECC_PER_BLOCK[level]![version - 1]!;
  const total = rawCodewords(version);
  const shortBlocks = blocks - (total % blocks);
  const shortLength = Math.floor(total / blocks) - eccLength;
  const parts: { data: number[]; ecc: number[] }[] = [];
  for (let i = 0, at = 0; i < blocks; i++) {
    const part = data.slice(at, (at += shortLength + (i < shortBlocks ? 0 : 1)));
    parts.push({ data: part, ecc: reedSolomon(part, eccLength) });
  }
  const out: number[] = [];
  for (let i = 0; i <= shortLength; i++) for (const p of parts) if (i < p.data.length) out.push(p.data[i]!);
  for (let i = 0; i < eccLength; i++) for (const p of parts) out.push(p.ecc[i]!);
  return out;
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** Penalty score of a finished symbol (section 7.8.3): lower scans better. */
function penalty(m: boolean[][]): number {
  const size = m.length;
  let score = 0;
  let dark = 0;
  for (let i = 0; i < size; i++) {
    for (const line of [m[i]!, m.map((row) => row[i]!)]) {
      // N1: runs of five or more in one colour.
      for (let j = 0, run = 1; j < size; j++, run++) {
        if (j + 1 === size || line[j + 1] !== line[j]) {
          if (run >= 5) score += run - 2;
          run = 0;
        }
      }
      // N3: the finder's 1:1:3:1:1 with four light modules on either side.
      const text = line.map((d) => (d ? '1' : '0')).join('');
      for (let j = 0; j + 11 <= size; j++) {
        const part = text.slice(j, j + 11);
        if (part === '10111010000' || part === '00001011101') score += 40;
      }
    }
    for (let j = 0; j < size; j++) {
      if (m[i]![j]) dark++;
      // N2: 2 × 2 blocks of one colour.
      if (i + 1 < size && j + 1 < size && m[i]![j] === m[i]![j + 1] && m[i]![j] === m[i + 1]![j] && m[i]![j] === m[i + 1]![j + 1]) score += 3;
    }
  }
  // N4: how far the dark share is from one half, in steps of 5%.
  return score + Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
}

/** 15 format bits: level and mask, BCH(15,5), XOR 0x5412. */
function formatBits(level: number, mask: number): number {
  const data = (FORMAT_BITS[level]! << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
}

/**
 * Encodes text as a QR code. The smallest version that holds the text at the asked
 * level is used. Throws a RangeError when the text is too long for version 40
 * (2,953 bytes at L, 1,273 at H).
 */
export function encodeQR(text: string, options: { ecc?: QRErrorCorrection } = {}): QRMatrix {
  const ecc = options.ecc ?? 'M';
  const level = LEVELS.indexOf(ecc);
  if (level < 0) throw new RangeError(`encodeQR: unknown error correction level "${ecc}"`);
  const bytes = utf8(text);
  let version = 1;
  // Mode (4 bits) + length (8 or 16 bits) + the bytes must fit the data codewords.
  while (version <= 40 && 4 + (version < 10 ? 8 : 16) + bytes.length * 8 > dataCodewords(version, level) * 8) version++;
  if (version > 40) throw new RangeError(`encodeQR: ${bytes.length} bytes do not fit a QR code at level ${ecc}`);

  const size = 17 + 4 * version;
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const reserved = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y]![x] = dark;
    reserved[y]![x] = true;
  };

  // Timing patterns, then finders (with their light separators) and alignment patterns over them.
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]] as const) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(cx + dx, cy + dy, d !== 2 && d !== 4);
      }
    }
  }
  const align = alignmentPositions(version);
  for (const cy of align) {
    for (const cx of align) {
      // Not where the three finders are.
      if ((cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
  const drawFormat = (mask: number) => {
    const bits = formatBits(level, mask);
    const bit = (i: number) => ((bits >>> i) & 1) === 1;
    // Around the top-left finder…
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    // …and split between the other two.
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true); // the dark module
  };
  drawFormat(0); // reserves the cells; the real bits follow the mask choice
  if (version >= 7) {
    // 18 version bits: BCH(18,6), twice.
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, dark);
      set(b, a, dark);
    }
  }

  // Codewords in two-module columns from the bottom right, zigzagging up and down, skipping the timing column.
  const data = codewords(bytes, version, level);
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (reserved[y]![x]) continue;
        // Past the last codeword: the remainder bits, light.
        modules[y]![x] = i < data.length * 8 && ((data[i >>> 3]! >>> (7 - (i & 7))) & 1) === 1;
        i++;
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!reserved[y]![x] && MASKS[mask]!(x, y)) modules[y]![x] = !modules[y]![x];
  };
  let best = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormat(mask);
    const score = penalty(modules);
    if (score < bestScore) {
      bestScore = score;
      best = mask;
    }
    applyMask(mask); // XOR again: back to the unmasked symbol
  }
  applyMask(best);
  drawFormat(best);
  return { size, version, ecc, mask: best, modules };
}

/**
 * The dark modules as one SVG path (`M x y h n v 1 h -n z` per horizontal run), in
 * module units, shifted by a quiet zone. The view box is `size + 2 × quietZone` wide.
 */
export function qrPath(modules: readonly (readonly boolean[])[], quietZone = 0): string {
  let d = '';
  modules.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let end = x;
      while (row[end + 1]) end++;
      d += `M${x + quietZone} ${y + quietZone}h${end - x + 1}v1h${x - end - 1}z`;
      x = end;
    }
  });
  return d;
}
