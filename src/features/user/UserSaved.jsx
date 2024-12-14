import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTwoUserSavedItems, getImageUrl } from "../../api/apiUsers";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../ui/Header";

function UserSaved() {
  const { userId, mushrooms, recipes, locations } = useLoaderData();
  const navigate = useNavigate();
  const [mushroomImages, setMushroomImages] = useState([]);
  const [locationImages, setLocationImages] = useState([]);

  useEffect(() => {
  
    const fetchMushroomImages = async () => {
      const images = await Promise.all(
        mushrooms.map(async (mushroom) => {
          if (mushroom.image_url) {
            try {
              const url = await getImageUrl(mushroom.image_url, "mushrooms-images");
              return { ...mushroom, image_url: url };
            } catch (error) {
              console.error(`Error fetching image for mushroom: ${mushroom.name}`, error);
              return { ...mushroom, image_url: null };
            }
          }
          return mushroom;
        })
      );
      setMushroomImages(images);
    };

    const fetchLocationImages = async () => {
      const images = await Promise.all(
        locations.map(async (location) => {
          if (location.image_url) {
            try {
              const url = await getImageUrl(location.image_url, "location-images");
              return { ...location, image_url: url };
            } catch (error) {
              console.error(`Error fetching image for location: ${location.name}`, error);
              return { ...location, image_url: null };
            }
          }
          return location;
        })
      );
      setLocationImages(images);
    };

    fetchMushroomImages();
    fetchLocationImages();
  }, [mushrooms, locations]);

  const handleViewAllClick = (category) => {
    navigate(`/user/${userId}/saved/${category}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg-primary p-5 pb-20 text-center font-sans text-white items-center">
      <Header
        title="Favourites"
        backButtonFlag={true}
        navigateTo={`/user/${userId}`}
      />

      {/* Locations Section */}
      <div className="mt-20">
        <h2 className="text-lg mb-2 font-semibold border-b border-gray-300 pb-3">Locations</h2>
        <div className="flex justify-center items-center pb-5 gap-4">
          {locationImages.map((location) => (
            <div
              key={location.id}
              className="relative flex-shrink-0 h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer overflow-hidden rounded-md border-2 border-white group"
              onClick={() => navigate(`/map/${location.id}`)}
            >
              <img
                src={location.image_url}
                alt={location.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:opacity-80"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white text-black text-sm font-bold flex items-center justify-center rounded-md overflow-hidden transition-all duration-100 ease-in-out h-0 group-hover:h-1/4">
                {location.name}
              </div>
            </div>
          ))}
          <div
            className="group flex h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer items-center justify-center rounded-md border-2 border-white transition-transform duration-100"
            onClick={() => handleViewAllClick("locations")}
          >
            <div className="text-2xl md:text-4xl text-white group-hover:hidden">
              <FiArrowRight />
            </div>
            <span className="hidden text-white text-sm md:text-lg font-semibold group-hover:block">
              View All
            </span>
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="mt-8">
        <h2 className="text-lg mb-2 font-semibold border-b border-gray-300 pb-3">Recipes</h2>
        <div className="flex justify-center items-center pb-5 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="relative flex-shrink-0 h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer overflow-hidden rounded-md border-2 border-white group"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:opacity-80"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white text-black text-sm font-bold flex items-center justify-center rounded-md overflow-hidden transition-all duration-100 ease-in-out h-0 group-hover:h-1/4">
                {recipe.name}
              </div>
            </div>
          ))}
          <div
            className="group flex h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer items-center justify-center rounded-md border-2 border-white transition-transform duration-100"
            onClick={() => handleViewAllClick("recipes")}
          >
            <div className="text-2xl md:text-4xl text-white group-hover:hidden">
              <FiArrowRight />
            </div>
            <span className="hidden text-white text-sm md:text-lg font-semibold group-hover:block">
              View All
            </span>
          </div>
        </div>
      </div>

      {/* Mushrooms Section */}
      <div className="mt-8">
        <h2 className="text-lg mb-2 font-semibold border-b border-gray-300 pb-3">Atlas</h2>
        <div className="flex justify-center items-center pb-5 gap-4">
          {mushroomImages.map((mushroom) => (
            <div
              key={mushroom.id}
              className="relative flex-shrink-0 h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer overflow-hidden rounded-md border-2 border-white group"
              onClick={() => navigate(`/mushrooms/mushroomDetail/${mushroom.id}`)}
            >
              <img
                src={mushroom.image_url}
                alt={mushroom.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:opacity-80"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white text-black text-sm font-bold flex items-center justify-center rounded-md overflow-hidden transition-all duration-100 ease-in-out h-0 group-hover:h-1/4">
                {mushroom.name}
              </div>
            </div>
          ))}
          <div
            className="group flex h-32 w-24 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer items-center justify-center rounded-md border-2 border-white transition-transform duration-100"
            onClick={() => handleViewAllClick("mushrooms")}
          >
            <div className="text-2xl md:text-4xl text-white group-hover:hidden">
              <FiArrowRight />
            </div>
            <span className="hidden text-white text-sm md:text-lg font-semibold group-hover:block">
              View All
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const userId = params.id;

  if (!userId) {
    throw new Error("User ID is undefined");
  }

  const savedItems = await getTwoUserSavedItems(userId);

  if (savedItems.error) {
    throw new Error(savedItems.error);
  }

  return { userId, ...savedItems };
}

export default UserSaved;
