import { useLoaderData, useNavigate } from "react-router-dom";
import LocationPin from "./LocationPin";
import { getLocations } from "../../api/apiMap";
import Button from "../../ui/Button";
import CircleButton from "../../ui/PlusButton";

function Map() {
  const { locations } = useLoaderData();
  const navigate = useNavigate();

  function handleCreateLocation(e) {
    e.preventDefault();
    navigate("/map/createLocation");
  }
  return (
    <div className="pb-16">
      {locations.map((location) => (
        <LocationPin location={location} key={location.id} />
      ))}
      <Button name="Find my position" onClick={() => {}} />
      <CircleButton onClick={handleCreateLocation} />
    </div>
  );
}

export async function loader() {
  const locations = await getLocations();
  return { locations };
}

export default Map;
