<#
  Build-PersistentAssetDocs.ps1

  Regenerates the published Persistent Asset docs under docs/persistent-asset/
  from the authored source under "Sources/Persistent Asset/Documentation".

  The source is a flat set of HTML pages: three home pages ("Quick Usage Guide.html",
  "User Manual.html", "Public API.html"), one shared pages/ folder holding the content
  of the manual and of the API reference, img/, and shared/ scripts.

  The website splits that flat folder into one clean-URL tree per book:

      docs/persistent-asset/quick-usage-guide/  (index.html + shared/)
      docs/persistent-asset/user-manual/        (index.html + pages/ + img/ + shared/)
      docs/persistent-asset/public-api/         (index.html + pages/       + shared/)

  Transform applied to every page:
    - stylesheet  shared/styles.css        -> /assets/css/doc-styles.css
                  (+ the favicon <link>s, the dark-mode sheet and the goatcounter
                   analytics <script> the site injects, which the offline source
                   docs must not have)
    - home links  each book's home page    -> that book's index.html, reached across
                  trees when the link comes from another book
    - images      img/<name>               -> <name>.png, under user-manual/img/ for
                  every book (the guide reaches them across trees)
    - cross-tree  Serializers.html         -> ../../user-manual/pages/Serializers.html
                  links between books, which the flat source writes as plain siblings,
                  get an explicit path to the other tree.

  The shared JS is copied into each tree's shared/ folder:
    - nav.js           lightly adapted (home file = index.html, the API reference and
                       the standalone guide detected by their /public-api/ and
                       /quick-usage-guide/ paths instead of by page name, and the
                       three-book bar pointed at site-absolute URLs)
    - search-index.js  page paths rewritten to be relative to each tree, so a search
                       hit for another book points across correctly. The guide draws
                       no search box, so it gets no index.

  styles.css is copied to the shared, cross-product docs/assets/css/doc-styles.css.

  Every rewrite is asserted, and the generated trees are link-checked at the end, so a
  reformatted source fails loudly instead of emitting a silently broken site.

  Re-run this after editing the source docs, then commit docs/.
#>

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM

$root = Split-Path $PSScriptRoot -Parent
$src  = Join-Path $root 'Sources\Persistent Asset\Documentation'
$dst  = Join-Path $root 'docs\persistent-asset'
$css  = Join-Path $root 'docs\assets\css\doc-styles.css'

if (-not (Test-Path $src)) { throw "Source docs not found: $src" }

# One entry per book: the source home page, the folder it becomes on the site, and the
# key the page-level code uses for it.
$BOOKS = @(
    @{ key = 'guide';  home = 'Quick Usage Guide.html'; dir = 'quick-usage-guide' }
    @{ key = 'manual'; home = 'User Manual.html';       dir = 'user-manual' }
    @{ key = 'api';    home = 'Public API.html';        dir = 'public-api' }
)
$dirOf = @{}
foreach ($b in $BOOKS) { $dirOf[$b.key] = $b.dir }

$analytics = '  <script data-goatcounter="https://justetools.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

# These standalone doc pages are outside Jekyll, so they never get _includes/custom-head.html.
# Inject the same favicon set here, absolute-pathed because the pages sit at several depths.
# Deliberately NOT added to the source docs: those ship inside the Unity package and are
# opened from disk, where a site-absolute /assets/... path would not resolve.
# Dark mode is web-only for the same reason as the favicons: the source docs ship
# inside the Unity package and are opened from disk, where /assets/... resolves to
# nothing. doc-dark.css must load AFTER doc-styles.css to win on source order.
$theme = @(
    '  <link rel="stylesheet" href="/assets/css/doc-dark.css" />'
    '  <script>(function(){try{var t=localStorage.getItem(''theme'');if(t===''dark''||t===''light''){document.documentElement.setAttribute(''data-theme'',t);}}catch(e){}})();</script>'
    '  <script src="/assets/js/theme.js" defer></script>'
    '  <script src="/assets/js/doc-nav.js" defer></script>'
) -join "`n"

$favicons = @(
    '  <link rel="icon" type="image/png" sizes="96x96" href="/assets/images/favicon-96x96.png" />'
    '  <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />'
    '  <link rel="shortcut icon" href="/assets/images/favicon.ico" />'
    '  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png" />'
) -join "`n"

function Read-Text([string]$p)  { return [IO.File]::ReadAllText($p) }
function Write-Text([string]$p, [string]$t) {
    $dir = Split-Path $p -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [IO.File]::WriteAllText($p, $t, $utf8)
}

# Map every source page to the book it will land in. The flat source folder lets a
# page link to any other as a plain sibling ("Serializers.html"); once split across the
# three trees those sibling links are only valid within one book, so links pointing at
# another book need an explicit path.
$pageTree = @{}
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    if ($_.Name -like 'API - *') { $pageTree[$_.Name] = 'api' } else { $pageTree[$_.Name] = 'manual' }
}

# Every image the site serves, as <source name without extension> -> <file on disk>. The
# source keeps them extensionless (so the Unity package does not import them as textures)
# or named .jpg; the site serves them all as .png, which is what the bytes are.
$imgFiles = @{}
Get-ChildItem (Join-Path $src 'img') -File | Where-Object { $_.Extension -ne '.meta' } | ForEach-Object {
    $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($imgFiles.ContainsKey($name)) {
        throw "Two source images share the name '$name' ($($imgFiles[$name].Name) and $($_.Name)); the site serves one .png per name."
    }
    # A placeholder waiting for its screenshot is empty on purpose; anything else has to be
    # a PNG, because that is the extension the pages are rewritten to point at.
    if ($_.Length -gt 0) {
        $head = [byte[]]::new(4)
        $fs = [IO.File]::OpenRead($_.FullName)
        try { [void]$fs.Read($head, 0, 4) } finally { $fs.Dispose() }
        if (($head[0] -ne 0x89) -or ($head[1] -ne 0x50) -or ($head[2] -ne 0x4E) -or ($head[3] -ne 0x47)) {
            throw "img/$($_.Name) is not a PNG. The site serves every image as <name>.png; update Build-PersistentAssetDocs.ps1 to carry the real format."
        }
    }
    $imgFiles[$name] = $_
}

# $location is 'home' (tree root: links read "pages/Name.html") or 'page' (inside
# pages/: links read "Name.html"). Same-book links are left exactly as authored.
function Convert-CrossTreeLinks([string]$text, [string]$tree, [string]$location) {
    if ($location -eq 'home') { $upTo = '../' } else { $upTo = '../../' }
    foreach ($name in @($pageTree.Keys)) {
        if ($pageTree[$name] -eq $tree) { continue }
        $dir = $dirOf[$pageTree[$name]]
        foreach ($variant in @($name, ($name -replace ' ', '%20'))) {
            if ($location -eq 'home') { $from = 'pages/' + $variant } else { $from = $variant }
            $to = $upTo + $dir + '/pages/' + $variant
            # The lookbehind anchors the match to the start of the href, so a path
            # already rewritten in an earlier pass cannot match again.
            $text = [regex]::Replace($text, '(?<=href=")' + [regex]::Escape($from) + '(?=["#?])', $to)
            if ($text -match '(?<=href=")' + [regex]::Escape($from) + '(?=["#?])') {
                throw "Cross-tree link to '$name' survived rewriting in a '$tree' page; update Build-PersistentAssetDocs.ps1."
            }
        }
    }
    return $text
}

# The three home pages all become index.html, each in its own tree. A link to the home of
# the book you are already in is a plain index.html; a link to another book's home crosses
# into that tree.
function Convert-HomeLinks([string]$text, [string]$tree, [string]$location) {
    if ($location -eq 'home') { $here = 'index.html'; $upTo = '../' }
    else                      { $here = '../index.html'; $upTo = '../../' }
    foreach ($book in $BOOKS) {
        if ($book.key -eq $tree) { $to = $here } else { $to = $upTo + $book.dir + '/index.html' }
        foreach ($variant in @($book.home, ($book.home -replace ' ', '%20'))) {
            foreach ($from in @($variant, ('../' + $variant))) {
                $text = [regex]::Replace($text, '(?<=href=")' + [regex]::Escape($from) + '(?=["#?])', $to)
            }
        }
    }
    return $text
}

function Convert-Images([string]$text, [string]$tree) {
    # Only the manual carries img/, so the guide reaches it across trees. The API pages
    # carry no images at all.
    if ($tree -eq 'api') {
        if ($text -match 'src="(?:\.\./)?img/') { throw "An API page references an image; the public-api tree has no img/ folder. Update Build-PersistentAssetDocs.ps1." }
        return $text
    }
    # A page inside pages/ writes "../img/x", a home page writes "img/x", and the guide has to
    # reach across into the manual's tree either way.
    foreach ($from in @('../img/', 'img/')) {
        $to = if ($tree -eq 'guide') { '../user-manual/img/' } else { $from }
        $text = [regex]::Replace($text, '(?<=src=")' + [regex]::Escape($from) + '([A-Za-z0-9_]+)(?=")', ($to + '$1.png'))
    }
    return $text
}

function Convert-Html([string]$text, [string]$tree, [string]$location) {
    # stylesheet -> absolute shared sheet, followed by the theme, favicon and analytics lines
    $before = $text
    $text = $text -replace `
        '<link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', `
        ('<link rel="stylesheet" href="/assets/css/doc-styles.css" />' + "`n" + $theme + "`n" + $favicons + "`n" + $analytics)
    if ($text -ceq $before) { throw "No shared/styles.css link to rewrite in a '$tree' page; update Build-PersistentAssetDocs.ps1." }

    $text = Convert-HomeLinks       $text $tree $location
    $text = Convert-Images          $text $tree
    $text = Convert-CrossTreeLinks  $text $tree $location

    # Nothing may still point at a source file name.
    foreach ($book in $BOOKS) {
        foreach ($variant in @($book.home, ($book.home -replace ' ', '%20'))) {
            if ($text -match '(?<=href=")(\.\./)?' + [regex]::Escape($variant) + '(?=["#?])') {
                throw "A link to '$($book.home)' survived rewriting in a '$tree' page; update Build-PersistentAssetDocs.ps1."
            }
        }
    }
    return $text
}

# --- clean the regenerated areas (leave comparison.md and any other content alone) ---
foreach ($book in $BOOKS) {
    foreach ($sub in @('pages', 'img', 'shared')) {
        $d = Join-Path $dst ($book.dir + '\' + $sub)
        if (Test-Path $d) { Remove-Item $d -Recurse -Force }
    }
}

# --- home pages ---
foreach ($book in $BOOKS) {
    Write-Text (Join-Path $dst ($book.dir + '\index.html')) `
               (Convert-Html (Read-Text (Join-Path $src $book.home)) $book.key 'home')
}

# --- content pages: API-* go to public-api, the rest to user-manual ---
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    $kind = $pageTree[$_.Name]
    Write-Text (Join-Path $dst ($dirOf[$kind] + '\pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) $kind 'page')
}

# --- images: every source image, whatever it is named, served as <name>.png ---
$imgDir = Join-Path $dst 'user-manual\img'
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
foreach ($name in $imgFiles.Keys) {
    Copy-Item $imgFiles[$name].FullName (Join-Path $imgDir ($name + '.png')) -Force
}

# --- shared nav.js: adapt the home file, the book detection and the book bar for the split site ---
# Each rewrite is asserted: if the source nav.js is reformatted so a pattern no longer
# matches, fail loudly rather than emit a silently broken sidebar (a missed isApiPage
# rewrite would keep filename-based detection, which never matches on the site's
# index.html homes and mis-renders the API section).
function Replace-Assert([string]$text, [string]$pattern, [string]$replacement, [string]$what) {
    $new = $text -replace $pattern, $replacement
    if ($new -ceq $text) { throw "nav.js: '$what' pattern did not match; source format changed, update Build-PersistentAssetDocs.ps1." }
    return $new
}
$nav = Read-Text (Join-Path $src 'shared\nav.js')
$nav = Replace-Assert $nav 'file: "User Manual\.html", title: "Home"' 'file: "index.html", title: "Home"' 'home page entry'
# A book's home is served as a directory URL, so the last path segment is empty where the
# source reads a file name. Without this the sidebar never marks the home page as current.
$nav = Replace-Assert $nav '(?m)^\s*var current = .*$' '  var current = path.split("/").pop() || "index.html";' 'current page name'
$nav = Replace-Assert $nav '(?m)^\s*var isApiPage = .*$'     '  var isApiPage = (path.indexOf("/public-api/") >= 0);' 'isApiPage detection'
$nav = Replace-Assert $nav '(?m)^\s*var isStandalone = .*$'  '  var isStandalone = (path.indexOf("/quick-usage-guide/") >= 0);' 'isStandalone detection'
# The bar's three links are the one place a page addresses another tree, so they become
# site-absolute rather than relative to whichever depth the page sits at.
foreach ($book in $BOOKS) {
    $nav = Replace-Assert $nav ('\["' + [regex]::Escape($book.home) + '", ') ('["/persistent-asset/' + $book.dir + '/", ') "BOOKS entry for $($book.home)"
}
$nav = Replace-Assert $nav 'hrefOf\(BOOKS\[k\]\[0\]\)' 'BOOKS[k][0]' 'book bar href'
# Which book a page belongs to is a path question on the site, not a file-name one, so the
# active link is decided by the two detections above rather than by comparing file names.
$nav = Replace-Assert $nav `
    '(?m)^\s*var isBook = \(current === BOOKS\[k\]\[0\]\)\r?\n\s*\|\| \(\(k === 1\).*\r?\n\s*\|\| \(\(k === 2\) && isApiPage\);' `
    "    var isBook = ((k === 0) && isStandalone)`n              || ((k === 1) && (isStandalone === false) && (isApiPage === false))`n              || ((k === 2) && isApiPage);" `
    'active book detection'
foreach ($book in $BOOKS) {
    Write-Text (Join-Path $dst ($book.dir + '\shared\nav.js')) $nav
}

# --- shared search-index.js: rewrite each entry's page path per tree ---
# The guide draws no search box, so it is not given an index.
function Tree-Of([string]$p) {
    if (($p -eq 'Public API.html') -or $p.StartsWith('pages/API - ')) { return 'api' }
    if ($p -eq 'Quick Usage Guide.html') { return 'guide' }
    return 'manual'
}
function Rewrite-P([string]$p, [string]$tree) {
    $of = Tree-Of $p
    $isHome = ($p -eq 'Public API.html') -or ($p -eq 'User Manual.html') -or ($p -eq 'Quick Usage Guide.html')
    if ($of -eq $tree) {
        if ($isHome) { return 'index.html' }
        return $p
    }
    if ($isHome) { return '../' + $dirOf[$of] + '/index.html' }
    return '../' + $dirOf[$of] + '/' + $p
}
function Build-Index([string[]]$lines, [string]$tree) {
    $out = New-Object System.Collections.Generic.List[string]
    foreach ($line in $lines) {
        $m = [regex]::Match($line, '^\{p:"([^"]*)"')
        if ($m.Success) {
            $p    = $m.Groups[1].Value
            $newp = Rewrite-P $p $tree
            $line = '{p:"' + $newp + '"' + $line.Substring($m.Length)
        }
        $out.Add($line)
    }
    return ($out -join "`n")
}
$idxLines = [IO.File]::ReadAllLines((Join-Path $src 'shared\search-index.js'))
foreach ($key in @('manual', 'api')) {
    Write-Text (Join-Path $dst ($dirOf[$key] + '\shared\search-index.js')) (Build-Index $idxLines $key)
}

# --- shared, cross-product stylesheet ---
Write-Text $css (Read-Text (Join-Path $src 'shared\styles.css'))

# --- link check: every local href and src in the generated trees has to resolve ---
# The rewrites above are asserted one by one, but only walking the result catches a page
# that points at a file no longer there, which is what a removed or renamed source page
# leaves behind.
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

$books = ($BOOKS | ForEach-Object { $_.dir }) -join ', '
Write-Host "Done. Regenerated $books and refreshed doc-styles.css."
