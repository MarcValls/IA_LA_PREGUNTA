$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Here

$Index = Join-Path $Here "frontend\index.html"
if (-not (Test-Path $Index)) {
  Write-Host "[FAIL] No encuentro frontend\index.html" -ForegroundColor Red
  Read-Host "Pulsa Enter para salir"
  exit 1
}

Write-Host "IA. LA PREGUNTA - Clase 00 - Escritorio OFFLINE v1.8" -ForegroundColor Cyan
Write-Host "Guion docente pregenerado - sin backend - sin Ollama - sin conexion" -ForegroundColor Green
Write-Host "Abriendo frontend\index.html ..." -ForegroundColor DarkGray

Start-Process $Index

Write-Host "Cierra esta ventana cuando termines." -ForegroundColor DarkGray
Read-Host "Pulsa Enter para salir"
