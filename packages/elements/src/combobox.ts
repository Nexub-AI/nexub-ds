import type { FieldError } from './field.js';
import { NxChoiceElement, ListPopup, choiceLabels, filterOptions, fold, type NxOption } from './choice.js';
import { CHEVRON, el, svg } from './dom.js';
import { missingMessage } from './messages.js';
import { sheet, fieldCss } from './styles.js';
import { listCss } from './list-styles.js';

/** `<nx-combobox>`'s async search: the options for `query`; `signal` aborts when a newer search starts. */
export type NxSearch = (query: string, signal: AbortSignal) => Promise<NxOption[]>;

/**
 * `<nx-combobox>`: a form-associated editable combobox, the `@nexub/react` `ComboboxField`: a
 * text field that filters a listbox as you type (WAI-ARIA combobox pattern, list autocomplete,
 * `aria-activedescendant`). Options come from child `<option>` / `<optgroup>` elements or the
 * `options` property, or from the server through `onsearch`.
 *
 * Without `allow-custom` the value is an option's value: text that names no option goes back
 * to the picked option's label on blur (typing an option's label exactly picks it). With
 * `allow-custom` the typed text is the value.
 *
 * Async search: set `onsearch` to `(query, signal) => Promise<options>`. It runs on every edit
 * (debounce on your side) and when the list opens; only the latest search's answer is shown
 * (older ones are dropped and their `signal` aborted). "Searching…", "No results found." and a
 * failed search are announced in a live region.
 *
 * Keyboard: Arrow Down / Up open the list and move (Alt+Arrow Down opens without moving,
 * Alt+Arrow Up closes), Enter picks (or, closed, submits the form), Escape closes, then clears.
 *
 * Attributes (reflected as properties): `name`, `value` (the default), `placeholder`,
 * `allow-custom`, `required`, `disabled`, `readonly`, `invalid`, `size`. Events: `input` when
 * the value changes, `change` when it was committed (a pick, blur, Enter).
 *
 * @alpha
 */
export class NxCombobox extends NxChoiceElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'allow-custom'];
  }

  /** @internal */
  protected readonly control = el('input', { type: 'text', role: 'combobox', part: 'input', autocomplete: 'off', spellcheck: 'false', 'aria-autocomplete': 'list' });
  readonly #toggle = el('button', { type: 'button', class: 'toggle', part: 'button', tabindex: '-1', 'aria-hidden': 'true' });
  /** @internal */
  protected readonly list: ListPopup;
  #search: NxSearch | null = null;
  /** The latest search's options; `null` before the first. */
  #results: NxOption[] | null = null;
  #state: 'idle' | 'loading' | 'failed' = 'idle';
  #seq = 0;
  #abort?: AbortController;
  /** The last option picked: its label shows even when a later search no longer lists it. */
  #picked?: NxOption;
  /** Typed since the last commit; `null` when the field shows the value's label. */
  #text: string | null = null;
  /** The value when focus came in, to fire `change` once. */
  #committed = '';

  constructor() {
    super();
    this.root.adoptedStyleSheets = [sheet(fieldCss), sheet(listCss)];
    this.#toggle.append(svg(CHEVRON));
    this.box.append(this.control, this.#toggle);
    this.list = new ListPopup(this, this.box, this.control, (o) => this.#pick(o), () => this.#renderList());
    this.root.append(this.list.popup);
    const input = this.control;
    input.addEventListener('focus', () => (this.#committed = this.value));
    input.addEventListener('input', this.#onInput);
    input.addEventListener('keydown', this.#onKey);
    input.addEventListener('blur', () => this.#commit());
    this.#toggle.addEventListener('mousedown', (e) => e.preventDefault());
    this.#toggle.addEventListener('click', () => {
      if (this.open) return this.close();
      this.control.focus();
      this.show();
    });
    this.upgrade('options', 'onsearch', 'value');
  }

  /** Free text: the typed text is the value when it names no option. */
  get allowCustom(): boolean {
    return this.hasAttribute('allow-custom');
  }
  set allowCustom(v: boolean) {
    this.toggleAttribute('allow-custom', Boolean(v));
  }

  /** The async search (see the class docs); `null` filters the options here. */
  get onsearch(): NxSearch | null {
    return this.#search;
  }
  set onsearch(fn: NxSearch | null) {
    this.#search = typeof fn === 'function' ? fn : null;
    this.#results = null;
    this.optionsChanged();
  }

  /** The picked option, if it is known (an option, a search result or the last pick). */
  get selectedOption(): NxOption | undefined {
    return this.#known().find((o) => o.value === this.value);
  }

  /** Opens the list (and runs the search when there is none yet). */
  show(): void {
    if (this.locked || this.open) return;
    if (this.#search && !this.#results && this.#state !== 'loading') void this.#run(this.#text ?? '');
    this.list.show();
  }

  override attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (name === 'allow-custom' && old !== next) this.resanitize();
    super.attributeChangedCallback(name, old, next);
  }

  #known(): NxOption[] {
    return [...this.options, ...(this.#results ?? []), ...(this.#picked ? [this.#picked] : [])];
  }

  /** @internal Without free text or a search, a value that is none of the options is no value. */
  protected sanitize(v: string): string {
    return this.allowCustom || this.#search || !this.options.length || this.options.some((o) => o.value === v) ? v : '';
  }

  /** @internal */
  protected check(): FieldError {
    return this.required && !this.value ? { kind: 'valueMissing', message: missingMessage() } : undefined;
  }

  /** @internal */
  protected override reset(): void {
    this.#text = null;
    this.close();
  }

  /** @internal */
  protected update(): void {
    const text = this.#text ?? (this.value ? (this.selectedOption?.label ?? this.value) : '');
    if (this.control.value !== text) this.control.value = text;
    this.control.placeholder = this.placeholder;
    this.#toggle.disabled = this.locked;
    if (this.open) this.#renderList();
  }

  /** The options shown: the search's answer, or the options filtered by the typed text. */
  #renderList(): void {
    const shown = this.#search ? (this.#results ?? []) : filterOptions(this.options, this.#text ?? '');
    const loading = this.#state === 'loading';
    this.list.render(shown, this.value, this.listLabel);
    this.list.list.setAttribute('aria-busy', String(loading));
    // Searching or failed; else "No results" once there is something to have found nothing for.
    const status = loading ? choiceLabels.searching : this.#state === 'failed' ? choiceLabels.searchFailed : shown.length || (this.#search && !this.#results) ? '' : choiceLabels.noResults;
    if (this.list.status.textContent !== status) this.list.status.textContent = status;
  }

  /** Runs the search; an answer that arrives after a newer search started is dropped. */
  async #run(query: string): Promise<void> {
    const seq = ++this.#seq;
    this.#abort?.abort();
    const abort = (this.#abort = new AbortController());
    this.#state = 'loading';
    this.#renderList();
    let results: NxOption[] = [];
    let state: 'idle' | 'failed' = 'idle';
    try {
      results = (await this.#search!(query, abort.signal)) ?? [];
    } catch {
      state = 'failed';
    }
    if (seq !== this.#seq) return;
    this.#results = results;
    this.#state = state;
    this.list.active = -1;
    this.#renderList();
  }

  #onInput = (e: Event): void => {
    // The inner input's own event stops here; the host fires one when the value changes.
    e.stopPropagation();
    this.#text = this.control.value;
    this.list.active = -1;
    if (this.allowCustom && this.setValue(this.#text)) {
      this.render();
      this.emit('input');
    }
    if (this.#search) void this.#run(this.#text);
    if (this.open) this.#renderList();
    else this.show();
  };

  #onKey = (e: KeyboardEvent): void => {
    if (e.isComposing) return;
    const list = this.list;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const down = e.key === 'ArrowDown';
        if (!this.open) {
          this.show();
          if (this.open && !e.altKey) list.setActive(down ? list.first() : list.last());
        } else if (e.altKey) {
          if (!down) this.close();
        } else list.setActive(list.active < 0 ? (down ? list.first() : list.last()) : list.step(list.active, down ? 1 : -1));
        return;
      }
      case 'Enter': {
        const o = this.open ? list.options[list.active] : undefined;
        if (o) {
          e.preventDefault();
          return this.#pick(o);
        }
        const wasOpen = this.open;
        this.#commit();
        // Implicit submission, as a text field: the inner input has no form of its own.
        if (!wasOpen) this.form?.requestSubmit();
        return;
      }
      case 'Escape':
        if (this.open) {
          e.preventDefault();
          return this.close();
        }
        if (this.control.value && !this.locked) {
          e.preventDefault();
          this.#text = '';
          this.#commit();
        }
    }
  };

  #pick(o: NxOption): void {
    this.#picked = o;
    this.#text = null;
    this.close();
    const changed = this.setValue(o.value);
    this.touch();
    this.render();
    if (changed) this.emit('input');
    this.#change();
  }

  /** Blur, Enter, Escape: the typed text picks the option it names, is the value (free text), or goes back. */
  #commit(): void {
    this.close();
    const text = this.#text;
    if (text === null) return;
    this.#text = null;
    const typed = fold(text.trim());
    const match = typed ? this.#known().find((o) => !o.disabled && fold(o.label) === typed) : undefined;
    if (match) this.#picked = match;
    const next = !typed ? '' : match ? match.value : this.allowCustom ? text : undefined;
    const changed = next !== undefined && this.setValue(next);
    this.touch();
    this.render();
    if (changed) this.emit('input');
    this.#change();
  }

  #change(): void {
    if (this.value === this.#committed) return;
    this.#committed = this.value;
    this.emit('change');
  }
}
