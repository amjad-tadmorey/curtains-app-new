import supabase from "./supabase";

export async function getReference() {
    const { data, error } = await supabase
        .from('reference')
        .select("*")

    if (error) {
        console.log(error);
        throw new Error('data could not be loaded')
    }
    return data[0]
}
