// 9.6: the XSS corpus and the DOM audit shared by the xss tests in @nexub/react,
// @nexub/patterns and @nexub/marketing. Test support only: not exported from the package.

/** Values for anything rendered into href or src. None may come out script-capable. */
export const XSS_URLS = [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  ' javascript:alert(1)',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  '\u0001javascript:alert(1)',
  'javascript://%0aalert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>',
  'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
  'file:///etc/passwd',
  '" onmouseover="alert(1)',
  '"><img src=x onerror=alert(1)>',
  "'><script>alert(1)</script>",
  'x" autofocus onfocus="alert(1)',
];

/** Values for anything rendered as text: labels, titles, names, descriptions, model output. */
export const XSS_TEXT = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<svg/onload=alert(1)>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  '<a href="javascript:alert(1)">x</a>',
  '</textarea><script>alert(1)</script>',
  '"><b onmouseover=alert(1)>x</b>',
  '[x](javascript:alert(1))',
  "{{constructor.constructor('alert(1)')()}}",
  '<style>*{background:url(javascript:alert(1))}</style>',
];

const LINK = new Set(['http:', 'https:', 'mailto:', 'tel:', 'sms:']);
const MEDIA = new Set(['http:', 'https:', 'blob:']);
const protocol = (value: string) => {
  try {
    return new URL(value, 'https://base.test/dir/').protocol;
  } catch {
    return null; // not a URL: nothing to load or navigate to
  }
};

/**
 * Everything under `root` that could run script: an element the payload created
 * (script, iframe, object, embed, base), an inline event handler, a link or form
 * target outside http(s)/mailto/tel/sms, or a media source outside http(s)/blob/data:image.
 * `allowHandlers` is for attributes the test itself set.
 */
export function auditDom(root: ParentNode = document): string[] {
  const found: string[] = [];
  for (const el of root.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (['script', 'iframe', 'object', 'embed', 'base'].includes(tag)) found.push(`<${tag}> element`);
    for (const { name, value } of el.attributes) {
      const attr = name.toLowerCase();
      if (attr.startsWith('on')) found.push(`<${tag} ${attr}>`);
      if (['href', 'xlink:href', 'action', 'formaction'].includes(attr)) {
        const p = protocol(value);
        if (p !== null && !LINK.has(p)) found.push(`<${tag} ${attr}="${value.slice(0, 60)}">`);
      }
      if (['src', 'poster', 'data'].includes(attr)) {
        const p = protocol(value);
        const image = p === 'data:' && /^data:image\//i.test(value.trim());
        if (p !== null && !MEDIA.has(p) && !image) found.push(`<${tag} ${attr}="${value.slice(0, 60)}">`);
      }
      if (attr === 'srcdoc') found.push(`<${tag} srcdoc>`);
      if (attr === 'style' && /url\(\s*['"]?\s*javascript:|expression\(/i.test(value)) found.push(`<${tag} style="${value.slice(0, 60)}">`);
    }
  }
  return found;
}
