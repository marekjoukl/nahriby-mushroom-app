import { useState, useEffect } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select
import {
  updateLocation,
  deleteLocation,
  getLocation,
  uploadImageAndGetUrl,
} from "../../api/apiMap";
import { getMushrooms } from "../../api/apiMushrooms";
import Header from "../../ui/Header";
import toast from "react-hot-toast";

function EditLocation() {
  const { location } = useLoaderData(); // Load initial data from loader
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({
    name: location.name || "",
    stars: location.stars || 0,
    lat: location.lat || "",
    lng: location.lng || "",
    image_url: location.image_url || "",
    description: location.description || "",
    author: location.author || 42,
    mushrooms: location.mushrooms || [],
    imageFile: null, // New file input
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mushrooms, setMushrooms] = useState([]);

  useEffect(() => {
    async function fetchMushrooms() {
      const data = await getMushrooms();
      setMushrooms(
        data.map((mushroom) => ({
          value: mushroom.id,
          label: mushroom.name,
        })),
      );
    }
    fetchMushrooms();
  }, []);

  const handleStarsClick = (rating) => {
    setLocationData((prev) => ({
      ...prev,
      stars: rating,
    }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLocationData((prev) => ({
      ...prev,
      imageFile: file,
      image_url: file.name,
    }));
  };

  const removeImage = () => {
    setLocationData((prev) => ({
      ...prev,
      imageFile: null,
      image_url: "", // Clear existing image URL
    }));
  };

  const handleMushroomSelection = (selectedOptions) => {
    setLocationData((prev) => ({
      ...prev,
      mushrooms: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true); // Set loading to true
    try {
      let imagePath = locationData.image_url;

      // If a new file is uploaded, handle the upload using the backend function
      if (locationData.imageFile) {
        imagePath = await uploadImageAndGetUrl(locationData.imageFile);
      }

      // Update location data
      const updatedData = {
        ...locationData,
        image_url: imagePath,
        imageFile: undefined, // Exclude file from the update payload
      };

      await updateLocation(location.id, updatedData);
      toast.success("Location updated successfully!");
      navigate(`/map/${location.id}`);
    } catch (error) {
      toast.error("Failed to update location.");
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const handleDelete = async () => {
    setIsLoading(true); // Set loading to true
    try {
      await deleteLocation(location.id);
      toast.success("Location deleted successfully!");
      navigate("/map");
    } catch (error) {
      toast.error("Failed to delete location.");
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <>
      <Header
        title="Edit Location"
        type="saved_locations"
        itemId={location.id}
      />
      <Form
        method="POST"
        className="mx-auto min-h-screen space-y-4 bg-bg-primary p-6 pb-[5rem] pt-[5rem] text-white shadow-lg"
      >
        <div>
          <label className="block p-1 text-sm font-medium text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={locationData.name}
            onChange={handleChange}
            placeholder="Name of the location"
            className="w-full rounded-xl border border-gray-300 p-3 text-black focus:ring focus:ring-green-200"
            required
          />
        </div>
        <div>
          <div className="flex justify-center">{renderStars()}</div>
          <input type="hidden" name="stars" value={locationData.stars} />
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
          <label className="block p-1 text-sm font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            value={locationData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-4 text-black focus:ring focus:ring-green-200"
            rows="3"
            placeholder="Write something..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Photo</label>
          <div className="mt-2 flex items-center space-x-4">
            {!locationData.image_url && (
              <label className="flex cursor-pointer items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                Choose File
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {locationData.image_url && (
              <>
                <p>
                  {locationData.image_url.split("_")[1] ||
                    locationData.image_url}
                </p>
                <button
                  type="button"
                  onClick={removeImage}
                  className="rounded-full bg-red-500 p-2 text-xs font-bold text-white hover:bg-red-600"
                  title="Remove Photo"
                  hidden={!locationData.image_url}
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Select Mushrooms
          </label>
          <Select
            isMulti
            options={mushrooms}
            value={mushrooms.filter((mushroom) =>
              locationData.mushrooms.includes(mushroom.value),
            )}
            onChange={handleMushroomSelection}
            className="text-black"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-navbar-active px-4 py-2 text-white hover:bg-[#0cd784] focus:outline-none focus:ring-2 focus:ring-[#0FE596] focus:ring-opacity-50"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            disabled={isLoading} // Disable button when loading
          >
            Delete
          </button>
        </div>
      </Form>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-3/4 rounded-lg bg-white p-6 shadow-lg">
            <p className="text-gray-800">
              Are you sure you want to delete this location?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function loader({ params }) {
  const location = await getLocation(params.id);
  if (!location) {
    throw new Response("Location not found", { status: 404 });
  }
  return { location };
}

export default EditLocation;
