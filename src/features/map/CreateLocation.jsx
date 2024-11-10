import { useEffect, useState } from "react";
import { Form, redirect, useSearchParams } from "react-router-dom";
import { createLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";
import { getMushrooms } from "../../api/apiMushrooms";
import { useUserId } from "../../contexts/UserContext";

function CreateLocation() {
  const [mushrooms, setMushrooms] = useState([]);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const [locationData, setLocationData] = useState({
    stars: 0,
    mushrooms: [],
    lat: lat,
    lng: lng,
  });

  useEffect(() => {
    async function fetchMushrooms() {
      const data = await getMushrooms();
      setMushrooms(data);
    }
    fetchMushrooms();
  }, []);

  const handleStarsClick = (rating) => {
    setLocationData({
      ...locationData,
      stars: rating,
    });
  };

  const renderStars = () => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (v, i) => (
      <span
        key={i}
        onClick={() => handleStarsClick(i + 1)}
        style={{
          color: i < locationData.stars ? "yellow" : "gray",
          fontSize: "2.5rem",
          padding: "0 0.35rem",
        }}
      >
        ★
      </span>
    ));
  };

  const toggleMushroomSelection = (mushroomId) => {
    setLocationData((prevData) => ({
      ...prevData,
      mushrooms: prevData.mushrooms.includes(mushroomId)
        ? prevData.mushrooms.filter((id) => id !== mushroomId)
        : [...prevData.mushrooms, mushroomId],
    }));
  };

  return (
    <Form
      method="POST"
      className="mx-auto min-h-screen space-y-4 bg-bg-primary p-6 pb-[5rem] pt-12 text-white shadow-lg"
    >
      <BackButton iconType="x" navigateTo="/map" />
      <h2 className="text-center text-xl font-semibold text-white">
        Create a New Location
      </h2>

      <div>
        <div className="flex justify-center">{renderStars()}</div>
        <input type="hidden" name="stars" value={locationData.stars} />
      </div>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full rounded-xl border border-gray-300 p-3 text-black focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div className="flex items-center justify-center space-x-2 text-gray-300">
        <label className="text-xs font-bold tracking-widest">LAT:</label>
        <p className="text-xs font-light tracking-widest">
          {Number(locationData.lat)?.toFixed(7)}
        </p>
        <span className="mx-1">,</span>{" "}
        <label className="text-xs font-bold tracking-widest">LNG:</label>
        <p className="text-xs font-light tracking-widest">
          {Number(locationData.lng)?.toFixed(7)}
        </p>
      </div>
      <input type="hidden" name="lat" value={locationData.lat} />
      <input type="hidden" name="lng" value={locationData.lng} />

      <div>
        <textarea
          name="description"
          className="w-full rounded-xl border border-gray-300 p-4 text-black focus:ring focus:ring-green-200"
          rows="3"
          placeholder="Write something..."
          required
        />
      </div>

      <div>
        <input
          placeholder="Image URL"
          type="text"
          name="image_url"
          className="w-full rounded-xl border border-gray-300 p-3 text-black focus:ring focus:ring-green-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Mushrooms in this location:
        </label>
        <div className="flex flex-wrap gap-2">
          {mushrooms.length > 0 ? (
            mushrooms.map((mushroom) => (
              <button
                key={mushroom.id}
                type="button"
                onClick={() => toggleMushroomSelection(mushroom.id)}
                className={`rounded-full border px-4 py-2 ${
                  locationData.mushrooms.includes(mushroom.id)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {mushroom.name}
              </button>
            ))
          ) : (
            <p>Loading mushrooms...</p>
          )}
        </div>
      </div>

      <input
        type="hidden"
        name="mushrooms"
        value={JSON.stringify(locationData.mushrooms)}
      />
      <input type="hidden" name="author" value={useUserId()} />

      <div className="flex justify-center">
        <button
          type="submit"
          className="rounded-full bg-navbar-active px-4 py-2 text-white hover:bg-[#0cd784] focus:outline-none focus:ring-2 focus:ring-[#0FE596] focus:ring-opacity-50"
        >
          Publish
        </button>
      </div>
    </Form>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const newLocation = await createLocation(data);

    return redirect(`/map/${newLocation[0].id}`);
  } catch (error) {
    console.error("Failed to create location:", error);
    return null;
  }
}

export default CreateLocation;
