<#
  Build-ScryDocs.ps1

  Regenerates the published Scry docs under docs/scry/
  from the authored source under "Sources/Scry/Documentation".

  The source is a flat set of HTML pages: two home pages ("User Manual.html" and
  "Public API.html"), a pages/ folder holding the manual's content, img/, and shared/ scripts.

  The website splits that folder into one clean-URL tree per book:

      docs/scry/user-manual/  (index.html + pages/ + img/ + shared/)
      docs/scry/public-api/   (index.html             + shared/)

  Transform applied to every page:
    - stylesheet  shared/styles.css   -> /assets/css/scry.css
                  (+ the favicon <link>s, the dark-mode sheet and the goatcounter
                   analytics <script> the site injects, which the offline source
                   docs must not have)
    - home links  each book's home    -> that book's index.html, reached across trees
                  when the link comes from the other book
    - cross-tree  pages/X.html written from the API home -> ../user-manual/pages/X.html
    - images      img/<name>          -> img/<name>.png

  The shared JS is copied into each tree's shared/ folder:
    - nav.js           home file = index.html, the API reference detected by its
                       /public-api/ path instead of by page name, and the two-book bar
                       pointed at site-absolute URLs
    - search-index.js  page paths rewritten to be relative to each tree, so a search
                       hit for the other book points across correctly

  styles.css is published whole as docs/assets/css/scry.css, and the pages load it alone.
  Each package carries its own copy of the shared doc sheet, so the site serves the copy
  the offline docs ship with, not docs/assets/css/doc-styles.css (Persistent Asset's copy).

  Every rewrite is asserted, and the generated trees are link-checked at the end, so a
  reformatted source fails loudly instead of emitting a silently broken site.

  Re-run this after editing the source docs, then commit docs/.
#>

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM

$root   = Split-Path $PSScriptRoot -Parent
$src    = Join-Path $root 'Sources\Scry\Documentation'
$dst    = Join-Path $root 'docs\scry'
$scCss  = Join-Path $root 'docs\assets\css\scry.css'

if (-not (Test-Path $src)) { throw "Source docs not found: $src" }

$BOOKS = @(
    @{ key = 'manual'; home = 'User Manual.html'; dir = 'user-manual' }
    @{ key = 'api';    home = 'Public API.html';  dir = 'public-api' }
)
$dirOf = @{}
foreach ($b in $BOOKS) { $dirOf[$b.key] = $b.dir }

$analytics = '  <script data-goatcounter="https://justetools.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

# Web-only additions, absolute-pathed because the pages sit at several depths. Not in the
# source docs: those ship inside the Unity package and are opened from disk, where a
# site-absolute /assets/... path resolves to nothing. doc-dark.css loads after the package
# sheet to win on source order.
$head = @(
    '<link rel="stylesheet" href="/assets/css/scry.css" />'
    '  <link rel="stylesheet" href="/assets/css/doc-dark.css" />'
    '  <script>(function(){try{var t=localStorage.getItem(''theme'');if(t===''dark''||t===''light''){document.documentElement.setAttribute(''data-theme'',t);}}catch(e){}})();</script>'
    '  <script src="/assets/js/theme.js" defer></script>'
    '  <script src="/assets/js/doc-nav.js" defer></script>'
    '  <link rel="icon" type="image/png" sizes="96x96" href="/assets/images/favicon-96x96.png" />'
    '  <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />'
    '  <link rel="shortcut icon" href="/assets/images/favicon.ico" />'
    '  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png" />'
    $analytics
) -join "`n"

function Read-Text([string]$p)  { return [IO.File]::ReadAllText($p) }
function Write-Text([string]$p, [string]$t) {
    $dir = Split-Path $p -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [IO.File]::WriteAllText($p, $t, $utf8)
}

function Replace-Assert([string]$text, [string]$pattern, [string]$replacement, [string]$what) {
    $new = $text -replace $pattern, $replacement
    if ($new -ceq $text) { throw "'$what' pattern did not match; source format changed, update Build-ScryDocs.ps1." }
    return $new
}

# Every source image, as <name without extension> -> <file on disk>. The source keeps them
# extensionless so the Unity package does not import them as textures; the site serves
# them as .png, which is what the bytes are.
$imgFiles = @{}
Get-ChildItem (Join-Path $src 'img') -File | Where-Object { $_.Extension -ne '.meta' } | ForEach-Object {
    $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($imgFiles.ContainsKey($name)) {
        throw "Two source images share the name '$name' ($($imgFiles[$name].Name) and $($_.Name)); the site serves one .png per name."
    }
    if ($_.Length -gt 0) {
        $bytes = [byte[]]::new(4)
        $fs = [IO.File]::OpenRead($_.FullName)
        try { [void]$fs.Read($bytes, 0, 4) } finally { $fs.Dispose() }
        if (($bytes[0] -ne 0x89) -or ($bytes[1] -ne 0x50) -or ($bytes[2] -ne 0x4E) -or ($bytes[3] -ne 0x47)) {
            throw "img/$($_.Name) is not a PNG. The site serves every image as <name>.png; update Build-ScryDocs.ps1 to carry the real format."
        }
    }
    $imgFiles[$name] = $_
}

# $location is 'home' (tree root) or 'page' (inside pages/).
function Convert-HomeLinks([string]$text, [string]$tree, [string]$location) {
    if ($location -eq 'home') { $here = 'index.html'; $upTo = '../' }
    else                      { $here = '../index.html'; $upTo = '../../' }
    foreach ($book in $BOOKS) {
        if ($book.key -eq $tree) { $to = $here } else { $to = $upTo + $book.dir + '/index.html' }
        foreach ($variant in @($book.home, ($book.home -replace ' ', '%20'))) {
            foreach ($from in @($variant, ('../' + $variant))) {
                $text = [regex]::Replace($text, '(?<=href=")' + [regex]::Escape($from) + '(?=["#?])', $to)
            }
            if ($text -match '(?<=href=")(\.\./)?' + [regex]::Escape($variant) + '(?=["#?])') {
                throw "A link to '$($book.home)' survived rewriting in a '$tree' page; update Build-ScryDocs.ps1."
            }
        }
    }
    return $text
}

# Every content page belongs to the manual, so only the API home links across into pages/.
function Convert-CrossTreeLinks([string]$text, [string]$tree) {
    if ($tree -ne 'api') { return $text }
    return [regex]::Replace($text, '(?<=href=")pages/', '../user-manual/pages/')
}

function Convert-Images([string]$text, [string]$tree) {
    if ($tree -eq 'api') {
        if ($text -match 'src="(?:\.\./)?img/') { throw "The API page references an image; the public-api tree has no img/ folder. Update Build-ScryDocs.ps1." }
        return $text
    }
    foreach ($from in @('../img/', 'img/')) {
        $text = [regex]::Replace($text, '(?<=src=")' + [regex]::Escape($from) + '([A-Za-z0-9_-]+)(?=")', ($from + '$1.png'))
    }
    return $text
}

function Convert-Html([string]$text, [string]$tree, [string]$location) {
    $before = $text
    $text = $text -replace '<link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', $head
    if ($text -ceq $before) { throw "No shared/styles.css link to rewrite in a '$tree' page; update Build-ScryDocs.ps1." }

    $text = Convert-HomeLinks      $text $tree $location
    $text = Convert-CrossTreeLinks $text $tree
    $text = Convert-Images         $text $tree
    return $text
}

# --- clean the regenerated trees ---
foreach ($book in $BOOKS) {
    $d = Join-Path $dst $book.dir
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
}

# --- home pages ---
foreach ($book in $BOOKS) {
    Write-Text (Join-Path $dst ($book.dir + '\index.html')) `
               (Convert-Html (Read-Text (Join-Path $src $book.home)) $book.key 'home')
}

# --- content pages: all in the manual ---
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    Write-Text (Join-Path $dst ('user-manual\pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) 'manual' 'page')
}

# --- images ---
$imgDir = Join-Path $dst 'user-manual\img'
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
foreach ($name in $imgFiles.Keys) {
    Copy-Item $imgFiles[$name].FullName (Join-Path $imgDir ($name + '.png')) -Force
}

# --- shared nav.js ---
$nav = Read-Text (Join-Path $src 'shared\nav.js')
$nav = Replace-Assert $nav 'file: "User Manual\.html"' 'file: "index.html"' 'manual home entry'
# A book's home is served as a directory URL, so the last path segment is empty where the
# source reads a file name. Without this the sidebar never marks the home page as current.
$nav = Replace-Assert $nav '(?m)^\s*var current = .*$' '  var current = path.split("/").pop() || "index.html";' 'current page name'
# On the site both homes are index.html, so which book a page is in is a path question.
$nav = Replace-Assert $nav '(?m)^\s*var isApiPage = .*$' '  var isApiPage = (path.indexOf("/public-api/") >= 0);' 'isApiPage detection'
# The bar's links are the one place a page addresses the other tree, so they become
# site-absolute rather than relative to whichever depth the page sits at.
foreach ($book in $BOOKS) {
    $nav = Replace-Assert $nav ('\["' + [regex]::Escape($book.home) + '", ') ('["/scry/' + $book.dir + '/", ') "BOOKS entry for $($book.home)"
}
$nav = Replace-Assert $nav 'hrefOf\(BOOKS\[k\]\[0\]\)' 'BOOKS[k][0]' 'book bar href'
foreach ($book in $BOOKS) {
    Write-Text (Join-Path $dst ($book.dir + '\shared\nav.js')) $nav
}

# --- shared search-index.js: rewrite each entry's page path per tree ---
function Rewrite-P([string]$p, [string]$tree) {
    if ($p -eq 'Public API.html')  { $of = 'api' } else { $of = 'manual' }
    $isHome = ($p -eq 'Public API.html') -or ($p -eq 'User Manual.html')
    if ($of -eq $tree) {
        if ($isHome) { return 'index.html' }
        return $p
    }
    if ($isHome) { return '../' + $dirOf[$of] + '/index.html' }
    return '../' + $dirOf[$of] + '/' + $p
}
$idxLines = [IO.File]::ReadAllLines((Join-Path $src 'shared\search-index.js'))
foreach ($book in $BOOKS) {
    $out = New-Object System.Collections.Generic.List[string]
    $hits = 0
    foreach ($line in $idxLines) {
        $m = [regex]::Match($line, '^\{p:"([^"]*)"')
        if ($m.Success) {
            $line = '{p:"' + (Rewrite-P $m.Groups[1].Value $book.key) + '"' + $line.Substring($m.Length)
            $hits++
        }
        $out.Add($line)
    }
    if ($hits -eq 0) { throw "search-index.js: no {p:""..."" entries found; update Build-ScryDocs.ps1." }
    Write-Text (Join-Path $dst ($book.dir + '\shared\search-index.js')) ($out -join "`n")
}

# --- stylesheet: the package's own sheet, whole ---
$styles = (Read-Text (Join-Path $src 'shared\styles.css')) -replace "`r`n", "`n"
$banner = "/* Generated by Tools/Build-ScryDocs.ps1 from Sources/Scry/Documentation/shared/styles.css.`n   The only stylesheet of the Scry doc pages. Edit the source, not this file. */`n`n"
Write-Text $scCss ($banner + $styles)

# --- link check: every local href and src in the generated trees has to resolve ---
$broken = New-Object System.Collections.Generic.List[string]
Get-ChildItem $dst -Recurse -Filter *.html | ForEach-Object {
    $page = $_
    $here = $page.DirectoryName
    foreach ($m in [regex]::Matches((Read-Text $page.FullName), '(?:href|src)="([^"]+)"')) {
        $target = $m.Groups[1].Value
        if ($target -match '^(https?:|mailto:|#|/)') { continue }
        $target = ($target -split '[#?]')[0]
        if ($target -eq '') { continue }
        $path = Join-Path $here ([Uri]::UnescapeDataString($target) -replace '/', '\')
        if (-not (Test-Path $path)) {
            $broken.Add(($page.FullName.Substring($dst.Length + 1)) + ' -> ' + $m.Groups[1].Value)
        }
    }
}
if ($broken.Count -gt 0) {
    throw ("Generated pages point at files that do not exist:`n  " + ($broken -join "`n  "))
}

Write-Host "Done. Regenerated user-manual, public-api and scry.css."
