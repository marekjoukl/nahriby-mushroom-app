import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, getUserLocations, getUserMushrooms, getUserRecipes } from "../../api/apiUsers";
import { FiSettings, FiMapPin, FiBookmark, FiPlus } from "react-icons/fi";

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
          className="w-24 h-32 rounded-md overflow-hidden border-2 border-white cursor-pointer"
          onClick={() => navigate(`/recipes`)}
        >
          <img src={recipe.image_url} alt="Recipe" className="object-cover w-full h-full" />
        </div>
      ));
    }
    if (activeTab === "Mushrooms") {
      return mushrooms.map((mushroom) => (
        <div 
          key={mushroom.id} 
          className="w-24 h-32 rounded-md overflow-hidden border-2 border-white cursor-pointer"
          onClick={() => navigate(`/mushrooms`)}
        >
          <img src={mushroom.image_url} alt="Mushroom" className="object-cover w-full h-full" />
        </div>
      ));
    }
    if (activeTab === "Locations") {
      return locations.map((location) => (
        <div 
          key={location.id} 
          className="w-24 h-32 rounded-md overflow-hidden border-2 border-white cursor-pointer"
          onClick={() => navigate(`/map/${location.id}/edit`)}
        >
          <img src={location.image_url} alt="Location" className="object-cover w-full h-full" />
        </div>
      ));
    }
  };

  return (
    <div className="w-full h-screen bg-bg-primary text-white text-center p-5 font-sans pb-16">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl m-0">Your profile</h1>
        <FiSettings className="text-2xl cursor-pointer" onClick={handleSettingsClick}/>
      </div>
      
      <div className="flex flex-col items-center mt-5">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
          <img
            src={user.image_url}
            alt={`${user.name}'s profile`}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="flex items-center text-gray-300 text-sm mt-2">
            <FiMapPin className="mr-1 text-red-500" />
            <span>{user.country}</span>
          </div>
        </div>
        
        <FiBookmark 
          className="text-2xl text-white mt-4 cursor-pointer" 
          onClick={handleBookmarkClick} 
        />
      </div>
      
      <div className="mt-4 text-green-500 text-lg font-bold">
        {locations.length + mushrooms.length + recipes.length} Post
      </div>

      <div className="flex justify-around mt-5 border-b border-green-500 pb-2">
        <button
          className={`text-lg p-2 ${activeTab === "Recipes" ? "text-red-500 font-bold border-b-2 border-green-500" : "text-green-300"}`}
          onClick={() => handleTabClick("Recipes")}
        >
          Recipes
        </button>
        <button
          className={`text-lg p-2 ${activeTab === "Mushrooms" ? "text-red-500 font-bold border-b-2 border-green-500" : "text-green-300"}`}
          onClick={() => handleTabClick("Mushrooms")}
        >
          Mushrooms
        </button>
        <button
          className={`text-lg p-2 ${activeTab === "Locations" ? "text-red-500 font-bold border-b-2 border-green-500" : "text-green-300"}`}
          onClick={() => handleTabClick("Locations")}
        >
          Locations
        </button>
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <div
          className="w-24 h-32 border border-white rounded-md flex items-center justify-center cursor-pointer hover:bg-bg-secondary"
          onClick={handleAddClick}
        >
          <FiPlus className="text-white text-3xl" />
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
