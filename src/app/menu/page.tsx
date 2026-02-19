import { MenuBuilder } from "@/components/menu/MenuBuilder";
import { categories, products } from "@/lib/data";

export default function MenuPage() {
    return <MenuBuilder categories={categories} initialProducts={products} />;
}
