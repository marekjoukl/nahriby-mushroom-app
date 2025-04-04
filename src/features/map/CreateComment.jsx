/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { useState } from "react";
import { Form, redirect, useLocation } from "react-router-dom";
import { useUserId } from "../../contexts/UserContext"; // Assuming this hook returns the current user ID
import { getLocation, updateLocation } from "../../api/apiMap";
import { createComment } from "../../api/apiComments";
import Header from "../../ui/Header";
import toast from "react-hot-toast";

function CreateComment() {
  const userId = useUserId();
  const [stars, setStars] = useState(0);
  const location = useLocation();
  const location_id = location.pathname.split("/")[2];

  const handleStarClick = (rating) => {
    setStars(rating);
  };

  const renderStars = () => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (v, i) => (
      <span
        key={i}
        onClick={() => handleStarClick(i + 1)}
        style={{
          color: i < stars ? "yellow" : "gray",
          fontSize: "2.5rem",
          padding: "0 0.35rem",
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <Header title="Comments" type="saved_locations" itemId={location.id} />
      <Form
        method="post"
        className="mx-auto h-full max-w-md space-y-4 bg-bg-primary p-6 pb-16 pt-[5rem] text-white shadow-lg"
      >
        <h2 className="text-center text-xl font-semibold text-white">
          Add a comment to help other users...
        </h2>

        <div>
          <div className="flex justify-center">{renderStars()}</div>
          <input type="hidden" name="stars" value={stars} />
        </div>

        {/* Comment text area */}
        <div>
          <textarea
            name="description"
            className="w-full rounded-xl border border-gray-300 p-4 text-black focus:ring focus:ring-green-200"
            rows="3"
            placeholder="Write something..."
            required
          />
        </div>

        <input type="hidden" name="author" value={userId} />
        <input type="hidden" name="location_id" value={location_id} />

        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-navbar-active px-4 py-2 text-white hover:bg-[#0cd784] focus:outline-none focus:ring-2 focus:ring-[#0FE596] focus:ring-opacity-50"
          >
            Publish
          </button>
        </div>
      </Form>
    </>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // Create the comment and get the comment ID
    const commentId = await createComment(data);

    // Fetch the location data and ensure comments is an array
    const location = await getLocation(params.id);
    const existingComments = location.comments ?? []; // Use an empty array if comments is null
    const updatedComments = [...existingComments, commentId];

    // Update the location with the new comments array
    await updateLocation(location.id, { comments: updatedComments });
    toast.success("Comment added successfully!");

    return redirect(`/map/${location.id}`);
  } catch (error) {
    toast.error("Error creating comment");
    console.error("Error creating comment:", error);
    throw error;
  }
}

export default CreateComment;
