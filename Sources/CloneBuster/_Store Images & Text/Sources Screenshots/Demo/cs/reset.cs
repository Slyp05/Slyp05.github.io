// Clears the Exporter's saved choices and closes it, so it reopens as on its first day.
System.Type t = System.Type.GetType("CloneBuster.Editor.CloneBusterWindow, CloneBuster.Editor");
foreach (UnityEngine.Object w in UnityEngine.Resources.FindObjectsOfTypeAll(t))
    ((UnityEditor.EditorWindow)w).Close();
UnityEditor.EditorUserSettings.SetConfigValue("CloneBuster.Exporter", null);
UnityEditor.EditorUserSettings.SetConfigValue("CloneBuster.WelcomeDismissed", null);
return "reset";
