<#
  Build-SettingsKitDocs.ps1

  Regenerates the published Settings Kit docs under docs/settings-kit/ from the authored
  source under "Sources/Settings Kit/Documentation".

  The source is a flat set of HTML pages: two home pages ("User Manual.html" and
  "Public API.html"), a pages/ folder holding the manual's content, img/, and
  shared/styles.css.

  The website splits that folder into one clean-URL tree per book:

      docs/settings-kit/documentation/  (index.html + pages/ + img/)
      docs/settings-kit/public-api/     (index.html)

  The manual keeps the /documentation/ URL because the package itself links there
  (the demo page's HelpUrl).

  Transform applied to every page:
    - stylesheet  shared/styles.css   -> /assets/css/doc-styles.css + settings-kit.css
                  (+ the dark-mode sheet, phone menu, favicon <link>s and the goatcounter
                   analytics <script> the site injects, which the offline source docs
                   must not have)
    - home links  each book's home    -> that book's index.html, reached across trees
                  when the link comes from the other book
    - cross-tree  pages/X.html written from the API home -> ../documentation/pages/X.html
    - images      img/<name>          -> img/<name>.png

  styles.css is the shared doc sheet plus a Settings Kit tail. The shared part is already
  published as docs/assets/css/doc-styles.css by Build-PersistentAssetDocs.ps1; the tail
  becomes docs/assets/css/settings-kit.css.

  Every rewrite is asserted, and the generated trees are link-checked at the end.

  Re-run this after editing the source docs, then commit docs/.
#>

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM

$root      = Split-Path $PSScriptRoot -Parent
$src       = Join-Path $root 'Sources\Settings Kit\Documentation'
$dst       = Join-Path $root 'docs\settings-kit'
$sharedCss = Join-Path $root 'docs\assets\css\doc-styles.css'
$skCss     = Join-Path $root 'docs\assets\css\settings-kit.css'

if (-not (Test-Path $src)) { throw "Source docs not found: $src" }

$BOOKS = @(
    @{ key = 'manual'; home = 'User Manual.html'; dir = 'documentation' }
    @{ key = 'api';    home = 'Public API.html';  dir = 'public-api' }
)

$analytics = '  <script data-goatcounter="https://justetools.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

# Web-only additions, absolute-pathed because the pages sit at several depths. Not in the
# source docs: those ship inside the Unity package and are opened from disk, where a
# site-absolute /assets/... path resolves to nothing. doc-dark.css loads after the two
# light sheets to win on source order.
$head = @(
    '  <link rel="stylesheet" href="/assets/css/doc-styles.css" />'
    '  <link rel="stylesheet" href="/assets/css/settings-kit.css" />'
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

# Every source image, as <name without extension> -> <file on disk>. The source keeps them
# extensionless so the Unity package does not import them as textures; the site serves
# them as .png, which is what the bytes are.
$imgFiles = @{}
Get-ChildItem (Join-Path $src 'img') -File | Where-Object { $_.Extension -ne '.meta' } | ForEach-Object {
    $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($imgFiles.ContainsKey($name)) {
        throw "Two source images share the name '$name' ($($imgFiles[$name].Name) and $($_.Name)); the site serves one .png per name."
    }
    # A placeholder waiting for its screenshot is empty on purpose; anything else has to be a PNG.
    if ($_.Length -gt 0) {
        $bytes = [byte[]]::new(4)
        $fs = [IO.File]::OpenRead($_.FullName)
        try { [void]$fs.Read($bytes, 0, 4) } finally { $fs.Dispose() }
        if (($bytes[0] -ne 0x89) -or ($bytes[1] -ne 0x50) -or ($bytes[2] -ne 0x4E) -or ($bytes[3] -ne 0x47)) {
            throw "img/$($_.Name) is not a PNG. The site serves every image as <name>.png; update Build-SettingsKitDocs.ps1 to carry the real format."
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
                throw "A link to '$($book.home)' survived rewriting in a '$tree' page; update Build-SettingsKitDocs.ps1."
            }
        }
    }
    return $text
}

# Every content page belongs to the manual, so only the API home links across into pages/.
function Convert-CrossTreeLinks([string]$text, [string]$tree) {
    if ($tree -ne 'api') { return $text }
    return [regex]::Replace($text, '(?<=href=")pages/', '../documentation/pages/')
}

function Convert-Images([string]$text, [string]$tree) {
    if ($tree -eq 'api') {
        if ($text -match 'src="(?:\.\./)?img/') { throw "The API page references an image; the public-api tree has no img/ folder. Update Build-SettingsKitDocs.ps1." }
        return $text
    }
    foreach ($from in @('../img/', 'img/')) {
        $text = [regex]::Replace($text, '(?<=src=")' + [regex]::Escape($from) + '([A-Za-z0-9_]+)(?=")', ($from + '$1.png'))
    }
    return $text
}

function Convert-Html([string]$text, [string]$tree, [string]$location) {
    $before = $text
    $text = $text -replace '  <link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', $head
    if ($text -ceq $before) { throw "No shared/styles.css link to rewrite in a '$tree' page; update Build-SettingsKitDocs.ps1." }

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
    Write-Text (Join-Path $dst ('documentation\pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) 'manual' 'page')
}

# --- images ---
$imgDir = Join-Path $dst 'documentation\img'
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
foreach ($name in $imgFiles.Keys) {
    Copy-Item $imgFiles[$name].FullName (Join-Path $imgDir ($name + '.png')) -Force
}

# --- stylesheet: the shared part is published by the Persistent Asset build, the tail here ---
$marker = '/* Settings Kit additions.'
$styles = (Read-Text (Join-Path $src 'shared\styles.css')) -replace "`r`n", "`n"
$cut = $styles.IndexOf($marker)
if ($cut -lt 0) { throw "shared/styles.css has no '$marker' line; update Build-SettingsKitDocs.ps1." }
$shared = ((Read-Text $sharedCss) -replace "`r`n", "`n").TrimEnd()
if ($styles.Substring(0, $cut).TrimEnd() -cne $shared) {
    Write-Warning "The shared part of the Settings Kit styles.css differs from docs/assets/css/doc-styles.css. The site serves doc-styles.css; copy the shared sheet across so the offline docs match."
}
# The marker line itself ("Everything above matches the shared file") is dropped: nothing is above it here.
$tail = $styles.Substring($cut)
$tail = $tail.Substring($tail.IndexOf("`n") + 1).TrimStart("`n")
# The source has no top bar at all, but on a phone doc-nav.js draws one, 50px tall as the
# shared sheet sets it, so the zero offset only applies above the phone breakpoint.
$before = $tail
$tail = $tail -replace '(?m)^:root \{ --doc-top: 0px; \}$', '@media (min-width: 761px) { :root { --doc-top: 0px; } }'
if ($tail -ceq $before) { throw "styles.css: the --doc-top override did not match; update Build-SettingsKitDocs.ps1." }
$banner = "/* Generated by Tools/Build-SettingsKitDocs.ps1 from Sources/Settings Kit/Documentation/shared/styles.css.`n   Loaded after doc-styles.css on the Settings Kit doc pages. Edit the source, not this file. */`n`n"
Write-Text $skCss ($banner + $tail)

# --- link check: every local href and src in the generated trees has to resolve ---
$broken = New-Object System.Collections.Generic.List[string]
foreach ($book in $BOOKS) {
    Get-ChildItem (Join-Path $dst $book.dir) -Recurse -Filter *.html | ForEach-Object {
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
}
if ($broken.Count -gt 0) {
    throw ("Generated pages point at files that do not exist:`n  " + ($broken -join "`n  "))
}

Write-Host "Done. Regenerated documentation, public-api and settings-kit.css."
