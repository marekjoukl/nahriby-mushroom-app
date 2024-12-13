import { useEffect, useState } from "react";
import { Form, redirect, useSearchParams } from "react-router-dom";
import { createLocation } from "../../api/apiMap";
import { getMushrooms } from "../../api/apiMushrooms";
import { useUserId } from "../../contexts/UserContext";
import Header from "../../ui/Header";
import toast from "react-hot-toast";

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
  const [imageFile, setImageFile] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
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
    <>
      <Header title="Create new location" />
      <Form
        method="POST"
        encType="multipart/form-data"
        className="mx-auto min-h-screen space-y-4 bg-bg-primary p-6 pb-[5rem] pt-[5rem] text-white shadow-lg"
      >
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

        <div className="flex flex-col">
          <label className="block text-sm font-medium text-white">
            Upload Photo
          </label>
          <div className="mt-2 flex flex-row items-center space-x-4">
            <label
              className={`flex cursor-pointer items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                imageFile ? "hidden" : ""
              }`}
            >
              Choose File
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <div
              className={`flex items-center space-x-4 ${imageFile ? "" : "hidden"}`}
            >
              <span className="text-sm text-gray-300">{imageFile?.name}</span>
              <button
                type="button"
                onClick={removeImage}
                className="rounded-full bg-red-500 p-2 text-xs font-bold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                title="Remove Photo"
              >
                ✕
              </button>
            </div>
          </div>
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
    </>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  // Convert form data into a plain object
  const data = Object.fromEntries(formData);
  data.mushrooms = JSON.parse(data.mushrooms); // Convert mushrooms string back to an array
  data.imageFile = formData.get("imageFile"); // Get the uploaded image file

  try {
    const newLocation = await createLocation(data);
    toast.success("Location created successfully!");

    return redirect(`/map/${newLocation[0].id}`);
  } catch (error) {
    console.error("Failed to create location:", error);
    toast.error("Failed to create location. Please try again.");
    return null;
  }
}

export default CreateLocation;
