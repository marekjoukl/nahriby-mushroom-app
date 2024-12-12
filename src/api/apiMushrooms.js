import supabase from "./supabase";

// Function to get all mushrooms
export async function getMushrooms() {
    const { data, error } = await supabase
        .from("mushrooms")
        .select("*");

    if (error) {
        console.error("Error fetching mushrooms:", error);
        throw new Error(error.message);
    }
    return data;
}

// Function to create a new mushroom entry
export async function createMushroom(data) {
    const { error, data: insertedData } = await supabase
        .from("mushrooms")
        .insert([{ ...data }])
        .select();

    if (error) {
        console.error("Error creating mushroom:", error);
        throw new Error(error.message);
    }
    return insertedData;
}

// Function to get a mushroom by ID
export async function getMushroom(id) {
    const { data, error } = await supabase
        .from("mushrooms")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching mushroom:", error);
        return null; // Return null if there's an error
    }
    return data; // Return the mushroom data
}

// Function to update a mushroom by ID
export async function updateMushroom(id, data) {
    const { error, data: updatedData } = await supabase
        .from("mushrooms")
        .update(data)
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error updating mushroom:", error);
        throw new Error(error.message);
    }
    return updatedData;
}

// Function to delete a mushroom by ID
export async function deleteMushroom(id) {
    const { error } = await supabase
        .from("mushrooms")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting mushroom:", error);
        throw new Error(error.message);
    }
}

// Function to search mushrooms by name
export async function searchMushroomsByName(name) {
    const { data, error } = await supabase
        .from("mushrooms")
        .select("*")
        .ilike("name", `%${name}%`);

    if (error) {
        console.error("Error searching mushrooms:", error);
        throw new Error(error.message);
    }
    return data;
}
