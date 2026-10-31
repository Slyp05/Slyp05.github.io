// Opens the Exporter at a given size, floating, on a tab, with a file selected (empty for none).
System.Type t = System.Type.GetType("CloneBuster.Editor.CloneBusterWindow, CloneBuster.Editor");
System.Type tab = t.GetNestedType("Tab", System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic);
string key = "__KEY__";
UnityEditor.EditorWindow w;
if (key.Length > 0)
{
    t.GetMethod("Reveal", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic).Invoke(null, new object[] { key, System.Enum.Parse(tab, "__TAB__") });
    w = UnityEditor.EditorWindow.GetWindow(t);
}
else
{
    w = UnityEditor.EditorWindow.GetWindow(t);
    t.GetMethod("SetTab", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic).Invoke(w, new object[] { System.Enum.Parse(tab, "__TAB__") });
}
w.position = new UnityEngine.Rect(80, 80, __W__, __H__);
w.Repaint();
return w.position.ToString();
