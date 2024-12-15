/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { getUser } from "../../api/apiUsers";
import { useNavigate } from "react-router-dom";

function LocationMarker({ location }) {
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    navigate(`/map/${location.id}`);
  }

  useEffect(() => {
    async function fetchAuthor() {
      const user = await getUser(location.author);
      setAuthor(user);
    }
    fetchAuthor();
  }, [location.author]);

  return (
    (location.lat, location.lng) && (
      <Marker key={location.id} position={[location.lat, location.lng]}>
        <Popup maxWidth={250} offset={[0, -10]} className="custom-popup">
          <div className="p-2">
            {author && (
              <div className="mb-2 flex items-center">
                <img
                  src={author.image_url}
                  alt={`${author.name}'s profile`}
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <span className="font-semibold text-gray-800">
                  {author.name}
                </span>
              </div>
            )}

            <h2 className="text-lg font-bold text-gray-800">{location.name}</h2>

            <div className="my-1 flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`text-lg ${
                    index < location.stars ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <p
              onClick={handleClick}
              className="cursor-pointer text-right text-blue-500 hover:text-blue-600"
            >
              View Details
            </p>
          </div>
        </Popup>
      </Marker>
    )
  );
}

export default LocationMarker;
