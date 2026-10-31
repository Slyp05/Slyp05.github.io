// Shows the demo vault's batches on the demo dates, in this Editor's memory only: the vault's files keep their real
// proofs. Every batch also reads as anchored in Bitcoin. Run again after a domain reload.
System.Type index = System.Type.GetType("CloneBuster.Editor.VaultIndex, CloneBuster.Editor");
System.Collections.IList batches = (System.Collections.IList)index.GetMethod("Batches").Invoke(null, null);
System.Collections.Generic.List<object> sorted = new System.Collections.Generic.List<object>();
foreach (object b in batches) sorted.Add(b);
sorted.Sort((a, b) => ((System.DateTime)a.GetType().GetProperty("RecordedUtc").GetValue(a)).CompareTo((System.DateTime)b.GetType().GetProperty("RecordedUtc").GetValue(b)));
string[] days = { "2026-03-02 09:14", "2026-03-09 18:40", "2026-03-23 21:05", "2026-04-14 10:32", "2026-05-06 16:58", "2026-06-02 11:21", "2026-06-30 22:47", "2026-08-04 14:09", "2026-09-15 19:36", "2026-10-20 15:12" };
string log = "";
for (int i = 0; i < sorted.Count; i++)
{
    object b = sorted[i];
    System.DateTime local = System.DateTime.ParseExact(days[System.Math.Min(i, days.Length - 1)], "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture).AddMinutes(System.Math.Max(0, i - days.Length + 1) * 3);
    b.GetType().GetProperty("AuthorityTime").SetValue(b, (System.DateTime?)System.DateTime.SpecifyKind(local, System.DateTimeKind.Local).ToUniversalTime());
    b.GetType().GetProperty("HasOts").SetValue(b, true);
    b.GetType().GetProperty("BitcoinHeight").SetValue(b, 939000 + i * 4100);
    log += local.ToString("d MMM") + " ";
}
index.GetMethod("Touch").Invoke(null, null);
UnityEditorInternal.InternalEditorUtility.RepaintAllViews();
return sorted.Count + " batches: " + log;
