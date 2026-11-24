import { choiceFieldMessages } from '@nexub/core';
import { NxFieldElement } from './field.js';
import { CHECK, el, isRtl, svg } from './dom.js';

/** One choice in `<nx-select>` or `<nx-combobox>`: the shape of `@nexub/react`'s `ComboboxOption`. */
export interface NxOption {
  value: string;
  label: string;
  /** A second line under the label (an email, a code). Also searched. */
  description?: string;
  /** More text the option is found by (type-ahead and filtering). */
  keywords?: string[];
  disabled?: boolean;
  /** A heading the option is listed under; consecutive options with the same group share it. */
  group?: string;
}

/** The select, combobox and phone field strings: `choiceFieldMessages` from `@nexub/core` (11.9). */
export const choiceLabels = choiceFieldMessages;

/** Below this width the list is a bottom sheet (as `@nexub/react`'s `sheet="auto"`). */
const SHEET_QUERY = '(max-width: 47.99rem)';
/** Type-ahead keys typed within this many milliseconds add up to one search. */
const TYPEAHEAD_MS = 500;

/** Lower case without accents, so "É" finds "e". */
export const fold = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** The options written as child `<option>`s, under their `<optgroup>`s. */
export function childOptions(host: Element): NxOption[] {
  return Array.from(host.querySelectorAll('option'), (o) => {
    const group = o.parentElement?.localName === 'optgroup' ? (o.parentElement as HTMLOptGroupElement) : undefined;
    return { value: o.value, label: o.label, disabled: o.disabled || Boolean(group?.disabled), group: group?.label || undefined };
  });
}

/** The options whose label, description or keywords contain `query` (any case, any accents). */
export function filterOptions(options: NxOption[], query: string): NxOption[] {
  const q = fold(query.trim());
  return q ? options.filter((o) => [o.label, o.description, ...(o.keywords ?? [])].some((t) => t && fold(t).includes(q))) : options;
}

let uid = 0;

/**
 * The popup listbox of the three list fields. Focus never moves into it: the field keeps focus
 * and points at the active option with `aria-activedescendant` (WAI-ARIA combobox pattern).
 * The popup is a `popover="manual"` (the top layer) where the browser has it, placed under the
 * field (above it without room), and a bottom sheet below 48rem.
 *
 * @internal
 */
export class ListPopup {
  readonly popup = el('div', { class: 'popup', part: 'popup', hidden: '' });
  readonly status = el('div', { role: 'status', class: 'status' });
  readonly list: HTMLDivElement;
  options: NxOption[] = [];
  /** The highlighted option's index, `-1` for none. */
  active = -1;
  #selected = '';
  #id = `nx-list-${++uid}`;
  #typed = '';
  #typedAt = 0;

  constructor(
    readonly host: HTMLElement,
    readonly anchor: HTMLElement,
    readonly control: HTMLElement,
    readonly pick: (option: NxOption) => void,
    /** Draws the options; runs before the popup opens. */
    readonly refresh: () => void,
  ) {
    this.list = el('div', { role: 'listbox', id: this.#id, part: 'listbox' });
    this.popup.append(this.status, this.list);
    if ('popover' in this.popup) this.popup.popover = 'manual';
    control.setAttribute('aria-controls', this.#id);
    control.setAttribute('aria-expanded', 'false');
    // A press in the list keeps focus in the field.
    this.popup.addEventListener('mousedown', (e) => e.preventDefault());
    this.list.addEventListener('click', (e) => {
      const o = this.options[this.#indexAt(e)];
      if (o && !o.disabled) this.pick(o);
    });
    this.list.addEventListener('mousemove', (e) => {
      const i = this.#indexAt(e);
      if (i >= 0 && i !== this.active && !this.options[i]!.disabled) this.setActive(i, false);
    });
  }

  #indexAt(e: Event): number {
    const node = (e.target as Element).closest<HTMLElement>('[role="option"]');
    return node ? Number(node.dataset.index) : -1;
  }

  get open(): boolean {
    return !this.popup.hidden;
  }

  /** Draws `options`; `selected` (the field's value) is `aria-selected` with a check. */
  render(options: NxOption[], selected: string, label: string): void {
    this.options = options;
    this.#selected = selected;
    if (label) this.list.setAttribute('aria-label', label);
    else this.list.removeAttribute('aria-label');
    const nodes: HTMLElement[] = [];
    let group: HTMLElement | undefined;
    let heading: string | undefined;
    options.forEach((o, i) => {
      if (o.group !== heading) {
        heading = o.group;
        group = undefined;
        if (heading) {
          const hid = `${this.#id}-g${i}`;
          group = el('div', { role: 'group', 'aria-labelledby': hid });
          const head = el('div', { role: 'presentation', id: hid, class: 'heading' });
          head.textContent = heading;
          group.append(head);
          nodes.push(group);
        }
      }
      const id = `${this.#id}-${i}`;
      const node = el('div', {
        role: 'option',
        id,
        class: 'option',
        part: 'option',
        'data-index': String(i),
        'aria-selected': String(o.value === selected),
        'aria-disabled': o.disabled ? 'true' : undefined,
        'aria-describedby': o.description ? `${id}-d` : undefined,
      });
      const text = el('span', { class: 'label' });
      text.textContent = o.label;
      node.append(svg(CHECK), text);
      if (o.description) {
        const d = el('span', { id: `${id}-d`, class: 'description' });
        d.textContent = o.description;
        text.append(d);
      }
      if (group) group.append(node);
      else nodes.push(node);
    });
    this.list.replaceChildren(...nodes);
    if (this.active >= options.length) this.active = -1;
    this.setActive(this.active, false);
  }

  /** Highlights option `i` (`-1`: none) and scrolls it into view. */
  setActive(i: number, scroll = true): void {
    this.active = i;
    let found: HTMLElement | undefined;
    for (const node of this.list.querySelectorAll<HTMLElement>('[role="option"]')) {
      const on = Number(node.dataset.index) === i;
      node.toggleAttribute('data-active', on);
      if (on) found = node;
    }
    if (found && this.open) {
      this.control.setAttribute('aria-activedescendant', found.id);
      if (scroll) found.scrollIntoView?.({ block: 'nearest' });
    } else this.control.removeAttribute('aria-activedescendant');
  }

  /** The enabled option `count` steps from `from` in `dir`, stopping at the ends. */
  step(from: number, dir: 1 | -1, count = 1): number {
    let found = from;
    for (let i = from + dir; i >= 0 && i < this.options.length && count > 0; i += dir) {
      if (this.options[i]!.disabled) continue;
      found = i;
      count--;
    }
    return found;
  }
  first(): number {
    return this.step(-1, 1);
  }
  last(): number {
    return this.step(this.options.length, -1);
  }
  indexOf(value: string): number {
    return this.options.findIndex((o) => o.value === value);
  }

  show(): void {
    if (this.open) return;
    this.refresh();
    this.popup.hidden = false;
    try {
      this.popup.showPopover?.();
    } catch {
      // Not in the document yet, or no top layer: the fixed popup still shows.
    }
    this.control.setAttribute('aria-expanded', 'true');
    this.place();
    window.addEventListener('resize', this.place);
    window.addEventListener('scroll', this.place, { capture: true, passive: true });
    document.addEventListener('mousedown', this.#outside, true);
  }

  hide(): void {
    if (!this.open) return;
    try {
      this.popup.hidePopover?.();
    } catch {
      // Was not showing as a popover.
    }
    this.popup.hidden = true;
    this.active = -1;
    this.control.setAttribute('aria-expanded', 'false');
    this.control.removeAttribute('aria-activedescendant');
    window.removeEventListener('resize', this.place);
    window.removeEventListener('scroll', this.place, true);
    document.removeEventListener('mousedown', this.#outside, true);
  }

  #outside = (e: Event): void => {
    if (!e.composedPath().includes(this.host)) this.hide();
  };

  /** Under the field, the field's width (above it without room below); the sheet layout ignores this. */
  place = (): void => {
    if (!this.open || window.matchMedia?.(SHEET_QUERY).matches) return;
    const r = this.anchor.getBoundingClientRect();
    const h = this.popup.offsetHeight;
    const vw = document.documentElement.clientWidth || innerWidth;
    const vh = document.documentElement.clientHeight || innerHeight;
    const gap = 4;
    let top = r.bottom + gap;
    if (top + h > vh - gap && r.top - gap - h >= gap) top = r.top - gap - h;
    const s = this.popup.style;
    s.setProperty('--nx-top', `${Math.max(gap, top)}px`);
    s.setProperty('--nx-start', `${Math.max(0, isRtl(this.host) ? vw - r.right : r.left)}px`);
    s.setProperty('--nx-width', `${r.right - r.left}px`);
  };

  /** `true` while a type-ahead search is running (a space then adds to it). */
  get typing(): boolean {
    return this.#typed !== '' && Date.now() - this.#typedAt <= TYPEAHEAD_MS;
  }

  /**
   * Type-ahead: the next enabled option whose label (or a keyword) starts with the keys typed in
   * the last half second; one key pressed again cycles through the options starting with it.
   * `-1` when none matches.
   */
  typeahead(key: string): number {
    const now = Date.now();
    this.#typed = now - this.#typedAt > TYPEAHEAD_MS ? key : this.#typed + key;
    this.#typedAt = now;
    const q = fold(this.#typed);
    const repeated = [...q].every((c) => c === q[0]);
    const needle = repeated ? q[0]! : q;
    const from = this.active >= 0 ? this.active : this.indexOf(this.#selected);
    const start = from < 0 ? 0 : from + (repeated ? 1 : 0);
    const n = this.options.length;
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      const o = this.options[i]!;
      if (!o.disabled && [o.label, ...(o.keywords ?? [])].some((t) => fold(t).startsWith(needle))) return i;
    }
    return -1;
  }

  /**
   * The select-only combobox keys (WAI-ARIA APG), for a button that opens this list. Closed:
   * Arrow Down / Up, Enter, Space, Home, End open it; a printable key picks by type-ahead (as a
   * native select). Open: arrows, Home / End, Page Up / Down (ten) and type-ahead move; Enter,
   * Space and Alt+Arrow Up pick; Tab picks and moves on; Escape closes.
   */
  selectKey(e: KeyboardEvent): void {
    const { key } = e;
    const printable = key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    const typeahead = printable && (key !== ' ' || this.typing);
    if (!this.open) {
      if (typeahead) {
        e.preventDefault();
        this.refresh();
        const o = this.options[this.typeahead(key)];
        if (o) this.pick(o);
      } else if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(key)) {
        e.preventDefault();
        this.show();
        const current = this.indexOf(this.#selected);
        this.setActive(key === 'Home' ? this.first() : key === 'End' ? this.last() : current >= 0 && !this.options[current]!.disabled ? current : this.first());
      }
      return;
    }
    let next: number;
    switch (key) {
      case 'ArrowDown':
        next = this.step(this.active, 1);
        break;
      case 'ArrowUp':
        if (e.altKey) return this.#choose(e);
        next = this.active < 0 ? this.last() : this.step(this.active, -1);
        break;
      case 'Home':
        next = this.first();
        break;
      case 'End':
        next = this.last();
        break;
      case 'PageDown':
        next = this.step(this.active, 1, 10);
        break;
      case 'PageUp':
        next = this.step(this.active, -1, 10);
        break;
      case 'Enter':
        return this.#choose(e);
      case 'Tab':
        // Picks and lets focus move on.
        return this.#choose();
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        return this.hide();
      default:
        if (!printable) return;
        if (!typeahead) return this.#choose(e);
        next = this.typeahead(key);
        if (next < 0) return e.preventDefault();
    }
    e.preventDefault();
    this.setActive(next);
  }

  #choose(e?: Event): void {
    e?.preventDefault();
    const o = this.options[this.active];
    if (o) this.pick(o);
    else this.hide();
  }
}

/**
 * What `<nx-select>` and `<nx-combobox>` share: options from child `<option>` / `<optgroup>`
 * elements (watched for changes) or the `options` property, the placeholder, and the popup.
 *
 * @alpha
 */
export abstract class NxChoiceElement extends NxFieldElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'placeholder'];
  }

  /** @internal */
  protected abstract readonly list: ListPopup;
  #options: NxOption[] | null = null;
  #children: NxOption[] = [];
  #observer?: MutationObserver;

  /** The options: the `options` property when set, else the child `<option>` elements. */
  get options(): NxOption[] {
    return this.#options ?? this.#children;
  }
  /** Replaces the child `<option>`s as the source; `null` goes back to them. */
  set options(v: NxOption[] | null) {
    this.#options = v ? v.map((o) => ({ ...o, value: String(o.value), label: String(o.label ?? o.value) })) : null;
    this.optionsChanged();
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') ?? '';
  }
  set placeholder(v: string) {
    this.setAttribute('placeholder', v);
  }

  /** `true` while the list is open. */
  get open(): boolean {
    return this.list.open;
  }
  /** Closes the list. */
  close(): void {
    this.list.hide();
  }

  override connectedCallback(): void {
    this.#children = childOptions(this);
    this.#observer ??= new MutationObserver(() => {
      this.#children = childOptions(this);
      if (!this.#options) this.optionsChanged();
    });
    this.#observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value', 'label', 'disabled', 'selected'] });
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.list.hide();
  }

  /** @internal The `value` attribute, else the child `<option selected>`. */
  protected override initial(): string {
    return this.getAttribute('value') ?? this.querySelector<HTMLOptionElement>('option[selected]')?.value ?? '';
  }

  /** @internal The options changed: the value is checked against them again. */
  protected optionsChanged(): void {
    this.resanitize();
    this.render();
  }

  /** @internal Read-only or disabled: the list can't open and the value can't change. */
  protected get locked(): boolean {
    return this.isDisabled || this.readOnly;
  }

  /** @internal The text the list is named by: the field's own name. */
  protected get listLabel(): string {
    return this.control.getAttribute('aria-label') ?? '';
  }
}
