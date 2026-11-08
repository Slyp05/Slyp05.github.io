// Colours C# inside every <pre class="cs">. What Concordance adds to a line ((Modifier), Modifier.Stop, [ModifierPhase.X],
// and the Modify and Observe calls) is marked in the card's ink. In a <pre class="cs manual">, only the text between « and »
// is marked, so a slide marks what it is about. A line wrapped in ~~ ~~ is struck out; [[dim]] fades a line.
(function ()
{
  var attributes = /^(SerializeField|SerializeReference|Serializable)$/;
  var keywords = /^(using|public|private|protected|internal|class|struct|void|return|new|var|if|else|static|readonly|override|this|null|true|false|float|int|string|bool)$/;
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function line(src, manual)
  {
    if (manual)
      return src.split(/(«[^»]*»)/).map(function (part)
      {
        return (part.charAt(0) === "«") ? '<span class="cc">' + plain(part.slice(1, -1)) + "</span>" : plain(part);
      }).join("");
    return tokens(src, true);
  }
  function plain(src) { return tokens(src, false); }
  function tokens(src, mark)
  {
    var out = "", m;
    var re = /(\(Modifier\)|Modifier\.Stop|\[ModifierPhase\.[A-Za-z]+\]|\.(?:Modify|StopModifying|Observe|StopObserving)\b)|(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|(\[[A-Z][A-Za-z]*)|(\b\d+(?:\.\d+)?f?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([\s\S])/g;
    while ((m = re.exec(src)) !== null)
    {
      if (m[1] && mark === false) m = [m[0], null, null, null, null, null, null, m[1]];
      if (m[1])
      {
        if (m[1].charAt(0) === ".") out += '.<span class="cc">' + esc(m[1].slice(1)) + "</span>";
        else out += '<span class="cc">' + esc(m[1]) + "</span>";
      }
      else if (m[2]) out += '<span class="c">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="s">' + esc(m[3]) + "</span>";
      else if (m[4])
      {
        var name = m[4].slice(1);
        out += (attributes.test(name)) ? '[<span class="a">' + name + "</span>" : "[" + '<span class="t">' + name + "</span>";
      }
      else if (m[5]) out += '<span class="n">' + m[5] + "</span>";
      else if (m[6])
      {
        var w = m[6], call = /^\s*(<[^>]*>)?\s*\(/.test(src.slice(re.lastIndex));
        if (keywords.test(w)) out += '<span class="k">' + w + "</span>";
        else if (call) out += '<span class="m">' + w + "</span>";
        else if (/^[A-Z]/.test(w)) out += '<span class="t">' + w + "</span>";
        else out += esc(w);
      }
      else out += esc(m[7]);
    }
    return out;
  }
  var pres = document.querySelectorAll("pre.cs");
  for (var i = 0; i < pres.length; i++)
  {
    var manual = pres[i].classList.contains("manual");
    var lines = pres[i].textContent.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    pres[i].innerHTML = lines.map(function (l)
    {
      var dim = false, strike = false;
      if (l.indexOf("[[dim]]") >= 0) { dim = true; l = l.replace("[[dim]]", ""); }
      if (/^\s*~~.*~~\s*$/.test(l)) { strike = true; l = l.replace(/~~/g, ""); }
      var lead = l.match(/^\s*/)[0], text = l.slice(lead.length);
      var body = (strike) ? '<span class="x">' + esc(text) + "</span>" : line(text, manual);
      if (dim) body = '<span class="dim">' + body + "</span>";
      return lead + body;
    }).join("\n");
  }
})();
