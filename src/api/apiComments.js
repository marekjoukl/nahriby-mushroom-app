import supabase from "./supabase";

export async function createComment(data) {
  const { error, data: insertedData } = await supabase
    .from("comments")
    .insert([{ ...data }])
    .select("id");

  if (error) {
    console.error("Error creating comment:", error);
    throw new Error(error.message);
  }

  return insertedData[0].id; // Return the new comment ID
}

export async function getCommentsByLocation(locationId) {
  try {
    // Step 1: Get the location to retrieve its comments array
    const { data: location, error: locationError } = await supabase
      .from("locations")
      .select("comments")
      .eq("id", locationId)
      .single();

    if (locationError) {
      console.error("Error fetching location:", locationError);
      throw new Error(locationError.message);
    }

    // Check if comments exist; if not, return an empty array
    const commentIds = location.comments || [];
    if (commentIds.length === 0) {
      return []; // No comments to fetch
    }

    // Step 2: Fetch all comments with IDs in the comments array
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .in("id", commentIds);

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      throw new Error(commentsError.message);
    }

    return comments; // Return the array of comment objects
  } catch (error) {
    console.error("Error getting comments by location:", error);
    throw error;
  }
}
