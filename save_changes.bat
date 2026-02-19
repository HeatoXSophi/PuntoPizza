@echo off
echo ==========================================
echo      Guardando cambios en Punto Pizza
echo ==========================================

echo [1/3] Agregando archivos al control de versiones...
git add .

echo [2/3] Creando punto de guardado (Commit)...
git commit -m "Feat: Complete Premium Redesign (Hero, Builder, Story)"

echo [3/3] Subiendo a GitHub (Deploy)...
git push

echo.
echo ==========================================
echo      ¡Todo listo! Cambios guardados.
echo ==========================================
pause
