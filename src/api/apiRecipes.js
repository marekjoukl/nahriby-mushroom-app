import supabase from "./supabase";

export async function getRecipes() {
    const { data, error } = await supabase.from("recipes").select("*");
    if (error) {
        console.error("error", error);
        throw new Error(error.message);
    }
    return data;
}

export async function createRecipes(data) {
    const { error, data: insertedData } = await supabase
        .from("recipes")
        .insert([{ ...data }])
        .select();

    if (error) {
        console.error("error", error);
        throw new Error(error.message);
    }
    return insertedData;
}

export async function getRecipe(id) {
    const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error getting recipe: ", error);
        return null;
    }
    return data;
}

export async function updateRecipeRating(id, newRating) {
    const { error } = await supabase
        .from("recipes")
        .update({ rating: newRating})
        .eq("id", id);

    if (error) {
        console.error("Error updating recipe rating: ", error);
        throw new Error(error.message)
    }
}

export async function updateRecipe(id, data) {
    const { error } = await supabase
        .from("recipes")
        .update(data)
        .eq("id", id);

    if (error) {
        console.error("Error updating recipe:", error);
        throw new Error(error.message);
    }
}

export async function deleteRecipe(id) {
    const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting recipe: ", error);
        throw new Error(error.message);
    }
}