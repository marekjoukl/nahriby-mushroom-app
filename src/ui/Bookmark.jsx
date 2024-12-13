import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { getUser, updateUser } from "../api/apiUsers";

function Bookmark({ userId, itemId, type }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Fetch the user's data to check if this item is already saved
    async function checkIfSaved() {
      try {
        const user = await getUser(userId);
        const savedItems = user[type] || []; // Access dynamic property based on type
        setIsSaved(savedItems.includes(itemId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    checkIfSaved();
  }, [userId, itemId, type]);

  const handleBookmarkClick = async () => {
    try {
      const user = await getUser(userId);
      let updatedItems;

      if (isSaved) {
        // Remove item from the saved list
        updatedItems = user[type].filter((id) => id !== itemId);
      } else {
        // Add item to the saved list
        updatedItems = [...user[type], itemId];
      }

      // Update user data with new list of saved items for the specified type
      await updateUser(userId, { [type]: updatedItems });

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <FontAwesomeIcon
      icon={faBookmark}
      onClick={handleBookmarkClick}
      className={`cursor-pointer text-2xl ${isSaved ? "text-green-700" : "text-gray-400"} transition-transform duration-100 hover:opacity-80`}
      title={isSaved ? "Remove from favorites" : "Add to favorites"}
    />
  );
}

export default Bookmark;
