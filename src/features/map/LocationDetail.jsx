/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { useLoaderData, useNavigate } from "react-router-dom";
import { getLocation } from "../../api/apiMap";
import { getImageUrl } from "../../api/apiMap"; // Import your new function
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getUser } from "../../api/apiUsers";
import { getMushrooms } from "../../api/apiMushrooms";
import { useUserId } from "../../contexts/UserContext";
import { getCommentsByLocation } from "../../api/apiComments";
import Header from "../../ui/Header";
import { FaEdit } from "react-icons/fa";

function LocationDetail() {
  const { location } = useLoaderData();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [mushrooms, setMushrooms] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null); // State for image URL
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    async function fetchImageUrl() {
      setIsLoadingImage(true);
      try {
        if (location.image_url) {
          const url = await getImageUrl(location.image_url);
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
      } finally {
        setIsLoadingImage(false); // Ensure `isLoadingImage` is always updated
      }
    }

    fetchImageUrl();
  }, [location.image_url]);

  function handleEditLocation() {
    navigate(`/map/${location.id}/edit`);
  }

  function handleAddComment() {
    navigate(`/map/${location.id}/createComment`);
  }

  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true);

      try {
        const commentsData = await getCommentsByLocation(location.id);

        const commentsWithAuthor = await Promise.all(
          commentsData.map(async (comment) => {
            const author = await getUser(comment.author);
            return {
              ...comment,
              authorName: author.name,
              authorImage: author.image_url,
            };
          }),
        );

        setComments(commentsWithAuthor);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [location.id]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser(location.author);
      setUser(user);
    }
    fetchUser();
  }, [location.author]);

  useEffect(() => {
    async function fetchMushrooms() {
      const mushrooms = await getMushrooms();
      setMushrooms(mushrooms);
    }
    fetchMushrooms();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pb-[5rem] pt-16 text-white">
      <Header
        title="Location Detail"
        navigateTo="/map"
        type="saved_locations"
        itemId={location.id}
        userId={location.author}
        RightIcon2={location.author === useUserId() ? FaEdit : null}
        onRightIcon2Click={handleEditLocation}
      />
      <div
        className="h-60 bg-black bg-cover"
        style={{
          backgroundImage: `url(${imageUrl || ""})`, // Use placeholder if imageUrl is null
        }}
      ></div>

      <div className="border-b border-gray-500 p-4">
        <div className="flex gap-2 pb-2">
          {isLoadingImage ? (
            <p>Loading...</p>
          ) : (
            <img
              src={user.image_url}
              alt={`${user.name}'s profile`}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-300">
              {new Date(location.created_at).toLocaleDateString("en-GB")}{" "}
              {new Date(location.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold">{location.name}</h1>
      </div>
      <div className="flex items-center justify-between border-b border-gray-500 p-4">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={`${index < location.stars ? "text-yellow-500" : "text-gray-500"} text-lg`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-300">
            {location.lat},
            <br /> {location.lng}
          </p>
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
            onClick={() => {
              const lat = location.lat;
              const lng = location.lng;
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              window.open(googleMapsUrl, "_blank");
            }}
          >
            <FontAwesomeIcon icon={faCar} style={{ color: "#63E6BE" }} />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-500 p-4">
        <p className="mb-2">{location.description}</p>
        <p className="text-sm text-gray-400">
          Mushrooms in this location:{" "}
          <span className="text-green-400">
            {location.mushrooms.length > 0
              ? mushrooms
                  .filter((mushroom) =>
                    location.mushrooms.includes(mushroom.id),
                  )
                  .map((mushroom) => mushroom.name)
                  .join(", ")
              : "No mushrooms selected"}
          </span>
        </p>
      </div>
      {/* Comments Section */}
      <div className="border-b border-gray-500 p-4">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold">Comments ({comments.length})</h2>
          <Button name="Add Comment" onClick={handleAddComment} />
        </div>

        {isLoading ? (
          <p className="text-gray-400">Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 rounded-lg bg-bg-secondary p-4"
            >
              <div className="mb-2 flex items-center">
                <img
                  src={comment.authorImage}
                  alt={`${comment.authorName}'s profile`}
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">{comment.authorName}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("en-GB")}{" "}
                    {new Date(comment.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p>{comment.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const { id } = params;
  const location = await getLocation(id);
  if (!location) {
    throw new Response("Location not found", { status: 404 });
  }

  return { location };
}

export default LocationDetail;
