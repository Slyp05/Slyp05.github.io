# Store text

Title: `Scry - The Inspector That Understands Your Code`

## Summary

An Inspector that reads your C# code: every field, property and method, live, with the right control, buttons you can undo, and no attributes or custom editors to write.

## Tags

Entered one per tag, in this order:

1. Inspector
2. editor extension
3. custom Inspector
4. button
5. attributes
6. custom editor
7. property drawer
8. undo
9. debug
10. static analysis
11. workflow
12. productivity
13. AI
14. non-serialized
15. Play mode

Swaps: Inspector button, method button, async, coroutine, Roslyn.

## Description

Plain text, pasted as is into the Asset Store description field (it renders no code blocks or markdown).

---

Scry replaces Unity's Inspector with one that reads your C# code, down to the body of every method.

• It shows everything your scripts contain, not only serialized fields, and keeps it live.
• It picks the right control for each value from what your code does with it, so you no longer need attributes such as [Range] or [Min], or a custom editor.
• It turns your methods into buttons you can safely click.
• It points out mistakes before they cost you a Play session or a build.
• It lets you use scripts you didn't write, from a teammate, an asset or an AI, without reading their code first.

And it still looks and works like Unity's Inspector, so there is little to learn.

📜 Everything in Your Script, Live

Unity's Inspector shows only serialized fields. Scry also shows your non-serialized fields, your properties, your methods, and your events with the methods listening to them, in the order you wrote them. Your static members show on request.

All of it stays live, in Edit mode and in Play mode: values and getters update as your game runs, and warnings follow them. Change any value, private ones included, in the middle of Play mode and see what happens, without adding [SerializeField] or a debug menu.

Every value is editable, including types Unity's Inspector can't draw:
• Dictionaries, HashSets, queues and stacks edit like lists.
• A field holding a plain C# class or an interface expands as a foldout. When it's null, pick a concrete type and create the instance right there.
• An empty ScriptableObject field gets a Create button.
• Hover an asset for a larger preview: a sprite, a prefab, an AudioClip's waveform.

The search box in each component's header finds any member, including members of nested objects.

🔮 No Attributes, No Custom Editors

Scry picks each control from what your code does with the value:
• min and max limits on numbers your code clamps or wraps
• dropdowns for values your code compares against a fixed set
• units on numbers, such as seconds
• read-only for fields OnValidate always overwrites
• enum names as labels on arrays indexed by an enum
• strikethrough on fields that have no effect in the current state

Headers, tooltips and separators come from your /// comments, and each #region becomes a foldout.

Where Unity and other packages ask you to add [Range], [ShowInInspector], [Button] or a dropdown attribute, or to write a custom editor, Scry reads the same facts from the code you already wrote.

🛡️ Methods as Buttons

Every method gets a button, so you can call it from the Inspector without a [ContextMenu] or a test script. Scry knows what each method changes before you click:
• A method that changes nothing shows its result live, right in its row, like a property.
• A method that changes only its own object is recorded as a single undo step.
• A method that does something Scry can't undo, such as writing a file, asks first and shows the line that does it.

Hover a method to highlight the fields it reads and writes, and preview the values it would set. With several objects selected, one click runs it on each, as one undo step.

Coroutines and async methods run from their button too, and an async method's result fills in when it finishes. Click again to stop one. An async method that takes a CancellationToken gets one from Scry, cancelled by that second click or by the MonoBehaviour's destroyCancellationToken.

⚠️ Mistakes Shown in the Inspector

Scry flags values your code will fail on:
• a tag that doesn't exist in the project
• a divisor set to 0
• a component your code needs that the GameObject doesn't have
• a reference that doesn't implement the interface your code casts it to

It also flags code that compiles in the Editor but breaks a player build, such as a call to an Editor-only API outside #if UNITY_EDITOR. And it warns about a static field that keeps its value across Play sessions when Domain Reload is disabled.

Each problem shows on its member, with the line of code that causes it and a one-click fix when Scry has one.

🧭 Code You Didn't Write

Use a script from a teammate, an asset or an AI assistant without reading its code first.
Scry shows which values it accepts, flags the ones it would fail on, and tells you what each method changes before you click.

🎛️ Adjust It Visually

Change how Scry handles any member or component from the Inspector itself:
• hide a member, or make it read-only
• group members by kind (serialized fields, properties, methods, statics), and choose which kinds show
• switch a serialized field, or a whole type, back to Unity's default drawing

Your choices change only your own Inspector. To set one for the whole team, copy it as an attribute and paste it into the script.
Project Settings disable any inference or check project-wide, and are committed to your VCS.

🤝 Works With Your Project

Scry uses Unity's own controls and colors, with a few small icons added, and replaces only the default Inspector.
• Types with their own editor, yours ([CustomEditor]), Odin's or another package's, keep it, and so do Unity's own components, such as Transform.
• Property drawers keep working, and so do prefab overrides, multi-object editing and undo.
• Your scripts need no base class, and attributes are optional.
• The code analysis runs in a separate process in the background, so it never blocks the Editor.
• Scry runs only in the Editor: none of it runs in your builds.

📦 Included

• Offline documentation: User Manual and Public API.
• Source code, except the code analysis, which ships compiled.

🔧 Requirements

• Unity 6.0 to 6.6.

Asset uses Roslyn under MIT License; see Third-Party Notices.txt file in package for details.

💬 Support

If you have any questions or feedback, use this [contact form](https://justetools.net/contact/), or [email me](mailto:justetools@gmail.com).
