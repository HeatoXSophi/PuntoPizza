"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const orders = [
    {
        id: "ORD-001",
        status: "pending",
        items: ["Pepperoni Lovers (L)", "Coca Cola 2L"],
        time: "10:30 AM",
    },
    {
        id: "ORD-002",
        status: "cooking",
        items: ["Combo Familiar", "Extra Queso"],
        time: "10:32 AM",
    },
    {
        id: "ORD-003",
        status: "ready",
        items: ["Suprema (M)"],
        time: "10:25 AM",
    },
];

export default function KitchenPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Cocina</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Pending Column */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Pendientes</h2>
                    {orders.filter(o => o.status === 'pending').map(order => (
                        <Card key={order.id} className="border-l-4 border-l-yellow-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex justify-between">
                                    <span>#{order.id}</span>
                                    <span className="text-xs font-normal text-muted-foreground">{order.time}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm list-disc pl-4 mb-4">
                                    {order.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                                <Button className="w-full" size="sm">Empezar a Cocinar</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Cooking Column */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">En Horno</h2>
                    {orders.filter(o => o.status === 'cooking').map(order => (
                        <Card key={order.id} className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex justify-between">
                                    <span>#{order.id}</span>
                                    <span className="text-xs font-normal text-muted-foreground">{order.time}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm list-disc pl-4 mb-4">
                                    {order.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">Pagar</Button>
                                    <Button size="sm" className="flex-1">Listo</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Ready Column */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Listos / Entrega</h2>
                    {orders.filter(o => o.status === 'ready').map(order => (
                        <Card key={order.id} className="border-l-4 border-l-green-500 bg-muted/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex justify-between">
                                    <span>#{order.id}</span>
                                    <span className="text-xs font-normal text-muted-foreground">{order.time}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm list-disc pl-4 mb-4">
                                    {order.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                                <Button variant="secondary" className="w-full" size="sm">Despachar</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
