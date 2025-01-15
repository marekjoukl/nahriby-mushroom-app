/**
 * Project: ITU - Mushroom app
 * Author: Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */

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
    // Handle image upload
    let imagePath = "";
    const imageFile = data.imageFile; // Extract imageFile from the input

    if (imageFile && imageFile instanceof File) {
        const { data: uploadData, error } = await supabase.storage
            .from("mushrooms-images")
            .upload(`mushrooms/${Date.now()}_${imageFile.name}`, imageFile);

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
        .from("mushrooms")
        .insert([{ ...payload }])
        .select();

    if (error) {
        console.error("Error creating mushroom:", error);
        throw new Error(error.message);
    }
    return insertedData;
}

// Function to get the public URL of an image
export async function getImageUrl(imagePath) {
    if (!imagePath) return null;

    const { data: publicURL, error } = supabase.storage
        .from("mushrooms-images")
        .getPublicUrl(imagePath);

    if (error) {
        console.error("Error fetching image URL:", error.message);
        return null;
    }

    return publicURL.publicUrl;
}

// Function to upload an image and get its URL
export async function uploadImageAndGetUrl(imageFile) {
    if (!imageFile || !(imageFile instanceof File)) {
        throw new Error("Invalid image file");
    }

    try {
        const { data: uploadData, error } = await supabase.storage
            .from("mushrooms-images")
            .upload(`mushrooms/${Date.now()}_${imageFile.name}`, imageFile);

        if (error) {
            console.error("Upload error details:", error); // Debugging information
            throw new Error("Failed to upload image");
        }

        return uploadData.path;
    } catch (error) {
        console.error("Error uploading image:", error.message);
        throw error;
    }
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
    let imageUrl = await uploadImageAndGetUrl(data.imageFile);
    const { imageFile: _, ...payload } = data;

    if (data.imageFile.name !== "") {
        // Add the image path to the payload
        payload.image_url = imageUrl;
    }
    
    const { error, data: updatedData } = await supabase
        .from("mushrooms")
        .update(payload)
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

// Function to get mushrooms by toxicity level
export async function getMushroomsByToxicity(toxicity) {
    let query = supabase.from("mushrooms").select("*");

    if (toxicity && toxicity !== "ALL") {
        const toxicityLevel = toxicity === "EDIBLE" ? 1 : toxicity === "WARNING" ? 2 : 3;
        query = query.eq("toxicity", toxicityLevel);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching mushrooms by toxicity:", error);
        throw new Error(error.message);
    }
    return data;
}
