import supabase from "./supabase";

export async function getSchedule() {
    const { data, error } = await supabase
        .from('schedule')
        .select("*")

    if (error) {
        console.log(error);
        throw new Error('data could not be loaded')
    }
    return data
}

export async function addToSchedule(newSchedule) {
    const { data, error } = await supabase
        .from('schedule')
        .insert([
            newSchedule,
        ])
        .select()
    if (error) {
        throw new Error('schedule could not be loaded')
    }
    return data
}


