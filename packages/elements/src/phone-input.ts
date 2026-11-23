import { COUNTRIES, callingCode, formatNational, parsePhone, phoneCountryOf, toE164, type CountryCode } from '@nexub/core';
import { NxFieldElement, type FieldError } from './field.js';
import { ListPopup, choiceLabels, type NxOption } from './choice.js';
import { CHEVRON, el, localeOf, svg } from './dom.js';
import { missingMessage } from './messages.js';
import { sheet, fieldCss } from './styles.js';
import { listCss } from './list-styles.js';

/** Where the caret goes in regrouped text: after the same number of digits (as React's PhoneInput). */
const caretAfterDigits = (text: string, digits: number): number => {
  let pos = 0;
  for (let seen = 0; seen < digits && pos < text.length; pos++) if (/\d/.test(text[pos]!)) seen++;
  return pos;
};

/**
 * `<nx-phone-input>`: a form-associated phone field, the `@nexub/react` `PhoneInput`: a country
 * picker (a select-only combobox listing every country, or the `countries` given) and the
 * national number, grouped as you type, with the `@nexub/core` phone rules. A full
 * international number (`+44 20…`, `0044…`) typed or pasted picks its country.
 *
 * The value (what the form posts) is E.164 (`+919847012345`), `''` when empty. A number with
 * the wrong length for its country is `typeMismatch`; an international prefix left unfinished
 * (`+4`) is `badInput`. Formatting and length checks only: confirm the number on the server.
 *
 * Attributes (reflected as properties): `name`, `value` (the default, E.164), `country` (the
 * picked country; set it to change it), `default-country` (else the region of the nearest
 * `lang`, else `US`), `countries` (a list, in this order; one shows as text), `locale` (country
 * names), `placeholder`, `required`, `disabled`, `readonly`, `invalid`, `size`. Events: `input`
 * on every change of the value, `change` when it was committed (blur, Enter, a country pick),
 * and `countrychange` when the user changes the country.
 *
 * @alpha
 */
export class NxPhoneInput extends NxFieldElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'country', 'default-country', 'countries', 'locale', 'placeholder'];
  }

  /** @internal */
  protected readonly control = el('input', { type: 'tel', inputmode: 'tel', autocomplete: 'tel-national', part: 'input' });
  readonly #button = el('button', { type: 'button', role: 'combobox', class: 'country', part: 'country', 'aria-haspopup': 'listbox' });
  readonly #code = el('span');
  /** With one country there is nothing to pick: its code shows as text. */
  readonly #only = el('span', { class: 'country', role: 'img', hidden: '' });
  readonly #list: ListPopup;
  /** The picked (or typed) country; `null` follows the attributes. */
  #country: CountryCode | null = null;
  /** An international prefix being typed whose calling code isn't complete yet (`+4`). */
  #draft: string | null = null;
  #committed = '';
  #names?: [string | undefined, Intl.DisplayNames | undefined];
  #sorted?: [string, NxOption[]];

  constructor() {
    super();
    this.root.adoptedStyleSheets = [sheet(fieldCss), sheet(listCss)];
    this.#button.append(this.#code, svg(CHEVRON));
    this.box.append(this.#button, this.#only, this.control);
    this.#list = new ListPopup(this, this.box, this.#button, (o) => this.#pickCountry(o.value), () => this.#renderList());
    this.root.append(this.#list.popup);
    this.#button.addEventListener('click', () => (this.#list.open ? this.#list.hide() : this.#open()));
    this.#button.addEventListener('keydown', (e) => this.#list.selectKey(e));
    this.#button.addEventListener('keyup', (e) => e.key === ' ' && e.preventDefault());
    this.#button.addEventListener('blur', () => this.#list.hide());
    const input = this.control;
    input.addEventListener('focus', () => (this.#committed = this.value));
    input.addEventListener('input', this.#onInput);
    input.addEventListener('blur', () => this.#commit());
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      this.#commit();
      this.form?.requestSubmit();
    });
    this.upgrade('value', 'country');
  }

  /** The country the number is in (ISO 3166-1 alpha-2). Setting it keeps the national digits. */
  get country(): CountryCode {
    return this.#country ?? this.#fit(this.getAttribute('country')) ?? this.#fit(this.getAttribute('default-country')) ?? this.#fit(phoneCountryOf(localeOf(this))) ?? this.#allowed?.[0] ?? 'US';
  }
  set country(v: CountryCode) {
    this.setAttribute('country', v);
  }
  /** The country an empty field starts on, and goes back to on `form.reset()`. */
  get defaultCountry(): string {
    return this.getAttribute('default-country') ?? '';
  }
  set defaultCountry(v: string) {
    this.setAttribute('default-country', v);
  }
  /** The countries to pick from, in order (`"IN AE US"`); empty for every country. */
  get countries(): string {
    return this.getAttribute('countries') ?? '';
  }
  set countries(v: string) {
    this.setAttribute('countries', v);
  }
  get locale(): string {
    return this.getAttribute('locale') ?? '';
  }
  set locale(v: string) {
    this.setAttribute('locale', v);
  }
  get placeholder(): string {
    return this.getAttribute('placeholder') ?? '';
  }
  set placeholder(v: string) {
    this.setAttribute('placeholder', v);
  }
  /** `true` while the country list is open. */
  get open(): boolean {
    return this.#list.open;
  }
  /** Closes the country list. */
  close(): void {
    this.#list.hide();
  }

  disconnectedCallback(): void {
    this.close();
  }

  get #allowed(): CountryCode[] | undefined {
    const list = this.countries
      .split(/[\s,]+/)
      .map((c) => c.toUpperCase())
      .filter((c) => COUNTRIES[c]);
    return list.length ? list : undefined;
  }

  /** `c` in upper case when it is a known country this field allows. */
  #fit(c: string | null | undefined): CountryCode | undefined {
    const code = c?.trim().toUpperCase();
    const allowed = this.#allowed;
    return code && COUNTRIES[code] && (!allowed || allowed.includes(code)) ? code : undefined;
  }

  #nameOf(code: CountryCode): string {
    const locale = localeOf(this);
    if (!this.#names || this.#names[0] !== locale) {
      let names: Intl.DisplayNames | undefined;
      try {
        names = new Intl.DisplayNames(locale ? [locale] : undefined, { type: 'region' });
      } catch {
        names = undefined;
      }
      this.#names = [locale, names];
    }
    return this.#names[1]?.of(code) ?? code;
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old !== next) {
      if (name === 'country') {
        const c = this.#fit(next);
        if (c) this.#moveTo(c);
      } else if (name === 'countries' && this.#country && !this.#fit(this.#country)) this.#moveTo(null);
    }
    super.attributeChangedCallback(name, old, next);
  }

  /** Another country for the same national digits. */
  #moveTo(country: CountryCode | null): void {
    const { national } = parsePhone(this.value, this.country);
    this.#country = country;
    this.#draft = null;
    if (national) this.setValue(toE164(national, this.country));
    else this.resanitize();
  }

  /** @internal Any typed form to E.164 (a number from a country the field doesn't allow is no value); its country becomes the field's. */
  protected sanitize(v: string): string {
    if (!v.trim()) return '';
    const p = parsePhone(v, this.country);
    if (!this.#fit(p.country)) return '';
    this.#country = p.country;
    return p.e164;
  }

  /** @internal */
  protected override reset(): void {
    this.#country = null;
    this.#draft = null;
    this.#list.hide();
  }

  /** @internal */
  protected check(): FieldError {
    if (this.#draft) return { kind: 'badInput', message: choiceLabels.invalidPhone };
    if (!this.value) return this.required ? { kind: 'valueMissing', message: missingMessage() } : undefined;
    return parsePhone(this.value, this.country).valid ? undefined : { kind: 'typeMismatch', message: choiceLabels.invalidPhone };
  }

  /** @internal */
  protected update(): void {
    const country = this.country;
    const text = this.#draft ?? formatNational(parsePhone(this.value, country).national, country);
    if (this.control.value !== text) this.control.value = text;
    this.control.placeholder = this.placeholder;
    const cc = callingCode(country);
    const label = choiceLabels.countryCode(this.#nameOf(country), cc);
    const single = this.#allowed?.length === 1;
    this.#code.textContent = `+${cc}`;
    this.#only.textContent = `+${cc}`;
    this.#button.setAttribute('aria-label', label);
    this.#only.setAttribute('aria-label', label);
    this.#button.hidden = single;
    this.#only.hidden = !single;
    this.#button.disabled = this.isDisabled || this.readOnly;
    if (this.#list.open) this.#renderList();
  }

  /** Every allowed country, by name (the `countries` order when given), each found by name or `+code`. */
  #renderList(): void {
    const allowed = this.#allowed;
    const key = `${localeOf(this)}|${this.countries}`;
    if (this.#sorted?.[0] !== key) {
      const options = (allowed ?? Object.keys(COUNTRIES)).map((value) => ({ value, label: `${this.#nameOf(value)} +${COUNTRIES[value]}`, keywords: [`+${COUNTRIES[value]}`] }));
      if (!allowed) options.sort((a, b) => a.label.localeCompare(b.label, localeOf(this)));
      this.#sorted = [key, options];
    }
    this.#list.render(this.#sorted[1], this.country, this.#button.getAttribute('aria-label') ?? '');
  }

  #open(): void {
    this.#list.show();
    this.#list.setActive(this.#list.indexOf(this.country));
  }

  #pickCountry(country: CountryCode): void {
    this.#list.hide();
    const before = this.country;
    const value = this.value;
    this.#moveTo(country);
    this.touch();
    this.render();
    if (this.country !== before) this.dispatchEvent(new Event('countrychange', { bubbles: true }));
    if (this.value !== value) {
      this.emit('input');
      this.#committed = this.value;
      this.emit('change');
    }
  }

  #onInput = (e: Event): void => {
    // The inner input's own event stops here; the host fires one when the value changes.
    e.stopPropagation();
    const input = this.control;
    const raw = input.value;
    const country = this.country;
    let international = /^\s*(\+|00)/.test(raw);
    let next = parsePhone(raw, country);
    // A pasted number from outside the allowed countries stays in this one, all its digits, so
    // it reads (and validates) as wrong instead of switching (as React's PhoneInput).
    if (!this.#fit(next.country)) {
      next = parsePhone(raw.replace(/^[\s+0]+/, ''), country);
      international = false;
    }
    const digits = raw.replace(/\D/g, '').slice(/^\s*0/.test(raw) ? 2 : 0);
    const cc = callingCode(next.country);
    // `+4`: no calling code yet. It stays as typed and the value waits for it.
    this.#draft = international && !(digits.startsWith(cc) && digits.length > cc.length) ? raw.replace(/[^\d+\s]/g, '') : null;
    const typed = raw.slice(0, input.selectionStart ?? raw.length).replace(/\D/g, '');
    const trunk = typed.startsWith('0') && !next.national.startsWith('0') ? 1 : 0;
    if (!this.#draft) this.#country = next.country;
    const changed = this.setValue(this.#draft ? '' : next.e164);
    this.render();
    if (!this.#draft) {
      const pos = caretAfterDigits(input.value, international ? next.national.length : Math.max(0, typed.length - trunk));
      input.setSelectionRange(pos, pos);
    }
    if (this.country !== country) this.dispatchEvent(new Event('countrychange', { bubbles: true }));
    if (changed) this.emit('input');
  };

  /** Blur and Enter: an unfinished prefix stays (invalid); `change` when the value moved. */
  #commit(): void {
    this.touch();
    this.render();
    if (this.value !== this.#committed) {
      this.#committed = this.value;
      this.emit('change');
    }
  }
}
