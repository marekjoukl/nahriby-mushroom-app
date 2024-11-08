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
  const { error, data: insertedData } = await supabase
    .from("locations")
    .insert([{ ...data, mushrooms: data.mushrooms }])
    .select();

  if (error) {
    console.error("error", error);
    throw new Error(error.message);
  }
  return insertedData;
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
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
