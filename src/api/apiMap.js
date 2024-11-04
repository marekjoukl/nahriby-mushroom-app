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
    .insert([{ ...data }])
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
