# Plan de Implementación - Clon de Selfie Pizza

## Descripción del Objetivo
Clonar la funcionalidad y estética de la app "Selfie Pizza". El objetivo es construir una aplicación web responsiva (PWA) que se comporte exactamente como una app móvil, manteniendo la opción de empaquetarla con Capacitor para despliegue nativo.

## Revisión del Usuario Requerida
> [!IMPORTANT]
> **Selección de Stack Tecnológico:**
> - **Framework:** Next.js 14 (App Router) - Para desarrollo rápido tanto de la App Cliente como de los Paneles de Admin.
> - **Estilos:** Tailwind CSS - Para estilos pixel-perfect que coincidan con la estética "Visual y Limpia".
> - **Iconos:** Lucide React.
> - **Estado:** Zustand (para estado de Carrito/Usuario).
> - **Backend:** Next.js API Routes + Mock Data (inicialmente) o Supabase (si se necesita base de datos inmediata). *Comenzaré con datos mock locales para demostrar el flujo de UI completo primero.*

> [!NOTE]
> **Activos:**
> Dado que no podemos copiar los activos originales (advertencia legal), usaré:
> - **Imágenes:** Imágenes de stock de alta calidad de Pizzas/Comida que coincidan con la vibra premium.
> - **Colores:** Una paleta vibrante inspirada en apps modernas de comida (ej., Naranja/Rojo primario, Modos Oscuro/Claro).

## Arquitectura Propuesta
El proyecto será una única aplicación Next.js con layouts distintos:
1.  `/app/(customer)`: La app principal de pedidos (UI Mobile-first).
2.  `/app/(admin)`: Los paneles de Admin y Restaurante (UI optimizada para Desktop).

### Características Clave a Implementar
1.  **Menú Dinámico:** Menú basado en JSON para cambiar ítems fácilmente.
2.  **Sistema de Combos:** Lógica especial para agrupar ítems (característica crítica).
3.  **Geolocalización:** API de Geolocalización del navegador simple para detectar "Tienda Más Cercana" (lógica simulada para zonas válidas).
4.  **Seguimiento en Tiempo Real:** Actualizaciones de estado simuladas (Pedido Realizado -> En Horno -> En Reparto) usando `setInterval`.

## Estructura de Componentes
### [Compartido]
#### [NUEVO] `components/ui`
- Botones, Inputs, Tarjetas, Modales (Primitivas Reutilizables).

### [App Cliente]
#### [NUEVO] `components/layout/BottomNav.tsx`
- Barra de navegación para Inicio, Menú, Carrito, Perfil.
#### [NUEVO] `components/home/BannerSlider.tsx`
- Carrusel de promociones.
#### [NUEVO] `components/menu/ProductCard.tsx`
- Tarjeta de producto de alta resolución con botón "Agregar".
#### [NUEVO] `components/cart/CartDrawer.tsx`
- Resumen del carrito deslizante.

### [Panel de Administración]
#### [NUEVO] `components/admin/OrderBoard.tsx`
- Tablero estilo Kanban para la vista de cocina.

## Plan de Verificación
### Pruebas Automatizadas
- [x] Verificación de construcción (`npm run build`).

### Verificación Manual
- [x] **Flujo de Usuario:** Abrir App -> Navegar Menú -> Agregar Combo -> Checkout -> Rastrear Pedido.
- [x] **Responsividad:** Verificar "Vista Móvil" en navegador de Escritorio.
## Fase 3: Modelo 'WhatsApp-First' (Focus & Free)

### Objetivo
Eliminar complejidad de backend y costos. La "Base de Datos" es el chat de WhatsApp del dueño.
La experiencia de usuario ("Armar Pizza") debe ser el punto fuerte visual.

### Nuevos Componentes
#### [NEW] [PizzaBuilder.tsx](file:///C:/Users/PABLO/.gemini/antigravity/scratch/selfie_pizza/src/components/menu/PizzaBuilder.tsx)
- Interfaz gráfica donde el usuario ve la pizza armándose capa por capa.
- Animaciones de ingredientes cayendo sobre la masa.

#### [NEW] [WhatsAppCheckout.tsx](file:///C:/Users/PABLO/.gemini/antigravity/scratch/selfie_pizza/src/components/cart/WhatsAppCheckout.tsx)
- Formulario simple (Nombre, Dirección, Método de Pago).
- Botón "Enviar Pedido a WhatsApp" que genera un link `wa.me` con el texto formateado:
  ```text
  Hola! Quiero pedir:
  1x Pizza Personalizada (Pepperoni, Champiñones) - $15.00
  Total: $15.00
  Pago con: Efectivo
  Entregar a: Calle Falsa 123
  ```

### Stack "Gratis"
- **Hosting:** Vercel (Gratis).
- **Backend:** WhatsApp (Gratis).
- **Pagos:** Efectivo / Transferencia (Acordado por chat).
