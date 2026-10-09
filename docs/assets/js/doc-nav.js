/*
  Phone menu for the standalone doc pages.

  At phone width the sidebar has no room beside the content. This puts a menu button at the right of
  the top bar and turns the sidebar into a drawer that slides over the page, so the contents are one
  tap away from anywhere. Pages without the Persistent Asset book bar get a bar of their own, naming
  the package. The CSS lives with the rest of the doc layout in doc-styles.css (.nav-menu-btn,
  .nav-drawer, .nav-backdrop, .doc-top-phone); above 760px all of it is hidden and the sidebar shows
  in full, so this changes nothing on a desktop.

  Web-only, like theme.js: the source docs shipped inside the Unity packages never load it and keep
  the sidebar as a list above the content.
*/
(function () {
  var PHONE = '(max-width: 760px)';

  var ICONS = '<svg class="icon-open" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
    '<svg class="icon-close" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M6 6l12 12M18 6L6 18"/></svg>';

  function init() {
    var layout = document.getElementById('layout');
    var nav = document.querySelector('#layout > nav');
    if (layout === null || nav === null || document.querySelector('.nav-menu-btn')) return;
    var root = document.documentElement;

    // The Persistent Asset pages have their book bar already; the other packages get one that names
    // the package and only shows on a phone.
    var bar = layout.querySelector('.doc-top');
    if (bar === null) {
      bar = document.createElement('div');
      bar.className = 'doc-top doc-top-phone';
      var brand = document.createElement('span');
      brand.className = 'doc-brand';
      var title = nav.querySelector('.nav-title');
      brand.textContent = (title) ? title.textContent.trim() : document.title;
      bar.appendChild(brand);
      layout.insertBefore(bar, layout.firstChild);
    }

    if (!nav.id) nav.id = 'doc-sidebar';
    nav.classList.add('nav-drawer');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-menu-btn';
    btn.setAttribute('aria-controls', nav.id);
    btn.innerHTML = ICONS;
    bar.appendChild(btn);

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    layout.appendChild(backdrop);

    function isOpen() { return nav.classList.contains('nav-open'); }

    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      backdrop.classList.toggle('nav-open', open);
      root.classList.toggle('nav-locked', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close contents' : 'Open contents');
      if (open) {
        // Open on the page you are reading rather than at the top of a thirty-link list.
        var here = nav.querySelector('a[aria-current="page"], a.active');
        nav.scrollTop = 0;
        if (here && here.offsetTop > nav.clientHeight / 2)
          nav.scrollTop = here.offsetTop - nav.clientHeight / 3;
      }
    }
    setOpen(false);

    btn.addEventListener('click', function () { setOpen(!isOpen()); });
    backdrop.addEventListener('click', function () { setOpen(false); });

    var mq = (window.matchMedia) ? window.matchMedia(PHONE) : null;

    // Any link closes the drawer: one that stays on this page shows where it went, one that leaves
    // loads the next page with the drawer shut. The exception is the current API area, which nav.js
    // turns into a toggle for the type list under it; that list is in the drawer, so it stays open.
    nav.addEventListener('click', function (ev) {
      var link = (ev.target.closest) ? ev.target.closest('a') : null;
      if (link === null || !link.getAttribute('href')) return;
      var foldsHere = ev.defaultPrevented && link.hasAttribute('aria-expanded')
                   && link.nextElementSibling !== null
                   && link.nextElementSibling.classList.contains('indent') === false;
      if (!foldsHere) setOpen(false);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && isOpen()) {
        setOpen(false);
        btn.focus();
        return;
      }
      // nav.js answers "/" and Ctrl+K by focusing its search box, which a closed drawer hides. It has
      // already handled the key by now, so open the drawer and hand the focus over.
      var search = document.getElementById('pa-search');
      var wantsSearch = (ev.key === '/') || ((ev.key === 'k' || ev.key === 'K') && (ev.ctrlKey || ev.metaKey));
      if (wantsSearch && ev.defaultPrevented && search && mq && mq.matches && !isOpen()) {
        setOpen(true);
        search.focus();
        search.select();
      }
    });

    // Rotating a tablet or widening a window past the phone layout shows the sidebar in full, so an
    // open drawer must not leave the page locked behind it.
    if (mq) {
      var onChange = function () { if (!mq.matches && isOpen()) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  // The package name at the top left (sidebar title, book bar or phone bar) links to the package's
  // product page, the first folder of the path. The link keeps the title's look; see .title-link.
  function linkTitles() {
    var pkg = location.pathname.split('/')[1];
    if (!pkg) return;
    var titles = document.querySelectorAll('#layout > nav .nav-title, .doc-top .doc-brand');
    for (var i = 0; i < titles.length; i++) {
      var el = titles[i];
      if (el.querySelector('a')) continue;
      var a = document.createElement('a');
      a.className = 'title-link';
      a.href = '/' + pkg + '/';
      while (el.firstChild) a.appendChild(el.firstChild);
      el.appendChild(a);
    }
  }

  function start() { init(); linkTitles(); }

  if (document.readyState === 'complete') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
