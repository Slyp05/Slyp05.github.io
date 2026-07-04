/*
  Shared sidebar, search and code-copy helper for the Persistent Asset documentation.

  - Manual pages get their whole sidebar from the PAGES list below: edit it to add, remove or
    reorder pages (or their sidebar sub-sections) and every manual page picks the change up.
  - API pages keep their own static sidebar (their type lists live in the page); including this
    script only adds the search box and the code-copy buttons to them.
  - The search data lives in shared/search-index.js. It is generated, never edited by hand: rerun
    _DocsTools/Build-SearchIndex.ps1 after editing pages.
  - The sidebar is written with document.write so everything works when the manual is opened
    straight from disk (file://), where fetch() is blocked.
*/
(function () {
  var PAGES = [
    { file: "User Manual.html", title: "Home" },
    { file: "pages/What is a ScriptableObject.html", title: "What is a ScriptableObject?", sections: [
      ["one-sentence", "The short version"],
      ["vs-mono", "vs. MonoBehaviour"],
      ["making-one", "Making one"],
      ["the-catch", "The catch"]
    ] },
    { file: "pages/Getting Started.html", title: "Getting Started", sections: [
      ["step-class", "1. Make a data class"],
      ["step-asset", "2. Create the asset"],
      ["step-manager", "3. Pick a manager"],
      ["step-play", "4. Press Play"],
      ["save-location", "Wiping test data"],
      ["what-happened", "What just happened?"]
    ] },
    { file: "pages/Installation.html", title: "Installation & Demo", sections: [
      ["requirements", "Requirements"],
      ["platforms", "Platform support"],
      ["install", "Installing"],
      ["dependencies", "Optional modules"],
      ["demo", "The demo"]
    ] },
    { file: "pages/Core Concepts.html", title: "Core Concepts", sections: [
      ["parts", "The parts"],
      ["object", "Persistent object"],
      ["manager", "Persistence manager"],
      ["serializer", "Serializer"],
      ["operations", "Operations"],
      ["results", "Results"],
      ["ready", "When the data is ready"],
      ["editor", "Editor vs play mode"],
      ["global", "Acting on everything"]
    ] },
    { file: "pages/Local Saving.html", title: "Local Saving", sections: [
      ["prototype", "Prototype"],
      ["file", "Local File"],
      ["playerprefs", "Player Prefs"],
      ["session", "Session (Memory)"],
      ["test", "Test"],
      ["none", "None"],
      ["deleting", "Deleting local data"]
    ] },
    { file: "pages/Cloud and Remote.html", title: "Cloud & Remote", sections: [
      ["async", "Remote means async"],
      ["cache", "The offline cache"],
      ["status", "Saving indicator"],
      ["http", "Server (HTTP)"],
      ["cloudsave", "Cloud Save (UGS)"],
      ["custom", "Custom managers"]
    ] },
    { file: "pages/Quick Help.html", title: "Quick Help", sections: [
      ["choosing", "Which manager?"],
      ["surprises", "Common surprises"],
      ["digging", "Digging deeper"]
    ] },
    { file: "pages/Guides.html", title: "Guides", sections: [
      ["slots", "Multiple save slots"],
      ["reacting", "Reacting to load & save"],
      ["drain", "Saving on quit"],
      ["reset", "Resetting & Restoring"],
      ["globals", "Global objects"],
      ["interfaces", "Optional hooks"],
      ["attribute", "Without the base class"],
      ["security", "Securing saves"],
      ["migration", "Locking & migrating saves"],
      ["versioning", "Versioning your data"],
      ["erasure", "Deleting a player's data"],
      ["debug", "Debugging"]
    ] },
    { file: "pages/No-Code.html", title: "No-Code", sections: [
      ["variables", "Persistent Variables"],
      ["components", "The components"],
      ["dragdrop", "Connecting variables"],
      ["wiring", "Saving from the inspector"],
      ["input", "Input bindings"],
      ["localization", "Localization"],
      ["developers", "For developers"]
    ] },
    { file: "pages/Settings.html", title: "Settings", sections: [
      ["general", "General"],
      ["singleton", "Singleton"],
      ["security", "Security"],
      ["remote", "Remote"],
      ["variables", "Variables Binding"]
    ] },
    { file: "pages/Extending.html", title: "Extending", sections: [
      ["manager", "Custom manager"],
      ["serializer", "Custom serializer"],
      ["remote", "Custom remote manager"],
      ["settings", "Custom settings"],
      ["display", "The InspectorDisplay attribute"],
      ["codecs", "Custom variable types"],
      ["converters", "Custom value converters"],
      ["widgets", "Custom widgets"]
    ] },
    { file: "pages/Technical QA.html", title: "Technical Q&A", sections: [
      ["durability", "Crash & durability"],
      ["editor", "Editor safety"],
      ["async", "Async & concurrency"],
      ["conflicts", "Multi-device conflicts"],
      ["failures", "Failures & exceptions"],
      ["security", "Security"],
      ["portability", "Identity & portability"],
      ["performance", "Performance"],
      ["testing", "Testing & quality"]
    ] },
    { file: "pages/Roadmap.html", title: "Roadmap", sections: [
      ["planned", "Planned for the package"],
      ["free", "Free add-on packages"],
      ["considered", "Considered packages"],
      ["feedback", "Your feedback"]
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
  var isApiPage = (current === "Public API.html") || (current.indexOf("API - ") === 0);

  function hrefOf(file) { return prefix + encodeURI(file); }

  // Manual pages get the generated sidebar; API pages keep their own static one.
  if (isApiPage === false)
  {
    var html = '<nav>';
    html += '<div class="nav-title">Persistent Asset</div>';
    html += '<div id="pa-links">';
    for (var i = 0; i < PAGES.length; i++)
    {
      var page = PAGES[i];
      var isActive = (page.file.split("/").pop() === current);
      html += '<a href="' + hrefOf(page.file) + '"' + ((isActive) ? ' class="active"' : '') + '>' + esc(page.title) + '</a>';
      if (isActive && page.sections)
        for (var s = 0; s < page.sections.length; s++)
          html += '<a href="#' + page.sections[s][0] + '" class="indent">' + esc(page.sections[s][1]) + '</a>';
    }
    html += '</div></nav>';
    document.write(html);
  }
  document.write('<script src="' + prefix + 'shared/search-index.js"><\/script>');

  function ready(fn)
  {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Search: a box injected under the sidebar title; results replace the sidebar links while typing.
  ready(function () {
    var nav = document.querySelector("nav");
    var title = (nav) ? nav.querySelector(".nav-title") : null;
    if (title === null) return;

    var search = document.createElement("div");
    search.className = "nav-search";
    search.innerHTML = '<input id="pa-search" type="search" placeholder="Search the docs..." autocomplete="off" />';
    var results = document.createElement("div");
    results.id = "pa-results";
    results.style.display = "none";
    title.parentNode.insertBefore(search, title.nextSibling);
    title.parentNode.insertBefore(results, search.nextSibling);

    // Everything else in the sidebar gets hidden while search results are shown.
    var hidden = [];
    for (var c = 0; c < nav.children.length; c++)
    {
      var child = nav.children[c];
      if ((child !== title) && (child !== search) && (child !== results))
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
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { clear(); return; }

      var index = window.PA_SEARCH_INDEX || [];
      var manualHits = [];
      var apiHits = [];
      for (var i = 0; i < index.length; i++)
      {
        var e = index[i];
        var score = 0;
        if (e.h.toLowerCase().indexOf(q) >= 0) score = 2;
        else if ((e.x || "").toLowerCase().indexOf(q) >= 0) score = 1;
        if (score > 0)
          ((e.api) ? apiHits : manualHits).push({ e: e, score: score, order: i });
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

      var html = "";
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
        btn.addEventListener("click", function () {
          var code = pre.querySelector("code");
          var text = (code) ? code.textContent : pre.textContent;
          function done()
          {
            btn.textContent = "Copied!";
            setTimeout(function () { btn.textContent = "Copy"; }, 1500);
          }
          // execCommand only counts as user-triggered while this click handler is still on the
          // stack, and the async Clipboard API is refused on file:// pages, so the synchronous
          // path goes first and the Clipboard API is the fallback (for browsers dropping
          // execCommand support).
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
          if (copied)
          {
            done();
            return;
          }
          if (navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(text).then(done, function () { });
        });
        pre.appendChild(btn);
      })(pres[i]);
  });
})();
