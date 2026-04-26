# Punto Pizza Mobile App 🍕📱

Esta carpeta contiene el código fuente de la App Móvil nativa (Android) para Punto Pizza.
La app funciona como un contenedor ("wrapper") que carga el sitio web optimizado, brindando una experiencia 100% nativa.

## 🚀 Cómo generar el APK (Android)

Para construir el archivo instalable (.apk) necesitas tener una cuenta en **Expo.dev** (es gratis).

1.  Abre una terminal en esta carpeta:
    ```bash
    cd mobile-app
    ```

2.  Instala las dependencias (si no lo has hecho):
    ```bash
    npm install
    ```

3.  Inicia sesión en Expo:
    ```bash
    npx expo login
    ```

4.  **Generar APK de prueba (Development Build):**
    ```bash
    npx eas build -p android --profile development
    ```

5.  **Generar APK para producción (Google Play / Instalación directa):**
    Primero instala EAS CLI globalmente:
    ```bash
    npm install -g eas-cli
    ```
    
    Luego configura el build:
    ```bash
    eas build:configure
    ```
    (Elige Android)

    Finalmente construye:
    ```bash
    eas build -p android --profile preview
    ```

El sistema generará un enlace de descarga donde podrás bajar tu archivo `.apk` listo para enviar por WhatsApp o instalar.

## 🛠️ Personalización

-   **Icono de la App:** Reemplaza `assets/icon.png` (debe ser cuadrado, min 1024x1024).
-   **Pantalla de Carga:** Reemplaza `assets/splash.png` (branding centrado).
-   **URL del Sitio:** Edita `App.js` si cambia el dominio de Vercel.
