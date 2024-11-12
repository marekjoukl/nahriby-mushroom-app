import { useEffect, useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getLocation, updateLocation, deleteLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";
import Header from "../../ui/Header";

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

  const handleDelete = async () => {
    await deleteLocation(location.id);
    navigate("/map");
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
          <input
            type="text"
            name="name"
            value={locationData.name}
            onChange={handleChange}
            placeholder="Name"
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
          <input
            type="text"
            name="image_url"
            value={locationData.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full rounded-xl border border-gray-300 p-3 text-black focus:ring focus:ring-green-200"
          />
        </div>

        <input type="hidden" name="author" value={locationData.author} />

        <div className="flex justify-between">
          <button
            type="submit"
            className="rounded-full bg-navbar-active px-4 py-2 text-white hover:bg-[#0cd784] focus:outline-none focus:ring-2 focus:ring-[#0FE596] focus:ring-opacity-50"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Delete Location
          </button>
        </div>
      </Form>
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

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await updateLocation(params.id, data);
  return redirect(`/map/${params.id}`);
}

export default EditLocation;
