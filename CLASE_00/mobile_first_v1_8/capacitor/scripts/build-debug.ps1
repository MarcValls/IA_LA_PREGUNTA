\
$ErrorActionPreference = "Stop"
& "$PSScriptRoot\setup-android.ps1"
$capRoot = Split-Path -Parent $PSScriptRoot
Push-Location "$capRoot\android"
try {
  .\gradlew.bat assembleDebug
  Write-Host "APK debug esperado en android\app\build\outputs\apk\debug\app-debug.apk"
} finally {
  Pop-Location
}
