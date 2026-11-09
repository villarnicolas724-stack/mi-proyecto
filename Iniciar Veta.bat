@echo off
title Veta
cd /d "%~dp0"

rem Instala lo necesario la primera vez o cuando una actualizacion trae piezas nuevas.
set NEEDS_INSTALL=0
if not exist node_modules\.package-lock.json set NEEDS_INSTALL=1
if %NEEDS_INSTALL%==0 (
  powershell -NoProfile -Command "if ((Get-Item package-lock.json).LastWriteTime -gt (Get-Item node_modules\.package-lock.json).LastWriteTime) { exit 1 } else { exit 0 }"
  if errorlevel 1 set NEEDS_INSTALL=1
)
if %NEEDS_INSTALL%==1 (
  echo Instalando lo necesario. Puede tardar unos minutos...
  call npm.cmd install --no-audit --no-fund
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
