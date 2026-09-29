@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "frontend\index.html" (
  echo [FAIL] No encuentro frontend\index.html
  pause
  exit /b 1
)
echo IA. LA PREGUNTA - Clase 00 - Escritorio OFFLINE v1.8
echo Guion docente pregenerado - sin backend - sin Ollama
echo Abriendo frontend\index.html ...
start "" "frontend\index.html"
echo.
echo Cierra esta ventana cuando termines.
pause
