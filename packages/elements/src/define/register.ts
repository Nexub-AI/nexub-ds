/** Defines `tag` unless it is already defined (so loading a define module twice is safe), and not where there is no DOM. */
export function register(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements !== 'undefined' && !customElements.get(tag)) customElements.define(tag, ctor);
}
