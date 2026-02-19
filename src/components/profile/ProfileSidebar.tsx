"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, MapPin, ChevronRight, Pizza } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { DICTIONARY } from "@/lib/dictionary";

export function ProfileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { userName, setUserName, phoneNumber, setPhoneNumber, address, setAddress, language } = useCartStore();

    // Get current dictionary
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;

    // UI States: 'view' (logged in), 'edit' (form), 'welcome' (no user)
    const [viewState, setViewState] = useState<"view" | "edit" | "welcome">("welcome");

    const [localName, setLocalName] = useState("");
    const [localPhone, setLocalPhone] = useState("");
    const [localAddress, setLocalAddress] = useState("");

    // Initialize state based on user existence
    useEffect(() => {
        if (isOpen) {
            if (userName) {
                setViewState("view");
                setLocalName(userName);
                setLocalPhone(phoneNumber);
                setLocalAddress(address);
            } else {
                setViewState("welcome");
                setLocalName("");
                setLocalPhone("");
                setLocalAddress("");
            }
        }
    }, [isOpen, userName, phoneNumber, address]);

    const handleSave = () => {
        if (!localName.trim() || !localPhone.trim()) {
            toast.error(language === 'es' ? "Nombre y teléfono son obligatorios" : "Name and phone are required");
            return;
        }
        setUserName(localName);
        setPhoneNumber(localPhone);
        setAddress(localAddress);
        setViewState("view");
        toast.success(t.profile_created);
    };

    const handleLogout = () => {
        setUserName("");
        setPhoneNumber("");
        setAddress("");
        setViewState("welcome");
        toast.success(t.logout_success);
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
                            {userName ? <User className="w-6 h-6" /> : <Pizza className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">
                                {viewState === 'welcome' ? t.welcome : (userName || t.guest)}
                            </h2>
                            <p className="text-xs opacity-90">
                                {viewState === 'welcome' ? t.app_name : (phoneNumber || t.vip)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* --- CONTENT --- */}
                <div className="flex-1 overflow-y-auto h-[calc(100%-88px)] relative">

                    {/* VIEW: WELCOME (No User) */}
                    {viewState === "welcome" && (
                        <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-12 h-12 text-[#FF5722]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">{t.welcome_title}</h3>
                                <p className="text-gray-500 text-sm">{t.welcome_text}</p>
                            </div>

                            <button
                                onClick={() => setViewState("edit")}
                                className="w-full bg-[#FF5722] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:bg-[#F4511E] transition-all transform hover:scale-105"
                            >
                                {t.create_account}
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-gray-400 mt-4">{t.no_password}</p>
                        </div>
                    )}

                    {/* VIEW: LOGGED IN (View Profile) */}
                    {viewState === "view" && (
                        <div className="p-6 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">{t.name_label}</label>
                                    <p className="font-semibold text-gray-800 text-lg">{userName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">{t.phone_profile_label}</label>
                                    <p className="font-semibold text-gray-800 text-lg">{phoneNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">{t.addr_profile_label}</label>
                                    <p className="font-semibold text-gray-800 text-base leading-snug">
                                        {address || "---"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setLocalName(userName);
                                    setLocalPhone(phoneNumber);
                                    setLocalAddress(address);
                                    setViewState("edit");
                                }}
                                className="w-full bg-white border-2 border-[#FF5722] text-[#FF5722] font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors"
                            >
                                {t.edit_profile}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-gray-400 font-semibold text-sm hover:text-red-500 py-2"
                            >
                                {t.logout}
                            </button>
                        </div>
                    )}

                    {/* VIEW: EDIT / REGISTER (Form) */}
                    {viewState === "edit" && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right duration-200">
                            <h3 className="text-gray-800 font-bold text-lg mb-4">
                                {userName ? t.edit_title : t.create_title}
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" /> {t.name_label} *
                                    </label>
                                    <input
                                        type="text"
                                        value={localName}
                                        onChange={(e) => setLocalName(e.target.value)}
                                        placeholder={t.name_placeholder}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> {t.phone_profile_label} *
                                    </label>
                                    <input
                                        type="tel"
                                        value={localPhone}
                                        onChange={(e) => setLocalPhone(e.target.value)}
                                        placeholder="+34 600 000 000"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF5722] outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {t.addr_profile_label}
                                    </label>
                                    <textarea
                                        value={localAddress}
                                        onChange={(e) => setLocalAddress(e.target.value)}
                                        placeholder={t.addr_profile_placeholder}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FF5722] outline-none resize-none h-24"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setViewState(userName ? "view" : "welcome")}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-[2] bg-[#FF5722] text-white font-bold py-3 rounded-xl hover:bg-[#F4511E] shadow-lg shadow-orange-200"
                                >
                                    {t.save_profile}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
