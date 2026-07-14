# Launched by the SessionEnd hook (.claude/settings.json).
# Closes the Jekyll server window this project started and frees port 4000.
$ErrorActionPreference = 'SilentlyContinue'
$pidFile = Join-Path $env:TEMP 'slyp05-jekyll.pid'

# --- close the window (and its jekyll child) we recorded ---
if (Test-Path $pidFile) {
    $server = (Get-Content $pidFile | Select-Object -First 1)
    if ($server) { taskkill /PID $server /T /F 2>$null | Out-Null }
    Remove-Item $pidFile -Force
}

# --- backstop: anything still listening on port 4000 ---
Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force }

exit 0
