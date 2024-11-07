import { useNavigate, useLoaderData } from "react-router-dom"
import { FaPlus } from "react-icons/fa";
import { getRecipes } from "../../api/apiRecipes";

function Recipes() {
    const { recipes } = useLoaderData();
    const navigate = useNavigate();

    const handleRecipeClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleAddRecipeClick = () => {
        navigate("/recipes/add");
    };

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Add recipe button */}
            <div className="flex justify-between items-center">
                <h1 className="text-center text-green-800">Recipes</h1>    
                <button onClick={handleAddRecipeClick} className="flex items-center text-blue-600">
                    <FaPlus className="text-xl"></FaPlus>
                </button>
            </div>

            {/* Handling recipe detail */}
            {recipes.map((recipe) => (
                <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-400">

                    {/* Image - higher half */}
                    <div className="h-40 bg-gray-100">
                    <img
                        src={recipe.photo || "https://via.placeholder.com/150"}
                        alt={recipe.name}
                        className="h-full w-full object-cover"
                    />
                    </div>
                    
                    {/* General recipe info */}
                    <div className="p-4 space-y-2">
                        <h2 className="text-lg font-bold text-gray-900">{recipe.name}</h2>
                        <p className="text-sm text-gray-600">Rating: {recipe.rating}</p>
                        <p className="text-sm text-gray-600">Serves: {recipe.serves}</p>
                        <p className="text-sm text-gray-600"> Cooking Time: {recipe.cooking_hours} hours {recipe.cooking_minutes} minutes</p>
                    </div>
                </div>
            ))}
        </div>   
    );
}

export async function loader() {
  const recipes = await getRecipes();  
  return { recipes };
}

export default Recipes;


