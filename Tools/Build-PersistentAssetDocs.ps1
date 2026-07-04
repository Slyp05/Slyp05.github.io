<#
  Build-PersistentAssetDocs.ps1

  Regenerates the published Persistent Asset docs under docs/persistent-asset/
  from the authored source under "Sources/Persistent Asset/Documentation".

  The source is a flat set of HTML pages (one "User Manual.html" home, one
  "Public API.html" home, a shared pages/ folder, img/ and shared/ scripts).
  The website splits them into two clean-URL trees:

      docs/persistent-asset/user-manual/   (index.html + pages/ + img/ + shared/)
      docs/persistent-asset/public-api/    (index.html + pages/       + shared/)

  Transform applied to every page:
    - stylesheet  shared/styles.css        -> /assets/css/doc-styles.css
                  (+ the goatcounter analytics <script> the site injects)
    - home links  User%20Manual.html       -> index.html   (same tree)
                  Public%20API.html         -> index.html   (same tree)
    - images      ../img/<name>            -> ../img/<name>.png

  The shared JS is copied into each tree's shared/ folder:
    - nav.js           lightly adapted (home file = index.html, API detected by
                       the /public-api/ path instead of the "Public API.html" name)
    - search-index.js  page paths rewritten to be relative to each tree, so a
                       search hit for the *other* tree points across correctly.

  styles.css is copied to the shared, cross-product docs/assets/css/doc-styles.css.

  Re-run this after editing the source docs, then commit docs/.
#>

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM

$root = Split-Path $PSScriptRoot -Parent
$src  = Join-Path $root 'Sources\Persistent Asset\Documentation'
$dst  = Join-Path $root 'docs\persistent-asset'
$um   = Join-Path $dst 'user-manual'
$api  = Join-Path $dst 'public-api'
$css  = Join-Path $root 'docs\assets\css\doc-styles.css'

if (-not (Test-Path $src)) { throw "Source docs not found: $src" }

$analytics = '  <script data-goatcounter="https://justetools.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

function Read-Text([string]$p)  { return [IO.File]::ReadAllText($p) }
function Write-Text([string]$p, [string]$t) {
    $dir = Split-Path $p -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [IO.File]::WriteAllText($p, $t, $utf8)
}

function Convert-Html([string]$text, [string]$tree) {
    # The manual and API homes both become index.html, but each in its OWN tree.
    # This doc set never links across trees, so a same-tree rename is correct. Guard
    # that assumption: a foreign-tree home link would otherwise be silently rewritten
    # to this tree's index.html and point at the wrong page.
    if ($tree -eq 'manual' -and $text -match 'Public%20API\.html') {
        throw "Manual page links to the API home (Public%20API.html); cross-tree links need explicit ../public-api/ handling in Build-PersistentAssetDocs.ps1."
    }
    if ($tree -eq 'api' -and $text -match 'User%20Manual\.html') {
        throw "API page links to the manual home (User%20Manual.html); cross-tree links need explicit ../user-manual/ handling in Build-PersistentAssetDocs.ps1."
    }
    # stylesheet -> absolute shared sheet, followed by the analytics line
    $text = $text -replace `
        '<link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', `
        ('<link rel="stylesheet" href="/assets/css/doc-styles.css" />' + "`n" + $analytics)
    # home-page renames (same-tree only, per the guard above)
    $text = $text -replace 'User%20Manual\.html', 'index.html'
    $text = $text -replace 'Public%20API\.html',  'index.html'
    # extensionless source images become .png on the site
    $text = $text -replace '(src="(?:\.\./)?img/[A-Za-z0-9_]+)"', '$1.png"'
    return $text
}

# --- clean the regenerated areas (leave comparison.md and any other content alone) ---
foreach ($d in @((Join-Path $um 'pages'), (Join-Path $um 'img'), (Join-Path $um 'shared'),
                 (Join-Path $api 'pages'), (Join-Path $api 'shared'))) {
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
}

# --- home pages ---
Write-Text (Join-Path $um  'index.html') (Convert-Html (Read-Text (Join-Path $src 'User Manual.html')) 'manual')
Write-Text (Join-Path $api 'index.html') (Convert-Html (Read-Text (Join-Path $src 'Public API.html')) 'api')

# --- content pages: API-* go to public-api, the rest to user-manual ---
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    $isApi = $_.Name -like 'API - *'
    $tree  = if ($isApi) { $api } else { $um }
    $kind  = if ($isApi) { 'api' } else { 'manual' }
    Write-Text (Join-Path $tree ('pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) $kind)
}

# --- images: extensionless source files -> <name>.png ---
New-Item -ItemType Directory -Force -Path (Join-Path $um 'img') | Out-Null
Get-ChildItem (Join-Path $src 'img') -File | Where-Object { $_.Extension -eq '' } | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $um ('img\' + $_.Name + '.png')) -Force
}

# --- shared nav.js: adapt home file + API detection for the split site ---
# Each rewrite is asserted: if the source nav.js is reformatted so a pattern no
# longer matches, fail loudly rather than emit a silently broken sidebar (a
# missed isApiPage rewrite would keep filename-based detection, which never
# matches on the site's index.html homes and mis-renders the API section).
function Replace-Assert([string]$text, [string]$pattern, [string]$replacement, [string]$what) {
    $new = $text -replace $pattern, $replacement
    if ($new -ceq $text) { throw "nav.js: '$what' pattern did not match; source format changed, update Build-PersistentAssetDocs.ps1." }
    return $new
}
$nav = Read-Text (Join-Path $src 'shared\nav.js')
$nav = Replace-Assert $nav '\{ file: "User Manual\.html", title: "Home" \}' '{ file: "index.html", title: "Home" }' 'home page entry'
$nav = Replace-Assert $nav '(?m)^\s*var isApiPage = .*$' '  var isApiPage = (path.indexOf("/public-api/") >= 0);' 'isApiPage detection'
Write-Text (Join-Path $um  'shared\nav.js') $nav
Write-Text (Join-Path $api 'shared\nav.js') $nav

# --- shared search-index.js: rewrite each entry's page path per tree ---
function Rewrite-P([string]$p, [string]$tree) {
    $isApi = ($p -eq 'Public API.html') -or $p.StartsWith('pages/API - ')
    if ($tree -eq 'manual') {
        if ($isApi) {
            if ($p -eq 'Public API.html') { return '../public-api/index.html' }
            return '../public-api/' + $p
        }
        if ($p -eq 'User Manual.html') { return 'index.html' }
        return $p
    } else {
        if ($isApi) {
            if ($p -eq 'Public API.html') { return 'index.html' }
            return $p
        }
        if ($p -eq 'User Manual.html') { return '../user-manual/index.html' }
        return '../user-manual/' + $p
    }
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
Write-Text (Join-Path $um  'shared\search-index.js') (Build-Index $idxLines 'manual')
Write-Text (Join-Path $api 'shared\search-index.js') (Build-Index $idxLines 'api')

# --- shared, cross-product stylesheet ---
Write-Text $css (Read-Text (Join-Path $src 'shared\styles.css'))

Write-Host "Done. Regenerated user-manual/ and public-api/ and refreshed doc-styles.css."
