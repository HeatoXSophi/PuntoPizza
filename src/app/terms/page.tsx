export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white mt-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-black text-[#5D4037] mb-6 decoration-4 underline decoration-[#FF5722]">Términos y Condiciones</h1>

            <div className="space-y-6 text-gray-600">
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">1. Aceptación de los Términos</h2>
                    <p>Al acceder y utilizar el sitio web de Santa Cruz Pizzería, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo, por favor no utilice nuestros servicios.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">2. Pedidos y Pagos</h2>
                    <p>Todos los pedidos están sujetos a disponibilidad y confirmación del precio. Nos reservamos el derecho de rechazar cualquier pedido. Los pagos deben realizarse al momento de la entrega o mediante los métodos de pago en línea habilitados.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">3. Zonas de Reparto</h2>
                    <p>Nuestro servicio de entrega está limitado a áreas específicas. Nos reservamos el derecho de cancelar pedidos fuera de nuestra zona de cobertura.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">4. Modificaciones</h2>
                    <p>Podemos actualizar estos términos en cualquier momento sin previo aviso. Es su responsabilidad revisar esta página periódicamente.</p>
                </section>
            </div>
        </div>
    );
}
