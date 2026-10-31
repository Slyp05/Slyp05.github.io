// Opens Project Settings on the CloneBuster page at a given size.
UnityEditor.EditorWindow w = UnityEditor.SettingsService.OpenProjectSettings("Project/CloneBuster");
w.position = new UnityEngine.Rect(100, 100, __W__, __H__);
w.Repaint();
return w.GetType().Name + " " + w.position;
