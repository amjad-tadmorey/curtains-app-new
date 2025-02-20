import supabase from "./supabase";

export async function addOrder(newOrder) {
    const { data, error } = await supabase
        .from('orders')
        .insert([
            newOrder,
        ])
        .select()
    if (error) {
        console.log(error);
        throw new Error('Orders could not be loaded')
    }

    return data
}

export async function getOrders() {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
    if (error) {
        console.log(error);
        throw new Error('Orders could not be loaded')
    }
    return orders

}

export async function getOrderById(id) {
    const { data: order, error } = await supabase
        .from('orders').select("*")
        .eq("id", id)
    if (error) {
        console.log(error);
        throw new Error('Order could not be loaded')
    }
    return order[0]
}