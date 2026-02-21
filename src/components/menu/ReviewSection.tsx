"use client";

import { useState, useEffect } from "react";
import { Star, Send, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    productId: string;
}

function StarRating({ rating, onRate, interactive = false }: {
    rating: number;
    onRate?: (r: number) => void;
    interactive?: boolean;
}) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    disabled={!interactive}
                    onClick={() => onRate?.(star)}
                    className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
                >
                    <Star
                        className={`w-4 h-4 ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}

export function ReviewSection({ productId }: ReviewSectionProps) {
    const { user } = useCartStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    async function loadReviews() {
        if (!supabase) return;
        const { data } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", productId)
            .order("created_at", { ascending: false })
            .limit(10);
        if (data) setReviews(data);
    }

    async function submitReview() {
        if (!supabase || !user) {
            toast.error("Inicia sesión para dejar una reseña");
            return;
        }
        setIsSubmitting(true);
        const { error } = await supabase.from("reviews").insert({
            product_id: productId,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anónimo",
            rating: newRating,
            comment: newComment.trim() || null,
        });

        if (error) {
            toast.error("Error al enviar reseña");
        } else {
            toast.success("¡Reseña enviada!");
            setNewComment("");
            setNewRating(5);
            setShowForm(false);
            loadReviews();
        }
        setIsSubmitting(false);
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-700">Reseñas</h3>
                    {avgRating && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            ⭐ {avgRating} ({reviews.length})
                        </span>
                    )}
                </div>
                {user && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-xs text-[#FF5722] font-medium hover:underline"
                    >
                        {showForm ? "Cancelar" : "Escribir reseña"}
                    </button>
                )}
            </div>

            {/* New Review Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-3"
                    >
                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                            <StarRating rating={newRating} onRate={setNewRating} interactive />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="¿Qué te pareció? (opcional)"
                                className="w-full bg-white rounded-lg p-2 text-sm resize-none h-16 focus:outline-none focus:ring-1 focus:ring-[#FF5722]/30"
                            />
                            <button
                                onClick={submitReview}
                                disabled={isSubmitting}
                                className="flex items-center gap-1.5 bg-[#FF5722] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#E64A19] transition-colors disabled:opacity-50"
                            >
                                <Send className="w-3 h-3" />
                                {isSubmitting ? "Enviando..." : "Enviar"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-2.5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 bg-[#FF5722]/10 rounded-full flex items-center justify-center">
                                    <User className="w-3 h-3 text-[#FF5722]" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">{review.user_name}</span>
                                <StarRating rating={review.rating} />
                            </div>
                            {review.comment && (
                                <p className="text-xs text-gray-500 ml-7">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-400 text-center py-2">
                    Sé el primero en dejar una reseña ✨
                </p>
            )}
        </div>
    );
}
