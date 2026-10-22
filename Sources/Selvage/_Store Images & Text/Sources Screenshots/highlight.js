// Colours C# inside every <pre class="cs">. A line holding [[hl]] is highlighted, and a line wrapped in ~~ ~~ is struck out.
(function ()
{
  var attributes = /^(Inject|DontInject|Provide|Preference|Channel|DynamicChannel|SerializeField|Serializable|ExecuteAlways|OnePerList)$/;
  var keywords = /^(using|public|private|protected|internal|class|interface|struct|void|return|new|var|if|else|foreach|in|await|async|yield|static|readonly|sealed|override|this|null|true|false|float|int|string|bool|object|typeof|namespace|get|set)$/;
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function line(src)
  {
    var out = "", m;
    var re = /(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|(\[[A-Z][A-Za-z]*)|(\b\d+(?:\.\d+)?f?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([\s\S])/g;
    while ((m = re.exec(src)) !== null)
    {
      if (m[1]) out += '<span class="c">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="s">' + esc(m[2]) + "</span>";
      else if (m[3]) out += "[" + '<span class="a">' + esc(m[3].slice(1)) + "</span>";
      else if (m[4]) out += '<span class="n">' + m[4] + "</span>";
      else if (m[5])
      {
        var w = m[5], call = /^\s*(<[^>]*>)?\s*\(/.test(src.slice(re.lastIndex));
        var prev = src.slice(0, m.index).replace(/\s+$/, "");
        if (attributes.test(w) && /[\[,]$/.test(prev)) out += '<span class="a">' + w + "</span>";
        else if (keywords.test(w)) out += '<span class="k">' + w + "</span>";
        else if (call) out += '<span class="m">' + w + "</span>";
        else if (/^[A-Z]/.test(w)) out += '<span class="t">' + w + "</span>";
        else out += esc(w);
      }
      else out += esc(m[6]);
    }
    return out;
  }
  var pres = document.querySelectorAll("pre.cs");
  for (var i = 0; i < pres.length; i++)
  {
    var lines = pres[i].textContent.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    pres[i].innerHTML = lines.map(function (l)
    {
      var hl = false, strike = false;
      if (l.indexOf("[[hl]]") >= 0) { hl = true; l = l.replace("[[hl]]", ""); }
      if (/^\s*~~.*~~\s*$/.test(l)) { strike = true; l = l.replace(/~~/g, ""); }
      var lead = l.match(/^\s*/)[0], text = l.slice(lead.length);
      var body = (strike) ? '<span class="x">' + esc(text) + "</span>" : line(text);
      if (hl) body = '<span class="hl">' + body + "</span>";
      return lead + body;
    }).join("\n");
  }
})();
