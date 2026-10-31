<#
  Build-CloneBusterDocs.ps1

  Regenerates the published CloneBuster docs under docs/clonebuster/user-manual/
  from the authored source under "Sources/CloneBuster/Documentation".

  The source is one book: "User Manual.html", a pages/ folder, img/ and shared/ scripts.
  On the site it becomes:

      docs/clonebuster/user-manual/  (index.html + pages/ + img/ + shared/)

  Transform applied to every page:
    - stylesheet  shared/styles.css   -> /assets/css/doc-styles.css + clonebuster.css
                  (+ the favicon <link>s, the dark-mode sheet and the goatcounter
                   analytics <script> the site injects, which the offline source
                   docs must not have)
    - home links  User Manual.html    -> index.html
    - images      img/<name>          -> img/<name>.png

  The shared JS is copied into shared/:
    - nav.js           home file = index.html, and the brand bar's link pointed at the
                       site-absolute manual URL
    - search-index.js  the home page entries pointed at index.html

  styles.css is the shared doc sheet plus a CloneBuster tail. The shared part is already
  published as docs/assets/css/doc-styles.css by Build-PersistentAssetDocs.ps1; the tail
  becomes docs/assets/css/clonebuster.css.

  Every rewrite is asserted, and the generated tree is link-checked at the end, so a
  reformatted source fails loudly instead of emitting a silently broken site.

  Re-run this after editing the source docs, then commit docs/.
#>

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM

$root = Split-Path $PSScriptRoot -Parent
$src       = Join-Path $root 'Sources\CloneBuster\Documentation'
$dst       = Join-Path $root 'docs\clonebuster\user-manual'
$sharedCss = Join-Path $root 'docs\assets\css\doc-styles.css'
$cbCss     = Join-Path $root 'docs\assets\css\clonebuster.css'
$homeFile  = 'User Manual.html'

if (-not (Test-Path $src)) { throw "Source docs not found: $src" }

$analytics = '  <script data-goatcounter="https://justetools.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

# These standalone doc pages are outside Jekyll, so they never get _includes/custom-head.html.
# Inject the same favicon set here, absolute-pathed because the pages sit at several depths.
# Deliberately NOT added to the source docs: those ship inside the Unity package and are
# opened from disk, where a site-absolute /assets/... path would not resolve.
# doc-dark.css must load AFTER doc-styles.css to win on source order.
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

function Replace-Assert([string]$text, [string]$pattern, [string]$replacement, [string]$what) {
    $new = $text -replace $pattern, $replacement
    if ($new -ceq $text) { throw "'$what' pattern did not match; source format changed, update Build-CloneBusterDocs.ps1." }
    return $new
}

# Every image the site serves, as <source name without extension> -> <file on disk>. The
# source keeps them extensionless so the Unity package does not import them as textures;
# the site serves them as .png, which is what the bytes are.
$imgFiles = @{}
Get-ChildItem (Join-Path $src 'img') -File | Where-Object { $_.Extension -ne '.meta' } | ForEach-Object {
    $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($imgFiles.ContainsKey($name)) {
        throw "Two source images share the name '$name' ($($imgFiles[$name].Name) and $($_.Name)); the site serves one .png per name."
    }
    if ($_.Length -gt 0) {
        $head = [byte[]]::new(4)
        $fs = [IO.File]::OpenRead($_.FullName)
        try { [void]$fs.Read($head, 0, 4) } finally { $fs.Dispose() }
        if (($head[0] -ne 0x89) -or ($head[1] -ne 0x50) -or ($head[2] -ne 0x4E) -or ($head[3] -ne 0x47)) {
            throw "img/$($_.Name) is not a PNG. The site serves every image as <name>.png; update Build-CloneBusterDocs.ps1 to carry the real format."
        }
    }
    $imgFiles[$name] = $_
}

# $location is 'home' (tree root) or 'page' (inside pages/).
function Convert-Html([string]$text, [string]$location) {
    $before = $text
    $text = $text -replace `
        '<link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', `
        ('<link rel="stylesheet" href="/assets/css/doc-styles.css" />' + "`n" + '  <link rel="stylesheet" href="/assets/css/clonebuster.css" />' + "`n" + $theme + "`n" + $favicons + "`n" + $analytics)
    if ($text -ceq $before) { throw "No shared/styles.css link to rewrite in a $location page; update Build-CloneBusterDocs.ps1." }

    # home links
    if ($location -eq 'home') { $to = 'index.html' } else { $to = '../index.html' }
    foreach ($variant in @($homeFile, ($homeFile -replace ' ', '%20'))) {
        foreach ($from in @($variant, ('../' + $variant))) {
            $text = [regex]::Replace($text, '(?<=href=")' + [regex]::Escape($from) + '(?=["#?])', $to)
        }
        if ($text -match '(?<=href=")(\.\./)?' + [regex]::Escape($variant) + '(?=["#?])') {
            throw "A link to '$homeFile' survived rewriting; update Build-CloneBusterDocs.ps1."
        }
    }

    # images
    foreach ($from in @('../img/', 'img/')) {
        $text = [regex]::Replace($text, '(?<=src=")' + [regex]::Escape($from) + '([A-Za-z0-9_]+)(?=")', ($from + '$1.png'))
    }
    return $text
}

# --- clean the regenerated areas (leave any hand-written content alone) ---
foreach ($sub in @('pages', 'img', 'shared')) {
    $d = Join-Path $dst $sub
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
}

# --- pages ---
Write-Text (Join-Path $dst 'index.html') (Convert-Html (Read-Text (Join-Path $src $homeFile)) 'home')
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    Write-Text (Join-Path $dst ('pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) 'page')
}

# --- images ---
$imgDir = Join-Path $dst 'img'
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
foreach ($name in $imgFiles.Keys) {
    Copy-Item $imgFiles[$name].FullName (Join-Path $imgDir ($name + '.png')) -Force
}

# --- shared nav.js ---
$nav = Read-Text (Join-Path $src 'shared\nav.js')
$nav = Replace-Assert $nav 'file: "User Manual\.html", title: "Home"' 'file: "index.html", title: "Home"' 'home page entry'
# The home is served as a directory URL, so the last path segment is empty where the source
# reads a file name. Without this the sidebar never marks the home page as current.
$nav = Replace-Assert $nav '(?m)^\s*var current = .*$' '  var current = path.split("/").pop() || "index.html";' 'current page name'
$nav = Replace-Assert $nav 'hrefOf\("User Manual\.html"\)' '"/clonebuster/user-manual/"' 'brand bar href'
Write-Text (Join-Path $dst 'shared\nav.js') $nav

# --- shared search-index.js: the home entries point at index.html ---
$idx = Read-Text (Join-Path $src 'shared\search-index.js')
$idx = Replace-Assert $idx '\{p:"User Manual\.html"' '{p:"index.html"' 'search index home entries'
Write-Text (Join-Path $dst 'shared\search-index.js') $idx

# --- stylesheet: the shared part is published by the Persistent Asset build, the tail here ---
function Split-AtTail([string]$text, [string]$marker, [string]$what) {
    $at = $text.IndexOf($marker)
    if ($at -lt 0) { throw "$what has no '$marker' line; update Build-CloneBusterDocs.ps1." }
    $rule = $text.LastIndexOf("`n/*", $at - 1)
    if ($rule -lt 0) { throw "$what has no banner line above '$marker'; update Build-CloneBusterDocs.ps1." }
    return @($text.Substring(0, $rule + 1), $text.Substring($rule + 1))
}
$styles = (Read-Text (Join-Path $src 'shared\styles.css')) -replace "`r`n", "`n"
$shared = (Read-Text $sharedCss) -replace "`r`n", "`n"
$cbParts     = Split-AtTail $styles '/* Package additions'          'shared/styles.css'
$sharedParts = Split-AtTail $shared '/* Persistent Asset additions' 'doc-styles.css'
if ($cbParts[0].TrimEnd() -cne $sharedParts[0].TrimEnd()) {
    Write-Warning "The shared part of the CloneBuster styles.css differs from docs/assets/css/doc-styles.css. The site serves doc-styles.css; copy the shared sheet across so the offline docs match."
}
$banner = "/* Generated by Tools/Build-CloneBusterDocs.ps1 from Sources/CloneBuster/Documentation/shared/styles.css.`n   Loaded after doc-styles.css on the CloneBuster doc pages. Edit the source, not this file. */`n`n"
Write-Text $cbCss ($banner + $cbParts[1])

# --- link check: every local href and src in the generated tree has to resolve ---
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

Write-Host "Done. Regenerated clonebuster/user-manual and clonebuster.css."
