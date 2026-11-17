// Phone numbers: country calling codes, as-you-type grouping and E.164.
// Ceiling: this is formatting and plausibility (length bounds), not carrier-grade
// validation. Apps that must know a number is real validate it on the server.

/** ISO 3166-1 alpha-2 code, upper case ("IN"). */
export type CountryCode = string;

export interface ParsedPhone {
  country: CountryCode;
  /** National digits, without the trunk 0. */
  national: string;
  /** `+<calling code><national>`, or '' when there are no digits. */
  e164: string;
  valid: boolean;
}

// Code + calling code, back to back. Where several share a calling code, the
// main one comes first: it is the one a bare international number resolves to.
const TABLE =
  'US1GB44RU7AU61IT39NO47FI358MA212RE262GP590CW599' +
  'AF93AL355DZ213AS1AD376AO244AI1AG1AR54AM374AW297AT43AZ994BS1BH973BD880BB1BY375BE32BZ501BJ229BM1BT975BO591BA387BW267BR55IO246VG1BN673BG359BF226BI257' +
  'KH855CM237CA1CV238BQ599KY1CF236TD235CL56CN86CX61CC61CO57KM269CG242CD243CK682CR506CI225HR385CU53CY357CZ420DK45DJ253DM1DO1EC593EG20SV503GQ240ER291EE372SZ268ET251' +
  'FK500FO298FJ679FR33GF594PF689GA241GM220GE995DE49GH233GI350GR30GL299GD1GU1GT502GG44GN224GW245GY592HT509HN504HK852HU36IS354IN91ID62IR98IQ964IE353IM44IL972' +
  'JM1JP81JE44JO962KZ7KE254KI686XK383KW965KG996LA856LV371LB961LS266LR231LY218LI423LT370LU352MO853MG261MW265MY60MV960ML223MT356MH692MQ596MR222MU230YT262MX52FM691MD373MC377MN976ME382MS1MZ258MM95' +
  'NA264NR674NP977NL31NC687NZ64NI505NE227NG234NU683NF672KP850MK389MP1OM968PK92PW680PS970PA507PG675PY595PE51PH63PL48PT351PR1QA974RO40RW250BL590SH290KN1LC1MF590PM508VC1WS685SM378ST239SA966SN221RS381SC248SL232SG65SX1SK421SI386SB677SO252ZA27KR82SS211ES34LK94SD249SR597SJ47SE46CH41SY963' +
  'TW886TJ992TZ255TH66TL670TG228TK690TO676TT1TN216TR90TM993TC1TV688UG256UA380AE971UY598UZ998VU678VA39VE58VN84VI1WF681EH212YE967ZM260ZW263AX358';

/** Country → calling code digits ("IN" → "91"). Names come from `Intl.DisplayNames`. */
export const COUNTRIES: Readonly<Record<CountryCode, string>> = /* @__PURE__ */ Object.fromEntries(
  Array.from(TABLE.matchAll(/([A-Z]{2})(\d+)/g), (m) => [m[1]!, m[2]!]),
);

// [shortest, longest national length, display groups]. The last group takes any extra digits.
const META: Record<CountryCode, readonly [number, number, string]> = {
  IN: [10, 10, '5 5'],
  AE: [8, 9, '2 3 4'],
  SA: [9, 9, '2 3 4'],
  QA: [8, 8, '4 4'],
  KW: [8, 8, '4 4'],
  BH: [8, 8, '4 4'],
  OM: [8, 8, '4 4'],
  US: [10, 10, '3 3 4'],
  CA: [10, 10, '3 3 4'],
  GB: [9, 10, '4 6'],
  SG: [8, 8, '4 4'],
  MY: [8, 10, '2 4 4'],
  AU: [9, 9, '3 3 3'],
  DE: [6, 11, '3 4 4'],
  FR: [9, 9, '1 2 2 2 2'],
  ID: [8, 12, '3 4 4'],
  PH: [10, 10, '3 3 4'],
  LK: [9, 9, '2 3 4'],
  BD: [10, 10, '4 6'],
  NP: [8, 10, '3 3 4'],
  PK: [10, 10, '3 7'],
};

const digitsOf = (s: string) => s.replace(/\D/g, '');

/** Calling code digits for a country, or '' when the country is unknown. */
export function callingCode(country: CountryCode): string {
  return COUNTRIES[country.toUpperCase()] ?? '';
}

/** Groups national digits for display as they are typed ("9847012" → "98470 12"). Never throws. */
export function formatNational(digits: string, country: CountryCode): string {
  let rest = digitsOf(digits);
  const groups = META[country.toUpperCase()]?.[2].split(' ').map(Number);
  const out: string[] = [];
  if (groups) {
    for (let i = 0; i < groups.length && rest; i++) {
      const n = i === groups.length - 1 ? rest.length : groups[i]!;
      out.push(rest.slice(0, n));
      rest = rest.slice(n);
    }
  } else {
    // Generic: threes, the tail stays together up to four.
    for (; rest.length > 4; rest = rest.slice(3)) out.push(rest.slice(0, 3));
    if (rest) out.push(rest);
  }
  return out.join(' ');
}

/** `+<calling code><digits>`; '' when there are no digits or the country is unknown. */
export function toE164(national: string, country: CountryCode): string {
  const cc = callingCode(country);
  const digits = digitsOf(national);
  return cc && digits ? `+${cc}${digits}` : '';
}

const plausible = (national: string, country: CountryCode): boolean => {
  const cc = callingCode(country);
  const [min, max] = META[country] ?? [4, 14];
  return Boolean(cc) && national.length >= min && national.length <= max && cc.length + national.length <= 15;
};

/**
 * Reads typed or pasted input: `+` or `00` prefix, spaces, dashes, parentheses, a trunk 0.
 * A full international number picks its country by calling code; where countries share
 * the code (+1, +44, +7 …) `defaultCountry` is kept when it is one of them.
 */
export function parsePhone(value: string, defaultCountry: CountryCode = 'US'): ParsedPhone {
  let country = defaultCountry.toUpperCase();
  const text = value.trim();
  let national = digitsOf(text);
  if (/^(\+|00)/.test(text)) {
    if (text[0] !== '+') national = national.slice(2);
    // Calling codes are prefix-free, so at most one length matches.
    const own = callingCode(country);
    if (own && national.startsWith(own)) national = national.slice(own.length);
    else {
      for (let len = 3; len > 0; len--) {
        const found = Object.keys(COUNTRIES).find((c) => COUNTRIES[c] === national.slice(0, len));
        if (found) {
          country = found;
          national = national.slice(len);
          break;
        }
      }
    }
  }
  // Trunk 0 is dropped abroad, except where it is part of the number (Italy, Vatican).
  if (country !== 'IT' && country !== 'VA') national = national.replace(/^0/, '');
  national = national.slice(0, 15 - (callingCode(country).length || 1));
  return { country, national, e164: toE164(national, country), valid: plausible(national, country) };
}

/** Plausible E.164: known calling code and a national length the country (or E.164) allows. */
export function isValidPhone(e164: string): boolean {
  return /^\+\d+$/.test(e164) && parsePhone(e164).valid;
}
