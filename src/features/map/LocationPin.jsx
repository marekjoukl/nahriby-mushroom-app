import { useNavigate } from "react-router-dom";

function LocationPin({ location }) {
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    navigate(`/map/${location.id}`);
  }
  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid black",
        padding: "10px",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      <h1>Location #{location.id}</h1>
      <h2>Name: {location.name}</h2>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <p>Description: {location.description}</p>
      <p>
        Created at: {new Date(location.created_at).toLocaleDateString("en-GB")}{" "}
        {new Date(location.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p>Stars: {location.stars}/5</p>
      <p className="text-2xl underline">View Details</p>
    </div>
  );
}

export default LocationPin;
