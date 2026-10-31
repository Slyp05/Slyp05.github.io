string s = "compiling=" + UnityEditor.EditorApplication.isCompiling + " updating=" + UnityEditor.EditorApplication.isUpdating + " ppp=" + UnityEditor.EditorGUIUtility.pixelsPerPoint;
foreach (UnityEditor.EditorWindow w in UnityEngine.Resources.FindObjectsOfTypeAll<UnityEditor.EditorWindow>())
    s += " | " + w.GetType().Name;
foreach (UnityEditor.Progress.Item p in UnityEditor.Progress.EnumerateItems())
    s += " || " + p.name + " " + p.description + " " + p.progress + " " + p.status;
System.Type index = System.Type.GetType("CloneBuster.Editor.VaultIndex, CloneBuster.Editor");
if (index != null) s += " || batches=" + ((System.Collections.IList)index.GetMethod("Batches").Invoke(null, null)).Count;
return s;
