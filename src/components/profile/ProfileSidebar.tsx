"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, MapPin, ChevronRight, Pizza, Mail, Lock, LogOut, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { DICTIONARY } from "@/lib/dictionary";
import { auth } from "@/lib/auth";

export function ProfileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const {
        userName, setUserName,
        phoneNumber, setPhoneNumber,
        address, setAddress,
        language,
        user, setUser,
        setEmail
    } = useCartStore();

    // Get current dictionary
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;

    // UI States: 'view' (logged in), 'login' (form), 'register' (form), 'welcome' (landing)
    const [viewState, setViewState] = useState<"view" | "login" | "register" | "welcome">("welcome");
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");
    const [addressInput, setAddressInput] = useState("");

    // Initialize state based on user existence
    useEffect(() => {
        if (isOpen) {
            if (user) {
                setViewState("view");
            } else {
                setViewState("welcome");
            }
        }
    }, [isOpen, user]);

    const handleLogin = async () => {
        if (!emailInput || !passwordInput) {
            toast.error("Email y contraseña requeridos");
            return;
        }

        setIsLoading(true);
        try {
            const { user: authUser } = await auth.login(emailInput, passwordInput);
            if (authUser) {
                setUser(authUser);
                setEmail(authUser.email || "");

                // Fetch profile data
                const profile = await auth.getProfile(authUser.id);
                if (profile) {
                    setUserName(profile.full_name);
                    setPhoneNumber(profile.phone);
                    setAddress(profile.address);
                }

                toast.success(`Bienvenido de nuevo, ${profile?.full_name || "Usuario"}`);
                setViewState("view");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al iniciar sesión");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!emailInput || !passwordInput || !nameInput || !phoneInput) {
            toast.error("Todos los campos marcados con * son obligatorios");
            return;
        }

        setIsLoading(true);
        try {
            const { user: newUser } = await auth.register(emailInput, passwordInput, {
                full_name: nameInput,
                phone: phoneInput,
                address: addressInput
            });

            if (newUser) {
                setUser(newUser);
                setEmail(newUser.email || "");
                setUserName(nameInput);
                setPhoneNumber(phoneInput);
                setAddress(addressInput);

                toast.success("¡Cuenta creada exitosamente!");
                setViewState("view");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al registrarse");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await auth.logout();
            setUser(null);
            setUserName("");
            setPhoneNumber("");
            setAddress("");
            setEmail("");
            setViewState("welcome");
            toast.success("Sesión cerrada");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[60]"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0`}>

                {/* --- HEADER --- */}
                <div className="bg-[#FF5722] p-6 text-white flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#FF5722]">
                            {user ? <User className="w-6 h-6" /> : <Pizza className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">
                                {user ? (userName || "Usuario") : "Bienvenido"}
                            </h2>
                            <p className="text-xs opacity-90">
                                {user ? (phoneNumber || user.email) : "A Punto Pizza"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* --- CONTENT --- */}
                <div className="flex-1 overflow-y-auto h-[calc(100%-88px)] relative p-6">

                    {/* VIEW: WELCOME */}
                    {viewState === "welcome" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-12 h-12 text-[#FF5722]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">¡Hola! 👋</h3>
                                <p className="text-gray-500 text-sm">
                                    Crea tu perfil para realizar pedidos más rápido y guardar tus direcciones favoritas.
                                </p>
                            </div>

                            <button
                                onClick={() => setViewState("register")}
                                className="w-full bg-[#FF5722] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:bg-[#F4511E] transition-all"
                            >
                                Crear mi Cuenta
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setViewState("login")}
                                className="text-[#FF5722] font-bold text-sm hover:underline"
                            >
                                ¿Ya tienes cuenta? Ingresar
                            </button>
                        </div>
                    )}

                    {/* VIEW: LOGGED IN */}
                    {viewState === "view" && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Nombre</label>
                                    <p className="font-semibold text-gray-800 text-lg">{userName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Teléfono</label>
                                    <p className="font-semibold text-gray-800 text-lg">{phoneNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Dirección</label>
                                    <p className="font-semibold text-gray-800 text-base leading-snug">
                                        {address || "---"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                Cerrar Sesión
                            </button>
                        </div>
                    )}

                    {/* VIEW: LOGIN */}
                    {viewState === "login" && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-200">
                            <h3 className="text-gray-800 font-bold text-xl">Iniciar Sesión</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="email"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                            placeholder="ejemplo@email.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="password"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                            placeholder="******"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] shadow-lg shadow-orange-200 flex justify-center items-center"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Ingresar"}
                            </button>

                            <button onClick={() => setViewState("welcome")} className="w-full text-gray-500 text-sm hover:underline">
                                Volver
                            </button>
                        </div>
                    )}

                    {/* VIEW: REGISTER */}
                    {viewState === "register" && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-200">
                            <h3 className="text-gray-800 font-bold text-xl">Crear Cuenta</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                        placeholder="Juan Perez"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block">Teléfono *</label>
                                    <input
                                        type="tel"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                        placeholder="+58 424..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block">Email *</label>
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block">Contraseña *</label>
                                    <input
                                        type="password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block">Dirección (Opcional)</label>
                                    <textarea
                                        value={addressInput}
                                        onChange={(e) => setAddressInput(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#FF5722] outline-none h-20 resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={isLoading}
                                className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] shadow-lg flex justify-center items-center"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Registrarse"}
                            </button>

                            <button onClick={() => setViewState("welcome")} className="w-full text-gray-500 text-sm hover:underline">
                                Cancelar
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
