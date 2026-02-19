"use client";

import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DICTIONARY } from "@/lib/dictionary";

export function Footer() {
    const { language } = useCartStore();
    const t = DICTIONARY[language || "es"] || DICTIONARY.es;

    return (
        <footer className="bg-[#0F172A] text-white pt-16 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-white">
                                S
                            </div>
                            <span className="text-xl font-heading font-bold tracking-tight">
                                Santa Cruz <span className="text-primary">Pizzería</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t.footer_brand_desc}
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6">{t.footer_links}</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    {t.footer_home}
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    {t.footer_menu}
                                </Link>
                            </li>
                            <li>
                                <Link href="/nosotros" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    {t.footer_history}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    {t.footer_contact}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6">{t.footer_contact_title}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>Puerta Maraven, Urb. Manaure,<br />Punto Fijo, Falcón, Venezuela</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>+58 424-6802805</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>contacto@santacruz.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Map / Hours */}
                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6">{t.footer_hours_title}</h4>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-400">{t.footer_days_week}</span>
                                <span className="font-bold">5:00 PM - 11:00 PM</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-400">{t.footer_days_weekend}</span>
                                <span className="font-bold text-primary">5:00 PM - 12:00 AM</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-400">{t.footer_days_sunday}</span>
                                <span className="font-bold">5:00 PM - 11:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Santa Cruz Pizzería. {t.footer_rights}
                    </p>
                    <div className="flex gap-6 text-gray-500 text-xs">
                        <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-white transition-colors">Términos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
