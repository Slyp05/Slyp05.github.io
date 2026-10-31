// A floating Inspector at a given size, showing one asset; its instance id is returned for shot.sh.
System.Type t = typeof(UnityEditor.Editor).Assembly.GetType("UnityEditor.InspectorWindow");
UnityEditor.Selection.activeObject = UnityEditor.AssetDatabase.LoadMainAssetAtPath("__KEY__");
UnityEditor.EditorWindow w = null;
foreach (UnityEditor.EditorWindow x in UnityEngine.Resources.FindObjectsOfTypeAll(t))
    if (x.titleContent.text == "Inspector" && x.position.width == __W__) w = x;
if (w == null)
{
    w = (UnityEditor.EditorWindow)UnityEngine.ScriptableObject.CreateInstance(t);
    w.Show();
}
w.position = new UnityEngine.Rect(200, 200, __W__, __H__);
UnityEditor.ActiveEditorTracker.sharedTracker.ForceRebuild();
t.GetMethod("RebuildContentsContainers", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public)?.Invoke(w, null);
w.Repaint();
return w.GetInstanceID().ToString();
