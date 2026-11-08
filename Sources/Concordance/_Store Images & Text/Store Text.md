# Store text

Title: `Concordance - Coordinate Scripts Sharing Values`

## Summary

Coordinate every script that writes the same value: changes combine instead of overwriting, any field or property becomes a change event, and every write is tracked.

## Tags

Entered one per tag, in this order:

1. modifiers
2. stat modifiers
3. buffs
4. debuffs
5. time scale
6. pause
7. slow motion
8. change events
9. observer
10. property changed
11. debugging
12. overwrite
13. code architecture
14. AI coding
15. metaprogramming

Swaps: IL weaving, value tracking, decoupling, Roslyn analyzer.

## Description

Plain text, pasted as is into the Asset Store description field (it renders no code blocks or markdown).

---

Concordance lets several scripts change the same field or property without breaking each other, your own and Unity's alike, and shows you every script that writes it.

It's metaprogramming: Concordance rewrites your scripts after Unity compiles them, so a line you mark becomes a change that combines with the others. Your source files stay as you wrote them, and a line it can't rewrite is reported in your code editor as you type, with how to fix it.

💥 The Bug Every Project Has

Each script is correct on its own, and breaks when another one writes the same value:

• Slow motion ends and restores the time scale it cached, unpausing the game under the pause menu.
• A stun ends and re-enables movement in the middle of a cutscene.
• An effect's object is destroyed halfway, and the value it changed stays stuck forever.

These bugs only show up when two systems overlap, and the line at fault is in a different script from the one that looks broken.

🔍 Who Changed It?

The Concordance window lists every write to a value, found in your code, with a link to each line.

During Play, it flags two scripts overwriting each other as it happens, with the line of each. It also shows the value, what it was before any change, and every active change in order, with a history of who changed it, when and from which line.

🎼 What Should the Value Be?

Each script layers its change on the value instead of overwriting it, by marking the assignment it already has: the line stays the same, plus one "keyword".

Changes apply in an order you set per value, like Script Execution Order, and each one ends with the object that made it.

👂 When Did It Change?

Run code each time a field or property changes, including values Unity raises no event for, such as the time scale.

Handlers end with the object that registered them, so a forgotten unsubscribe never keeps a destroyed object alive.

🪜 Adopt It One Line at a Time

Concordance needs no new value types and no rewrite. Code that doesn't know about it keeps working: a regular assignment still sets the value, and every change applies on top of it.

Convert the one line that causes trouble today, and the rest of your project stays as it is.

🤖 Ready for AI-Assisted Coding

Concordance needs no AI and works the same without it, but if an AI assistant writes some of your scripts:

• Each script states its own change, so a script written without seeing the rest of your project still combines with it.
• Mistakes in Concordance code are reported at compile time, each message saying how to fix it, in the output an assistant reads.
• The Concordance window shows every script that writes a value, so you can review what generated code changes, beyond its diff.
• A change is one keyword on an existing line: a small edit to make, and a one-line revert.
• A change ends with the object that made it, so there is no cleanup for the assistant to forget.

🎮 It Follows What Unity Writes

Animation, physics and UI change values on their own every frame, and Concordance layers on top of them.

Changes apply on top of what an Animator, a Timeline or a UI control writes, frame after frame. Values the physics engine builds on, such as velocities, are refused at compile time, with what to change instead.

Exiting Play mode removes every change and puts each value back as it was, so your ScriptableObject assets keep their values.

💡 Where It Helps

Any value more than one system wants a say in, such as:

• Time scale: pause, slow motion, hit stops, bullet time.
• Movement: speed boosts, slows, caps and locks.
• Physics: gravity zones, drag, mass changes.
• Camera: field of view for zoom, sprint and aim.
• Audio: volume ducking for dialogue, menus and cutscenes.
• UI: buttons disabled by several conditions at once.

⭐ More Features

• Inspector functions: choose what a change does in the Inspector, such as multiply, clamp or blend, and tune it in Play mode.
• Mute: leave one change out in the Editor to see the value without it.
• Watch any value: follow its writes and history, for this session or always.
• Inspector section: see at a glance which fields and properties of an object have changes, and which need a look.
• Problems listed for you: every value whose order is left undecided, or with a write that can be fixed, each saying how to fix it.
• Setter methods too: SetActive works like any property, and your own getter and setter pairs can join it.
• Regular syntax: write a change as a method call instead, with options such as the object it ends with.
• Advanced API: stop, list or release the changes of any object, such as a pooled one.
• Test Runner support: changes work in Edit mode tests, and are cleaned up after each test.

🛠️ Under the Hood

• Compiled in: no reflection, and no link.xml under IL2CPP.
• Deterministic: the same changes always give the same value, whichever script ran first, with the order set in code or in the Concordance window.
• Pay for what you use: in a build, a value nothing changes or listens to costs nothing extra, on write or per frame, and updating a change allocates nothing.
• Any field or property: static or instance, in generic classes too.
• Packages and DLLs: their writes keep working, and your changes apply on top of them.
• Code analysis: mistakes reported in your IDE as you type, each saying how to fix it.
• Universal: Every Unity 6 build target, Mono and IL2CPP, with Enter Play Mode without Domain Reload.
• Tested: on every Unity version from 6.0 to 6.6, with over 650 automated tests.

📦 Included

• Full documentation: Quick Usage Guide, User Manual and API reference.
• A playable demo: the same level of overlapping gravity zones, written once with regular assignments and once with Concordance.
• Source code.

🔧 Requirements

• Unity 6.0 or newer.
• Unity's Mono Cecil package, added with the import.

💬 Support

If you have any questions or feedback, use this [contact form](https://justetools.net/contact/), or [email me](mailto:justetools@gmail.com).
