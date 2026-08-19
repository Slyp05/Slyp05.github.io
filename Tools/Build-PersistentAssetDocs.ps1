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
                  (+ the favicon <link>s and goatcounter analytics <script>
                   the site injects, which the offline source docs must not have)
    - home links  User%20Manual.html       -> index.html   (same tree)
                  Public%20API.html         -> index.html   (same tree)
    - images      ../img/<name>            -> ../img/<name>.png
    - cross-tree  Serializers.html         -> ../../user-manual/pages/Serializers.html
                  links between the two trees, which the flat source writes as
                  plain siblings, get an explicit path to the other tree.

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

# Map every source page to the tree it will land in. The flat source folder lets a
# page link to any other as a plain sibling ("Serializers.html"); once split across
# user-manual/ and public-api/ those sibling links are only valid within one tree,
# so links pointing at the other tree need an explicit path.
$pageTree = @{}
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    if ($_.Name -like 'API - *') { $pageTree[$_.Name] = 'api' } else { $pageTree[$_.Name] = 'manual' }
}

# $location is 'home' (tree root: links read "pages/Name.html") or 'page' (inside
# pages/: links read "Name.html"). Same-tree links are left exactly as authored.
function Convert-CrossTreeLinks([string]$text, [string]$tree, [string]$location) {
    if ($location -eq 'home') { $upTo = '../' } else { $upTo = '../../' }
    foreach ($name in @($pageTree.Keys)) {
        if ($pageTree[$name] -eq $tree) { continue }
        if ($pageTree[$name] -eq 'api') { $dir = 'public-api' } else { $dir = 'user-manual' }
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

function Convert-Html([string]$text, [string]$tree, [string]$location) {
    # The manual and API homes both become index.html, but each in its OWN tree.
    # Cross-tree links to *content* pages are handled by Convert-CrossTreeLinks below.
    # Cross-tree links to the two *home* pages are not, so guard that case: a foreign-
    # tree home link would otherwise be silently rewritten to this tree's index.html
    # and point at the wrong page.
    if ($tree -eq 'manual' -and $text -match 'Public%20API\.html') {
        throw "Manual page links to the API home (Public%20API.html); cross-tree links need explicit ../public-api/ handling in Build-PersistentAssetDocs.ps1."
    }
    if ($tree -eq 'api' -and $text -match 'User%20Manual\.html') {
        throw "API page links to the manual home (User%20Manual.html); cross-tree links need explicit ../user-manual/ handling in Build-PersistentAssetDocs.ps1."
    }
    # stylesheet -> absolute shared sheet, followed by the analytics line
    $text = $text -replace `
        '<link rel="stylesheet" href="(?:\.\./)?shared/styles\.css" />', `
        ('<link rel="stylesheet" href="/assets/css/doc-styles.css" />' + "`n" + $theme + "`n" + $favicons + "`n" + $analytics)
    # home-page renames (same-tree only, per the guard above)
    $text = $text -replace 'User%20Manual\.html', 'index.html'
    $text = $text -replace 'Public%20API\.html',  'index.html'
    # extensionless source images become .png on the site
    $text = $text -replace '(src="(?:\.\./)?img/[A-Za-z0-9_]+)"', '$1.png"'
    # sibling links that now cross between the two trees
    $text = Convert-CrossTreeLinks $text $tree $location
    return $text
}

# --- clean the regenerated areas (leave comparison.md and any other content alone) ---
foreach ($d in @((Join-Path $um 'pages'), (Join-Path $um 'img'), (Join-Path $um 'shared'),
                 (Join-Path $api 'pages'), (Join-Path $api 'shared'))) {
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
}

# --- home pages ---
Write-Text (Join-Path $um  'index.html') (Convert-Html (Read-Text (Join-Path $src 'User Manual.html')) 'manual' 'home')
Write-Text (Join-Path $api 'index.html') (Convert-Html (Read-Text (Join-Path $src 'Public API.html')) 'api' 'home')

# --- content pages: API-* go to public-api, the rest to user-manual ---
Get-ChildItem (Join-Path $src 'pages') -Filter *.html | ForEach-Object {
    $isApi = $_.Name -like 'API - *'
    $tree  = if ($isApi) { $api } else { $um }
    $kind  = if ($isApi) { 'api' } else { 'manual' }
    Write-Text (Join-Path $tree ('pages\' + $_.Name)) (Convert-Html (Read-Text $_.FullName) $kind 'page')
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
