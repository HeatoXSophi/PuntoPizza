"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { orders } from "@/lib/orders";
import { toast } from "sonner";
import { Loader2, RefreshCw, CheckCircle, Truck, XCircle, Clock } from "lucide-react";

export function AdminOrders() {
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orders.getAllOrders();
            setOrdersList(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Real-time subscription
        if (!supabase) return;
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Real-time update:', payload);
                    // Simple refresh strategy for now
                    fetchOrders();
                    if (payload.eventType === 'INSERT') {
                        toast("¡Nuevo Pedido Recibido!", {
                            icon: <span className="text-2xl">🍕</span>,
                            duration: 5000,
                        });
                        // Play sound?
                        const audio = new Audio('/notification.mp3'); // We'll need to add this file or use system sound
                        audio.play().catch(e => console.log("Audio play failed interaction"));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase?.removeChannel(channel);
        };
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orders.updateStatus(orderId, newStatus);
            toast.success(`Pedido actualizado a: ${newStatus}`);
            // Optimistic update
            setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            toast.error("Error actualizando estado");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Comandas en Vivo</h2>
                    <p className="text-sm text-gray-500">Los nuevos pedidos aparecerán automáticamente aquí.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-[#FF5722]' : 'text-gray-600'}`} />
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ordersList.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800">{order.address ? "Delivery" : "Pickup"}</h3>
                            </div>
                            <span className="font-black text-lg text-[#FF5722]">${order.total}</span>
                        </div>

                        {/* Customer Info */}
                        <div className="p-4 text-sm space-y-1 border-b">
                            <p className="font-bold text-gray-800 flex items-center gap-2">
                                👤 {order.profiles?.full_name || order.phone || "Cliente"}
                            </p>
                            {order.address && (
                                <p className="text-gray-600 truncate" title={order.address}>
                                    📍 {order.address}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs">
                                💳 {order.payment_method}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="p-4 flex-1 bg-white">
                            <ul className="space-y-2">
                                {order.items.map((item: any, idx: number) => (
                                    <li key={idx} className="text-sm flex justify-between">
                                        <span className="text-gray-700">
                                            <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-gray-50 border-t grid grid-cols-4 gap-2">
                            <button
                                onClick={() => handleStatusChange(order.id, 'pending')}
                                className="p-2 rounded hover:bg-yellow-100 text-yellow-600 flex justify-center" title="Pendiente">
                                <Clock className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusChange(order.id, 'confirmed')}
                                className="p-2 rounded hover:bg-blue-100 text-blue-600 flex justify-center" title="Confirmar (Cocina)">
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusChange(order.id, 'delivered')}
                                className="p-2 rounded hover:bg-green-100 text-green-600 flex justify-center" title="Entregado">
                                <Truck className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                className="p-2 rounded hover:bg-red-100 text-red-600 flex justify-center" title="Cancelar">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {ordersList.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-400">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                    <p>No hay pedidos registrados aún.</p>
                </div>
            )}
        </div>
    );
}
