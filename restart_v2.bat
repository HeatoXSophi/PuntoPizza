@echo off
echo ==========================================
echo Limpiando cache y Reiniciando A PUNTO PIZZA...
echo ==========================================
if exist .next rmdir /s /q .next
timeout /t 2 >nul
echo Iniciando servidor...
call npm run dev
