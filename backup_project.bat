@echo off
setlocal enabledelayedexpansion

set "SOURCE=%~dp0"
set "DEST=C:\Users\PABLO\Desktop\PuntoPizzaWeb"

echo ==========================================
echo  INICIANDO RESPALDO (V2)
echo ==========================================

if not exist "%DEST%" mkdir "%DEST%"

echo [COPIANDO] Codigo fuente...
robocopy "%SOURCE%." "%DEST%" /E /XD node_modules .next .git .vscode "System Volume Information" /XF *.log *.tmp /R:1 /W:1 /NP

set "BRAIN_PATH=C:\Users\PABLO\.gemini\antigravity\brain\2a3cac85-f9c6-4da6-99cc-bd14ae822227"
set "DOCS_DEST=%DEST%\Documentacion_y_Chat"

if exist "%BRAIN_PATH%" (
    echo.
    echo [COPIANDO] Documentacion...
    if not exist "%DOCS_DEST%" mkdir "%DOCS_DEST%"
    copy /Y "%BRAIN_PATH%\*.md" "%DOCS_DEST%\"
    copy /Y "%BRAIN_PATH%\*.png" "%DOCS_DEST%\"
)

echo.
echo ==========================================
echo  RESPALDO COMPLETADO
echo ==========================================
echo.
pause
