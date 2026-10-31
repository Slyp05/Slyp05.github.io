using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using CloneBuster.Editor;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

// Field test only: presses the Exporter's real controls and reads back what they show.
public static class Drive
{
    const BindingFlags Any = BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;

    static EditorWindow Win => Resources.FindObjectsOfTypeAll<CloneBusterWindow>().FirstOrDefault() ?? (EditorWindow)EditorWindow.GetWindow<CloneBusterWindow>();
    static object Call(string method, params object[] args) => typeof(CloneBusterWindow).GetMethods(Any).First(m => (m.Name == method) && (m.GetParameters().Length == args.Length)).Invoke(Win, args);
    static object Get(string field) => typeof(CloneBusterWindow).GetField(field, Any).GetValue(Win);

    public static string Rescan()
    {
        Recorder.Rescan();
        return "rescan requested";
    }

    public static string RenderNow(string key, string outPath)
    {
        GameObject g = AssetDatabase.LoadMainAssetAtPath(key) as GameObject;
        string bounds = g.GetComponentInChildren<MeshFilter>().sharedMesh.bounds.size.ToString();
        RgbaImage image = ModelPreview.Render(key);
        System.IO.File.WriteAllBytes(outPath, image.EncodePng());
        return bounds;
    }

    public static string Status()
    {
        CloneBusterSettings s = CloneBusterSettings.Active;
        return $"keys={VaultIndex.Keys().Count} batches={VaultIndex.Batches().Count} running={Recorder.Running} snapshot={Recorder.Snapshotting} offline={Timestamper.Offline} refused={Timestamper.AuthorityRefused} writeError={Recorder.WriteError} stuck={string.Join(",", Recorder.StuckFiles)} owner={s.OwnerName} placeholder={s.OwnerIsPlaceholder} enabled={s.Enabled}";
    }

    public static string Owner(string name)
    {
        SerializedObject o = new(CloneBusterSettings.Active);
        o.FindProperty("owner").stringValue = name;
        o.ApplyModifiedPropertiesWithoutUndo();
        CloneBusterSettings.Save();
        return CloneBusterSettings.Active.OwnerName;
    }

    public static string Authority(string url)
    {
        SerializedObject o = new(CloneBusterSettings.Active);
        o.FindProperty("timestampAuthority").stringValue = url;
        o.ApplyModifiedPropertiesWithoutUndo();
        CloneBusterSettings.Save();
        return CloneBusterSettings.Active.TimestampAuthority;
    }

    public static string Enable(bool on)
    {
        CloneBusterSettings.Active.Enabled = on;
        CloneBusterSettings.Save();
        return Status();
    }

    public static string AddSource(string folder)
    {
        CloneBusterSettings s = CloneBusterSettings.Active;
        s.SourceFolders = new List<string>(s.SourceFolders) { VaultPaths.Normalize(folder) };
        CloneBusterSettings.Save();
        return string.Join(",", s.SourceFolders);
    }

    public static string AddThird(string key)
    {
        CloneBusterSettings s = CloneBusterSettings.Active;
        s.ThirdPartyFolders = new List<string>(s.ThirdPartyFolders) { key };
        CloneBusterSettings.Save();
        return string.Join(",", s.ThirdPartyFolders);
    }

    public static string Versions(string key)
    {
        StringBuilder b = new();
        b.AppendLine(key + " : " + FileStatus.Describe(key).text + " | noReel=" + FileStatus.NoReel(key));
        foreach (VaultVersion v in VaultIndex.Timeline(key))
            b.AppendLine($"  {v.Batch.Name} tsa={v.Batch.AuthorityTime:O} ots={v.Batch.HasOts} btc={v.Batch.BitcoinHeight} file={v.FileHash.Substring(0, 8)} preview={v.PreviewHash?.Substring(0, 8)} note={v.Note}");
        return b.ToString();
    }

    public static string Tab(string name)
    {
        Call("SetTab", Enum.Parse(typeof(CloneBusterWindow.Tab), name));
        return Pane();
    }

    public static string Select(string key)
    {
        Win.Focus();
        Call("Select", key);
        return Pane();
    }

    public static string Tick(string key, bool on)
    {
        IDictionary nodes = (IDictionary)Get("nodes");
        foreach (object node in nodes.Values)
            if ((string)node.GetType().GetProperty("Key").GetValue(node) == key)
            {
                typeof(CloneBusterWindow).GetMethod("SetTicked", Any).Invoke(Win, new[] { node, on, true });
                return Pane();
            }
        return "no node " + key;
    }

    public static string Field(string field, string value)
    {
        typeof(CloneBusterWindow).GetField(field, Any).SetValue(Win, value);
        return value;
    }

    public static string Press(string text)
    {
        List<Button> buttons = Win.rootVisualElement.Query<Button>().ToList().Where(b => (b.text == text) && b.enabledInHierarchy).ToList();
        if (buttons.Count == 0)
            return "NO ENABLED BUTTON '" + text + "'\n" + Pane();

        typeof(Clickable).GetMethod("Invoke", Any, null, new[] { typeof(EventBase) }, null).Invoke(buttons[0].clickable, new object[] { null });
        return Pane();
    }

    public static string SetText(string label, string value)
    {
        TextField f = Win.rootVisualElement.Query<TextField>().ToList().FirstOrDefault(t => t.label == label);
        if (f == null)
            return "NO FIELD " + label;
        f.value = value;
        return Pane();
    }

    public static string Pane()
    {
        StringBuilder b = new();
        foreach (Label l in Win.rootVisualElement.Query<Label>().ToList())
            if ((l.resolvedStyle.display != DisplayStyle.None) && (string.IsNullOrWhiteSpace(l.text) == false) && (IsTreeRow(l) == false))
                b.AppendLine(l.text);
        b.Append("[buttons] ").AppendLine(string.Join(" | ", Win.rootVisualElement.Query<Button>().ToList().Select(x => x.text + (x.enabledInHierarchy ? "" : " (off)"))));
        return b.ToString();
    }

    static bool IsTreeRow(Label l) => (l.GetFirstAncestorOfType<TreeView>() != null);
}
