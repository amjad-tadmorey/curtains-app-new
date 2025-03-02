import supabase from "./supabase";

export async function getProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select("*")

    if (error) {
        console.log(error);
        throw new Error('Orders could not be loaded')
    }

    return products
}

export async function getProductById(id) {
    const { data: product, error } = await supabase
        .from('products').select("*")
        .eq('id', id)

    if (error) {
        console.log(error);
        throw new Error('product could not be loaded')
    }

    return product[0]
}

export async function createProduct(newProduct) {
    const { data: product, error } = await supabase
        .from('products')
        .insert([
            newProduct,
        ])
        .select()
    if (error) {
        console.log(error);
        throw new Error('Orders could not be loaded')
    }
    return product
}

export async function updateStock(products) {
    let hasInsufficientStock = false;
    let errorMessage = ""; // Store the first error message

    // Step 1: Check stock for all products
    const stockData = {};

    for (const { product, quantity } of products) {
        const code = product.split(" || ")[2];
        const qty = parseFloat(quantity);

        // Fetch the current stock
        const { data, error } = await supabase
            .from("products")
            .select("inStock")
            .eq("id", code)
            .single();

        if (error || !data) {
            console.error(`Failed to fetch stock for ${code}`);
            return { state: false, error: `Failed to fetch stock for product ${code}` };
        }

        if (data.inStock < qty) {
            if (!hasInsufficientStock) {
                errorMessage = `Not enough stock for ${code}. Available: ${data.inStock}, Requested: ${qty}`;
            }
            hasInsufficientStock = true;
        }

        stockData[code] = data.inStock; // Store stock data
    }

    // Step 2: If any product has insufficient stock, return the first error found
    if (hasInsufficientStock) return { state: false, error: errorMessage };

    // Step 3: Update stock for all products
    for (const { product, quantity } of products) {
        const code = product.split(" || ")[2];
        const qty = parseFloat(quantity);

        const newStock = stockData[code] - qty;

        // Update the stock in the database
        const { error } = await supabase
            .from("products")
            .update({ inStock: newStock })
            .eq("id", code);

        if (error) {
            console.error(`Failed to update stock for ${code}`);
            return { state: false, error: `Failed to update stock for product ${code}` };
        }
    }

    return { state: true };
}



