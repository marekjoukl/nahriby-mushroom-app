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
        return null;
    }
    return data;
}


/*export async function updateUserName(id, newName) {
    const { error } = await supabase
        .from("users")
        .update({ name: newName})
        .eq("id", id);

    if (error) {
        console.error("Error updating user name: ", error);
        throw new Error(error.message)
    }
}

export async function updateUserEmail(id, newEmail) {
    const { error } = await supabase
        .from("users")
        .update({ email: newEmail})
        .eq("id", id);

    if (error) {
        console.error("Error updating user email: ", error);
        throw new Error(error.message)
    }
}

export async function updateUserBirthDate(id, newDate) {
    const { error } = await supabase
        .from("users")
        .update({ birth_date: newDate})
        .eq("id", id);

    if (error) {
        console.error("Error updating user birth date: ", error);
        throw new Error(error.message)
    }
}

export async function updateUserName(id, newCountry) {
    const { error } = await supabase
        .from("users")
        .update({ country: newCountry})
        .eq("id", id);

    if (error) {
        console.error("Error updating user country: ", error);
        throw new Error(error.message)
    }
}

export async function updateUserPassword(id, newPassword) {
    const { error } = await supabase
        .from("users")
        .update({ password: newPassword})
        .eq("id", id);

    if (error) {
        console.error("Error updating user password: ", error);
        throw new Error(error.message)
    }
}

export async function updateUserImage(id, newImage) {
    const { error } = await supabase
        .from("users")
        .update({ image_url: newImage})
        .eq("id", id);

    if (error) {
        console.error("Error updating user image: ", error);
        throw new Error(error.message)
    }
}*/
