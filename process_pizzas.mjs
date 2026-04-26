import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\PABLO\\Desktop\\Pizza';
const targetDir = 'C:\\Users\\PABLO\\Desktop\\PuntoPizzaWeb\\public\\images\\pizzas';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

const categories = {
    'PEQUEÑA': 'personal',
    'MEDIANA': 'medium',
    'GRANDE': 'large',
    'FAMILIAR': 'family',
    'FAMLIAR': 'family' // Typo in one of the filenames
};

const prices = {
    'personal': 8.50,
    'medium': 12.50,
    'large': 16.50,
    'family': 22.00
};

let sqlStatements = `-- Limpiar pizzas anteriores\nDELETE FROM products WHERE category_id IN ('personal', 'medium', 'large', 'family', 'combos');\n\n`;
sqlStatements += `-- Insertar nuevas pizzas\nINSERT INTO products (category_id, name, description, price, is_available, image_url, base_ingredients) VALUES\n`;

const values = [];

for (const file of files) {
    if (!file.toLowerCase().endsWith('.png') && !file.toLowerCase().endsWith('.jpg')) continue;

    const baseName = file.replace(/\.png|\.jpg/i, '').replace(/\(\d+\)/, '').trim();
    
    // Find category and pizza name
    let categoryKey = Object.keys(categories).find(k => baseName.toUpperCase().includes(k));
    
    if (!categoryKey) continue;

    const categoryId = categories[categoryKey];
    
    // Extract pizza name (everything before the size)
    let pizzaName = baseName.toUpperCase().replace(categoryKey, '').trim();
    pizzaName = pizzaName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    // Normalize file name for URL
    const newFileName = `${pizzaName.toLowerCase().replace(/\s+/g, '_')}_${categoryId}.png`;
    const targetPath = path.join(targetDir, newFileName);
    
    // Copy file
    fs.copyFileSync(path.join(sourceDir, file), targetPath);

    // SQL Value
    const imageUrl = `/images/pizzas/${newFileName}`;
    const price = prices[categoryId] || 10.00;
    const desc = `Deliciosa pizza ${pizzaName} tamaño ${categoryId === 'family' ? 'Familiar Rectangular' : categoryKey.toLowerCase()}`;
    
    values.push(`('${categoryId}', '${pizzaName}', '${desc}', ${price}, true, '${imageUrl}', ARRAY['Salsa de tomate', 'Mozzarella'])`);
}

sqlStatements += values.join(',\n') + ';\n';

fs.writeFileSync('C:\\Users\\PABLO\\Desktop\\PuntoPizzaWeb\\supabase\\004_real_pizzas.sql', sqlStatements);

console.log(`Procesadas ${values.length} pizzas. SQL generado.`);
