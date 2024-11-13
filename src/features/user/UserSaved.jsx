import { useLoaderData, useNavigate } from "react-router-dom";
import { getTwoUserSavedItems } from "../../api/apiUsers";
import BackButton from "../../ui/BackButton";
import { FiArrowRight } from "react-icons/fi";

function UserSaved() {
  const { userId, mushrooms, recipes, locations } = useLoaderData();
  const navigate = useNavigate();

  const handleViewAllClick = (category) => {
    navigate(`/user/${userId}/saved/${category}`);
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary p-6 text-center text-white pb-20">
      <div className="flex items-center justify-between">
        <BackButton iconType="arrow" navigateTo={`/user/${userId}`} />
        <h1 className="text-2xl font-serif">Favourites</h1>
      </div>
      
      {/* Mushrooms Section */}
      <div className="mt-8">
        <h2 className="text-lg mb-2 items-center font-semibold border-b border-gray-300 pb-2">Atlas</h2>
        <div className="flex justify-center items-center gap-4">
          {mushrooms.map((mushroom) => (
            <div 
                key={mushroom.id} 
                className="w-24 h-32 cursor-pointer rounded-md overflow-hidden border-2 border-white" 
                onClick={() => navigate(`/mushrooms/mushroomDetail/${mushroom.id}`)}>
              <img 
                src={mushroom.image_url} 
                alt={mushroom.name} 
                className="object-cover w-full h-full" />
            </div>
          ))}
          <button
            onClick={() => handleViewAllClick("mushrooms")}
            className="w-24 h-32 rounded-md border border-white flex items-center justify-center"
          >
            <FiArrowRight className="text-lg text-white" />
          </button>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="mt-8">
        <h2 className="text-lg mb-2 font-semibold border-b border-gray-300 pb-2">Recipes</h2>
        <div className="flex justify-center items-center gap-4">
          {recipes.map((recipe) => (
            <div 
                key={recipe.id} 
                className="w-24 h-32 cursor-pointer rounded-md overflow-hidden border-2 border-white" 
                onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <img 
                src={recipe.image_url} 
                alt={recipe.name} 
                className="object-cover w-full h-full" />
            </div>
          ))}
          <button
            onClick={() => handleViewAllClick("recipes")}
            className="w-24 h-32 rounded-md border border-white flex items-center justify-center"
          >
            <FiArrowRight className="text-lg text-white" />
          </button>
        </div>
      </div>

      {/* Locations Section */}
      <div className="mt-8">
        <h2 className="text-lg mb-2 font-semibold border-b border-gray-300 pb-2">Locations</h2>
        <div className="flex justify-center items-center gap-4">
          {locations.map((location) => (
            <div 
                key={location.id} 
                className="w-24 h-32 cursor-pointer rounded-md overflow-hidden border-2 border-white" 
                onClick={() => navigate(`/map/${location.id}`)}>
              <img 
                src={location.image_url} 
                alt={location.name} 
                className="object-cover w-full h-full" />
            </div>
          ))}
          <button
            onClick={() => handleViewAllClick("locations")}
            className="w-24 h-32 rounded-md border border-white flex items-center justify-center"
          >
            <FiArrowRight className="text-lg text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Loader function to load the saved items by user ID
export async function loader({ params }) {
  const userId = params.id; // Fetch userId from params
  
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
