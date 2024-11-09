import { useEffect, useState } from "react";
import { Form, redirect, useSearchParams } from "react-router-dom";
import { createLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";
import { getMushrooms } from "../../api/apiMushrooms";

function CreateLocation() {
  const [mushrooms, setMushrooms] = useState([]);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const [locationData, setLocationData] = useState({
    stars: 0,
    author: "45c4b990-4a01-46aa-87a5-f73e243c338c",
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
      className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 pb-16 shadow-lg"
    >
      <BackButton iconType="x" />
      <h2 className="text-center text-xl font-semibold">
        Create a New Location
      </h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <div className="flex justify-center">{renderStars()}</div>
        {/* Hidden field to store star rating */}
        <input type="hidden" name="stars" value={locationData.stars} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <input
          type="text"
          name="lat"
          defaultValue={locationData.lat}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Longitude
        </label>
        <input
          defaultValue={locationData.lng}
          type="text"
          name="lng"
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="text"
          name="image_url"
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          rows="3"
          placeholder="Enter a short description of the location"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Mushrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {mushrooms.map((mushroom) => (
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
          ))}
        </div>
      </div>

      <input
        type="hidden"
        name="mushrooms"
        value={JSON.stringify(locationData.mushrooms)}
      />
      <input type="hidden" name="author" value={locationData.author} />

      <button
        type="submit"
        className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </Form>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    const newLocation = await createLocation(data);

    return redirect(`/map/${newLocation[0].id}`);
  } catch (error) {
    console.error("Failed to create location:", error);
    return null;
  }
}

export default CreateLocation;
