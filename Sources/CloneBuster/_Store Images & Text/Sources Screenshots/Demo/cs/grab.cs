// Off-screen grab of the focused/last window of a given title.
UnityEditor.EditorWindow w = null;
foreach (UnityEditor.EditorWindow x in UnityEngine.Resources.FindObjectsOfTypeAll<UnityEditor.EditorWindow>())
    if (x.GetType().Name == "__TYPE__" || x.GetInstanceID().ToString() == "__TYPE__") w = x;
System.Reflection.FieldInfo pf = typeof(UnityEditor.EditorWindow).GetField("m_Parent", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
object host = pf.GetValue(w);
System.Type ht = host.GetType();
ht.GetMethod("RepaintImmediately", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic, null, System.Type.EmptyTypes, null).Invoke(host, null);
UnityEngine.Rect hp = (UnityEngine.Rect)ht.GetProperty("position").GetValue(host);
int wd = (int)(hp.width * UnityEditor.EditorGUIUtility.pixelsPerPoint), hg = (int)(hp.height * UnityEditor.EditorGUIUtility.pixelsPerPoint);
UnityEngine.RenderTexture rt = new UnityEngine.RenderTexture(wd, hg, 0, UnityEngine.RenderTextureFormat.ARGB32, UnityEngine.RenderTextureReadWrite.Linear);
System.Reflection.MethodInfo gp = null;
foreach (System.Reflection.MethodInfo mi in ht.GetMethods(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic))
    if (mi.Name == "GrabPixels") gp = mi;
gp.Invoke(host, new object[] { rt, new UnityEngine.Rect(0, 0, wd, hg) });
UnityEngine.RenderTexture.active = rt;
UnityEngine.Texture2D tex = new UnityEngine.Texture2D(wd, hg, UnityEngine.TextureFormat.RGB24, false);
tex.ReadPixels(new UnityEngine.Rect(0, 0, wd, hg), 0, 0);
tex.Apply();
UnityEngine.RenderTexture.active = null;
System.IO.File.WriteAllBytes(@"__OUT__", UnityEngine.ImageConversion.EncodeToPNG(tex));
return wd + "x" + hg + " " + w.titleContent.text + " ppp=" + UnityEditor.EditorGUIUtility.pixelsPerPoint;
