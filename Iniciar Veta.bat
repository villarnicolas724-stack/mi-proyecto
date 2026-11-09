@echo off
title Veta
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando lo necesario por primera vez. Puede tardar unos minutos...
  call npm.cmd install
)
echo.
echo Abriendo Veta en el navegador. No cierres esta ventana mientras uses la app.
echo Para apagarla, cierra esta ventana o pulsa Ctrl + C.
echo.
start "" http://localhost:3000/app
call npm.cmd run dev
