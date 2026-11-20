// @vitest-environment node
// The encoder lives in @nexub/core (shared with native); core's tests run here.
// A QR code that looks right but does not scan is the risk, so the encoder is
// checked by a decoder written here from the standard, sharing no code or tables
// with it: format info, unmasking, codeword order, block de-interleaving,
// Reed–Solomon syndromes and the byte-mode bit stream.
import { describe, expect, it } from 'vitest';
import { encodeQR, qrPath, type QRErrorCorrection } from '@nexub/core';

// ISO/IEC 18004 Annex C: the 15 format bits (most significant first) per level and mask.
const FORMAT: Record<QRErrorCorrection, string[]> = {
  L: ['111011111000100', '111001011110011', '111110110101010', '111100010011101', '110011000101111', '110001100011000', '110110001000001', '110100101110110'],
  M: ['101010000010010', '101000100100101', '101111001111100', '101101101001011', '100010111111001', '100000011001110', '100111110010111', '100101010100000'],
  Q: ['011010101011111', '011000001101000', '011111100110001', '011101000000110', '010010010110100', '010000110000011', '010111011011010', '010101111101101'],
  H: ['001011010001001', '001001110111110', '001110011100111', '001100111010000', '000011101100010', '000001001010101', '000110100001100', '000100000111011'],
};
// Annex E: alignment pattern centres, for the versions used below.
const ALIGNMENT: Record<number, number[]> = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 10: [6, 28, 50],
  14: [6, 26, 46, 66], 32: [6, 34, 60, 86, 112, 138], 40: [6, 30, 58, 86, 114, 142, 170],
};
// Annex D: the 18 version bits (most significant first).
const VERSION_INFO: Record<number, string> = Object.fromEntries(
  Object.entries({ 7: 0x07c94, 10: 0x0a4d3, 14: 0x0e60d, 32: 0x209d5, 40: 0x28c69 }).map(([v, bits]) => [v, bits.toString(2).padStart(18, '0')]),
);
// Table 1: codewords per version (data + error correction).
const TOTAL_CODEWORDS: Record<number, number> = { 1: 26, 2: 44, 3: 70, 4: 100, 5: 134, 6: 172, 7: 196, 10: 346, 14: 581, 32: 2465, 40: 3706 };
// Table 9: [blocks, error correction codewords per block] for the cases used below.
const BLOCKS: Record<string, [number, number]> = {
  '1L': [1, 7], '1M': [1, 10], '1Q': [1, 13], '1H': [1, 17], '2M': [1, 16], '2L': [1, 10], '3M': [1, 26], '3H': [2, 22], '4H': [4, 16], '4M': [2, 18],
  '5Q': [4, 18], '5H': [4, 22], '6H': [4, 28], '7H': [5, 26], '7M': [4, 18], '10M': [5, 26], '14Q': [16, 20], '32L': [17, 30], '40L': [25, 30], '40H': [81, 30],
};
// The mask conditions as the standard writes them: i = row, j = column.
const MASK: ((i: number, j: number) => boolean)[] = [
  (i, j) => (i + j) % 2 === 0,
  (i) => i % 2 === 0,
  (_, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
];

/** True where the standard puts a function pattern, format or version information. */
function isFunction(row: number, col: number, size: number, version: number): boolean {
  if (row === 6 || col === 6) return true; // timing
  if ((row < 9 && col < 9) || (row < 9 && col >= size - 8) || (row >= size - 8 && col < 9)) return true; // finders, separators, format
  if (version >= 7 && ((row < 6 && col >= size - 11) || (col < 6 && row >= size - 11))) return true; // version
  const centres = ALIGNMENT[version]!;
  for (const r of centres) {
    for (const c of centres) {
      const onFinder = (r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6);
      if (!onFinder && Math.abs(row - r) <= 2 && Math.abs(col - c) <= 2) return true;
    }
  }
  return false;
}

// GF(256), x^8 + x^4 + x^3 + x^2 + 1, built by repeated multiplication by x.
const gfMul = (a: number, b: number) => {
  let out = 0;
  for (; b; b >>= 1, a = a & 0x80 ? ((a << 1) ^ 0x11d) & 0xff : a << 1) if (b & 1) out ^= a;
  return out;
};
const gfPow = (a: number, n: number) => {
  let out = 1;
  while (n-- > 0) out = gfMul(out, a);
  return out;
};

/** Decodes a matrix the way a reader does. Throws (through `expect`) on anything a reader would reject. */
function decode(modules: boolean[][]): { text: string; ecc: QRErrorCorrection; mask: number; version: number } {
  const size = modules.length;
  const version = (size - 17) / 4;
  expect(Number.isInteger(version) && version >= 1 && version <= 40, `size ${size}`).toBe(true);
  expect(modules.every((r) => r.length === size)).toBe(true);
  const at = (row: number, col: number) => (modules[row]![col] ? '1' : '0');

  // Format information, both copies, most significant bit first (Figure 25).
  const copy1 = [0, 1, 2, 3, 4, 5, 7, 8].map((c) => at(8, c)).join('') + [7, 5, 4, 3, 2, 1, 0].map((r) => at(r, 8)).join('');
  const copy2 = [1, 2, 3, 4, 5, 6, 7].map((n) => at(size - n, 8)).join('') + [8, 7, 6, 5, 4, 3, 2, 1].map((n) => at(8, size - n)).join('');
  expect(copy2, 'the two format copies agree').toBe(copy1);
  let ecc: QRErrorCorrection | undefined;
  let mask = -1;
  for (const level of ['L', 'M', 'Q', 'H'] as const) {
    const found = FORMAT[level].indexOf(copy1);
    if (found >= 0) {
      ecc = level;
      mask = found;
    }
  }
  expect(ecc, `format bits ${copy1}`).toBeDefined();
  expect(at(size - 8, 8), 'dark module').toBe('1');

  if (version >= 7) {
    // Bit 0 is at the top left of each 6 × 3 block; bit i sits at (i / 3, size − 11 + i % 3) and mirrored.
    let a = '';
    let b = '';
    for (let i = 17; i >= 0; i--) {
      a += at(Math.floor(i / 3), size - 11 + (i % 3));
      b += at(size - 11 + (i % 3), Math.floor(i / 3));
    }
    expect(a, 'version information').toBe(VERSION_INFO[version]);
    expect(b, 'version information, mirrored').toBe(VERSION_INFO[version]);
  }

  // Codewords: two-module columns from the right edge, alternately upwards and downwards, the timing column skipped.
  const bits: number[] = [];
  let up = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let n = 0; n < size; n++) {
      const row = up ? size - 1 - n : n;
      for (const c of [col, col - 1]) {
        if (isFunction(row, c, size, version)) continue;
        bits.push(Number(modules[row]![c]) ^ Number(MASK[mask]!(row, c)));
      }
    }
    up = !up;
  }
  const total = TOTAL_CODEWORDS[version]!;
  expect(Math.floor(bits.length / 8), 'codewords in the symbol').toBe(total);
  expect(bits.slice(total * 8).every((b) => b === 0), 'remainder bits are zero').toBe(true);
  const stream = Array.from({ length: total }, (_, i) => bits.slice(i * 8, i * 8 + 8).reduce((n, b) => (n << 1) | b, 0));

  // De-interleave: the short blocks come first, the long ones have one more data codeword.
  const [blockCount, eccLength] = BLOCKS[`${version}${ecc}`]!;
  const dataTotal = total - blockCount * eccLength;
  const shortData = Math.floor(dataTotal / blockCount);
  const longBlocks = dataTotal % blockCount;
  const blocks = Array.from({ length: blockCount }, () => ({ data: [] as number[], ecc: [] as number[] }));
  let p = 0;
  for (let i = 0; i < shortData + 1; i++) {
    blocks.forEach((b, n) => {
      if (i < shortData || n >= blockCount - longBlocks) b.data.push(stream[p++]!);
    });
  }
  for (let i = 0; i < eccLength; i++) blocks.forEach((b) => b.ecc.push(stream[p++]!));
  expect(p).toBe(total);

  // Reed–Solomon: every syndrome of every block is zero.
  for (const b of blocks) {
    const word = [...b.data, ...b.ecc];
    for (let j = 0; j < eccLength; j++) {
      const x = gfPow(2, j);
      expect(word.reduce((sum, c) => gfMul(sum, x) ^ c, 0), `syndrome ${j}`).toBe(0);
    }
  }

  // The bit stream: byte mode, length, bytes, terminator, pad codewords.
  const data = blocks.flatMap((b) => b.data);
  const dataBits = data.flatMap((byte) => Array.from({ length: 8 }, (_, i) => (byte >> (7 - i)) & 1));
  let pos = 0;
  const read = (n: number) => {
    let v = 0;
    while (n-- > 0) v = (v << 1) | dataBits[pos++]!;
    return v;
  };
  expect(read(4), 'mode indicator: byte').toBe(0b0100);
  const length = read(version <= 9 ? 8 : 16);
  const bytes = Uint8Array.from({ length }, () => read(8));
  const terminator = Math.min(4, dataBits.length - pos);
  expect(read(terminator), 'terminator').toBe(0);
  while (pos % 8) expect(read(1), 'bit padding').toBe(0);
  for (let i = 0; pos < dataBits.length; i++) expect(read(8), 'pad codeword').toBe(i % 2 ? 0x11 : 0xec);
  return { text: new TextDecoder('utf-8', { fatal: true }).decode(bytes), ecc: ecc!, mask, version };
}

const FINDER = ['1111111', '1000001', '1011101', '1011101', '1011101', '1000001', '1111111'];

describe('encodeQR: structure', () => {
  const cases: [string, QRErrorCorrection, number][] = [
    ['HELLO WORLD', 'Q', 1],
    ['https://example.com/h/4729', 'M', 2],
    ['x'.repeat(60), 'H', 7],
    ['x'.repeat(200), 'M', 10],
  ];
  it.each(cases)('%s at %s is version %i with finder, timing and dark module in place', (text, ecc, version) => {
    const qr = encodeQR(text, { ecc });
    const { size, modules } = qr;
    expect(qr.version).toBe(version);
    expect(size).toBe(17 + 4 * version);
    expect(modules).toHaveLength(size);
    const cell = (row: number, col: number) => (modules[row]![col] ? '1' : '0');
    for (const [r0, c0] of [[0, 0], [0, size - 7], [size - 7, 0]] as const) {
      FINDER.forEach((line, r) => expect(Array.from(line, (_, c) => cell(r0 + r, c0 + c)).join('')).toBe(line));
    }
    // Separators: a light line around each finder.
    for (let i = 0; i < 8; i++) {
      for (const [r, c] of [[7, i], [i, 7], [7, size - 1 - i], [i, size - 8], [size - 8, i], [size - 1 - i, 7]] as const) expect(cell(r, c)).toBe('0');
    }
    // Timing: alternating, dark on even positions, between the finders.
    for (let i = 8; i < size - 8; i++) {
      expect(cell(6, i)).toBe(i % 2 ? '0' : '1');
      expect(cell(i, 6)).toBe(i % 2 ? '0' : '1');
    }
    expect(cell(size - 8, 8)).toBe('1');
    // Alignment patterns: dark centre, light ring, dark ring.
    for (const r of ALIGNMENT[version]!) {
      for (const c of ALIGNMENT[version]!) {
        if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
        expect(cell(r, c)).toBe('1');
        expect(cell(r - 1, c - 1) + cell(r - 1, c) + cell(r, c + 1) + cell(r + 1, c + 1)).toBe('0000');
        expect(cell(r - 2, c - 2) + cell(r - 2, c) + cell(r, c + 2) + cell(r + 2, c - 1)).toBe('1111');
      }
    }
  });
});

describe('encodeQR: decoded by an independent reader', () => {
  const cases: [string, string, QRErrorCorrection, number][] = [
    ['short text, one block', 'HELLO WORLD', 'Q', 1],
    ['a URL', 'https://example.com/h/4729', 'M', 2],
    ['UTF-8: accents, CJK, an emoji', 'Zoë pays ¥1,200 for 寿司 🍣', 'M', 3],
    ['empty text', '', 'L', 1],
    ['exactly full: 17 bytes at 1-L', 'a'.repeat(17), 'L', 1],
    ['one byte over: 18 bytes need version 2', 'a'.repeat(18), 'L', 2],
    ['two blocks', 'b'.repeat(20), 'H', 3],
    ['four blocks of two lengths', 'https://example.com/pay?ref=NX-4821-XQ&amount=250.00', 'Q', 5],
    ['version information (7+)', 'c'.repeat(60), 'H', 7],
    ['16-bit length (10+)', 'd'.repeat(200), 'M', 10],
    ['sixteen blocks', 'e'.repeat(250), 'Q', 14],
    ['version 32, its own alignment step', 'f'.repeat(1900), 'L', 32],
    ['the largest: 2,953 bytes at 40-L', 'g'.repeat(2953), 'L', 40],
    ['the largest at H: 1,273 bytes, 81 blocks', 'h'.repeat(1273), 'H', 40],
  ];
  it.each(cases)('%s', (_, text, ecc, version) => {
    const qr = encodeQR(text, { ecc });
    const read = decode(qr.modules);
    expect(read).toEqual({ text, ecc, mask: qr.mask, version });
  });

  it('every level round-trips the same text', () => {
    for (const ecc of ['L', 'M', 'Q', 'H'] as const) expect(decode(encodeQR('NX-4729', { ecc }).modules)).toMatchObject({ text: 'NX-4729', ecc, version: 1 });
  });

  it('defaults to level M', () => {
    expect(encodeQR('abc').ecc).toBe('M');
    expect(decode(encodeQR('abc').modules).ecc).toBe('M');
  });

  it('round-trips random bytes-as-text at every length up to 120', () => {
    let seed = 4729;
    const next = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff);
    for (let n = 0; n <= 120; n++) {
      const text = Array.from({ length: n }, () => String.fromCharCode(32 + (next() % 95))).join('');
      const ecc = (['L', 'M', 'Q', 'H'] as const)[n % 4]!;
      const qr = encodeQR(text, { ecc });
      // Only versions whose tables are listed above.
      if (!(qr.version in TOTAL_CODEWORDS) || !(`${qr.version}${ecc}` in BLOCKS)) continue;
      expect(decode(qr.modules).text).toBe(text);
    }
  });
});

describe('encodeQR: known answers', () => {
  // The whole symbol for one input, row by row (hex, most significant bit = column 0).
  // Bit-identical to an independent encoder (toqr 0.1.1) for this input. It pins the
  // mask choice too, so a change to the penalty scoring shows up here. (Across 1,240
  // inputs the two encoders agree on every version and on every module once unmasked;
  // they pick a different mask for about a third, which any reader accepts.)
  it('"https://example.com/h/4729" at H', () => {
    const qr = encodeQR('https://example.com/h/4729', { ecc: 'H' });
    const hex = qr.modules.map((row) => BigInt('0b' + row.map(Number).join('')).toString(16).padStart(Math.ceil(qr.size / 4), '0'));
    expect({ mask: qr.mask, hex }).toMatchInlineSnapshot(`
      {
        "hex": [
          "1fdd99b7f",
          "105172d41",
          "175ba9f5d",
          "17403425d",
          "174a6e95d",
          "105896441",
          "1fd55557f",
          "0018e7d00",
          "075a5b0e7",
          "1685ae7cb",
          "1a73ec5ea",
          "1ba27a08e",
          "116086da2",
          "1a3d7f2d9",
          "1f48d2572",
          "009cf4c19",
          "035bdc235",
          "0da51b340",
          "044aca414",
          "15213db9e",
          "11da59539",
          "128981881",
          "1372e2306",
          "171d76a2f",
          "15d3393f0",
          "00131af19",
          "1fc619b5e",
          "104d13d17",
          "17583e9f3",
          "175a0b696",
          "1750356cc",
          "104dca024",
          "1fcfa2f0e",
        ],
        "mask": 2,
      }
    `);
  });

  it('the data codewords of "HELLO WORLD" at 1-Q are the byte-mode stream of the standard', () => {
    // 0100 (byte) + 00001011 (11) + the ASCII bytes + 0000, then pad codewords: 13 data codewords.
    const expected = [0x40, 0xb4, 0x84, 0x54, 0xc4, 0xc4, 0xf2, 0x05, 0x74, 0xf5, 0x24, 0xc4, 0x40];
    const qr = encodeQR('HELLO WORLD', { ecc: 'Q' });
    // Read the first 13 codewords back out with the reader's module order.
    const bits: number[] = [];
    let up = true;
    for (let col = qr.size - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (let n = 0; n < qr.size; n++) {
        const row = up ? qr.size - 1 - n : n;
        for (const c of [col, col - 1]) if (!isFunction(row, c, qr.size, 1)) bits.push(Number(qr.modules[row]![c]) ^ Number(MASK[qr.mask]!(row, c)));
      }
      up = !up;
    }
    const words = expected.map((_, i) => bits.slice(i * 8, i * 8 + 8).reduce((n, b) => (n << 1) | b, 0));
    expect(words).toEqual(expected);
  });
});

describe('encodeQR: limits', () => {
  it('throws when the text does not fit version 40', () => {
    expect(() => encodeQR('g'.repeat(2954), { ecc: 'L' })).toThrow(RangeError);
    expect(() => encodeQR('h'.repeat(1274), { ecc: 'H' })).toThrow(RangeError);
  });
  it('counts bytes, not characters', () => {
    // 6 × 3 bytes = 18 bytes: over the 17 of version 1-L.
    expect(encodeQR('寿司寿司寿司', { ecc: 'L' }).version).toBe(2);
  });
});

describe('qrPath', () => {
  it('draws one closed sub-path per horizontal run, shifted by the quiet zone', () => {
    const modules = [
      [true, true, false],
      [false, false, true],
    ];
    expect(qrPath(modules)).toBe('M0 0h2v1h-2zM2 1h1v1h-1z');
    expect(qrPath(modules, 4)).toBe('M4 4h2v1h-2zM6 5h1v1h-1z');
  });
  it('covers exactly the dark modules', () => {
    const { modules, size } = encodeQR('https://example.com/h/4729');
    const dark = modules.flat().filter(Boolean).length;
    const area = [...qrPath(modules).matchAll(/h(\d+)v1/g)].reduce((n, m) => n + Number(m[1]), 0);
    expect(area).toBe(dark);
    expect(size).toBe(25);
  });
});
