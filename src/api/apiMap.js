import supabase from "./supabase";

export async function getLocations() {
  const { data, error } = await supabase.from("locations").select("*");
  if (error) {
    console.error("error", error);
    throw new Error(error.message);
  }
  return data;
}

export async function createLocation(data) {
  try {
    // Handle image upload
    let imagePath = "";
    const imageFile = data.imageFile; // Extract imageFile from the input

    if (imageFile && imageFile instanceof File) {
      const { data: uploadData, error } = await supabase.storage
        .from("location-images")
        .upload(`locations/${Date.now()}_${imageFile.name}`, imageFile);

      if (error) {
        throw new Error("Failed to upload image");
      }

      imagePath = uploadData.path;
    }

    // Create a payload excluding the `imageFile` field
    const { imageFile: _, ...payload } = data; // Remove imageFile from payload

    // Add the image path to the payload
    payload.image_url = imagePath;

    // Insert data into the locations table
    const { error: insertError, data: insertedData } = await supabase
      .from("locations")
      .insert([{ ...payload, mushrooms: payload.mushrooms }])
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }
    return insertedData;
  } catch (error) {
    console.error("Failed to create location:", error.message);
    throw error;
  }
}

export async function getImageUrl(imagePath) {
  if (!imagePath) return null;

  const { data: publicURL, error } = supabase.storage
    .from("location-images")
    .getPublicUrl(imagePath);

  if (error) {
    console.error("Error fetching image URL:", error.message);
    return null;
  }

  return publicURL.publicUrl;
}

export async function getLocation(id) {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching location:", error);
    return null; // Return null if there's an error
  }
  return data; // Return the location data
}

export async function updateLocation(id, data) {
  const { error } = await supabase.from("locations").update(data).eq("id", id);
  if (error) throw new Error(error.message);
}

// Delete a location
export async function deleteLocation(id) {
  const { error: commentsError } = await supabase
    .from("comments")
    .delete()
    .eq("location_id", id);
  if (commentsError)
    throw new Error(`Failed to delete comments: ${commentsError.message}`);
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadImageAndGetUrl(imageFile) {
  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error("Invalid image file");
  }

  try {
    const { data: uploadData, error } = await supabase.storage
      .from("location-images")
      .upload(`locations/${Date.now()}_${imageFile.name}`, imageFile);

    if (error) {
      throw new Error("Failed to upload image");
    }

    return uploadData.path;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
}
