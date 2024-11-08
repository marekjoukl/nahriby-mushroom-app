import { useEffect, useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getLocation, updateLocation, deleteLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";

function EditLocation() {
  const { location } = useLoaderData(); // Load initial data from loader
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({
    name: location.name,
    stars: location.stars || 0,
    lat: location.lat,
    lng: location.lng,
    image_url: location.image_url || "",
    description: location.description,
    author: location.author || 42,
  });

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

  const handleDelete = async () => {
    await deleteLocation(location.id);
    navigate("/map");
  };

  return (
    <Form
      method="POST"
      className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg"
    >
      <BackButton iconType="arrow" />
      <h2 className="text-center text-xl font-semibold">Edit Location</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={locationData.name}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <div className="flex justify-center">{renderStars()}</div>
        <input type="hidden" name="stars" value={locationData.stars} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <input
          type="text"
          name="lat"
          value={locationData.lat}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Longitude
        </label>
        <input
          type="text"
          name="lng"
          value={locationData.lng}
          onChange={handleChange}
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
          value={locationData.image_url}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={locationData.description}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          rows="3"
          placeholder="Enter a short description of the location"
          required
        />
      </div>

      <input type="hidden" name="author" value={locationData.author} />

      <button
        type="submit"
        className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-4 w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Delete Location
      </button>
    </Form>
  );
}

export async function loader({ params }) {
  const location = await getLocation(params.id);
  if (!location) {
    throw new Response("Location not found", { status: 404 });
  }
  return { location };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await updateLocation(params.id, data);
  return redirect(`/map/${params.id}`);
}

export default EditLocation;
