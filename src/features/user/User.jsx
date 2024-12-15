/**
 * Project: ITU - Mushroom app
 * Author: Aurel Strigac (xstrig00)
 * Date: 15.12. 2024
 */

import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getUser,
  getUserLocations,
  getUserMushrooms,
  getUserRecipes,
  getImageUrl,
} from "../../api/apiUsers";
import { FiSettings, FiMapPin, FiBookmark, FiPlus } from "react-icons/fi";
import Header from "../../ui/Header";

function User() {
  const { user, locations, mushrooms, recipes } = useLoaderData();
  const [activeTab, setActiveTab] = useState("Locations");
  const [locationImages, setLocationImages] = useState([]);
  const [mushroomImages, setMushroomImages] = useState([]);
  const [recipeImages, setRecipeImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace stored image paths with actual public URLs for locations
    const fetchLocationImages = async () => {
      const images = await Promise.all(
        locations.map(async (location) => {
          // Only fetch if image_url exists
          if (location.image_url) {
            try {
              const url = await getImageUrl(location.image_url, "location-images");
              return { ...location, image_url: url };
            } catch (error) {
              console.error(`Error fetching image for location: ${location.name}`, error);
              // If fail, just return without a URL
              return { ...location, image_url: null };
            }
          }
          return location;
        })
      );
      setLocationImages(images);
    };

    // Replace stored image paths with actual public URLs for mushrooms
    const fetchMushroomImages = async () => {
      const images = await Promise.all(
        mushrooms.map(async (mushroom) => {
          // Same logic for mushrooms
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

    // Replace stored image paths with actual public URLs for recipes
    const fetchRecipeImages = async () => {
      const images = await Promise.all(
        recipes.map(async (recipe) => {

          if (recipe.image_url) {
            try {
              const url = await getImageUrl(recipe.image_url, "recipe-images");
              return { ...recipe, image_url: url };
            } catch (error) {
              console.error(`Error fetching image for recipe: ${recipe.name}`, error);
              return { ...recipe, image_url: null };
            }
          }
          return recipe;
        })
      );
      setRecipeImages(images);
    };

    fetchLocationImages();
    fetchMushroomImages();
    fetchRecipeImages();
  }, [locations, mushrooms, recipes]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    // Navigate to different "add" pages depending on the active tab
    if (activeTab === "Recipes") {
      navigate("/recipes/add");
    }
    if (activeTab === "Mushrooms") {
      navigate("/mushrooms/mushroomForm");
    }
    if (activeTab === "Locations") {
      navigate("/map/createLocation");
    }
  };

  const handleSettingsClick = () => {
    navigate(`/user/${user.id}/edit`);
  };

  const handleBookmarkClick = () => {
    navigate(`/user/${user.id}/saved`);
  };

  const renderContent = () => {
    // Reusable function to render each tab's items
    const renderItems = (items, type) => {
      return items.map((item) => (
        <div
          key={item.id}
          className="relative flex-shrink-0 h-36 w-28 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer overflow-hidden rounded-md border-2 border-white group"
          // Each item's click navigates to its detail page depending on what it is
          onClick={() =>
            type === "recipes"
              ? navigate(`/recipes/${item.id}`)
              : type === "mushrooms"
              ? navigate(`/mushrooms/mushroomDetail/${item.id}`)
              : navigate(`/map/${item.id}`)
          }
        >
          {/* Use the fetched image URLs here */}
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:opacity-80"
          />
          {/* Hover overlay showing item name */}
          <div className="absolute bottom-0 left-0 w-full bg-white text-black text-sm font-bold flex items-center justify-center rounded-md overflow-hidden transition-all duration-100 ease-in-out h-0 group-hover:h-1/4">
            {item.name}
          </div>
        </div>
      ));
    };

    // Render content based on which tab is active
    if (activeTab === "Recipes") {
      return renderItems(recipeImages, "recipes");
    }
    if (activeTab === "Mushrooms") {
      return renderItems(mushroomImages, "mushrooms");
    }
    if (activeTab === "Locations") {
      return renderItems(locationImages, "locations");
    }
  };

  useEffect(() => {
    // Ensure the page starts at the top when this component is loaded
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg-primary p-5 pb-20 text-center font-sans text-white items-center">
      <Header
        title="Your Profile"
        backButtonFlag={false}
        RightIcon1={FiBookmark}
        onRightIcon1Click={handleBookmarkClick}
        RightIcon2={FiSettings}
        onRightIcon2Click={handleSettingsClick}
      />

      {/* Profile info section with user's image, name, country, and total posts */}
      <div className="mt-20 flex flex-col items-center">
        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white">
          {/* Displays the user's profile image */}
          <img
            src={user.image_url}
            alt={`${user.name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="mt-2 text-center text-xl font-bold">{user.name}</h2>

        {/* User country info with a map pin icon */}
        <div className="mt-1 flex items-center text-sm text-gray-300">
          <FiMapPin className="mr-1 text-red-500" />
          <span>{user.country}</span>
        </div>

        {/* Show total posts (sum of locations, mushrooms, and recipes) */}
        <div className="mt-4 text-lg font-bold text-green-500">
          {locations.length + mushrooms.length + recipes.length} Posts
        </div>
      </div>

      {/* Tabs for switching between Locations, Recipes, and Mushrooms */}
      <div className="mt-5 flex justify-around border-b border-green-500 pb-2">
        <button
          className={`p-2 text-base sm:text-lg ${
            activeTab === "Locations"
              ? "border-b-2 border-green-500 font-bold text-red-500 transition-transform duration-100 hover:opacity-80"
              : "text-green-300 transition-transform duration-100 hover:opacity-80"
          }`}
          onClick={() => handleTabClick("Locations")}
        >
          Locations
        </button>
        <button
          className={`p-2 text-base sm:text-lg ${
            activeTab === "Recipes"
              ? "border-b-2 border-green-500 font-bold text-red-500 transition-transform duration-100 hover:opacity-80"
              : "text-green-300 transition-transform duration-100 hover:opacity-80"
          }`}
          onClick={() => handleTabClick("Recipes")}
        >
          Recipes
        </button>
        <button
          className={`p-2 text-base sm:text-lg ${
            activeTab === "Mushrooms"
              ? "border-b-2 border-green-500 font-bold text-red-500 transition-transform duration-100 hover:opacity-80"
              : "text-green-300 transition-transform duration-100 hover:opacity-80"
          }`}
          onClick={() => handleTabClick("Mushrooms")}
        >
          Mushrooms
        </button>
      </div>

      {/* Grid of items (based on the active tab) plus an "Add New" button */}
      <div className="mt-5 flex flex-wrap justify-center gap-4 px-1 sm:px-1 md:px-20">
        {renderContent()}

        {/* The "Add New" button navigates to a creation form depending on the active tab */}
        <div
          className="group flex h-36 w-28 sm:h-36 sm:w-28 md:h-60 md:w-52 cursor-pointer items-center justify-center rounded-md border-2 border-white transition-transform duration-100"
          onClick={handleAddClick}
        >
          <div className="text-2xl md:text-4xl text-white group-hover:hidden">
            <FiPlus />
          </div>
          <span className="hidden text-white text-sm md:text-lg font-semibold group-hover:block">
            Add New
          </span>
        </div>
      </div>
    </div>
  );
}

// Loader function for user profile data and all related items
export async function loader({ params }) {
  const user = await getUser(params.id);
  const locations = await getUserLocations(params.id);
  const mushrooms = await getUserMushrooms(params.id);
  const recipes = await getUserRecipes(params.id);

  // If user not found, show 404
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user, locations, mushrooms, recipes };
}

export default User;
