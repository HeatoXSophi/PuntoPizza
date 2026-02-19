import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-background hidden md:flex flex-col">
                <div className="h-16 flex items-center border-b px-6">
                    <span className="text-lg font-bold text-primary">Selfie Admin</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/kitchen">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <UtensilsCrossed className="h-4 w-4" />
                            Cocina
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Button variant="outline" className="w-full gap-2">
                        <LogOut className="h-4 w-4" />
                        Salir
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
