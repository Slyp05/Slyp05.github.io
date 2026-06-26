---
layout: page
title: How Persistent Asset Compares
permalink: /persistent-asset/comparison/
sitemap: false
---

See how [Persistent Asset](/persistent-asset/) holds up against the other save solutions on the store.

<style>
/* widen only this page's content; the header and footer keep the site's default width */
.page-content .wrapper { max-width: 1100px; }

.page-content table {
  font-size: 13px;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}
.page-content th, .page-content td {
  padding: 7px 11px;
  vertical-align: middle;
  border-bottom: 1px solid #ebebf1;
}
/* first column = the questions; the three product columns share equal width, centered */
.page-content th:first-child, .page-content td:first-child { width: 31%; }
.page-content th:not(:first-child), .page-content td:not(:first-child) { width: 23%; text-align: center; }

/* header stays visible while scrolling the long table */
.page-content thead th {
  position: sticky;
  top: 0;
  background: #1e1e2e;
  color: #fff;
  font-weight: 600;
}
.page-content thead th:nth-child(2) { background: #312e81; }

/* zebra striping for easier row tracking (skips the featured column) */
.page-content tbody tr:nth-child(even) td:not(:nth-child(2)) { background: #f7f8fc; }

/* feature the Persistent Asset column */
.page-content tbody td:nth-child(2) { background: #eef1fd; font-weight: 600; }

/* section-label rows (bold text in the first cell, the rest empty) become bands */
.page-content tbody tr:has(td:first-child strong) td {
  background: #e6e9f7;
  border-bottom: 1px solid #cdd3ee;
}
.page-content tbody tr:has(td:first-child strong) td:first-child {
  text-transform: uppercase;
  letter-spacing: .05em;
  font-size: 11.5px;
  color: #312e81;
}
</style>

**Legend:** ✅ yes · ⚠️ partly / manual or unclear · ➖ deliberately not · ❌ no · ⏳ coming

|  | Persistent Asset | Easy Save 3 | Bayat Save System |
|---|---|---|---|
| **Setup & workflow** | | | |
| Saves & loads automatically, no code | ✅ Runs on its own | ⚠️ AutoSave component | ⚠️ AutoSave component |
| Set up entirely in the Inspector | ✅ No C# needed | ⚠️ Mostly code | ⚠️ Mostly code |
| Drop Save / Load onto a button | ✅ Ready for UnityEvents | ⚠️ Small script | ❌ Needs scripting |
| Save or wipe everything in one call | ✅ One call, every object | ⚠️ One at a time | ⚠️ One at a time |
| Change where saves go without rewriting code | ✅ Dropdown on the asset | ❌ Tied to your calls | ⚠️ Set in code |
| **Where it saves** | | | |
| Local files & PlayerPrefs | ✅ Built in | ✅ Built in | ✅ Built in |
| Multiple save slots | ✅ Built in | ✅ Multiple files | ✅ Catalog API |
| Cloud saves across devices, built-in | ✅ Unity Cloud Save | ❌ Your own server | ✅ Firebase / PlayFab |
| Keeps working offline, syncs later | ✅ Auto-uploads later | ❌ Not built in | ⚠️ Manual |
| Database storage (SQL / NoSQL) | ➖ Server owns the DB | ❌ No | ✅ Firebase (NoSQL) |
| PC, mobile, WebGL & console | ✅ Console via add-on | ✅ Console via add-on | ✅ Console untested |
| **Reliability & data safety** | | | |
| Saves can't corrupt on crash or power loss | ✅ Atomic write-then-swap | ⚠️ Backup-based | ⚠️ Backup-based |
| Automatic backup copy | ✅ Automatic fallback | ✅ Backup & restore | ✅ Built-in backup |
| Never overwrites good progress with defaults | ✅ Won't wipe a real save | ⚠️ Up to your code | ⚠️ Up to your code |
| Knows when async/cloud data is ready to use | ✅ Built-in ready signal | ⚠️ You track it | ⚠️ You track it |
| Upgrades old saves after a game update | ✅ Versioning built in | ⚠️ Migrate yourself | ⚠️ Migrate yourself |
| Reset to defaults or restore a checkpoint | ✅ Built-in reset & checkpoints | ⚠️ Manual | ⚠️ Manual |
| Finishes saving before the game closes | ✅ Waits for in-flight saves | ⚠️ No async drain | ⚠️ No async drain |
| **Security** | | | |
| Save encryption | ✅ AES-256 | ✅ AES-128 | ✅ AES |
| Tamper-proofing & anti-cheat | ✅ Edit-detection + device locks | ⚠️ Encryption only | ⚠️ Encryption only |
| **Performance** | | | |
| Smooth saving, no frame stutter | ✅ Heavy work in the background | ⚠️ Mostly main thread | ⚠️ Async API |
| Compress saves to shrink file size | ✅ gzip (Fast or Optimal) | ✅ gzip | ❌ Not built in |
| Skips saving when nothing changed | ✅ Optional dirty-check | ⚠️ Manual / cache | ⚠️ Manual |
| **What you can save** | | | |
| Deep object graphs & polymorphism out of the box | ⏳ via `[SerializeReference]`; full serializers coming | ✅ Reflection serializer | ✅ Json.NET-based |
| Save any object from anywhere in code | ➖ By design: one clear asset | ✅ Save anything, anywhere | ✅ Save anything, anywhere |
| Save entire scenes & GameObjects | ➖ By design: we save data | ✅ Snapshots scene objects | ✅ Unity objects & components |
| Save references between objects | ⏳ Asset refs planned | ✅ Unity & shared refs | ✅ Resolvers + shared refs |
| Save individual values / keys | ✅ Via Persistent Variables bag | ✅ Per-key partial saves | ✅ Per-key |
| **Editor & debugging tools** | | | |
| Live save status right in the Inspector | ✅ Load state & last result | ❌ No live panel | ❌ None |
| Edit your data live while playing | ✅ Tweak in the Inspector mid-play | ⚠️ Your component fields | ⚠️ Your component fields |
| Run Save / Load / Clear by hand while playing | ✅ Inspector buttons | ❌ From code | ❌ From code |
| Running log of every save & load | ✅ Built-in log | ❌ Not built in | ❌ Not built in |
| Simulate failures & slow/cancelled saves | ✅ Built-in test mode | ❌ Not built in | ❌ Not built in |
| One-click wipe of local saves for re-testing | ✅ Dev tool included | ⚠️ Editor tools | ❌ Via code |
| **No-code for designers** | | | |
| Save options & settings, no code | ✅ Ready-made workflow | ❌ Code required | ❌ Code required |
| Bind values to UI without code | ✅ Binder components | ❌ Not offered | ❌ Not offered |
| Values notify your UI when they change | ✅ Observable values | ❌ Not offered | ❌ Not offered |
| **Extending & integrations** | | | |
| Add your own save destination | ✅ Custom manager (+ cloud base) | ⚠️ Write the IO yourself | ✅ Modular Storage API |
| Swap in your own save format / serializer | ✅ Serializer is a slot | ⚠️ Harder to swap | ✅ Modular Serialization API |
| Teach it your own custom data types | ✅ Custom codecs | ✅ Custom ES3 types | ✅ Custom converters |
| React to saves & loads with events / hooks | ✅ Global events | ⚠️ Limited | ⚠️ Limited |
| Add advanced behaviour with one small interface | ✅ Opt-in interfaces | ❌ No equivalent | ⚠️ Extensible APIs |
| Free official serializer add-ons | ⏳ Newtonsoft / Odin (coming) | ⚠️ Community | ❌ JSON only |
| Third-party integrations (Steam, PlayFab, Firebase…) | ⏳ On the roadmap | ⚠️ Some / community | ✅ Firebase, PlayFab, Steam, GPG, Xbox |
| Visual scripting (PlayMaker) | ❌ Under consideration | ✅ PlayMaker actions | ✅ PlayMaker & Bolt |
| Spreadsheet / CSV export | ❌ Not our focus | ✅ Built in | ❌ Not offered |
| **Compatibility & ownership** | | | |
| Full C# source included | ✅ Editable source | ✅ Editable source | ✅ Editable source |
| No mandatory dependencies | ✅ Standalone | ✅ Standalone | ✅ Standalone |
| IL2CPP / AOT ready | ✅ Mono & IL2CPP | ✅ Mono & IL2CPP | ✅ Mono & IL2CPP |
| Human-readable saves (unencrypted) | ✅ Plain JSON | ✅ Plain JSON | ✅ Plain JSON |
| Save to a custom file path | ✅ Configurable | ✅ Configurable | ✅ Configurable |
| **Track record** | | | |
| Years of proven track record | ❌ New release | ✅ Long-established | ✅ Established |
| Actively developed (new features) | ✅ Active | ✅ Frequent updates | ❌ No release since Dec 2024 |
| Big community, tutorials & integrations | ❌ New | ✅ Large ecosystem | ⚠️ Smaller |
| Tested | ✅ 1,300+ automated tests (EditMode & PlayMode) | ✅ Field-proven over years | ⚠️ Platform-tested |
| Thorough documentation | ✅ Full docs | ✅ Full docs | ✅ Docs site |
