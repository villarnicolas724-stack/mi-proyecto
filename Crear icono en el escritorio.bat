@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Veta.lnk');" ^
  "$s.TargetPath = '%~dp0Iniciar Veta.bat';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.IconLocation = '%~dp0veta.ico';" ^
  "$s.WindowStyle = 7;" ^
  "$s.Description = 'Abrir Veta';" ^
  "$s.Save()"
echo.
echo Listo: ya tienes el icono de Veta en tu escritorio.
pause
