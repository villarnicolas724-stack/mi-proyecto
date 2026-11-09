@echo off
title Veta
cd /d "%~dp0"

rem Primera vez: instala lo necesario.
if not exist node_modules (
  echo Instalando lo necesario por primera vez. Puede tardar unos minutos...
  call npm.cmd install
)

rem Si Veta ya esta encendida, solo abre la ventana.
call :check
if not errorlevel 1 goto open

echo Encendiendo Veta...
start "Veta (no cierres esta ventana)" /min cmd /c "npm.cmd run dev"

:wait
timeout /t 1 /nobreak >nul
call :check
if errorlevel 1 goto wait

:open
rem Abre Veta en su propia ventana (Edge o Chrome); si no, en el navegador normal.
start "" msedge --app=http://localhost:3000/app 2>nul || start "" chrome --app=http://localhost:3000/app 2>nul || start "" http://localhost:3000/app
exit /b

:check
powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 http://localhost:3000/app | Out-Null; exit 0 } catch { exit 1 }"
exit /b %errorlevel%
