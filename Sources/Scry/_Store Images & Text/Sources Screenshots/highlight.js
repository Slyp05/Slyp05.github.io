// Colours the C# inside every <pre class="cs">. Inside the source, «text» marks the line a slide is about, ‹text› a read,
// ⟪text⟫ a write and ~~text~~ code struck out; each part is coloured as C# inside its mark.
(function ()
{
  var keywords = /^(using|public|private|protected|internal|class|struct|interface|enum|void|return|new|var|if|else|switch|case|break|static|readonly|override|this|null|true|false|float|int|string|bool|object|try|catch|throw|out|ref|async|await|foreach|for|in|yield|namespace|get|set|event|while)$/;
  var marks = { "«": ["»", "u"], "‹": ["›", "r"], "⟪": ["⟫", "w"], "~~": ["~~", "x"] };

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function tokens(src)
  {
    var out = "", m;
    var re = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\[[A-Za-z.]+)|(\b\d+(?:\.\d+)?f?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([\s\S])/gm;
    while ((m = re.exec(src)) !== null)
    {
      if (m[1])
        out += '<span class="c">' + esc(m[1]) + "</span>";
      else if (m[2])
        out += '<span class="s">' + esc(m[2]) + "</span>";
      else if (m[3])
        out += '[<span class="a">' + esc(m[3].slice(1)) + "</span>";
      else if (m[4])
        out += '<span class="n">' + m[4] + "</span>";
      else if (m[5])
      {
        var word = m[5];
        var next = src.slice(re.lastIndex).match(/^\s*(\(|<)/);
        if (keywords.test(word))
          out += '<span class="k">' + word + "</span>";
        else if (next && (next[1] === "(") && /^[A-Z]/.test(word))
          out += '<span class="m">' + word + "</span>";
        else if (/^[A-Z]/.test(word))
          out += '<span class="t">' + word + "</span>";
        else
          out += word;
      }
      else
        out += esc(m[6]);
    }
    return out;
  }

  function colour(src)
  {
    var out = "", i = 0;
    while (i < src.length)
    {
      var found = null;
      for (var open in marks)
        if (src.startsWith(open, i))
          found = open;
      if (found === null)
      {
        var next = src.length;
        for (var o in marks)
        {
          var at = src.indexOf(o, i);
          if ((at >= 0) && (at < next))
            next = at;
        }
        out += tokens(src.slice(i, next));
        i = next;
        continue;
      }
      var close = marks[found][0];
      var end = src.indexOf(close, i + found.length);
      out += '<span class="' + marks[found][1] + '">' + tokens(src.slice(i + found.length, end)) + "</span>";
      i = end + close.length;
    }
    return out;
  }

  document.querySelectorAll("pre.cs").forEach(function (pre) { pre.innerHTML = colour(pre.textContent); });
})();
