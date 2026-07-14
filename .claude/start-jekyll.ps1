# Launched by the SessionStart hook (.claude/settings.json).
# Opens a VISIBLE terminal window running the Jekyll dev server for docs/,
# and records the window's PID so it can be reaped later (SessionEnd, or the
# next SessionStart if this session died abruptly).
$ErrorActionPreference = 'SilentlyContinue'

$root    = Split-Path $PSScriptRoot -Parent          # project root (.claude\..)
$docs    = Join-Path $root 'docs'
$pidFile = Join-Path $env:TEMP 'slyp05-jekyll.pid'

# --- reap a server this script started before but that outlived its session ---
if (Test-Path $pidFile) {
    $old = (Get-Content $pidFile | Select-Object -First 1)
    if ($old) { taskkill /PID $old /T /F 2>$null | Out-Null }
    Remove-Item $pidFile -Force
}

# --- backstop: free port 4000 if anything else still holds it ---
Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force }

# --- launch the server in its own window (-NoExit keeps errors readable) ---
$inner = "`$Host.UI.RawUI.WindowTitle = 'Jekyll - docs (Slyp05.github.io)'; " +
         "Set-Location '$docs'; bundle exec jekyll serve"
$p = Start-Process -FilePath 'powershell' `
        -ArgumentList '-NoExit', '-NoProfile', '-Command', $inner `
        -WorkingDirectory $docs -PassThru
Set-Content -Path $pidFile -Value $p.Id
