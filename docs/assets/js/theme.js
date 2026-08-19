/*
  Dark-mode toggle, shared by the Jekyll pages and the standalone doc pages.

  The theme itself is pure CSS: every colour is a custom property, and the dark
  values are defined twice, under `prefers-color-scheme: dark` (the default, so a
  first-time visitor gets whatever their OS asks for) and under
  `[data-theme="dark"]` (so an explicit choice wins in either direction).

  This file only has to do two things: remember an explicit choice, and draw the
  button. Applying a stored choice happens in a tiny inline snippet in <head>, so
  it lands before first paint and there is no flash of the wrong theme.

  The button is built here, styles included, rather than in the stylesheets: the
  doc pages and the Jekyll pages load different CSS, and duplicating the rules in
  both would guarantee they drift apart.
*/
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }
  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  // With no explicit choice the OS decides, which is exactly what the CSS does.
  function isDark() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return systemPrefersDark();
  }

  var CSS = [
    '.theme-toggle{',
    '  position:fixed;right:1.25rem;bottom:1.25rem;z-index:1000;',
    '  width:2.75rem;height:2.75rem;padding:0;',
    '  display:flex;align-items:center;justify-content:center;',
    '  border:1px solid var(--tt-border,#d4d4d4);border-radius:50%;',
    '  background:var(--tt-bg,#fff);color:var(--tt-fg,#333);',
    '  cursor:pointer;-webkit-appearance:none;appearance:none;',
    '  box-shadow:0 2px 10px var(--tt-shadow,rgba(0,0,0,.16));',
    '  transition:background .15s ease,border-color .15s ease,transform .15s ease;',
    '}',
    '.theme-toggle:hover{background:var(--tt-bg-hover,#f4f4f4);transform:translateY(-1px)}',
    '.theme-toggle:focus-visible{outline:2px solid var(--tt-focus,#2a7ae2);outline-offset:2px}',
    '.theme-toggle svg{width:1.15rem;height:1.15rem;display:block;fill:none;',
    '  stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    // Exactly one icon is ever shown: the one for the theme you would switch TO.
    '.theme-toggle .tt-moon{display:none}',
    '.theme-toggle[data-is-dark="true"] .tt-moon{display:block}',
    '.theme-toggle[data-is-dark="true"] .tt-sun{display:none}',
    '@media print{.theme-toggle{display:none}}',
    '@media (prefers-reduced-motion:reduce){.theme-toggle{transition:none}',
    '  .theme-toggle:hover{transform:none}}'
  ].join('\n');

  var SUN = '<svg class="tt-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4' +
    'M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg class="tt-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function build() {
    if (document.querySelector('.theme-toggle')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.innerHTML = SUN + MOON;
    document.body.appendChild(btn);

    function sync() {
      var dark = isDark();
      btn.setAttribute('data-is-dark', dark ? 'true' : 'false');
      // The label describes the result of pressing, not the current state.
      var label = dark ? 'Switch to light theme' : 'Switch to dark theme';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }

    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      remember(next);
      sync();
    });

    // Follow the OS only while the visitor has not made a choice of their own.
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!stored()) sync(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
