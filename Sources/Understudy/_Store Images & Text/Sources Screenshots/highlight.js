// Colours C# inside every <pre class="cs">. What Understudy adds to a test (the Stub, Spy, Fake and Real entry points,
// and the Returns, Do, EachReturns, EachDo and Raise answers) is marked in cardboard. In a <pre class="cs manual">, only
// the text between « and » is marked, so a slide marks what it is about; <pre class="cs plain"> marks nothing.
// A line wrapped in ~~ ~~ is struck out; [[dim]] fades a line.
(function ()
{
  var attributes = /^(SerializeField|Test|TestCase|UnityTest|SetUp|TearDown|OneTimeSetUp|SetUpFixture|assembly)$/;
  var keywords = /^(using|public|private|protected|internal|class|struct|interface|void|return|new|var|if|else|static|readonly|override|this|null|true|false|float|int|string|bool|object|try|catch|throw|out|ref|async|await|foreach|in|namespace|get|set)$/;
  var marks = /^(?:(?:Stub|Spy|Fake|Real)\.[A-Z][A-Za-z]*|\.(?:Returns|Do|EachReturns|EachDo|Raise)\b)/;
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function line(src, mode)
  {
    if (mode === "manual")
      return src.split(/(«[^»]*»)/).map(function (part)
      {
        return (part.charAt(0) === "«") ? '<span class="u">' + tokens(part.slice(1, -1), false) + "</span>" : tokens(part, false);
      }).join("");
    return tokens(src, mode === "auto");
  }
  function tokens(src, mark)
  {
    var out = "", m;
    var re = /((?:Stub|Spy|Fake|Real)\.[A-Z][A-Za-z]*|\.(?:Returns|Do|EachReturns|EachDo|Raise)\b)|(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|(\[[A-Za-z]+)|(\b\d+(?:\.\d+)?f?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([\s\S])/g;
    while ((m = re.exec(src)) !== null)
    {
      if (m[1] && (mark === false))
      {
        // Not marked: colour the type and the member as plain code.
        var plain = m[1];
        if (plain.charAt(0) === ".") out += '.<span class="m">' + plain.slice(1) + "</span>";
        else out += '<span class="t">' + plain.split(".")[0] + '</span>.<span class="m">' + plain.split(".")[1] + "</span>";
        continue;
      }
      if (m[1])
      {
        if (m[1].charAt(0) === ".") out += '.<span class="u">' + esc(m[1].slice(1)) + "</span>";
        else out += '<span class="u">' + esc(m[1]) + "</span>";
      }
      else if (m[2]) out += '<span class="c">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="s">' + esc(m[3]) + "</span>";
      else if (m[4])
      {
        var name = m[4].slice(1);
        if (attributes.test(name)) out += '[<span class="a">' + name + "</span>";
        else if (/^[A-Z]/.test(name)) out += '[<span class="t">' + name + "</span>";
        else out += "[" + esc(name);
      }
      else if (m[5]) out += '<span class="n">' + m[5] + "</span>";
      else if (m[6])
      {
        var w = m[6], call = /^\s*(<[^>()]*>)?\s*\(/.test(src.slice(re.lastIndex));
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
    var mode = pres[i].classList.contains("manual") ? "manual" : (pres[i].classList.contains("plain") ? "plain" : "auto");
    var lines = pres[i].textContent.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    pres[i].innerHTML = lines.map(function (l)
    {
      var dim = false, strike = false;
      if (l.indexOf("[[dim]]") >= 0) { dim = true; l = l.replace("[[dim]]", ""); }
      if (/^\s*~~.*~~\s*$/.test(l)) { strike = true; l = l.replace(/~~/g, ""); }
      var lead = l.match(/^\s*/)[0], text = l.slice(lead.length);
      var body = (strike) ? '<span class="x">' + esc(text) + "</span>" : line(text, mode);
      if (dim) body = '<span class="dim">' + body + "</span>";
      return lead + body;
    }).join("\n");
  }
})();
