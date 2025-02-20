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