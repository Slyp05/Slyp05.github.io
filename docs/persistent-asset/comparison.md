---
layout: page
title: How Persistent Asset Compares
permalink: /persistent-asset/comparison/
image: /assets/images/persistent-asset-social.jpg
description: "Persistent Asset checked against every feature Easy Save 3, Crystal Save Pro and Bayat Save System list for themselves."
---

<style>
/* ---- tabs ---- */
.cmp-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 1.4em 0 1.2em;
  border-bottom: 1px solid var(--cmp-band-border);
  padding-bottom: 8px;
}
.cmp-tab {
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: var(--bg-subtle);
  color: var(--text);
}
.cmp-tab:visited { color: var(--text); }
.cmp-tab:hover { background: var(--cmp-band-bg); color: var(--text); text-decoration: none; }
.cmp-tab[aria-selected="true"] { background: var(--btn-feat-bg); color: var(--btn-feat-fg); }
/* the tab for what only Persistent Asset does stands out while unselected */
.cmp-tab--ours:not([aria-selected="true"]) {
  background: var(--cmp-band-bg);
  color: var(--cmp-band-fg);
  box-shadow: inset 0 0 0 1px var(--cmp-band-fg);
}
.cmp-tab--ours:not([aria-selected="true"]):visited { color: var(--cmp-band-fg); }
.cmp-panel > h2:first-child { margin-top: 0; }
.cmp-tab-score { display: none; }

/* no tab picked yet: the tabs become cards carrying each table's score */
.cmp-tabs--cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  border-bottom: 0;
  padding-bottom: 0;
}
.cmp-tabs--cards .cmp-tab {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: inset 0 0 0 1px var(--cmp-band-border);
}
.cmp-tabs--cards .cmp-tab-score {
  display: block;
  font-size: 13px;
  font-weight: 400;
}
.cmp-tab-score span { white-space: nowrap; margin-right: 7px; }
.cmp-tabs--cards .cmp-tab--ours { box-shadow: inset 0 0 0 1px var(--cmp-band-fg); }
/* the first card sizes to its longer name on one line, the other three share the rest */
@media (min-width: 701px) {
  .cmp-tabs--cards { grid-template-columns: auto repeat(3, 1fr); }
  .cmp-tabs--cards .cmp-tab--ours { white-space: nowrap; }
}
.cmp-back { display: inline-block; margin-top: 1em; font-size: 14px; }
.cmp-back[hidden] { display: none; }
@media (max-width: 700px) {
  .cmp-tabs--cards { grid-template-columns: repeat(2, 1fr); }
}

/* ---- tables ---- */
.page-content table {
  font-size: 13px;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}
.page-content th, .page-content td {
  padding: 7px 11px;
  vertical-align: middle;
  border-bottom: 1px solid var(--cmp-row-border);
  overflow-wrap: anywhere;
}
/* headers wrap between words only */
.page-content th { overflow-wrap: normal; }
@media (max-width: 600px) {
  .page-content table { font-size: 12px; }
  .page-content th, .page-content td { padding: 6px 7px; }
  .cmp-vs th:nth-child(1), .cmp-vs td:nth-child(1) { width: 40%; }
  .cmp-vs th:nth-child(2), .cmp-vs td:nth-child(2) { width: 18%; }
}
/* let long inline-code tokens wrap instead of overflowing into the next cell */
.page-content td code { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }

/* header stays visible while scrolling a long table */
.page-content thead th {
  position: sticky;
  top: 0;
  background: var(--cmp-head-bg);
  color: var(--cmp-head-fg);
  font-weight: 600;
}
.page-content tbody tr:nth-child(even) td { background: var(--cmp-zebra); }

/* one package: its feature, our status, how */
.cmp-vs th:nth-child(1), .cmp-vs td:nth-child(1) { width: 35%; }
.cmp-vs th:nth-child(2), .cmp-vs td:nth-child(2) { width: 15%; text-align: center; }
.cmp-vs th:nth-child(3), .cmp-vs td:nth-child(3) { width: 50%; }
</style>

Every feature that [Easy Save 3](https://assetstore.unity.com/packages/tools/utilities/easy-save-the-complete-save-game-data-serializer-system-768), [Crystal Save Pro](https://assetstore.unity.com/packages/tools/utilities/crystal-save-professional-save-system-save-migration-319719) and [Bayat Save System](https://assetstore.unity.com/packages/tools/input-management/bayat-save-system-108890) list for themselves, checked against [Persistent Asset](/persistent-asset/). Their features were read in September 2026 from their store pages and docs. Some of it may be wrong: email [justetools@gmail.com](mailto:justetools@gmail.com) and I'll fix it.

**Legend:** ⭐ yes, and more · ✅ yes · 🟠 partly, or solved differently · ❌ no

<nav class="cmp-tabs" role="tablist" aria-label="Comparisons">
  <a class="cmp-tab cmp-tab--ours" role="tab" id="tab-only-persistent-asset" href="#only-persistent-asset" aria-controls="only-persistent-asset">⭐ Only in Persistent Asset</a>
  <a class="cmp-tab" role="tab" id="tab-easy-save" href="#easy-save" aria-controls="easy-save">Easy Save 3</a>
  <a class="cmp-tab" role="tab" id="tab-crystal-save" href="#crystal-save" aria-controls="crystal-save">Crystal Save Pro</a>
  <a class="cmp-tab" role="tab" id="tab-bayat" href="#bayat" aria-controls="bayat">Bayat Save System</a>
</nav>

<section class="cmp-panel cmp-vs" id="only-persistent-asset" role="tabpanel" aria-labelledby="tab-only-persistent-asset" markdown="1">

## ⭐ Only in Persistent Asset

| Feature | Persistent Asset | How |
|---|---|---|
| Your class is the save | ⭐ | Write the class; it loads and saves itself, no keys |
| Loads only what the game uses | ⭐ | Automatic: loads on first use, saves on unload and pause |
| Knows when the data is safe to use | ⭐ | One bool you can trust: `IsReady` |
| Saving blocked after a failed load | ⭐ | If the load could still succeed later, saves wait for it |
| Storage per platform | ⭐ | Same save, stored differently on each platform |
| Storage per store build | ⭐ | Different storage for Steam, itch or other store builds |
| Settings lock once shipped | ⭐ | Settings that would break players' saves turn read-only |
| Settings changes migrate saves | ⭐ | Each player's save migrates once, automatically |
| Tamper mark | ⭐ | Readable save; hand-edited saves are flagged for good |
| Anchor a save to the machine | ⭐ | A save copied to another computer won't load |
| Anchor a save to its location | ⭐ | A save moved elsewhere won't load |
| Any REST or GraphQL backend | ⭐ | Set up in the Inspector, no code |
| Four serializers, chosen per save file | ⭐ | Unity JSON, Newtonsoft, Odin, MemoryPack |
| Checkpoints and resets | ⭐ | Snapshot, restore, or reset to starting values |
| Offline saves upload on their own | ⭐ | Retried in the background once back online |
| Failure simulation | ⭐ | Force any failure or delay to test your game |
| Build-time checks | ⭐ | A broken setup stops the build |
| Clashing saves flagged | ⭐ | Warns when two saves write to the same place |
| Project-wide save overview | ⭐ | Every save in one list, broken ones flagged |
| Build cost of saved asset references | ⭐ | Build and load cost shown per asset |
| Operation log | ⭐ | Every load and save, its result and duration |
| On-device debug overlay | ⭐ | Save status, logs and data in the running build |
| Quitting waits for unfinished saves | ⭐ | Up to a timeout you set |
| Every operation as a UnityEvent | ⭐ | Ready-made components, no code |
| UI binders | ⭐ | Show saved values in UI, no code |
| Change events, no code | ⭐ | A value change raises a UnityEvent |
| AI agent skills | ⭐ | Eight skills for AI coding agents included |

</section>

<section class="cmp-panel cmp-vs" id="easy-save" role="tabpanel" aria-labelledby="tab-easy-save" markdown="1">

## Easy Save 3

| Easy Save 3 feature | Persistent Asset | How |
|---|---|---|
| Auto Save, no code | ✅ | Saves and loads on its own by default |
| Save a GameObject's components | ✅ | Add one component, tick what to save |
| Save and load with one call each | ✅ | `Prefs.Set` and `Prefs.Get` |
| As simple as PlayerPrefs, more flexible | ✅ | `Prefs`, with slots, encryption and any storage |
| Key operations: exists, list, delete | ✅ | `Prefs.Has`, `Prefs.Keys`, `Prefs.Remove` |
| Load with a default, or into an object | ✅ | Fallback value, or straight into your object |
| File operations: delete, copy, rename, list | ✅ | Same on slots, each with its last save time |
| Save slots | ✅ | Any string names a slot |
| Slots UI in one click, customisable | ✅ | Menu added in one click; all slots share one editable prefab |
| AES encryption, 128-bit, with a password | ⭐ | AES-256, key per project or passed at runtime |
| Compression | ✅ | gzip, for local and cloud saves |
| Backups and restore | ⭐ | Automatic, restored when a save is corrupted |
| Caching | ✅ | Data stays in memory, written to disk on save |
| File, PlayerPrefs or memory | ✅ | Built in |
| Custom file names and paths | ✅ | Name, folder, extension; any folder on desktop |
| Settings window | ✅ | Project Settings > Persistent Asset |
| Cloud saves | ⭐ | Unity Cloud Save, Steam Cloud, any REST backend |
| PHP & MySQL server script | 🟠 | No PHP script; nine backend setups or your own endpoint |
| Steam Auto Cloud | ⭐ | Setup documented, plus saving to Steam Cloud directly |
| Android Backup and iCloud Backup | ✅ | Saves sit in the standard folder, which backups include |
| Classes, structs and Unity types | ✅ | Your own classes by their fields, Unity types built in |
| GameObjects and prefab instances | ✅ | Prefab instances respawned from their prefab |
| ScriptableObjects | ⭐ | `PersistentScriptableObject` base class or attribute |
| Collections, including 2D arrays | ✅ | With the Newtonsoft, Odin or MemoryPack serializer |
| Custom types | ✅ | Write a converter, or your own serializer |
| References to Unity objects | ✅ | To assets and to scene objects |
| Fast JSON serializer made for Unity | ✅ | Unity JSON: saves and loads 700 objects in 8 ms |
| Readable JSON saves | ✅ | Indented JSON option |
| PC, Mac, Linux, mobile, WebGL, Oculus | ✅ | Built in; WebGL has every storage but Steam Cloud |
| Same save files on every platform | ✅ | One format everywhere |
| Windows Universal and tvOS | 🟠 | Not tested |
| Consoles and other storage APIs | ✅ | Write your own storage, choose it per platform |
| C# API | ⭐ | Every call as sync, callback, async or coroutine |
| Error handling | ✅ | A failed call returns the reason |
| PlayMaker actions | 🟠 | No PlayMaker actions; built-in no-code components instead |
| Visual scripting: Bolt, NodeCanvas… | 🟠 | Called through generic nodes, no dedicated ones |
| CSV spreadsheet export | ❌ | Not in scope |
| File IO: strings, bytes, images, audio | 🟠 | Kept inside a save; images and audio need a converter |
| Folder operations | ❌ | Not in scope |
| Documentation and examples | ✅ | Quick Usage Guide, User Manual, Public API, demo game |
| Source code included | ✅ | Full C# source, one assembly per module |
| Support by email, forum, Discord | 🟠 | Email only, reply within a business day |
| On the store since 2011 | ❌ | Released in 2026 |

</section>

<section class="cmp-panel cmp-vs" id="crystal-save" role="tabpanel" aria-labelledby="tab-crystal-save" markdown="1">

## Crystal Save Pro

| Crystal Save Pro feature | Persistent Asset | How |
|---|---|---|
| No-code save and load | ✅ | Saves and loads on its own by default |
| Component-based setup | ✅ | Add one component to the GameObject |
| One component per GameObject | ✅ | Tick which of its components to save |
| Remember classes (custom savers) | ✅ | Write a saver for any component |
| Spawn saveable prefabs | ⭐ | Unity's own `Instantiate`, no special spawn call |
| Runtime prefabs restored | ✅ | Respawned from their prefab |
| Pick exactly what to persist | ✅ | Tick which components to save, per object |
| No manual IDs | ✅ | IDs assigned automatically in the editor |
| Your own classes | ✅ | Their fields are saved |
| ScriptableObjects | ⭐ | `PersistentScriptableObject` base class or attribute |
| Scales to a whole open world | ✅ | Split across several save files |
| Additive scenes | ✅ | Spawned objects return to their own scene |
| Objects kept across scenes | ✅ | `DontDestroyOnLoad` objects are saved |
| Unity Addressables | ❌ | Not supported (documented workaround) |
| Unity Cloud Save | ✅ | Built in |
| Supabase | ✅ | Copy-paste setup in the manual |
| Firebase | ✅ | Copy-paste setups for Firestore and Realtime Database |
| Unity Cloud Save on WebGL | ✅ | Works on WebGL |
| Move to the cloud with one toggle | ✅ | Switch storage in one dropdown, no code change |
| Local mirror, works offline | ⭐ | With Cache Mode, saves land on the device, then sync |
| Cloud slots refreshed on sign-in | ✅ | Loads retry until the player is signed in |
| Manual cloud refresh | ✅ | `Load()` and `PushPendingChangesAsync()` |
| Screenshots and metadata uploaded | ✅ | Slot screenshots and metadata can be stored in the cloud |
| Encrypted local mirror | ✅ | Protected separately from the cloud copy |
| No hardcoded encryption key | ✅ | Key generated per project |
| Sign-in helpers | ❌ | Not in scope |
| JSON format | ✅ | The default |
| Binary or JSON cloud transport | ✅ | Any serializer works with any storage |
| Added components | ✅ | Components added or removed at runtime are saved |
| Mesh and material swaps | ✅ | Saved as asset references |
| Child hierarchies | ✅ | Parent changes are saved |
| Blendshapes | ✅ | Weights saved with the renderer |
| Fully code-generated objects | ❌ | Only objects spawned from a prefab |
| Versioned save migration | ✅ | Upgrade old saves field by field |
| Non-destructive migration | ✅ | Old saves migrate once, automatically |
| Streaming deferred prefabs | ❌ | Not in scope |
| MySQL backend | 🟠 | Through a REST endpoint you put in front of it |
| Async queries with retry | ✅ | Async, retried until it succeeds |
| Restore one object on its own | 🟠 | Loads whole files: give the object its own save file |
| Metadata import across titles | ❌ | Not included |
| Server-side encryption | ✅ | Key passed at runtime, never shipped in the build |
| Pooled prefabs | 🟠 | Tracked through `Instantiate` and `Destroy` only |
| DontDestroyOnLoad manager | ❌ | Not in scope |
| Event-rich API | ✅ | An event for every operation, also as UnityEvents |
| MemoryPack serializer | ✅ | Built in: saves and loads 700 objects in 0.7 ms |
| Stores only changes | ✅ | Only what differs from the scene you made |
| Destroyed-object tracking | ✅ | A destroyed object stays destroyed after a load |
| Auto-thumbnails | ✅ | Per-slot screenshot |
| Slot metadata | ✅ | Save time and your own summary |
| Player and world slots | ✅ | Each save is either per slot or shared by all slots |
| Dynamic slots | ✅ | Any string, or the next free slot |
| Themeable save and load UI | ✅ | Ready-made menu; all slots share one editable prefab |
| Loading spinner | ✅ | Ready-made spinner |
| Save sharing: export and import | 🟠 | Runtime API per object; bundle a whole save yourself |
| Settings manager | 🟠 | No-code values bound to your settings |
| Settings window | ✅ | Project Settings > Persistent Asset |
| Performance settings | ✅ | Saves off the main thread, skipped when nothing changed |
| Testing guidance | ✅ | Force any save result in tests |
| Locale saved | ✅ | Built-in locale value |
| Detect local and cloud conflicts | ✅ | Never overwrites a cloud save it hasn't loaded |
| Automatic conflict policy | ✅ | Newest save wins, or your own merge |
| Merge API | ✅ | Merge two saves field by field |
| Player resolves conflicts in-game | 🟠 | Player picks one whole save, not field by field |
| Integrations: Game Creator 2, Opsive… | ❌ | None |
| Deterministic IDs | ✅ | GUID stored in the object, same in every build |
| Networking sync module (beta) | ❌ | Not in scope |
| Full source, no DLL | ✅ | Full C# source |

</section>

<section class="cmp-panel cmp-vs" id="bayat" role="tabpanel" aria-labelledby="tab-bayat" markdown="1">

## Bayat Save System

| Bayat Save System feature | Persistent Asset | How |
|---|---|---|
| Mono and IL2CPP | ✅ | Both |
| Standalone, mobile, WebGL | ✅ | All three |
| UWP | 🟠 | Not tested |
| Unified API | ✅ | Same calls for every storage |
| File storage | ✅ | Built in |
| PlayerPrefs storage | ✅ | Built in |
| Async API | ⭐ | Sync, callback, async or coroutine |
| Check a save exists | ✅ | Reports whether a save was found |
| Settings presets | 🟠 | No presets; select several saves and edit them at once |
| Create a backup | ⭐ | Made automatically, on by default |
| Restore a backup | ⭐ | Automatic when a save is corrupted |
| Keep several backups | 🟠 | One automatic backup; copy saves to other slots for more |
| Save metadata | ✅ | Save time and your own summary |
| Catalog of saved items | ✅ | Slots listed without loading their data |
| Json.NET serialization | ✅ | Newtonsoft (Json.NET) serializer |
| Json.NET attributes and callbacks | ✅ | Newtonsoft serializer |
| Indented JSON output | ✅ | Indented JSON option |
| Circular and shared references | ✅ | Odin built in; the other three serializers with setup |
| Polymorphic types | ✅ | Newtonsoft, Odin; Unity JSON, MemoryPack with setup |
| GameObjects and components | ✅ | Built in |
| Texture, material, mesh references | ✅ | Register the assets or their folder first |
| Collections and dictionaries | ✅ | With the Newtonsoft, Odin or MemoryPack serializer |
| Custom converters | ✅ | Per value type or per component |
| ScriptableObjects | ⭐ | `PersistentScriptableObject` base class or attribute |
| AES encryption | ⭐ | AES-256 |
| Your own encryption algorithm | ✅ | Extend the file storage and encrypt the bytes yourself |
| Auto Save component | ✅ | Add one component to the GameObject |
| Exclude components or children | ✅ | Tick only what you want saved |
| Save on quit or pause | ⭐ | Also on focus loss and on a timer |
| Load on start | ✅ | Loads when your game first uses the data |
| Firebase Realtime Database | ✅ | Copy-paste setup in the manual |
| Firebase Cloud Storage | 🟠 | No Cloud Storage setup; Firestore setup instead |
| PlayFab UserData | ✅ | Copy-paste setup in the manual |
| PlayFab Entity Objects | 🟠 | No Entity Objects setup; UserData setup instead |
| Steamworks.NET | ✅ | Built in |
| Facepunch Steamworks | ✅ | Through Steam Auto-Cloud, which works with any plugin |
| Google Play Games | 🟠 | Not built in: write your own storage, three methods |
| Xbox Live | 🟠 | Not built in: write your own storage, three methods |
| PlayMaker | 🟠 | No PlayMaker actions; built-in no-code components instead |
| Bolt | 🟠 | Called through generic nodes, no dedicated ones |
| Custom storage | ✅ | Implement three methods |
| Connection strings | ✅ | Storage set up in the Inspector |
| Raw text and bytes | 🟠 | Stored as a value inside a save, not as its own file |
| Save images | 🟠 | Slot screenshots built in; other images need a converter |
| Move, copy, delete | ✅ | `Slots.Copy`, `Rename`, `Delete` |
| List saved items | ✅ | Slots listed without loading their data |
| Load into an existing object | ✅ | Loads straight into your object |
| Scene reference resolver | ✅ | References to scene objects are saved and restored |
| Extensible | ✅ | Write your own storage, serializer or converters |
| Full documentation | ✅ | Quick Usage Guide, User Manual, Public API, XML summaries |
| Try before purchase | 🟠 | Playable demo game, no trial package |
| Unity 2018.4 or newer | ❌ | Built for Unity 6 and newer |

</section>

<a class="cmp-back" href="./" hidden>← All comparisons</a>

<script>
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.cmp-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.cmp-panel'));
  if (!tabs.length || !panels.length) return;
  var nav = document.querySelector('.cmp-tabs');
  var back = document.querySelector('.cmp-back');
  back.addEventListener('click', function (e) {
    e.preventDefault();
    history.pushState(null, '', location.href.split('#')[0]);
    show('');
    nav.scrollIntoView();
  });

  // each tab's score is counted from its own table, so it follows edits to the rows
  var marks = ['⭐', '✅', '🟠', '❌'];
  tabs.forEach(function (t) {
    var panel = document.getElementById(t.getAttribute('aria-controls'));
    if (!panel) return;
    var counts = {};
    panel.querySelectorAll('tbody tr').forEach(function (tr) {
      var cell = tr.cells[1];
      var mark = cell && marks.filter(function (m) { return cell.textContent.indexOf(m) !== -1; })[0];
      if (mark) counts[mark] = (counts[mark] || 0) + 1;
    });
    var score = document.createElement('span');
    score.className = 'cmp-tab-score';
    marks.forEach(function (m) {
      if (!counts[m]) return;
      var item = document.createElement('span');
      item.textContent = m + ' ' + counts[m];
      score.appendChild(item);
    });
    t.appendChild(score);
  });

  // no id: no tab picked, the tabs show as cards and every table stays hidden
  function show(id) {
    if (!panels.some(function (p) { return p.id === id; })) id = '';
    nav.classList.toggle('cmp-tabs--cards', !id);
    back.hidden = !id;
    panels.forEach(function (p) { p.hidden = (p.id !== id); });
    tabs.forEach(function (t, i) {
      var on = t.getAttribute('href') === '#' + id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = (on || (!id && i === 0)) ? 0 : -1;
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      var id = t.getAttribute('href').slice(1);
      // leaving the cards adds a history entry, so Back returns to them
      if (location.hash) history.replaceState(null, '', '#' + id);
      else history.pushState(null, '', '#' + id);
      show(id);
    });
    t.addEventListener('keydown', function (e) {
      var step = (e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowLeft') ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  function showFromHash() {
    show(location.hash.slice(1));
    if (location.hash) nav.scrollIntoView();
  }

  window.addEventListener('hashchange', showFromHash);
  window.addEventListener('popstate', showFromHash);
  window.addEventListener('load', function () { if (location.hash) nav.scrollIntoView(); });
  showFromHash();
})();
</script>
