// The docs' Trusted Types `default` policy (9.6), inlined first in <head> by app/layout.tsx so
// it exists before any bundle runs. The CSP (functions/_middleware.ts) enforces Trusted Types;
// this policy is what a plain string must pass to reach a DOM sink:
//   script URLs: this origin's /_next/static/ chunks (Turbopack's loader) and Turnstile. Nothing else.
//   HTML: only text with no "<" in it. React writes <style> text (Radix, Next) through innerHTML;
//     text without a tag can't create an element. Markup is refused, so an injected
//     string can't become a <script> or an onerror handler.
//   script text (eval, new Function, script.text): no rule, so always refused.
// Plain ES5: it runs before anything is transpiled for it.
export const TRUSTED_TYPES_POLICY = `(function(){var t=window.trustedTypes;if(!t||!t.createPolicy)return;var T='https://challenges.cloudflare.com/turnstile/v0/api.js';function no(k){throw new TypeError('Trusted Types: '+k+' refused by the docs policy')}try{t.createPolicy('default',{createHTML:function(s){return s.indexOf('<')<0?s:no('markup')},createScriptURL:function(u){var a=new URL(u,location.href);return(a.origin===location.origin&&a.pathname.indexOf('/_next/static/')===0)||a.origin+a.pathname===T?u:no('script URL')}})}catch(e){}})()`;
