import type { FieldError } from './field.js';
import { NxChoiceElement, ListPopup, choiceLabels, type NxOption } from './choice.js';
import { CHEVRON, el, svg } from './dom.js';
import { missingMessage } from './messages.js';
import { sheet, fieldCss } from './styles.js';
import { listCss } from './list-styles.js';

/**
 * `<nx-select>`: a form-associated single choice, the `@nexub/react` `Select`: a field-styled
 * button (`role="combobox"`) that opens a listbox, the WAI-ARIA select-only combobox pattern.
 * Options come from child `<option>` / `<optgroup>` elements (as in a native `<select>`) or the
 * `options` property (`{ value, label, description?, disabled?, group? }[]`).
 *
 * Keyboard: closed, Arrow Down / Up, Enter, Space, Home and End open the list, and typing picks
 * the option it starts (type-ahead, as a native select); open, arrows, Home / End and Page Up /
 * Down move, typing jumps, Enter / Space pick, Escape closes, Tab picks and moves on.
 *
 * Attributes (reflected as properties): `name`, `value` (the default; else the child
 * `<option selected>`), `placeholder`, `required`, `disabled`, `readonly`, `invalid`, `size`.
 * A value that is none of the options is no value. Events: `input` and `change` when the user
 * picks another option.
 *
 * @alpha
 */
export class NxSelect extends NxChoiceElement {
  /** @internal */
  protected readonly control = el('button', { type: 'button', role: 'combobox', class: 'trigger', part: 'trigger', 'aria-haspopup': 'listbox' });
  readonly #text = el('span', { class: 'text', part: 'value' });
  /** @internal */
  protected readonly list: ListPopup;

  constructor() {
    super();
    this.root.adoptedStyleSheets = [sheet(fieldCss), sheet(listCss)];
    this.control.append(this.#text, svg(CHEVRON));
    this.box.append(this.control);
    this.list = new ListPopup(this, this.box, this.control, (o) => this.#pick(o), () => this.list.render(this.options, this.value, this.listLabel));
    this.root.append(this.list.popup);
    this.control.addEventListener('click', () => (this.open ? this.close() : this.show()));
    this.control.addEventListener('keydown', (e) => {
      if (this.locked) {
        // Read-only: focusable, but no key opens the list or changes the value.
        if (e.key !== 'Tab') e.preventDefault();
        return;
      }
      this.list.selectKey(e);
    });
    // A Space on a button clicks it on key up: the keydown already handled it.
    this.control.addEventListener('keyup', (e) => e.key === ' ' && e.preventDefault());
    this.control.addEventListener('blur', () => this.close());
    this.upgrade('options', 'value');
  }

  /** The picked option, if any. */
  get selectedOption(): NxOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  /** Opens the list on the picked option (or the first). */
  show(): void {
    if (this.locked || this.open) return;
    this.list.show();
    const i = this.list.indexOf(this.value);
    this.list.setActive(i >= 0 && !this.options[i]!.disabled ? i : this.list.first());
  }

  /** @internal Any of the option values; anything else is no value (kept while there are no options yet). */
  protected sanitize(v: string): string {
    return !this.options.length || this.options.some((o) => o.value === v) ? v : '';
  }

  /** @internal */
  protected check(): FieldError {
    return this.required && !this.value ? { kind: 'valueMissing', message: missingMessage() } : undefined;
  }

  /** @internal */
  protected override reset(): void {
    this.close();
  }

  /** @internal */
  protected update(): void {
    const picked = this.selectedOption;
    this.#text.textContent = picked ? picked.label : this.placeholder || choiceLabels.selectPlaceholder;
    this.control.toggleAttribute('data-placeholder', !picked);
    if (this.open) this.list.refresh();
  }

  #pick(o: NxOption): void {
    this.close();
    const changed = this.setValue(o.value);
    this.touch();
    this.render();
    if (changed) {
      this.emit('input');
      this.emit('change');
    }
  }
}
