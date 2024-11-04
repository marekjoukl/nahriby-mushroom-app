import { useLoaderData } from "react-router-dom";

function Map() {
  const locations = useLoaderData();
  console.log(locations);
  return <div>Map</div>;
}

export async function loader() {
  // const locations = await getLocations();
  return {
    locations: [
      {
        id: 1,
        name: "Location 1",
        latitude: 37.7749,
        longitude: -122.4194,
      },
      {
        id: 2,
        name: "Location 2",
        latitude: 37.7749,
        longitude: -122.4194,
      },
      {
        id: 3,
        name: "Location 3",
        latitude: 37.7749,
        longitude: -122.4194,
      },
    ],
  };
}

export default Map;
