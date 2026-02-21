"use client";

import { User, Phone, Bell, Globe, ChevronDown, Bike, Store, MapPin, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { DICTIONARY } from "@/lib/dictionary";
import Link from "next/link";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { motion } from "framer-motion";

export function Header() {
    const {
        deliveryType,
        setDeliveryType,
        address,
        setAddress,
        phoneNumber,
        setPhoneNumber,
        setLocation,
        language,
        setLanguage,
        userName,
        items,
        isProfileOpen,
        setProfileOpen
    } = useCartStore();

    const [showLocationModal, setShowLocationModal] = useState(false);
    const [tempAddress, setTempAddress] = useState("");
    const [tempPhone, setTempPhone] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    // Get current dictionary
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;

    // Initialize temp address and phone from store (only on client)
    useEffect(() => {
        if (address) setTempAddress(address);
        if (phoneNumber) setTempPhone(phoneNumber);
    }, [address, phoneNumber]);

    const handleDeliveryClick = () => {
        setDeliveryType("delivery");
        setShowLocationModal(true);
    };

    const handlePickupClick = () => {
        setDeliveryType("pickup");
        toast.info(t.mode_pickup);
    };

    const toggleLanguage = () => {
        const newLang = language === "es" ? "en" : "es";
        setLanguage(newLang);
        toast.success(newLang === "es" ? "Idioma cambiado a Español" : "Language switched to English");
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t.geo_error);
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const link = `https://www.google.com/maps?q=${latitude},${longitude}`;

                setLocation({ lat: latitude, lng: longitude, link });
                setAddress(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                setTempAddress(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

                setIsLocating(false);
                toast.success(t.geo_success);
            },
            (error) => {
                console.error(error);
                setIsLocating(false);
                toast.error(t.geo_denied);
            }
        );
    };

    const saveDeliveryInfo = () => {
        if (!tempAddress.trim()) {
            toast.error(t.save_addr_error);
            return;
        }
        if (!tempPhone.trim()) {
            toast.error(t.save_phone_error);
            return;
        }
        setAddress(tempAddress);
        setPhoneNumber(tempPhone);
        setShowLocationModal(false);
        toast.success(t.save_success);
    };

    return (
        <>
            <header className="bg-[#FFF8E1] shadow-sm sticky top-0 z-50 transition-all">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

                    {/* LEFT: Logo & Profile */}
                    <div className="flex items-center gap-2 w-1/3">
                        {/* Logo */}
                        <Link href="/" className="shrink-0 mr-1 md:mr-2">
                            <img
                                src="/logo.png"
                                alt="Santa Cruz"
                                className="h-20 w-auto md:h-24 object-contain"
                            />
                        </Link>

                        {/* Profile / Login */}
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => setProfileOpen(true)}
                        >
                            <div className="bg-white p-2 rounded-full shadow-sm text-[#FF5722]">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    {userName ? "Hola," : "Bienvenido"}
                                </span>
                                <span className="text-xs md:text-sm font-black text-[#5D4037] truncate max-w-[80px] md:max-w-[100px]">
                                    {userName || "Ingresar"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: Toggle Pickup/Delivery */}
                    <div className="flex justify-center w-1/3">
                        <div className="flex bg-white rounded-full p-1 shadow-md border border-gray-100">
                            <button
                                onClick={handlePickupClick}
                                className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-[10px] md:text-xs font-bold transition-all duration-300 ${deliveryType === 'pickup' ? 'bg-[#FF5722] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Store className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">Recoger</span>
                            </button>
                            <button
                                onClick={handleDeliveryClick}
                                className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-[10px] md:text-xs font-bold transition-all duration-300 ${deliveryType === 'delivery' ? 'bg-[#FF5722] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Bike className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">Delivery</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Language, Cart, WhatsApp */}
                    <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
                        {/* Language Button (Hidden on very small screens to save space) */}
                        <button
                            onClick={toggleLanguage}
                            className="hidden sm:flex bg-white px-3 py-1.5 rounded-full items-center gap-1.5 shadow-sm border border-gray-100 text-[#5D4037] hover:bg-gray-50 transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-bold">{(language || "es").toUpperCase()}</span>
                        </button>

                        {/* WhatsApp Button */}
                        <a
                            href="https://wa.me/584246802805"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-2 rounded-full shadow-sm text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                        </a>

                        {/* Cart Button */}
                        <Link href="/cart" className="flex-shrink-0">
                            <div className="relative group">
                                <motion.div
                                    key={items?.length}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-[#FF5722] p-2.5 rounded-full shadow-md text-white hover:bg-[#E64A19] transition-colors cursor-pointer flex items-center justify-center min-w-[42px] min-h-[42px]"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </motion.div>
                                {(items?.length || 0) > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                                    >
                                        {items?.length || 0}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </header >

            {/* Profile Sidebar */}
            < ProfileSidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)
            } />

            {/* Location Modal */}
            {
                showLocationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">{t.delivery_title}</h3>
                                <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">{t.phone_label}</label>
                                    <input
                                        type="tel"
                                        value={tempPhone}
                                        onChange={(e) => setTempPhone(e.target.value)}
                                        placeholder={t.phone_placeholder}
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">{t.addr_label}</label>
                                    <textarea
                                        value={tempAddress}
                                        onChange={(e) => setTempAddress(e.target.value)}
                                        placeholder={t.addr_placeholder}
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none resize-none h-24"
                                    />
                                </div>

                                <button
                                    onClick={handleGetLocation}
                                    disabled={isLocating}
                                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-200"
                                >
                                    <MapPin className="w-5 h-5" />
                                    {isLocating ? t.getting_gps : t.get_gps}
                                </button>

                                <button
                                    onClick={saveDeliveryInfo}
                                    className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] transition-colors shadow-lg shadow-orange-200"
                                >
                                    {t.confirm_btn}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
