/*
  Shared sidebar, search and code-copy helper for the Concordance documentation.

  - PAGES below is the manual's one list: the sidebar, the reading order the Back/Next pager
    follows, and the page list the search index is built from all come from it. Add, remove or
    reorder a page here and the rest follows, and Check-DocsLinks.ps1 holds the pagers to it.
    `hideSections: true` keeps a page's section links out of the sidebar while its sections still
    feed the search index and the link checks: Home, whose sections only repeat the sidebar's groups.
    Every page stands at the same level. A `group:` starts a group, drawn as a heading above its
    pages. Every page is listed at all times: the headings order the sidebar, they never fold it
    away. `landing: true` marks the page that opens a group: its group heading links to it and it
    gets no link of its own, the way a section of Unity's package documentation opens on its own page.
  - API pages keep their own static sidebar (their type lists live in the page); including this
    script only adds the search box and the code-copy buttons to them.
  - The Quick Usage Guide is a book of its own, reached from Tools > Concordance and from the
    manual's home page, deliberately not from any sidebar. It draws no sidebar at all, carries its own
    header instead, and loads no search index, since one page has nothing to search.
    Build-SearchIndex.ps1 names it directly so the manual's own search still reaches it.
  - Search matches every word of the query, not the query as one phrase, so "base value" finds a
    section that carries both words apart. A word is worth 3 in a heading, 2 in the section's first
    paragraph and 1 anywhere else in it; a multi-word query whose whole phrase is in the heading gets
    3 more. Common words are dropped from the query first, the same ones Build-SearchIndex.ps1 drops
    from the body index, so a question typed in full is searched on the words that carry it. When no
    entry matches every remaining word, the ones matching the most are shown and labelled, rather
    than answering a real question with "No match".
  - The search data lives in shared/search-index.js. It is generated, never edited by hand: rerun
    _DocsTools/Build-SearchIndex.ps1, then _DocsTools/Check-DocsLinks.ps1, after editing pages.
  - The sidebar is written with document.write so everything works when the manual is opened
    straight from disk (file://), where fetch() is blocked.
  - Screenshots live in img/ without a file extension, so Unity never imports them as textures. One
    not captured yet shows as a labelled placeholder carrying its alt text, and Check-DocsLinks.ps1
    lists it as pending.

  What a page is expected to carry, most of it checked by Check-DocsLinks.ps1:

  - Sentence case in every heading, imperative where it names a task ("Set the modifier order",
    not "Setting the modifier order"). Troubleshooting names a field of work and stays as it is.
    This follows Unity's own documentation style guide.
  - One h1, no skipped heading levels, every image with alt text, and link text that says where
    it goes.
  - A <meta name="description"> holding the page's own .sub line, and the skip link that lets a
    keyboard reach the content past the sidebar.
  - A .guide-index listing every section, in page order, on any page with six sections or more
    and on any page long enough to scroll for a while. The sidebar hides its section links on a
    narrow screen, so that list is the only way around on a phone.
  - A section id here matches a <section id> on the page, in the same order.
*/
(function () {
  // The same words Build-SearchIndex.ps1 leaves out of each entry's body text. Searching for one
  // would only ever match a heading or a first line, so a query is stripped of them first.
  var SEARCH_STOP = ("the and for that this with from they them then than into onto over when what which "
    + "while were was are its it is of to in on at as by or an a be been has have had not no you your "
    + "yours one two all any each can cannot will would may might must should same other also only but so "
    + "if there here their his her our out off up down per via yet more most less own way ways does do "
    + "done how why who whom whose because rather still just").split(" ");

  var PAGES = [
    { file: "index.html", title: "Home", hideSections: true, sections: [
      ["sections", "User Manual sections"],
      ["contact", "Contact"]
    ] },
    { group: "Get started", file: "pages/Get started.html", title: "Get started", landing: true, sections: [
      ["topics", "Topics"]
    ] },
    { file: "pages/Installation.html", title: "Install Concordance", sections: [
      ["requirements", "Requirements"],
      ["install", "Install the package"],
      ["asmdef", "Reference Concordance from an assembly definition"],
      ["demo", "Try the demo"]
    ] },
    { file: "pages/Introduction to Concordance.html", title: "Introduction to Concordance", sections: [
      ["problem", "Values with several writers"],
      ["track", "Tracking"],
      ["modifiers", "Modifiers"],
      ["order", "Modifier order"],
      ["observe", "Change events on any member"],
      ["metaprogramming", "Metaprogramming"]
    ] },
    { file: "pages/Tutorial.html", title: "Tutorial: Coordinate a player's speed", sections: [
      ["overview", "Example overview"],
      ["prerequisites", "Prerequisites"],
      ["player", "Create the player"],
      ["conflict", "Find the conflict"],
      ["modifiers", "Fix the boost with a modifier"],
      ["order", "Order the stun after the boosts"],
      ["observe", "Observe the speed"],
      ["inspect", "Read the speed in the Concordance window"]
    ] },
    { group: "Modify members", file: "pages/Modify members.html", title: "Modify members", landing: true, sections: [
      ["topics", "Topics"]
    ] },
    { file: "pages/Write modifier lines.html", title: "Write modifiers", sections: [
      ["cast", "Write a modifier"],
      ["members", "Members that take modifiers"],
      ["previous", "The value before the modifier"],
      ["inputs", "Follow a changing value"],
      ["lifetime", "When a modifier ends"]
    ] },
    { file: "pages/Regular syntax.html", title: "Use the regular syntax", sections: [
      ["calls", "Call Modify"],
      ["values", "Compute the value"],
      ["keys", "Hold several modifiers from one owner"],
      ["localorder", "Order the modifiers of one script"]
    ] },
    { file: "pages/Order modifiers.html", title: "Order modifiers", sections: [
      ["how", "How modifiers are ordered"],
      ["phase", "Set a phase in code"],
      ["window", "Set the order in the Concordance window"],
      ["flags", "Resolve order flags"]
    ] },
    { file: "pages/Base values.html", title: "Base values", sections: [
      ["plain", "Plain writes"],
      ["read", "Read the base value"]
    ] },
    { file: "pages/Modifier functions.html", title: "Modifier functions", sections: [
      ["field", "Add a function field"],
      ["tune", "Tune a function in Play mode"],
      ["builtins", "Built-in functions"],
      ["custom", "Create a custom function"]
    ] },
    { group: "Observe and track", file: "pages/Observe and track.html", title: "Observe and track", landing: true, sections: [
      ["topics", "Topics"]
    ] },
    { file: "pages/Observe changes.html", title: "Observe changes", sections: [
      ["observe", "Observe a member"],
      ["previous", "Receive the previous value"],
      ["stop", "Stop observing"],
      ["owner", "End an observer with another object"]
    ] },
    { file: "pages/Inspect members.html", title: "Inspect members", sections: [
      ["open", "Open a member"],
      ["watch", "Watch a member"],
      ["conflicts", "Fix conflicting writes"],
      ["inspector", "View modified members in the Inspector window"]
    ] },
    { group: "Advanced topics", file: "pages/Advanced topics.html", title: "Advanced topics", landing: true, sections: [
      ["topics", "Topics"]
    ] },
    { file: "pages/Control by object.html", title: "Control modifiers by object", sections: [
      ["scopes", "Act on an owner or a target"],
      ["pooling", "Release pooled objects"],
      ["clone", "Copy an object without its modifiers"]
    ] },
    { file: "pages/Untracked writes.html", title: "Untracked writes", sections: [
      ["what", "How untracked writes apply"],
      ["find", "Find untracked writes"],
      ["assemblies", "Track an assembly"],
      ["recombine", "Recombine a member"]
    ] },
    { file: "pages/Special cases.html", title: "Special cases", sections: [
      ["animation", "Animated members"],
      ["unmodifiable", "Members the engine updates"],
      ["declare", "Declare your own special cases"],
      ["pairs", "Declare your own getter and setter pair"],
      ["find", "Find a member's special case"]
    ] },
    { file: "pages/How Concordance works.html", title: "How Concordance works", sections: [
      ["compile", "At compile time"],
      ["runtime", "At runtime"],
      ["builds", "In the Editor and in builds"],
      ["threading", "Threads, domain reload and tests"]
    ] },
    { group: "Reference", file: "pages/Reference.html", title: "Reference", landing: true, sections: [
      ["topics", "Topics"]
    ] },
    { file: "pages/Concordance window reference.html", title: "Concordance window reference", sections: [
      ["list", "Member list"],
      ["member", "Member details"],
      ["inspector", "Inspector section"]
    ] },
    { file: "pages/Code analysis reference.html", title: "Code analysis reference", sections: [
      ["reading", "Diagnostic codes"],
      ["errors", "Errors"],
      ["warnings", "Warnings"],
      ["info", "Hints"]
    ] },
    { file: "pages/Glossary.html", title: "Glossary", sections: [
      ["terms", "Terms"]
    ] },
    { file: "pages/Troubleshooting.html", title: "Troubleshooting", sections: [
      ["digging", "Find out what changed a value"],
      ["console", "Messages in the Console window"],
      ["exceptions", "Exceptions"],
      ["values", "Unexpected values"],
      ["support", "Support"]
    ] },
  ];
  function esc(text)
  {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var path = decodeURIComponent(location.pathname).replace(/\\/g, "/");
  var current = path.split("/").pop() || "index.html";
  var inPages = /\/pages\/[^\/]*$/.test(path);
  var prefix = (inPages) ? "../" : "";
  var isApiPage = (path.indexOf("/public-api/") >= 0);
  var isStandalone = (path.indexOf("/quick-usage-guide/") >= 0);

  function hrefOf(file) { return prefix + encodeURI(file); }

  // Which group each entry belongs to. Every group is drawn open: the headings order the list, they
  // do not hide it.
  var groupOf = [];
  var groupNames = [];
  var groupIndex = -1;
  for (var n = 0; n < PAGES.length; n++)
  {
    if (PAGES[n].group)
    {
      groupNames.push(PAGES[n].group);
      groupIndex++;
    }
    groupOf[n] = groupIndex;
  }
  // The one bar the three books share, written on every page so the cross-links live in one place
  // rather than in each book's own sidebar. On a page with a sidebar it is the first child of
  // #layout and spans both of its columns; the guide has no #layout and it lands at the top of body.
  var BOOKS = [
    ["/concordance/quick-usage-guide/", "Quick Usage Guide"],
    ["/concordance/user-manual/", "User Manual"],
    ["/concordance/public-api/", "Public API"]
  ];

  var bar = '<div class="doc-top"><span class="doc-brand">Concordance</span><div class="doc-top-links">';
  for (var k = 0; k < BOOKS.length; k++)
  {
    // Every page but the other two books belongs to the manual, and every API page to the reference.
    var isBook = ((k === 0) && isStandalone)
              || ((k === 1) && (isStandalone === false) && (isApiPage === false))
              || ((k === 2) && isApiPage);
    bar += '<a href="' + BOOKS[k][0] + '"' + ((isBook) ? ' class="active" aria-current="true"' : '')
         + '>' + esc(BOOKS[k][1]) + '</a>';
  }
  bar += '</div></div>';
  document.write(bar);

  // Manual pages get the generated sidebar; API pages keep their own static one, and the standalone
  // guide gets none.
  if ((isApiPage === false) && (isStandalone === false))
  {
    var html = '<nav>';
    html += '<div id="cd-links">';
    var drawnGroup = -1;
    for (var i = 0; i < PAGES.length; i++)
    {
      var page = PAGES[i];
      if (groupOf[i] !== drawnGroup)
      {
        if (drawnGroup >= 0)
          html += '</div>';
        drawnGroup = groupOf[i];
        var landingActive = (page.landing === true) && (page.file.split("/").pop() === current);
        if (page.landing === true)
          html += '<a class="nav-group' + ((landingActive) ? ' active" aria-current="page' : '') + '" href="'
                + hrefOf(page.file) + '">' + esc(groupNames[drawnGroup]) + '</a>';
        else
          html += '<div class="nav-group">' + esc(groupNames[drawnGroup]) + '</div>';
        html += '<div class="nav-group-body" id="cd-group-' + drawnGroup + '">';
        if (page.landing === true)
          continue;
      }
      var isActive = (page.file.split("/").pop() === current);
      var classes = (isActive) ? 'active' : '';
      html += '<a href="' + hrefOf(page.file) + '"' + ((classes === '') ? '' : ' class="' + classes + '"')
            + ((isActive) ? ' aria-current="page"' : '') + '>' + esc(page.title) + '</a>';
      if (isActive && page.sections && page.hideSections !== true)
        for (var s = 0; s < page.sections.length; s++)
          html += '<a href="#' + page.sections[s][0] + '" class="indent">' + esc(page.sections[s][1]) + '</a>';
    }
    if (drawnGroup >= 0)
      html += '</div>';
    html += '</div></nav>';
    document.write(html);
  }

  // No sidebar means no search box, so the index would be a few hundred KB read for nothing.
  if (isStandalone === false)
    document.write('<script src="' + prefix + 'shared/search-index.js"><\/script>');

  function ready(fn)
  {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Clicking the page you are already on folds its own links away, in both books: the manual's section
  // links and an API area's type list sit right under that link, so the fold is the run of siblings
  // between it and whatever ends it (the next page, or the next API area).
  ready(function () {
    var nav = document.querySelector("nav");
    if (nav === null) return;

    var here = nav.querySelector('[aria-current="page"]');
    if (here === null) return;

    // An API area owns everything up to the next area; a manual page owns the indented section links
    // that follow it, and the next page link ends them.
    var inApiSidebar = here.classList.contains("nav-band");
    var folds = [];
    for (var node = here.nextElementSibling; node !== null; node = node.nextElementSibling)
    {
      if (inApiSidebar)
      {
        if (node.classList.contains("nav-band"))
          break;
      }
      else if (node.classList.contains("indent") === false)
      {
        break;
      }
      folds.push(node);
    }
    if (folds.length === 0) return;

    here.setAttribute("aria-expanded", "true");
    here.addEventListener("click", function (ev) {
      ev.preventDefault();
      var opening = (here.getAttribute("aria-expanded") === "false");
      here.setAttribute("aria-expanded", (opening) ? "true" : "false");
      for (var i = 0; i < folds.length; i++)
        folds[i].hidden = (opening === false);
    });
  });

  // Search: a box injected under the sidebar title; results replace the sidebar links while typing.
  ready(function () {
    var nav = document.querySelector("nav");
    if (nav === null) return;

    var search = document.createElement("div");
    search.className = "nav-search";
    search.innerHTML = '<input id="cd-search" type="search" placeholder="Search the docs..." autocomplete="off"'
                     + ' aria-label="Search the documentation" />';
    var results = document.createElement("div");
    results.id = "cd-results";
    results.style.display = "none";
    nav.insertBefore(search, nav.firstChild);
    nav.insertBefore(results, search.nextSibling);

    // Everything else in the sidebar gets hidden while search results are shown.
    var hidden = [];
    for (var c = 0; c < nav.children.length; c++)
    {
      var child = nav.children[c];
      if ((child !== search) && (child !== results))
        hidden.push(child);
    }

    var input = search.querySelector("input");

    function clear()
    {
      results.style.display = "none";
      results.innerHTML = "";
      for (var h = 0; h < hidden.length; h++)
        hidden[h].style.display = "";
    }

    function run()
    {
      var q = input.value.trim().toLowerCase().replace(/\s+/g, " ");
      if (q.length < 2) { clear(); return; }

      // Every word has to land somewhere, so "base value" finds the section about reading it
      // even when neither the heading nor the first line carries that pair of words together. The
      // words dropped here are the ones the body index does not carry either, so "why is my value
      // wrong" is searched as "my value wrong" rather than failing on "why" and "is".
      var terms = [];
      var asked = q.split(/\s+/);
      for (var s = 0; s < asked.length; s++)
        if ((SEARCH_STOP.indexOf(asked[s]) < 0) && (asked[s].length > 1)) terms.push(asked[s]);
      if (terms.length === 0) terms = asked;

      // Matched at the start of a word, so "slot" still finds "slots" but "id" no longer finds
      // "avoid". A bare substring test made a one-letter word match almost every entry.
      var probes = [];
      for (var pr = 0; pr < terms.length; pr++)
        probes.push(new RegExp("(^|[^a-z0-9])" + terms[pr].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

      function carries(text, at) { return probes[at].test(text); }

      var index = window.CONCORDANCE_SEARCH_INDEX || [];

      // A word in half the manual says less about what you want than a word in one section, so a term
      // counts for how rare it is. One carried by more than about half the entries scores but does
      // not gate either: "modifier" must not decide which sections a whole question may reach.
      var NEEDED = Math.log(2);
      var weight = [];
      for (var w = 0; w < terms.length; w++)
      {
        var carrying = 0;
        for (var d = 0; d < index.length; d++)
        {
          var ed = index[d];
          if (carries(ed.h.toLowerCase(), w)
              || carries((ed.x || "").toLowerCase(), w)
              || carries((ed.k || "").toLowerCase(), w))
            carrying++;
        }
        weight.push((carrying === 0) ? 1 : Math.max(0.15, Math.log(index.length / carrying)));
      }

      var manualHits = [];
      var apiHits = [];
      var rated = [];
      for (var i = 0; i < index.length; i++)
      {
        var e = index[i];
        var heading = e.h.toLowerCase();
        var snippet = (e.x || "").toLowerCase();
        var body = (e.k || "").toLowerCase();
        var score = 0;
        var matched = 0;
        for (var t = 0; t < terms.length; t++)
        {
          if (carries(heading, t)) { score += 3 * weight[t]; matched++; }
          else if (carries(snippet, t)) { score += 2 * weight[t]; matched++; }
          else if (carries(body, t)) { score += 1 * weight[t]; matched++; }
          else if (weight[t] < NEEDED) matched++;   // too common to exclude anything
        }
        // The whole query as one phrase beats the same words found apart.
        if ((matched === terms.length) && (terms.length > 1) && (heading.indexOf(q) >= 0)) score += 3;
        rated.push({ score: score, matched: matched });
        if (matched === terms.length)
          ((e.api) ? apiHits : manualHits).push({ e: e, score: score, order: i });
      }

      // Nothing carries every word: answer with the entries carrying the most of them. A reader who
      // types a whole question gets the closest sections instead of an empty box.
      var approximate = false;
      if ((manualHits.length === 0) && (apiHits.length === 0))
      {
        var best = 0;
        for (var b = 0; b < rated.length; b++)
          if (rated[b].matched > best) best = rated[b].matched;
        if (best > 0)
        {
          approximate = true;
          for (var c = 0; c < index.length; c++)
            if (rated[c].matched === best)
              ((index[c].api) ? apiHits : manualHits).push({ e: index[c], score: rated[c].score, order: c });
        }
      }
      function byRank(a, b) { return (b.score - a.score) || (a.order - b.order); }
      manualHits.sort(byRank);
      apiHits.sort(byRank);

      // The side you are searching from comes first; the other fills the remaining slots.
      var groups = (isApiPage)
        ? [{ label: "Public API", hits: apiHits }, { label: "User Manual", hits: manualHits }]
        : [{ label: "User Manual", hits: manualHits }, { label: "Public API", hits: apiHits }];
      var primaryMax = 12, totalMax = 20;
      var primaryCount = (groups[0].hits.length < primaryMax) ? groups[0].hits.length : primaryMax;
      var secondaryCount = totalMax - primaryCount;
      if (groups[1].hits.length < secondaryCount) secondaryCount = groups[1].hits.length;
      var counts = [primaryCount, secondaryCount];

      var html = (approximate) ? '<div class="sr-none">No section carries every word. Closest:</div>' : "";
      for (var g = 0; g < groups.length; g++)
      {
        if (counts[g] === 0)
          continue;
        html += '<div class="sr-group">' + groups[g].label + '</div>';
        for (var r = 0; r < counts[g]; r++)
        {
          var entry = groups[g].hits[r].e;
          var href = prefix + encodeURI(entry.p) + ((entry.a) ? "#" + entry.a : "");
          html += '<a class="sr" href="' + href + '"><span class="sr-page">' + esc(entry.g) + '</span><span class="sr-head">' + esc(entry.h) + '</span></a>';
        }
      }
      if (html === "")
        html = '<div class="sr-none">' + ((index.length === 0) ? "Search index missing (rerun Build-SearchIndex.ps1)." : "No match.") + '</div>';

      results.innerHTML = html;
      results.style.display = "";
      for (var h = 0; h < hidden.length; h++)
        hidden[h].style.display = "none";
    }

    input.addEventListener("input", run);
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { input.value = ""; clear(); }
      if (ev.key === "Enter")
      {
        var first = results.querySelector("a.sr");
        if (first) location.href = first.getAttribute("href");
      }
    });
  });

  // Copy buttons on code blocks.
  ready(function () {
    var pres = document.querySelectorAll("main pre");
    for (var i = 0; i < pres.length; i++)
      (function (pre) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.textContent = "Copy";
        btn.setAttribute("aria-label", "Copy this code block");
        btn.addEventListener("click", function () {
          var code = pre.querySelector("code");
          var text = (code) ? code.textContent : pre.textContent;
          copyText(text, function (ok) {
            btn.textContent = (ok) ? "Copied!" : "Press Ctrl+C";
            setTimeout(function () { btn.textContent = "Copy"; }, 1500);
          });
        });
        pre.appendChild(btn);
      })(pres[i]);
  });

  // Copies text without the async Clipboard API, which file:// pages refuse. Same order as the code
  // blocks use: the synchronous path while the click is still on the stack, then the API as a fallback.
  function copyText(text, onDone)
  {
    var copied = false;
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { copied = document.execCommand("copy"); } catch (e) { copied = false; }
    document.body.removeChild(area);
    if (copied) { onDone(true); return; }
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(text).then(function () { onDone(true); }, function () { onDone(false); });
    else
      onDone(false);
  }

  // A link on every heading that has an id, so a section can be pointed at. Clicking it sets the
  // hash (which is what a reader sees) and puts the whole address on the clipboard.
  ready(function () {
    var headings = [];
    var direct = document.querySelectorAll("main h2[id], main h3[id]");
    for (var d = 0; d < direct.length; d++)
      headings.push([direct[d], direct[d].id]);
    // Manual pages put the id on the <section> wrapper and leave the <h2> bare, and the API pages do
    // the same with .type-section, so the heading to hang the link on is the wrapper's own h2. Without
    // this the links land only on h3 sub-headings, which is not what the sidebar and the deep links
    // point at. Sections are never nested here, so the first h2 inside one is always its own.
    var wrappers = document.querySelectorAll("main section[id], main .type-section[id]");
    for (var t = 0; t < wrappers.length; t++)
    {
      var h = wrappers[t].querySelector("h2");
      if (h && !h.id) headings.push([h, wrappers[t].id]);
    }
    for (var i = 0; i < headings.length; i++)
      (function (heading, id) {
        var link = document.createElement("a");
        link.className = "heading-link";
        link.href = "#" + id;
        link.textContent = "#";
        link.setAttribute("aria-label", "Link to this section");
        link.title = "Copy a link to this section";
        link.addEventListener("click", function (ev) {
          ev.preventDefault();
          // replaceState throws on an opaque origin, which is what file:// gives, so the plain
          // hash assignment is the fallback rather than an older-browser path.
          var moved = false;
          if (history && history.replaceState)
          {
            try { history.replaceState(null, "", "#" + id); moved = true; } catch (e) { moved = false; }
          }
          if (moved === false)
            location.hash = id;
          copyText(location.href, function (ok) {
            link.classList.add((ok) ? "copied" : "copy-failed");
            setTimeout(function () { link.classList.remove("copied"); link.classList.remove("copy-failed"); }, 1200);
          });
        });
        heading.appendChild(link);
      })(headings[i][0], headings[i][1]);
  });

  // Reaching the search box without the mouse: "/" or ctrl/cmd+K focuses it, Escape leaves it.
  ready(function () {
    document.addEventListener("keydown", function (ev) {
      var input = document.getElementById("cd-search");
      if (input === null) return;
      var target = ev.target || {};
      var typing = (target.tagName === "INPUT") || (target.tagName === "TEXTAREA") || target.isContentEditable;

      if (((ev.key === "/") && (typing === false)) ||
          ((ev.key === "k" || ev.key === "K") && (ev.ctrlKey || ev.metaKey)))
      {
        ev.preventDefault();
        input.focus();
        input.select();
        return;
      }
      if ((ev.key === "Escape") && (target === input))
        input.blur();
    });
  });

  // A screenshot not captured yet: its img-block shows a labelled placeholder with the alt text, so the
  // page still reads. Registered in the capture phase, since an image's error event does not bubble.
  document.addEventListener("error", function (ev) {
    var img = ev.target;
    if ((img.tagName !== "IMG") || (img.parentNode === null) || (img.parentNode.classList.contains("img-block") === false))
      return;

    var box = document.createElement("div");
    box.className = "img-placeholder";
    box.textContent = "Screenshot pending: " + (img.getAttribute("alt") || "");
    img.parentNode.replaceChild(box, img);
  }, true);
})();
