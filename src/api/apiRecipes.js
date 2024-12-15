/**
 * Project: ITU - Mushroom app
 * Author: Igor Mikula (xmikul74)
 * Date: 15.12. 2024
 */

import supabase from "./supabase";

export async function getRecipes() {
    // Old version
    const { data, error } = await supabase.from("recipes").select("*");
    if (error) {
        console.error("error", error);
        throw new Error(error.message);
    }
    return data;
}

export async function filterRecipes(searchQuery) {
    if (!searchQuery) {
        throw new Error("Search query is empty");
    }

    // Filtering recipes based on their name
    const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .ilike("name", `%${searchQuery}%`);

    if (error) {
        console.error("Error filtering recipes:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function createRecipes(data) {
    // Handle image upload
    let imagePath = "";
    const imageFile = data.imageFile; // Extract imageFile from the input

    if (imageFile && imageFile instanceof File) {
    const { data: uploadData, error } = await supabase.storage
        .from("recipe-images")
        .upload(`recipes/${Date.now()}_${imageFile.name}`, imageFile);

    if (error) {
        throw new Error("Failed to upload image");
    }

    imagePath = uploadData.path;
    }

    // Create a payload excluding the `imageFile` field
    const { imageFile: _, ...payload } = data; // Remove imageFile from payload

    // Add the image path to the payload
    payload.image_url = imagePath;

    const { error, data: insertedData } = await supabase
        .from("recipes")
        .insert([payload])
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

export async function uploadImageAndGetUrl(imageFile) {
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error("Invalid image file");
    }
  
    try {
      const { data: uploadData, error } = await supabase.storage
        .from("recipe-images")
        .upload(`recipes/${Date.now()}_${imageFile.name}`, imageFile);
  
      if (error) {
        throw new Error("Failed to upload image");
      }
  
      return uploadData.path;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw error;
    }
  }


  export async function getImageUrl(imagePath) {
    if (!imagePath) return null;
  
    const { data: publicURL, error } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(imagePath);
  
    if (error) {
      console.error("Error fetching image URL:", error.message);
      return null;
    }
  
    return publicURL.publicUrl;
  }

// Returning rating thats average of every users rating
export async function addRecipeRating(recipeId, userId, rating) {
    // Add new rating to the table
    const { error } = await supabase
        .from("recipe_ratings")
        .upsert({ recipe_id: recipeId, user_id: userId, rating }, { onConflict: ["recipe_id", "user_id"] });

    if (error) {
        console.error("Error adding rating:", error.message);
        throw new Error(error.message);
    }

    // Calculate average
    const { data, error: avgError } = await supabase
        .from("recipe_ratings")
        .select("rating")
        .eq("recipe_id", recipeId);

    if (avgError) {
        console.error("Error fetching ratings for averaging:", avgError.message);
        throw new Error(avgError.message);
    }

    const averageRating =
        data.reduce((sum, entry) => sum + entry.rating, 0) / data.length;

    // Actualize value in database
    const { error: updateError } = await supabase
        .from("recipes")
        .update({ rating: averageRating })
        .eq("id", recipeId);

    if (updateError) {
        console.error("Error updating average rating:", updateError.message);
        throw new Error(updateError.message);
    }

    return averageRating;
}