/**
 * Project: ITU - Mushroom app
 * Author: Aurel Strigac (xstrig00)
 * Date: 15.12. 2024
 */

import supabase from "./supabase";

// Function to get all users
export async function getUsers() {
    let { data, error } = await supabase
        .from('users')
        .select('*');

    // Fetches all users from the 'users' table
    if (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message);
    }
    return data;
}

// Function to get a single user by ID
export async function getUser(userId) {
    // Fetches a single user by 'id'
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }
    return data;
}

// Get all locations created by a specific user
export async function getUserLocations(userId) {
    const { data, error } = await supabase
      .from('locations')
      .select('id, image_url, name')
      .eq('author', userId);
  
    if (error) {
      console.error("Error fetching user locations: ", error);
      throw error;
    }
  
    return data;
}

// Get all mushrooms created by a specific user
export async function getUserMushrooms(userId) {
    const { data, error } = await supabase
      .from('mushrooms')
      .select('id, image_url, name')
      .eq('author', userId);
  
    if (error) {
      console.error("Error fetching user mushrooms: ", error);
      throw error;
    }
  
    return data;
}

// Get all recipes created by a specific user
export async function getUserRecipes(userId) {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, image_url, name')
      .eq('author', userId);
  
    if (error) {
      console.error("Error fetching user recipes: ", error);
      throw error;
    }
  
    return data;
}

// Update a user's information
export async function updateUser(id, data) {
    const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

// Delete a user by ID
export async function deleteUser(id) {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

// Fetch the user's saved mushrooms
export async function getUserSavedMushrooms(userId) {
    try {
      // First get the IDs of saved mushrooms from the 'users' table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_mushrooms')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_mushrooms } = user;
  
      // Fetch the actual mushrooms using their IDs
      const { data: mushrooms, error: mushroomError } = await supabase
        .from('mushrooms')
        .select('*')
        .in('id', saved_mushrooms || []); // If empty, select none
  
      if (mushroomError) {
        throw new Error(`Error fetching mushrooms: ${mushroomError.message}`);
      }
  
      return mushrooms;
    } catch (error) {
      console.error('Error fetching saved mushrooms:', error);
      return { error: error.message };
    }
}
  
// Fetch the user's saved recipes
export async function getUserSavedRecipes(userId) {
    try {
      // First get the IDs of saved recipes from 'users'
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_recipes')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_recipes } = user;
  
      // Fetch recipes by IDs
      const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', saved_recipes || []);
  
      if (recipeError) {
        throw new Error(`Error fetching recipes: ${recipeError.message}`);
      }
  
      return recipes;
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      return { error: error.message };
    }
}
  
// Fetch the user's saved locations
export async function getUserSavedLocations(userId) {
    try {
      // Get the saved location IDs from 'users'
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_locations')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_locations } = user;
  
      // Fetch locations by those IDs
      const { data: locations, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .in('id', saved_locations || []);
  
      if (locationError) {
        throw new Error(`Error fetching locations: ${locationError.message}`);
      }
  
      return locations;
    } catch (error) {
      console.error('Error fetching saved locations:', error);
      return { error: error.message };
    }
}

// Fetch 2 saved items from each category (mushrooms, recipes, locations) for a user
export async function getTwoUserSavedItems(userId) {
    try {
      // First get the arrays of saved items from 'users'
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_mushrooms, saved_recipes, saved_locations')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_mushrooms, saved_recipes, saved_locations } = user;
  
      // Fetch up to 2 saved mushrooms
      const { data: mushrooms, error: mushroomError } = await supabase
        .from('mushrooms')
        .select('*')
        .in('id', saved_mushrooms || [])
        .limit(2);
  
      if (mushroomError) {
        throw new Error(`Error fetching mushrooms: ${mushroomError.message}`);
      }
  
      // Fetch up to 2 saved recipes
      const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', saved_recipes || [])
        .limit(2);
  
      if (recipeError) {
        throw new Error(`Error fetching recipes: ${recipeError.message}`);
      }
  
      // Fetch up to 2 saved locations
      const { data: locations, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .in('id', saved_locations || [])
        .limit(2);
  
      if (locationError) {
        throw new Error(`Error fetching locations: ${locationError.message}`);
      }
  
      return { mushrooms, recipes, locations };
    } catch (error) {
      console.error('Error fetching saved items:', error);
      return { error: error.message };
    }
}

// Get a public URL for an image stored in a given bucket
export async function getImageUrl(imagePath, bucketName) {
  if (!imagePath) return null;

  const { data: publicURL, error } = supabase.storage
    .from(bucketName)
    .getPublicUrl(imagePath);

  if (error) {
    console.error(`Error fetching image from ${bucketName}:`, error.message);
    return null;
  }

  // Returns a publicly accessible URL to the stored image
  return publicURL.publicUrl;
}

// Upload an image file to the "user-images" bucket and return its storage path
export async function uploadImageAndGetUrl(imageFile) {
  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error("Invalid image file");
  }

  try {
    // Uploads the file with a unique name (timestamp + original name)
    const { data: uploadData, error } = await supabase.storage
      .from("user-images")
      .upload(`users/${Date.now()}_${imageFile.name}`, imageFile);

    if (error) {
      throw new Error("Failed to upload image");
    }

    return uploadData.path;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
}
