export const products = [
    {
        id: "1",
        name: "Pepperoni Lovers",
        description: "Doble pepperoni, extra queso mozzarella y salsa de tomate especial.",
        price: 12.99,
        category: "medium", // Mapped to a pizza size
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400",
        isPopular: true,
    },
    {
        id: "2",
        name: "Suprema",
        description: "Pepperoni, salchicha italiana, pimientos, cebolla y aceitunas negras.",
        price: 14.50,
        category: "family", // Mapped to a pizza size
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
        isSpicy: true,
    },
    {
        id: "3",
        name: "Combo Familiar",
        description: "2 Pizzas Grandes + Coca Cola 2L + Palitos de Ajo.",
        price: 25.99,
        category: "combos",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "4",
        name: "Coca Cola",
        description: "Botella de 2 Litros.",
        price: 3.50,
        category: "drinks",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "5",
        name: "Brownie con Helado",
        description: "Delicioso brownie caliente con helado de vainilla.",
        price: 5.99,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=400",
    },
];

export const categories = [
    { id: "all", name: "Todas" },
    { id: "personal", name: "Pequeña" },
    { id: "medium", name: "Mediana" },
    { id: "large", name: "Grande" },
    { id: "family", name: "Familiar" },
    { id: "pasta", name: "Pastas" },
    { id: "combos", name: "Combos" },
    { id: "promos", name: "Promociones" },
    { id: "desserts", name: "Postres" },
    { id: "drinks", name: "Bebidas" },
];
