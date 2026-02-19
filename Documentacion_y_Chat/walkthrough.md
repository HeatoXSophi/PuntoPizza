# Selfie Pizza Clone - Guía de Inicio

¡El clon de Selfie Pizza está listo (a nivel de código)!

## Estado Actual
Todo el código fuente para la aplicación de Cliente y el Panel de Administración ha sido generado en la carpeta `src`.
Sin embargo, la instalación automática de dependencias (`npm install`) ha tardado más de lo esperado.

## Pasos para Ejecutar

1.  **Abrir Terminal** en la carpeta del proyecto:
    `C:\Users\PABLO\.gemini\antigravity\scratch\selfie_pizza`

2.  **Instalar Dependencias** (si no terminaron de instalarse):
    ```bash
    npm install
    # Instalar librerías adicionales usadas en el código:
    npm install lucide-react clsx tailwind-merge framer-motion zustand next-themes sonner
    ```

3.  **Ejecutar el Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Abrir en el Navegador**:
    - App Cliente: [http://localhost:3000](http://localhost:3000)
    - Panel Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
    - Vista Cocina: [http://localhost:3000/admin/kitchen](http://localhost:3000/admin/kitchen)

## Características Implementadas
- **Cliente:** Home (Banners), Menú (Filtrado), Carrito (Zustand), Perfil.
- **Admin:** Dashboard de Ventas, Vista de Cocina (Kanban).
- **Tech Logic:** Estado global con `zustand`, estilos con `tailwindcss`, iconos `lucide`.

¡Que disfrutes tu pizza! 🍕
