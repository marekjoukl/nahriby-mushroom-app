import { useLoaderData, useNavigate } from "react-router-dom";
import { getLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";
import Button from "../../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faStar, faCar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getUser } from "../../api/apiUsers";
import { getMushrooms } from "../../api/apiMushrooms";
import Bookmark from "../../ui/Bookmark";
import { useUserId } from "../../contexts/UserContext";

function LocationDetail() {
  const { location } = useLoaderData();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [mushrooms, setMushrooms] = useState([]);

  function handleEditLocation() {
    navigate(`/map/${location.id}/edit`);
  }

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
    <div className="min-h-screen bg-bg-primary pb-16 text-white">
      <div className="fixed left-0 top-3 z-10 flex w-full items-center justify-between p-4">
        <BackButton iconType="x" navigateTo="/map" />
        <Bookmark
          userId={useUserId()}
          itemId={location.id}
          type="saved_locations"
        />
      </div>
      <div
        className="h-60 bg-black bg-cover"
        style={{
          backgroundImage: `url(${location.image_url})`,
        }}
      ></div>

      <div className="border-b border-gray-500 p-4">
        <div className="flex gap-2 pb-2">
          <img
            src={user.image_url}
            alt={`${user.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
          />
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
              const lat = location.lat; // Replace with actual latitude
              const lng = location.lng; // Replace with actual longitude
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              window.open(googleMapsUrl, "_blank");
            }}
          >
            <FontAwesomeIcon icon={faCar} style={{ color: "#63E6BE" }} />
          </div>
        </div>
      </div>
      <div className="border-b border-gray-500 p-4">
        <div className="mb-2 flex items-center"></div>
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

      <div className="flex items-center justify-between border-b border-gray-500 p-4">
        <h2 className="text-lg font-bold">Comments (1)</h2>

        <Button name="Add Comment" />
      </div>

      <div className="border-b border-gray-500 p-4">
        <div className="mb-2 rounded-lg bg-bg-secondary p-4">
          <div className="mb-2 flex items-center">
            <img
              src="path/to/comment-user-avatar.jpg"
              alt="Commenter Avatar"
              className="mr-2 h-8 w-8 rounded-full"
            />
            <div>
              <p className="font-semibold">Jane Doe</p>
              <p className="text-sm text-gray-400">
                {new Date(location.created_at).toLocaleDateString("en-GB")}{" "}
                {new Date(location.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="ml-auto">
              <Button name="Edit" />
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  className={`${index < location.stars ? "text-yellow-500" : "text-gray-500"} text-lg`}
                />
              ))}
            </div>
          </div>
          <p>Quiet and remote place, also recommend!</p>
        </div>
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
