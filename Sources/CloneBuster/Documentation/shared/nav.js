/*
  Shared sidebar, search and code-copy helper for the CloneBuster documentation.

  - PAGES below is the manual's one list: the sidebar, the reading order the Back/Next pager
    follows, and the page list the search index is built from all come from it. Add, remove or
    reorder a page here and the rest follows, and Check-DocsLinks.ps1 holds the pagers to it.
    Every page stands at the same level. A `group:` starts a group, drawn as a heading above its
    pages. Every page is listed at all times: the headings order the sidebar, they never fold it
    away.
  - Search matches every word of the query, not the query as one phrase, so "scene object" finds a
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

  What a page is expected to carry, most of it checked by Check-DocsLinks.ps1:

  - Sentence case in every heading, imperative where it names a task ("Save asset references",
    not "Saving asset references"). Troubleshooting and Debugging name a field of work and stay
    as they are. This follows Unity's own documentation style guide.
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
    { file: "User Manual.html", title: "Home", sections: [
      ["setup", "Install it, then leave it"],
      ["copy", "When a copy appears"],
      ["reel", "Show how your work came to be"],
      ["contact", "Contact"]
    ] },
    { file: "pages/Installation.html", title: "Install CloneBuster", sections: [
      ["requirements", "Requirements"],
      ["install", "Install the package"],
      ["first-import", "What happens on import"],
      ["commit", "Commit the vault"],
      ["menus", "CloneBuster menus"],
      ["remove", "Remove CloneBuster"]
    ] },
    { file: "pages/How CloneBuster works.html", title: "How CloneBuster proves your work", sections: [
      ["record", "Every version, recorded as you save"],
      ["timestamps", "Two independent timestamps"],
      ["previews", "Previews taken at save time"],
      ["history", "Originals come from your own history"],
      ["purchased", "Purchased assets are never evidence"],
      ["limits", "What a timestamp proves"]
    ] },
    { group: "Prove your work", file: "pages/Export a proof.html", title: "Export a proof", sections: [
      ["pick", "Pick files and versions"],
      ["copy", "Add the copy"],
      ["code", "Show lines of code"],
      ["export", "Export"],
      ["contents", "What the export folder holds"],
      ["pending", "Export again once Bitcoin confirms"]
    ] },
    { file: "pages/Export a process reel.html", title: "Export a process reel", sections: [
      ["pick", "Pick a file and its versions"],
      ["options", "Set the reel's options"],
      ["frames", "What the reel shows"],
      ["share", "Share the reel"]
    ] },
    { file: "pages/File a takedown.html", title: "File a takedown notice", sections: [
      ["before", "Before you send a notice"],
      ["send", "Send the notice"],
      ["stores", "Where each store takes notices"]
    ] },
    { file: "pages/Verify a proof.html", title: "Verify a proof without CloneBuster", sections: [
      ["hash", "Hash the file"],
      ["manifest", "Find the hash in its manifest"],
      ["rfc3161", "Check the RFC 3161 timestamp"],
      ["ots", "Check the OpenTimestamps proof"],
      ["preview", "Check a preview"]
    ] },
    { group: "More", file: "pages/Change the settings.html", title: "Change the settings", sections: [
      ["recorded", "What the vault records"],
      ["source-folders", "Record folders outside Assets"],
      ["third-party", "Mark a third-party folder"],
      ["owner", "Set the owner"],
      ["formats", "Turn off previews for a format"],
      ["servers", "Change the timestamp servers"],
      ["pause", "Turn CloneBuster off"]
    ] },
    { file: "pages/Supported formats.html", title: "Supported formats", sections: [
      ["reel", "Formats the reel reads"],
      ["models", "Model previews"],
      ["pdf", "What Proof.pdf shows"],
      ["unread", "What CloneBuster doesn't read"]
    ] },
    { file: "pages/Troubleshooting.html", title: "Troubleshooting", sections: [
      ["banners", "Exporter banners"],
      ["console", "Console messages"],
      ["exports", "Export results"],
      ["warnings", "Fix a file saved without its image"]
    ] }
  ];

  function esc(text)
  {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var path = decodeURIComponent(location.pathname).replace(/\\/g, "/");
  var current = path.split("/").pop();
  var inPages = /\/pages\/[^\/]*$/.test(path);
  var prefix = (inPages) ? "../" : "";

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
  // The bar above the sidebar: the brand and the manual's home. It is the first child of #layout and
  // spans both of its columns.
  document.write('<div class="doc-top"><span class="doc-brand">CloneBuster</span><div class="doc-top-links">'
               + '<a href="' + hrefOf("User Manual.html") + '" class="active" aria-current="true">User Manual</a></div></div>');

  // The sidebar, generated from PAGES.
  {
    var html = '<nav>';
    html += '<div id="sv-links">';
    var drawnGroup = -1;
    for (var i = 0; i < PAGES.length; i++)
    {
      var page = PAGES[i];
      if (groupOf[i] !== drawnGroup)
      {
        if (drawnGroup >= 0)
          html += '</div>';
        drawnGroup = groupOf[i];
        html += '<div class="nav-group">' + esc(groupNames[drawnGroup]) + '</div>';
        html += '<div class="nav-group-body" id="sv-group-' + drawnGroup + '">';
      }
      var isActive = (page.file.split("/").pop() === current);
      var classes = (isActive) ? 'active' : '';
      html += '<a href="' + hrefOf(page.file) + '"' + ((classes === '') ? '' : ' class="' + classes + '"')
            + ((isActive) ? ' aria-current="page"' : '') + '>' + esc(page.title) + '</a>';
      if (isActive && page.sections)
        for (var s = 0; s < page.sections.length; s++)
          html += '<a href="#' + page.sections[s][0] + '" class="indent">' + esc(page.sections[s][1]) + '</a>';
    }
    if (drawnGroup >= 0)
      html += '</div>';
    html += '</div></nav>';
    document.write(html);
  }

  document.write('<script src="' + prefix + 'shared/search-index.js"><\/script>');

  function ready(fn)
  {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Clicking the page you are already on folds its section links away: the run of indented links
  // between it and the next page link.
  ready(function () {
    var nav = document.querySelector("nav");
    if (nav === null) return;

    var here = nav.querySelector('[aria-current="page"]');
    if (here === null) return;

    var folds = [];
    for (var node = here.nextElementSibling; node !== null; node = node.nextElementSibling)
    {
      if (node.classList.contains("indent") === false)
        break;
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
    search.innerHTML = '<input id="sv-search" type="search" placeholder="Search the docs..." autocomplete="off"'
                     + ' aria-label="Search the documentation" />';
    var results = document.createElement("div");
    results.id = "sv-results";
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

      // Every word has to land somewhere, so "save location" finds the section about where a save goes
      // even though neither the heading nor the first line carries that pair of words together. The
      // words dropped here are the ones the body index does not carry either, so "why is my save
      // empty" is searched as "my save empty" rather than failing on "why" and "is".
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

      var index = window.CLONEBUSTER_SEARCH_INDEX || [];

      // A word in half the manual says less about what you want than a word in one section, so a term
      // counts for how rare it is. One carried by more than about half the entries scores but does
      // not gate either: "save" must not decide which sections a whole question may reach.
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

      var hits = [];
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
          hits.push({ e: e, score: score, order: i });
      }

      // Nothing carries every word: answer with the entries carrying the most of them. A reader who
      // types a whole question gets the closest sections instead of an empty box.
      var approximate = false;
      if (hits.length === 0)
      {
        var best = 0;
        for (var b = 0; b < rated.length; b++)
          if (rated[b].matched > best) best = rated[b].matched;
        if (best > 0)
        {
          approximate = true;
          for (var c = 0; c < index.length; c++)
            if (rated[c].matched === best)
              hits.push({ e: index[c], score: rated[c].score, order: c });
        }
      }
      function byRank(a, b) { return (b.score - a.score) || (a.order - b.order); }
      hits.sort(byRank);

      var html = (approximate) ? '<div class="sr-none">No section carries every word. Closest:</div>' : "";
      for (var r = 0; (r < hits.length) && (r < 20); r++)
      {
        var entry = hits[r].e;
        var href = prefix + encodeURI(entry.p) + ((entry.a) ? "#" + entry.a : "");
        html += '<a class="sr" href="' + href + '"><span class="sr-page">' + esc(entry.g) + '</span><span class="sr-head">' + esc(entry.h) + '</span></a>';
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
    // Pages put the id on the <section> wrapper and leave the <h2> bare, so the heading to hang the
    // link on is the wrapper's own h2. Without
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
      var input = document.getElementById("sv-search");
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
})();
