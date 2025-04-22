import supabase from "./supabase";

export async function getVehicles() {
    const { data, error } = await supabase
        .from('vehicles')
        .select("*")

    if (error) {
        console.log(error);
        throw new Error('data could not be loaded')
    }
    return data
}
