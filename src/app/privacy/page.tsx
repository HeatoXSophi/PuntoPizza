export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white mt-8 rounded-xl shadow-sm">
            <h1 className="text-3xl font-black text-[#5D4037] mb-6 decoration-4 underline decoration-[#FF5722]">Política de Privacidad</h1>

            <div className="space-y-6 text-gray-600">
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">1. Información que Recopilamos</h2>
                    <p>En Santa Cruz Pizzería, recopilamos información personal que usted nos proporciona voluntariamente al realizar un pedido, crear una cuenta o contactarnos. Esto puede incluir su nombre, dirección, número de teléfono y dirección de correo electrónico.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">2. Uso de la Información</h2>
                    <p>Utilizamos su información para:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Procesar y entregar sus pedidos de pizza.</li>
                        <li>Comunicarnos con usted sobre el estado de su pedido.</li>
                        <li>Mejorar nuestros servicios y experiencia del cliente.</li>
                        <li>Enviar promociones y ofertas (si ha optado por recibirlas).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">3. Protección de Datos</h2>
                    <p>Implementamos medidas de seguridad para proteger su información personal. No vendemos ni compartimos sus datos con terceros no afiliados para fines de marketing.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#FF5722] mb-2">4. Contacto</h2>
                    <p>Si tiene preguntas sobre nuestra política de privacidad, contáctenos a través de WhatsApp o nuestro correo electrónico.</p>
                </section>
            </div>
        </div>
    );
}
