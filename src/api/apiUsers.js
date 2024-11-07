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
export async function getUser(id) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return null; // Return null if there's an error
    }
    return data; // Return the user data
}

