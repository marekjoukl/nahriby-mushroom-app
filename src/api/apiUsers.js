import supabase from "./supabase";

// Function to get all users
export async function getUsers() {
    let { data, error } = await supabase
        .from('users')
        .select('*')

    if (error) {
        console.error("Error fetching users:", error);
        throw new Error(error.message);
    }
    return data;
}

// Function to get a single user by ID
export async function getUser(userId) {
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

// Function to get all locations created by a user
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

// Function to get all mushrooms created by a user
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

// Function to get all recipes created by a user
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

// Function for updating a user
export async function updateUser(id, data) {
    const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
  
// Function for deleting a user
export async function deleteUser(id) {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

// Fetch saved mushrooms for a user by user ID
export async function getUserSavedMushrooms(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_mushrooms')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_mushrooms } = user;
  
      const { data: mushrooms, error: mushroomError } = await supabase
        .from('mushrooms')
        .select('*')
        .in('id', saved_mushrooms || []); // Handle empty arrays gracefully
  
      if (mushroomError) {
        throw new Error(`Error fetching mushrooms: ${mushroomError.message}`);
      }
  
      return mushrooms;
    } catch (error) {
      console.error('Error fetching saved mushrooms:', error);
      return { error: error.message };
    }
}
  
// Fetch saved recipes for a user by user ID
export async function getUserSavedRecipes(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_recipes')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_recipes } = user;
  
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
  
// Fetch saved locations for a user by user ID
export async function getUserSavedLocations(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_locations')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_locations } = user;
  
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

// Fetch 2 saved mushrooms, recipes, and locations for a user by user ID
export async function getTwoUserSavedItems(userId) {
    try {
      // Fetch the user's saved items arrays
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('saved_mushrooms, saved_recipes, saved_locations')
        .eq('id', userId)
        .single();
  
      if (userError) {
        throw new Error(`Error fetching user: ${userError.message}`);
      }
  
      const { saved_mushrooms, saved_recipes, saved_locations } = user;
  
      // Fetch the mushrooms that match the user's saved mushroom IDs
      const { data: mushrooms, error: mushroomError } = await supabase
        .from('mushrooms')
        .select('*')
        .in('id', saved_mushrooms || []) // Handle empty arrays gracefully
        .limit(2);
  
      if (mushroomError) {
        throw new Error(`Error fetching mushrooms: ${mushroomError.message}`);
      }
  
      // Fetch the recipes that match the user's saved recipe IDs
      const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', saved_recipes || [])
        .limit(2);
  
      if (recipeError) {
        throw new Error(`Error fetching recipes: ${recipeError.message}`);
      }
  
      // Fetch the locations that match the user's saved location IDs
      const { data: locations, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .in('id', saved_locations || [])
        .limit(2);
  
      if (locationError) {
        throw new Error(`Error fetching locations: ${locationError.message}`);
      }
  
      // Return an object with the saved items
      return { mushrooms, recipes, locations };
    } catch (error) {
      console.error('Error fetching saved items:', error);
      return { error: error.message };
    }
}

export async function getImageUrl(imagePath, bucketName) {
  if (!imagePath) return null;

  const { data: publicURL, error } = supabase.storage
    .from(bucketName)
    .getPublicUrl(imagePath);

  if (error) {
    console.error(`Error fetching image from ${bucketName}:`, error.message);
    return null;
  }

  return publicURL.publicUrl;
}

export async function uploadImageAndGetUrl(imageFile) {
  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error("Invalid image file");
  }

  try {
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
