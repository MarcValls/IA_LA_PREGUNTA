$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Here

$python = $null
if (Get-Command py -ErrorAction SilentlyContinue) { $python = "py" }
elseif (Get-Command python -ErrorAction SilentlyContinue) { $python = "python" }
else {
  Write-Host "[FAIL] No encuentro Python 3." -ForegroundColor Red
  Write-Host "Instala Python o abre backend\server.py con un Python 3 disponible."
  Read-Host "Pulsa Enter para salir"
  exit 1
}

function Test-PortInUse([int]$Port) {
  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $async = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    if (-not $async.AsyncWaitHandle.WaitOne(150)) { return $false }
    $client.EndConnect($async)
    return $true
  } catch { return $false }
  finally { $client.Close() }
}

$Port = 8765
while ((Test-PortInUse $Port) -and $Port -lt 8775) { $Port++ }
if ($Port -ge 8775 -and (Test-PortInUse $Port)) {
  Write-Host "[FAIL] No encuentro un puerto libre entre 8765 y 8775." -ForegroundColor Red
  Read-Host "Pulsa Enter para salir"
  exit 1
}

Write-Host "IA. LA PREGUNTA - Clase 00 interactiva FULLSTACK v1.6 · AULA 50/50 · TIPOGRAFÍA DUAL" -ForegroundColor Cyan
Write-Host "Frontend + backend + SQLite + Ollama local"
Write-Host "Aplicacion: http://127.0.0.1:$Port/"
Write-Host "Ollama esperado: http://127.0.0.1:11434"
if ($Port -ne 8765) { Write-Host "[INFO] 8765 estaba ocupado; uso $Port." -ForegroundColor Yellow }
Write-Host "Cierra esta ventana o pulsa Ctrl+C para detener el servidor." -ForegroundColor DarkGray

if ($python -eq "py") {
  & py -3 "backend\server.py" --host 127.0.0.1 --port $Port --ollama http://127.0.0.1:11434 --open
} else {
  & python "backend\server.py" --host 127.0.0.1 --port $Port --ollama http://127.0.0.1:11434 --open
}
