export default function CookiesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white mt-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-black text-[#5D4037] mb-6 decoration-4 underline decoration-[#FF5722]">Política de Cookies</h1>

            <div className="space-y-6 text-gray-600">
                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">¿Qué son las cookies?</h2>
                    <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Nos ayudan a mejorar su experiencia de usuario.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">¿Cómo usamos las cookies?</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Cookies Esenciales:</strong> Necesarias para que el sitio funcione (ej. mantener su carrito de compras).</li>
                        <li><strong>Cookies de Preferencia:</strong> Recuerdan sus ajustes, como el idioma seleccionado.</li>
                        <li><strong>Cookies de Análisis:</strong> Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">Control de Cookies</h2>
                    <p>Puede controlar y/o eliminar las cookies según desee. Consulte la configuración de su navegador para más detalles.</p>
                </section>
            </div>
        </div>
    );
}
