"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MapPin, Phone, Mail, Save, History, ArrowLeft, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { userName, email, phoneNumber, address, orders, setUserName, setEmail, setPhoneNumber, setAddress } = useCartStore();
    const isHydrated = useHydrated();
    const router = useRouter();

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    useEffect(() => {
        if (isHydrated) {
            setFormData({
                userName: userName || "",
                email: email || "",
                phoneNumber: phoneNumber || "",
                address: address || ""
            });
        }
    }, [isHydrated, userName, email, phoneNumber, address]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setUserName(formData.userName);
        setEmail(formData.email);
        setPhoneNumber(formData.phoneNumber);
        setAddress(formData.address);
        toast.success("¡Perfil actualizado correctamente!");
    };

    if (!isHydrated) return <div className="p-8 text-center bg-[#F5F5F7] min-h-screen pt-20">Cargando perfil...</div>;

    return (
        <div className="p-4 pb-24 max-w-lg mx-auto space-y-6 pt-6">
            <div className="flex justify-between items-center">
                <Link href="/">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
                        <ArrowLeft className="h-5 w-5" /> Volver al Inicio
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => router.push("/")}
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shadow-inner border-4 border-white">
                    <User className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">{formData.userName || "Tu Nombre"}</h1>
                    <p className="text-muted-foreground">{formData.email || "tu@email.com"}</p>
                </div>
            </div>

            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Información Personal
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <User className="w-4 h-4 text-muted-foreground" /> Nombre Completo
                        </label>
                        <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-muted-foreground" /> Correo Electrónico
                        </label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ej: juan@gmail.com"
                            type="email"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-muted-foreground" /> Teléfono / WhatsApp
                        </label>
                        <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Ej: 0412-1234567"
                            type="tel"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" /> Dirección de Entrega
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Dirección Predeterminada
                        </label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Ej: Urb. Los Mangos, Casa #15..."
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Esta dirección se usará automáticamente en tus pedidos de delivery.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" /> Historial de Pedidos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {orders && orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <p className="font-bold text-sm">{new Date(order.date).toLocaleDateString()} - {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-xs text-muted-foreground">{order.items.length} productos • {order.method}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">${order.total.toFixed(2)}</p>
                                            {order.totalBs && <p className="text-xs text-gray-500">Bs. {order.totalBs.toFixed(2)}</p>}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-1">
                                        {order.items.map(i => i.name).join(", ")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">
                            Aún no has realizado pedidos.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Button
                onClick={handleSave}
                className="w-full h-12 text-lg font-bold gap-2 shadow-xl shadow-green-100 hover:scale-[1.02] transition-transform bg-green-600 hover:bg-green-700 text-white"
            >
                <Save className="h-5 w-5" /> Guardar Cambios
            </Button>
        </div>
    );
}
