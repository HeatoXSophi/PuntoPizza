"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    TrendingUp, ShoppingBag, DollarSign, Clock,
    BarChart3, Users, Star, Package
} from "lucide-react";
import { motion } from "framer-motion";

interface SalesData {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    topProducts: { name: string; count: number }[];
    recentOrders: number;
    totalCustomers: number;
    avgRating: number;
    ordersByStatus: Record<string, number>;
}

function StatCard({ icon: Icon, label, value, color, delay }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-lg font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function AdminAnalytics() {
    const [data, setData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("week");

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    async function loadAnalytics() {
        if (!supabase) return;
        setLoading(true);

        // Calculate date filter
        const now = new Date();
        let fromDate = new Date(0); // Default: all time
        if (timeRange === "today") {
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (timeRange === "week") {
            fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (timeRange === "month") {
            fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Fetch orders
        const { data: orders } = await supabase
            .from("orders")
            .select("*")
            .gte("created_at", fromDate.toISOString());

        // Fetch reviews for avg rating
        const { data: reviews } = await supabase
            .from("reviews")
            .select("rating");

        // Fetch unique customers
        const { count: customerCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        // Process data
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Count product frequency from order items
        const productCounts: Record<string, number> = {};
        orders?.forEach(order => {
            const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
            items.forEach((item: any) => {
                productCounts[item.name] = (productCounts[item.name] || 0) + (item.quantity || 1);
            });
        });

        const topProducts = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Order status counts
        const ordersByStatus: Record<string, number> = {};
        orders?.forEach(order => {
            const status = order.status || "pending";
            ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
        });

        // Avg rating
        const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        // Recent orders (last 24h)
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentOrders = orders?.filter(o =>
            new Date(o.created_at) >= yesterday
        ).length || 0;

        setData({
            totalOrders,
            totalRevenue,
            avgOrderValue,
            topProducts,
            recentOrders,
            totalCustomers: customerCount || 0,
            avgRating,
            ordersByStatus,
        });
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-20 shadow-sm" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const statusLabels: Record<string, string> = {
        pending: "Pendiente",
        preparing: "Preparando",
        delivering: "En Camino",
        delivered: "Entregado",
        cancelled: "Cancelado",
    };

    return (
        <div className="space-y-4">
            {/* Time Range Selector */}
            <div className="flex gap-2">
                {(["today", "week", "month", "all"] as const).map(range => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeRange === range
                                ? "bg-[#FF5722] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {range === "today" ? "Hoy" : range === "week" ? "Semana" : range === "month" ? "Mes" : "Todo"}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard icon={ShoppingBag} label="Pedidos" value={data.totalOrders} color="bg-blue-500" delay={0} />
                <StatCard icon={DollarSign} label="Ingresos" value={`$${data.totalRevenue.toFixed(2)}`} color="bg-green-500" delay={0.05} />
                <StatCard icon={TrendingUp} label="Ticket Promedio" value={`$${data.avgOrderValue.toFixed(2)}`} color="bg-purple-500" delay={0.1} />
                <StatCard icon={Clock} label="Últimas 24h" value={data.recentOrders} color="bg-orange-500" delay={0.15} />
                <StatCard icon={Users} label="Clientes" value={data.totalCustomers} color="bg-indigo-500" delay={0.2} />
                <StatCard icon={Star} label="Rating" value={data.avgRating > 0 ? `⭐ ${data.avgRating.toFixed(1)}` : "—"} color="bg-yellow-500" delay={0.25} />
            </div>

            {/* Top Products */}
            {data.topProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-[#FF5722]" />
                        <h3 className="text-sm font-bold text-gray-700">Más Vendidos</h3>
                    </div>
                    <div className="space-y-2">
                        {data.topProducts.map((product, i) => (
                            <div key={product.name} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full flex items-center px-2"
                                        style={{
                                            width: `${Math.max(20, (product.count / data.topProducts[0].count) * 100)}%`
                                        }}
                                    >
                                        <span className="text-[10px] text-white font-medium truncate">
                                            {product.name}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-6 text-right">{product.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Order Status */}
            {Object.keys(data.ordersByStatus).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-[#FF5722]" />
                        <h3 className="text-sm font-bold text-gray-700">Estado de Pedidos</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(data.ordersByStatus).map(([status, count]) => (
                            <span
                                key={status}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${status === "delivered" ? "bg-green-100 text-green-700" :
                                        status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                            status === "preparing" ? "bg-blue-100 text-blue-700" :
                                                status === "delivering" ? "bg-purple-100 text-purple-700" :
                                                    "bg-red-100 text-red-700"
                                    }`}
                            >
                                {statusLabels[status] || status}: {count}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
