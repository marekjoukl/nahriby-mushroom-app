import { useLoaderData } from "react-router-dom";
import { getLocation } from "../../api/apiMap";
import BackButton from "../../ui/BackButton";

function LocationDetail() {
  const { location } = useLoaderData();
  return (
    <div>
      <BackButton iconType="" />
      <p>Image: {location.image}</p>
      <h1>Name:{location.name}</h1>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <p>
        Created at: {new Date(location.created_at).toLocaleDateString("en-GB")}{" "}
        {new Date(location.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p>Description: {location.description}</p>
      <p>Stars: {location.stars}/5</p>
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
