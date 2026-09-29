\
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$nodeMajor = [int]((node -p "process.versions.node.split('.')[0]") 2>$null)
if (-not $nodeMajor -or $nodeMajor -lt 22) {
  throw "Capacitor 8 requiere Node.js 22 o superior."
}

npm install
npm run mobile:prepare
if (-not (Test-Path "android")) {
  npx cap add android
}
npx cap sync android
Write-Host "PASS: proyecto Android sincronizado."
Write-Host "Siguiente: npx cap open android"
