import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getUser,
  getUserLocations,
  getUserMushrooms,
  getUserRecipes,
} from "../../api/apiUsers";
import { FiSettings, FiMapPin, FiBookmark, FiPlus } from "react-icons/fi";
import Header from "../../ui/Header";

function User() {
  const { user, locations, mushrooms, recipes } = useLoaderData();
  const [activeTab, setActiveTab] = useState("Recipes");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
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
    if (activeTab === "Recipes") {
      return recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="h-32 w-24 cursor-pointer overflow-hidden rounded-md border-2 border-white"
          onClick={() => navigate(`/recipes/${recipe.id}`)}
        >
          <img
            src={recipe.image_url}
            alt="Recipe"
            className="h-full w-full object-cover"
          />
        </div>
      ));
    }
    if (activeTab === "Mushrooms") {
      return mushrooms.map((mushroom) => (
        <div
          key={mushroom.id}
          className="h-32 w-24 cursor-pointer overflow-hidden rounded-md border-2 border-white"
          onClick={() => navigate(`/mushrooms/mushroomDetail/${mushroom.id}`)}
        >
          <img
            src={mushroom.image_url}
            alt="Mushroom"
            className="h-full w-full object-cover"
          />
        </div>
      ));
    }
    if (activeTab === "Locations") {
      return locations.map((location) => (
        <div
          key={location.id}
          className="h-32 w-24 cursor-pointer overflow-hidden rounded-md border-2 border-white"
          onClick={() => navigate(`/map/${location.id}`)}
        >
          <img
            src={location.image_url}
            alt="Location"
            className="h-full w-full object-cover"
          />
        </div>
      ));
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary p-5 pb-20 text-center font-sans text-white">
      {/* Header Section with Title and Icons */}
      <Header 
        title="Your Profile"
        backButtonFlag={false}
        RightIcon1={FiBookmark}
        onRightIcon1Click={handleBookmarkClick}
        RightIcon2={FiSettings}
        onRightIcon2Click={handleSettingsClick}>
      </Header>

      {/* Profile Section */}
      <div className="mt-20 flex flex-col items-center">
        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white">
          <img
            src={user.image_url}
            alt={`${user.name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <FiMapPin className="mr-1 text-red-500" />
            <span>{user.country}</span>
          </div>
        </div>
      </div>

      {/* Posts Count */}
      <div className="mt-4 text-lg font-bold text-green-500">
        {locations.length + mushrooms.length + recipes.length} Posts
      </div>

      {/* Tabs Section */}
      <div className="mt-5 flex justify-around border-b border-green-500 pb-2">
        <button
          className={`p-2 text-lg ${
            activeTab === "Recipes"
              ? "border-b-2 border-green-500 font-bold text-red-500"
              : "text-green-300"
          }`}
          onClick={() => handleTabClick("Recipes")}
        >
          Recipes
        </button>
        <button
          className={`p-2 text-lg ${
            activeTab === "Mushrooms"
              ? "border-b-2 border-green-500 font-bold text-red-500"
              : "text-green-300"
          }`}
          onClick={() => handleTabClick("Mushrooms")}
        >
          Mushrooms
        </button>
        <button
          className={`p-2 text-lg ${
            activeTab === "Locations"
              ? "border-b-2 border-green-500 font-bold text-red-500"
              : "text-green-300"
          }`}
          onClick={() => handleTabClick("Locations")}
        >
          Locations
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-5 grid grid-cols-3 gap-2 justify-items-center">
        <div
          className="flex h-32 w-24 cursor-pointer items-center justify-center rounded-md border border-white hover:bg-bg-secondary"
          onClick={handleAddClick}
        >
          <FiPlus className="text-3xl text-white" />
        </div>

        {/* Render content based on active tab */}
        {renderContent()}
      </div>
    </div>
  );
}

// Loader function to load user data by ID
export async function loader({ params }) {
  const user = await getUser(params.id);
  const locations = await getUserLocations(params.id);
  const mushrooms = await getUserMushrooms(params.id);
  const recipes = await getUserRecipes(params.id);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user, locations, mushrooms, recipes };
}

export default User;
