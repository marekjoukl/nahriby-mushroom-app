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
      .select('id, image_url')
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
      .select('id, image_url')
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
      .select('id, image_url')
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
