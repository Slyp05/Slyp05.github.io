/*
  Shared sidebar, search and code-copy helper for the Persistent Asset documentation.

  - PAGES below is the manual's one list: the sidebar, the reading order the Back/Next pager
    follows, and the page list the search index is built from all come from it. Add, remove or
    reorder a page here and the rest follows, and Check-DocsLinks.ps1 holds the pagers to it.
    Every page stands at the same level. A `group:` starts a group, drawn as a heading above its
    pages. Every page is listed at all times: the headings order the sidebar, they never fold it
    away.
  - API pages keep their own static sidebar (their type lists live in the page); including this
    script only adds the search box and the code-copy buttons to them.
  - The Quick Usage Guide is a book of its own, reached from Tools > Persistent Asset and from the
    manual's home page, deliberately not from any sidebar. It draws no sidebar at all, carries its own
    header instead, and loads no search index, since one page has nothing to search.
    Build-SearchIndex.ps1 names it directly so the manual's own search still reaches it.
  - Search matches every word of the query, not the query as one phrase, so "save location" finds a
    section that carries both words apart. A word is worth 3 in a heading, 2 in the section's first
    paragraph and 1 anywhere else in it; a multi-word query whose whole phrase is in the heading gets
    3 more. Common words are dropped from the query first, the same ones Build-SearchIndex.ps1 drops
    from the body index, so a question typed in full is searched on the words that carry it. When no
    entry matches every remaining word, the ones matching the most are shown and labelled, rather
    than answering a real question with "No match".
  - The search data lives in shared/search-index.js. It is generated, never edited by hand: rerun
    _DocsTools/Build-SearchIndex.ps1, then _DocsTools/Check-DocsLinks.ps1, after editing pages.
    _DocsTools/Check-DocsAgainstCode.ps1 is the other half, run after changing code the docs
    describe: it holds the menu paths, the members and the public types they name to the source.
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
    { group: "Start here", file: "User Manual.html", title: "Home", sections: [
      ["start", "Start here"],
      ["ways", "Ways to save"],
      ["saving", "Saving and loading"],
      ["storage", "Where it is stored"],
      ["help", "Help"],
      ["advanced", "Advanced"],
      ["contact", "Author and contact"]
    ] },
    { file: "pages/Installation.html", title: "Installation", sections: [
      ["requirements", "Requirements"],
      ["install", "Install the package"],
      ["demo", "Run the demo"],
      ["dependencies", "Optional modules"],
      ["folders", "Package contents"],
      ["settings", "Project settings"],
      ["tools", "Tools menu reference"]
    ] },
    { group: "Ways to save", file: "pages/Data class.html", title: "Data class", sections: [
      ["write", "Write the class"],
      ["asset", "Create the asset"],
      ["attribute", "Persist a class that already has a base class"]
    ] },
    { file: "pages/Prefs.html", title: "Prefs", sections: [
      ["api", "Set and get a value"],
      ["asset", "The Prefs asset"],
      ["choosing", "Choose between Prefs and a data class"]
    ] },
    { file: "pages/No-Code.html", title: "No-Code", sections: [
      ["variables", "Create a Persistent Variables asset"],
      ["components", "Variable components"],
      ["persistencecomponents", "Save and load from the Inspector"],
      ["savemenu", "Build a save menu"],
      ["input", "Persist input bindings and a locale"],
      ["developers", "Reference a variable from a script"],
      ["onthefly", "Store values under keys of your own"]
    ] },
    { file: "pages/Scene Objects.html", title: "Scene Objects", sections: [
      ["setup", "Save an object in your scene"],
      ["components", "Supported components"],
      ["spawned", "Spawned and destroyed objects"],
      ["refs", "Save a scene reference in a persistent asset"]
    ] },
    { file: "pages/What can be saved.html", title: "What can be saved", sections: [
      ["choosing", "Choose a serializer"],
      ["unity", "Unity JSON"],
      ["newtonsoft", "Newtonsoft JSON"],
      ["odin", "Odin"],
      ["memorypack", "MemoryPack"],
      ["size", "Size and speed"],
      ["switching", "Change the serializer later"],
      ["custom", "Create your own serializer"]
    ] },
    { group: "Saving and loading", file: "pages/How saving works.html", title: "How saving works", sections: [
      ["object", "The persistent asset"],
      ["scope", "Scope and global assets"],
      ["operations", "Load, save and clear"],
      ["ready", "When the data is ready"],
      ["editor", "Edit mode and Play mode"],
      ["global", "Act on every manager at once"],
      ["choosing", "Choose a persistence manager"]
    ] },
    { file: "pages/Save and load.html", title: "Save and load", sections: [
      ["whentoload", "Choose when loads happen"],
      ["whentosave", "Choose when saves happen"],
      ["assetrefs", "Save asset references"],
      ["reacting", "React to load and save"],
      ["drain", "Save on quit"],
      ["reset", "Reset an asset or restore a snapshot"],
      ["interfaces", "Optional hooks"]
    ] },
    { file: "pages/Slots and save menus.html", title: "Slots and save menus", sections: [
      ["slots", "Set up save slots"],
      ["registry", "List slots without loading them"],
      ["otherslots", "Work with other slots from code"],
      ["quicksave", "Add a quick save"],
      ["newgame", "New Game and Continue"]
    ] },
    { file: "pages/Update a shipped save.html", title: "Update a shipped save", sections: [
      ["migration", "Lock and migrate saves"],
      ["versioning", "Version your data"],
      ["erasure", "Delete a player's data"]
    ] },
    { group: "Where it is stored", file: "pages/Save on the device.html", title: "Save on the device", sections: [
      ["prototype", "Prototype"],
      ["file", "Local File"],
      ["playerprefs", "Player Prefs"],
      ["session", "Session (Memory)"],
      ["none", "None"],
      ["test", "Test"],
      ["deleting", "Delete local data"]
    ] },
    { file: "pages/Save per platform.html", title: "Save per platform", sections: [
      ["routes", "Set up routes"],
      ["distribution", "Route two builds of the same platform"],
      ["converting", "Convert an existing manager"],
      ["consoles", "Consoles"]
    ] },
    { file: "pages/Cloud and remote.html", title: "Cloud & remote", sections: [
      ["async", "Remote saving is asynchronous"],
      ["conflict", "Resolve a conflict between two devices"],
      ["merging", "Merge two saves"],
      ["http", "Server (HTTP)"],
      ["steam", "Steam Cloud"],
      ["cloudsave", "Cloud Save (UGS)"]
    ] },
    { file: "pages/Connect to a backend service.html", title: "Connect to a backend service", sections: [
      ["shape", "Fill in the Backend Service fields"],
      ["playfab", "PlayFab"],
      ["firestore", "Firebase Firestore"],
      ["supabase", "Supabase"],
      ["realtimedb", "Firebase Realtime Database"],
      ["nakama", "Nakama"],
      ["lootlocker", "LootLocker"],
      ["pocketbase", "PocketBase"],
      ["appwrite", "Appwrite"],
      ["graphql", "Any GraphQL endpoint"],
      ["any", "Any other REST backend"],
      ["own", "Use your own database"],
      ["others", "Other services"],
      ["missing", "What an absent save looks like"]
    ] },
    { file: "pages/Secure saves.html", title: "Secure saves", sections: [
      ["security", "Secure a local file"],
      ["remotesecurity", "Secure a remote save"],
      ["threat", "What it defends against"]
    ] },
    { group: "Help", file: "pages/Troubleshooting.html", title: "Troubleshooting", sections: [
      ["surprises", "Common issues"],
      ["recovery", "When a save doesn't load"],
      ["debug", "Debugging"],
      ["performance", "Performance"],
      ["testing", "Simulate any save outcome"],
      ["support", "Support"]
    ] },
    { group: "Advanced", file: "pages/Extend the package.html", title: "Extend the package", sections: [
      ["manager", "Create a custom persistence manager"],
      ["serializer", "Create a custom serializer"],
      ["remote", "Create a custom remote manager"],
      ["settings", "Add your own settings"],
      ["scenecodecs", "Add a component codec"],
      ["codecs", "Add your own variable types"]
    ] },
    { file: "pages/Technical QA.html", title: "Technical Q&A", sections: [
      ["durability", "Crash safety and durability"],
      ["security", "Security"],
      ["editor", "Editor safety"],
      ["concurrency", "Concurrency and threading"],
      ["conflicts", "Multi-device conflicts"],
      ["failures", "Error handling"],
      ["identity", "Identity and portability"],
      ["testing", "Testing"]
    ] },
  ];

  function esc(text)
  {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var path = decodeURIComponent(location.pathname).replace(/\\/g, "/");
  var current = path.split("/").pop();
  var inPages = /\/pages\/[^\/]*$/.test(path);
  var prefix = (inPages) ? "../" : "";
  var isApiPage = (current === "Public API.html") || (current.indexOf("API - ") === 0);
  var isStandalone = (current === "Quick Usage Guide.html");

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
    ["Quick Usage Guide.html", "Quick Usage Guide"],
    ["User Manual.html", "User Manual"],
    ["Public API.html", "Public API"]
  ];

  var bar = '<div class="doc-top"><span class="doc-brand">Persistent Asset</span><div class="doc-top-links">';
  for (var k = 0; k < BOOKS.length; k++)
  {
    // Every page but the other two books belongs to the manual, and every API page to the reference.
    var isBook = (current === BOOKS[k][0])
              || ((k === 1) && (current !== BOOKS[0][0]) && (isApiPage === false))
              || ((k === 2) && isApiPage);
    bar += '<a href="' + hrefOf(BOOKS[k][0]) + '"' + ((isBook) ? ' class="active" aria-current="true"' : '')
         + '>' + esc(BOOKS[k][1]) + '</a>';
  }
  bar += '</div></div>';
  document.write(bar);

  // Manual pages get the generated sidebar; API pages keep their own static one, and the standalone
  // guide gets none.
  if ((isApiPage === false) && (isStandalone === false))
  {
    var html = '<nav>';
    html += '<div id="pa-links">';
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
        html += '<div class="nav-group-body" id="pa-group-' + drawnGroup + '">';
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
    search.innerHTML = '<input id="pa-search" type="search" placeholder="Search the docs..." autocomplete="off"'
                     + ' aria-label="Search the documentation" />';
    var results = document.createElement("div");
    results.id = "pa-results";
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

      var index = window.PA_SEARCH_INDEX || [];

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
      var input = document.getElementById("pa-search");
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
