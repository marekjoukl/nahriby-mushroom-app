import { useLoaderData, useNavigate } from "react-router-dom";
import { getLocations } from "../../api/apiMap";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import SearchBar from "../../ui/SearchBar";
import Button from "../../ui/Button";
import LocationMarker from "./LocationMarker";

function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
}

function DetectClick() {
  const map = useMap();
  useMapEvents({
    click: (e) => {
      map.setView([e.latlng.lat, e.latlng.lng], map.getZoom(), {
        animate: true,
      });
    },
  });
}

function Map() {
  const { locations } = useLoaderData();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null); // Initialize as null
  const mapRef = useRef();

  // Fetch user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
          // Default position if geolocation fails
          setPosition([49.1922443, 16.6113382]);
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      // Default position if geolocation is not available
      setPosition([49.1922443, 16.6113382]);
    }
  }, []);

  const handleCreateLocation = (e) => {
    e.preventDefault();
    if (position) {
      navigate(`/map/createLocation?lat=${position[0]}&lng=${position[1]}`);
    } else {
      navigate("/map/createLocation"); // Fallback in case position is not set
    }
  };

  const handleFindMyPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!position) return <div>Loading map...</div>; // Wait until position is set

  return (
    <div className="relative flex h-screen flex-col pb-16">
      <SearchBar setPosition={setPosition} />

      <div className="z-0 h-full">
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <LocationMarker location={location} key={location.id} />
          ))}
          <ChangeCenter position={position} />
          <DetectClick />
        </MapContainer>
        <div className="fixed bottom-[5rem] left-1/2 z-[9999] -translate-x-1/2">
          <Button name="Find my position" onClick={handleFindMyPosition} />
        </div>
        <div className="fixed bottom-[5rem] right-4 z-[9999]">
          <Button name="+" onClick={handleCreateLocation} />
        </div>
      </div>
    </div>
  );
}

export async function loader() {
  const locations = await getLocations();
  return { locations };
}

export default Map;
