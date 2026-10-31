// Selects an asset so the Inspector shows it.
UnityEditor.Selection.activeObject = UnityEditor.AssetDatabase.LoadMainAssetAtPath("__KEY__");
UnityEditor.ActiveEditorTracker.sharedTracker.ForceRebuild();
foreach (UnityEditor.EditorWindow w in UnityEngine.Resources.FindObjectsOfTypeAll<UnityEditor.EditorWindow>())
    if (w.GetType().Name == "InspectorWindow") { w.GetType().GetMethod("RebuildContentsContainers", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public)?.Invoke(w, null); w.Repaint(); return UnityEditor.Selection.activeObject + " " + w.position; }
return "no inspector";
