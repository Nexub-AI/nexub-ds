import {
  addDays,
  addMonths,
  compareDateParts,
  dateRangeStatus,
  dateValueGranularity,
  daysInMonth,
  firstDayOfWeek,
  formatDateValue,
  parseDateValue,
  todayParts,
  weekdayOf,
  type DateGranularity,
  type DateParts,
} from '@nexub/core';
import { NxFieldElement, type FieldError } from './field.js';
import { labels, validationMessage } from './messages.js';
import { sheet, fieldCss, pickerCss } from './styles.js';
import { formatDisplay, formatHint, parseTypedDate, utcDate } from './date-text.js';

const RANK: Record<DateGranularity, number> = { year: 0, month: 1, day: 2 };
const YEARS_PER_PAGE = 12;
const svg = (d: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CALENDAR = svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>');
const PREVIOUS = svg('<path d="m15 18-6-6 6-6"/>');
const NEXT = svg('<path d="m9 18 6-6-6-6"/>');
/** Below this width the calendar is a bottom sheet (as `@nexub/react`'s `sheet="auto"`). */
const SHEET_QUERY = '(max-width: 47.99rem)';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<Record<string, string>> = {}): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) if (v !== undefined) node.setAttribute(k, v);
  return node;
};
const pageStart = (year: number) => year - (((year % YEARS_PER_PAGE) + YEARS_PER_PAGE) % YEARS_PER_PAGE);

/** `day`, `month` or `year`: what `<nx-date-picker>` picks. */
export type NxDateGranularity = DateGranularity;

/**
 * `<nx-date-picker>`: a form-associated date field. A text field that accepts a typed date
 * (normalised on blur or Enter) and a button that opens a dialog with a grid: days, months
 * (`granularity="month"`) or years (`granularity="year"`); a bottom sheet below 48rem. The
 * value is `YYYY-MM-DD`, `YYYY-MM` or `YYYY`, so it never shifts across time zones.
 *
 * Keyboard in the grid (as `@nexub/react`'s DatePicker): arrows move, Page Up/Down change the
 * month (Shift: the year; in the month and year grids, the page), Home/End go to the start or
 * end of the week (row), Enter or Space picks, Escape closes; focus returns to the field.
 *
 * Attributes (reflected as properties): `name`, `value` (the default), `min`, `max`,
 * `granularity`, `required`, `disabled`, `readonly`, `locale` (defaults to the nearest `lang`),
 * `size`. Event: `change` when the value changes.
 *
 * @alpha
 */
export class NxDatePicker extends NxFieldElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'min', 'max', 'granularity', 'locale'];
  }

  /** @internal */
  protected readonly control: HTMLInputElement = el('input', { type: 'text', part: 'input', autocomplete: 'off', spellcheck: 'false' });
  readonly #button = el('button', { type: 'button', part: 'button', class: 'open', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' });
  readonly #dialog = el('dialog', { part: 'calendar' });
  readonly #title = el('span', { class: 'title', 'aria-live': 'polite' });
  readonly #prev = el('button', { type: 'button', class: 'nav' });
  readonly #next = el('button', { type: 'button', class: 'nav' });
  readonly #body = el('div');
  /** Typed since the last commit; `null` when the field shows the value. */
  #text: string | null = null;
  /** What the typed text failed on its last commit (it stays as typed, the value unchanged). */
  #typedError: FieldError;
  /** The focused cell: a day, or the month or year a month or year cell stands for. */
  #active: DateParts = todayParts();

  constructor() {
    super();
    this.root.adoptedStyleSheets = [sheet(fieldCss), sheet(pickerCss)];
    this.#button.innerHTML = CALENDAR;
    this.#prev.innerHTML = PREVIOUS;
    this.#next.innerHTML = NEXT;
    const head = el('div', { class: 'head' });
    head.append(this.#prev, this.#title, this.#next);
    this.#dialog.append(head, this.#body);
    this.box.append(this.control, this.#button);
    this.root.append(this.#dialog);

    const input = this.control;
    input.addEventListener('input', (e) => {
      e.stopPropagation();
      this.#text = input.value;
    });
    input.addEventListener('blur', () => this.#commitText());
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      this.#commitText();
      this.form?.requestSubmit();
    });
    this.#button.addEventListener('click', () => this.show());
    this.#prev.addEventListener('click', () => this.#turn(-1));
    this.#next.addEventListener('click', () => this.#turn(1));
    this.#body.addEventListener('click', (e) => {
      const cell = (e.target as Element).closest<HTMLButtonElement>('button[data-value]');
      if (cell && !cell.disabled) this.#pick(cell.dataset.value!);
    });
    this.#body.addEventListener('keydown', this.#onGridKey);
    this.#dialog.addEventListener('close', () => {
      this.#button.setAttribute('aria-expanded', 'false');
      window.removeEventListener('resize', this.#place);
      this.control.focus();
    });
    // A press on the backdrop (outside the dialog's box) closes it, as a popover's outside click.
    this.#dialog.addEventListener('click', (e) => {
      if (e.target !== this.#dialog) return;
      const r = this.#dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) this.close();
    });
  }

  get min(): string {
    return this.getAttribute('min') ?? '';
  }
  set min(v: string) {
    this.setAttribute('min', v);
  }
  get max(): string {
    return this.getAttribute('max') ?? '';
  }
  set max(v: string) {
    this.setAttribute('max', v);
  }
  /** `day` (default), `month` or `year`. */
  get granularity(): NxDateGranularity {
    const g = this.getAttribute('granularity');
    return g === 'month' || g === 'year' ? g : 'day';
  }
  set granularity(v: NxDateGranularity) {
    this.setAttribute('granularity', v);
  }
  /** BCP 47 locale for month and weekday names and the typed format; `''` follows the nearest `lang`. */
  get locale(): string {
    return this.getAttribute('locale') ?? '';
  }
  set locale(v: string) {
    this.setAttribute('locale', v);
  }

  override get value(): string {
    return super.value;
  }
  override set value(v: string) {
    this.#text = null;
    this.#typedError = undefined;
    super.value = v;
  }

  /** `true` while the calendar is open. */
  get open(): boolean {
    return this.#dialog.open;
  }

  /** Opens the calendar on the selected date (or today), focused. */
  show(): void {
    if (this.open || this.isDisabled || this.readOnly) return;
    this.#active = this.#clamp(parseDateValue(this.value) ?? todayParts());
    this.#renderGrid();
    this.#dialog.showModal();
    this.#button.setAttribute('aria-expanded', 'true');
    this.#place();
    window.addEventListener('resize', this.#place);
    this.#focusActive();
  }

  /** Closes the calendar; focus goes back to the field. */
  close(): void {
    if (this.open) this.#dialog.close();
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (name === 'granularity' && old !== next) this.resanitize();
    super.attributeChangedCallback(name, old, next);
    if (this.open) this.#renderGrid();
  }

  get #locale(): string | undefined {
    const tag = this.getAttribute('locale') || this.closest('[lang]')?.getAttribute('lang') || undefined;
    try {
      return tag ? Intl.getCanonicalLocales(tag)[0] : undefined;
    } catch {
      return undefined;
    }
  }

  get #rtl(): boolean {
    try {
      return this.matches(':dir(rtl)');
    } catch {
      return this.closest('[dir]')?.getAttribute('dir')?.toLowerCase() === 'rtl';
    }
  }

  /** @internal Any of the three forms, cut to the granularity; a coarser one (`2026` for a day) is no value. */
  protected sanitize(v: string): string {
    const parts = parseDateValue(v.trim());
    const written = dateValueGranularity(v.trim());
    return parts && written && RANK[written] >= RANK[this.granularity] ? formatDateValue(parts, this.granularity) : '';
  }

  /** @internal */
  protected override reset(): void {
    this.#text = null;
    this.#typedError = undefined;
    this.close();
  }

  #rangeError(parts: DateParts): FieldError {
    const status = dateRangeStatus(parts, this.min, this.max, this.granularity);
    if (!status) return undefined;
    const under = status === 'under';
    const bound = parseDateValue(under ? this.min : this.max)!;
    const g = this.granularity;
    const shown = formatDisplay(bound, g, this.#locale);
    const kind = under ? 'rangeUnderflow' : 'rangeOverflow';
    const type = g === 'day' ? 'date' : g === 'month' ? 'month' : 'number';
    return { kind, message: validationMessage(kind, type, formatDateValue(bound, g), `Value must be ${shown} or ${under ? 'later' : 'earlier'}.`) };
  }

  /** @internal */
  protected check(): FieldError {
    if (this.#typedError) return this.#typedError;
    const parts = parseDateValue(this.value);
    if (!parts) return this.required ? { kind: 'valueMissing', message: validationMessage('valueMissing', 'date', '', 'Fill out this field.') } : undefined;
    return this.#rangeError(parts);
  }

  /** @internal */
  protected update(): void {
    const g = this.granularity;
    const parts = parseDateValue(this.value);
    const text = this.#text ?? (parts ? formatDisplay(parts, g, this.#locale) : '');
    if (this.control.value !== text) this.control.value = text;
    this.control.placeholder = formatHint(g, this.#locale);
    this.#button.disabled = this.isDisabled || this.readOnly;
    this.#button.setAttribute('aria-label', g === 'day' ? labels.pickDate : g === 'month' ? labels.pickMonth : labels.pickYear);
  }

  /** Blur and Enter: the typed text becomes the value, or stays as typed and invalid. */
  #commitText(): void {
    const text = this.#text;
    if (text === null) return;
    let changed = false;
    const parts = text.trim() ? parseTypedDate(text, this.granularity, this.#locale) : undefined;
    this.#typedError =
      !text.trim() || !parts
        ? !text.trim()
          ? undefined
          : { kind: 'badInput', message: validationMessage('badInput', 'date', '', `Enter a date as ${formatHint(this.granularity, this.#locale)}.`) }
        : this.#rangeError(parts);
    if (!this.#typedError) {
      this.#text = null;
      changed = this.setValue(parts ? formatDateValue(parts, this.granularity) : '');
    }
    this.touch();
    this.render();
    if (changed) this.emit('change');
  }

  #pick(value: string): void {
    this.#text = null;
    this.#typedError = undefined;
    const changed = this.setValue(value);
    this.touch();
    this.render();
    this.close();
    if (changed) this.emit('change');
  }

  /** `parts` moved inside `min` and `max` (a coarse bound covers its whole period). */
  #clamp(parts: DateParts): DateParts {
    const g = this.granularity;
    const status = dateRangeStatus(parts, this.min, this.max, g);
    if (!status) return parts;
    const bound = parseDateValue(status === 'under' ? this.min : this.max)!;
    if (status === 'under' || RANK[dateValueGranularity(this.max)!] >= RANK[g]) return bound;
    // A max coarser than the grid (max="2026" on a day grid): the last day of its period.
    const month = dateValueGranularity(this.max) === 'year' ? 11 : bound.month;
    return { year: bound.year, month, day: daysInMonth(bound.year, month) };
  }

  /** The previous (-1) or next (1) page: a month of days, a year of months, twelve years. */
  #turn(delta: number, focus = false): void {
    const g = this.granularity;
    const a = this.#active;
    this.#active = this.#clamp(g === 'day' ? addMonths(a, delta) : addMonths(a, delta * 12 * (g === 'year' ? YEARS_PER_PAGE : 1)));
    this.#renderGrid();
    if (focus) this.#focusActive();
  }

  #onGridKey = (e: KeyboardEvent): void => {
    const g = this.granularity;
    const a = this.#active;
    const ahead = this.#rtl ? -1 : 1;
    // One cell along a row, one row down: a day / a week, a month / three, a year / three.
    const move = (cells: number): DateParts => (g === 'day' ? addDays(a, cells) : addMonths(a, cells * (g === 'year' ? 12 : 1)));
    const rowStart = (): DateParts => {
      if (g === 'day') return addDays(a, -((weekdayOf(a) - firstDayOfWeek(this.#locale) + 7) % 7));
      return g === 'month' ? { ...a, month: 0, day: 1 } : { year: pageStart(a.year), month: 0, day: 1 };
    };
    let next: DateParts;
    switch (e.key) {
      case 'ArrowLeft':
        next = move(-ahead);
        break;
      case 'ArrowRight':
        next = move(ahead);
        break;
      case 'ArrowUp':
        next = move(g === 'day' ? -7 : -3);
        break;
      case 'ArrowDown':
        next = move(g === 'day' ? 7 : 3);
        break;
      case 'PageUp':
      case 'PageDown': {
        const dir = e.key === 'PageUp' ? -1 : 1;
        next = g === 'day' ? addMonths(a, dir * (e.shiftKey ? 12 : 1)) : addMonths(a, dir * 12 * (g === 'year' ? YEARS_PER_PAGE : 1));
        break;
      }
      case 'Home':
        next = rowStart();
        break;
      case 'End':
        next = g === 'day' ? addDays(rowStart(), 6) : g === 'month' ? { ...a, month: 11, day: 1 } : { year: pageStart(a.year) + 11, month: 0, day: 1 };
        break;
      default:
        return;
    }
    e.preventDefault();
    this.#active = this.#clamp(next);
    this.#renderGrid();
    this.#focusActive();
  };

  #focusActive(): void {
    this.#body.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }

  /** Places the dialog under the field (above it when there is no room); the sheet layout ignores this. */
  #place = (): void => {
    if (!this.open || window.matchMedia?.(SHEET_QUERY).matches) return;
    const r = this.box.getBoundingClientRect();
    const { offsetWidth: w, offsetHeight: h } = this.#dialog;
    const vw = document.documentElement.clientWidth || innerWidth;
    const vh = document.documentElement.clientHeight || innerHeight;
    const gap = 4;
    let top = r.bottom + gap;
    if (top + h > vh - gap && r.top - gap - h >= gap) top = r.top - gap - h;
    const start = Math.max(gap, Math.min(this.#rtl ? vw - r.right : r.left, vw - w - gap));
    this.#dialog.style.setProperty('--nx-top', `${Math.max(gap, top)}px`);
    this.#dialog.style.setProperty('--nx-start', `${start}px`);
  };

  /** Draws the header and the grid for the page `#active` is on. */
  #renderGrid(): void {
    const g = this.granularity;
    const locale = this.#locale;
    const a = this.#active;
    const selected = parseDateValue(this.value);
    const today = todayParts();
    const out = (p: DateParts, at: DateGranularity) => dateRangeStatus(p, this.min, this.max, at);
    const dtf = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...o });
    const nf = new Intl.NumberFormat(locale, { useGrouping: false });

    let title: string;
    let prev: DateParts;
    let next: DateParts;
    let navUnit: DateGranularity;
    let grid: HTMLElement;
    if (g === 'day') {
      const first = { year: a.year, month: a.month, day: 1 };
      title = dtf({ month: 'long', year: 'numeric' }).format(utcDate(first));
      [prev, next, navUnit] = [addMonths(first, -1), addMonths(first, 1), 'month'];
      const firstDay = firstDayOfWeek(locale);
      const offset = (weekdayOf(first) - firstDay + 7) % 7;
      const count = Math.ceil((offset + daysInMonth(a.year, a.month)) / 7) * 7;
      grid = el('table', { role: 'grid', 'aria-label': title });
      const head = el('tr');
      for (let i = 0; i < 7; i++) {
        // 1970-01-04 was a Sunday.
        const d = utcDate({ year: 1970, month: 0, day: 4 + ((firstDay + i) % 7) });
        const th = el('th', { scope: 'col', abbr: dtf({ weekday: 'long' }).format(d) });
        th.textContent = dtf({ weekday: 'short' }).format(d);
        head.append(th);
      }
      const thead = el('thead');
      thead.append(head);
      const tbody = el('tbody');
      grid.append(thead, tbody);
      const full = dtf({ dateStyle: 'full' });
      let row: HTMLTableRowElement | undefined;
      for (let i = 0; i < count; i++) {
        if (i % 7 === 0) tbody.append((row = el('tr')));
        const d = addDays(first, i - offset);
        const isSelected = selected !== undefined && compareDateParts(d, selected) === 0;
        const isToday = compareDateParts(d, today) === 0;
        let label = full.format(utcDate(d));
        if (isToday) label = labels.todayDate(label);
        if (isSelected) label = labels.selectedDate(label);
        const cell = el('td', { role: 'gridcell', 'aria-selected': isSelected ? 'true' : undefined });
        const button = el('button', {
          type: 'button',
          class: 'day',
          'data-value': formatDateValue(d),
          tabindex: compareDateParts(d, a) === 0 ? '0' : '-1',
          'aria-label': label,
          'aria-current': isToday ? 'date' : undefined,
          'data-outside': d.month !== a.month ? '' : undefined,
        });
        button.disabled = out(d, 'day') !== undefined;
        button.textContent = nf.format(d.day);
        cell.append(button);
        row!.append(cell);
      }
    } else {
      const isMonth = g === 'month';
      const start = isMonth ? a.year : pageStart(a.year);
      title = isMonth ? String(a.year) : `${start} – ${start + YEARS_PER_PAGE - 1}`;
      navUnit = 'year';
      prev = { year: isMonth ? a.year - 1 : start - 1, month: 0, day: 1 };
      next = { year: isMonth ? a.year + 1 : start + YEARS_PER_PAGE, month: 0, day: 1 };
      grid = el('div', { role: 'group', class: 'cells', 'aria-label': title });
      for (let i = 0; i < 12; i++) {
        const p: DateParts = isMonth ? { year: a.year, month: i, day: 1 } : { year: start + i, month: 0, day: 1 };
        const button = el('button', {
          type: 'button',
          class: 'cell',
          'data-value': formatDateValue(p, g),
          tabindex: compareDateParts(p, a, g) === 0 ? '0' : '-1',
          'aria-pressed': String(selected !== undefined && compareDateParts(p, selected, g) === 0),
          'aria-current': compareDateParts(p, today, g) === 0 ? 'date' : undefined,
          'aria-label': isMonth ? formatDisplay(p, 'month', locale) : String(p.year),
        });
        button.disabled = out(p, g) !== undefined;
        button.textContent = isMonth ? dtf({ month: 'short' }).format(utcDate(p)) : String(p.year);
        grid.append(button);
      }
    }
    // A page is unreachable when it is wholly outside min or max.
    this.#prev.disabled = out(prev, navUnit) === 'under';
    this.#next.disabled = out(next, navUnit) === 'over';
    const [pl, nl] = g === 'day' ? [labels.previousMonth, labels.nextMonth] : g === 'month' ? [labels.previousYear, labels.nextYear] : [labels.previousYears, labels.nextYears];
    this.#prev.setAttribute('aria-label', pl);
    this.#next.setAttribute('aria-label', nl);
    this.#title.textContent = title;
    this.#dialog.setAttribute('aria-label', g === 'day' ? labels.pickDate : g === 'month' ? labels.pickMonth : labels.pickYear);
    this.#body.replaceChildren(grid);
  }
}
