@echo off
echo ==========================================
echo Iniciando Selfie Pizza Clone...
echo ==========================================
echo Instalando dependencias necesarias...
call npm install
call npm install lucide-react clsx tailwind-merge framer-motion zustand class-variance-authority @radix-ui/react-slot
echo.
echo Iniciando servidor de desarrollo...
echo.
call npm run dev
pause
