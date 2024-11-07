import { useLoaderData } from "react-router-dom";
import { getRecipe, updateRecipeRating } from "../../api/apiRecipes";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

// TODO: make RecipeDetail as just window 

function RecipeDetail() {
    const recipe = useLoaderData();
    const [rating, setRating] = useState(recipe.rating || 0);
    const [hover, setHover] = useState(null);   // Showing when hovering stars
  
    const changeRating = async (newRating) => {
        setRating(newRating);
        await updateRecipeRating(recipe.id, newRating); // New API
    }

    return (
        <div className="p-4">
            <div className="bg-white shadow-md rounded-lg p-6 border border-zinc-900">
                <h1 className="text-2xl font-bold mb-4">{recipe.name}</h1>

                {/* Rating the recipe */}
                <span className="text-gray-700">Rate this recipe:</span>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} size={24}
                                className={`cursor-pointer ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                                onClick={() => changeRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                        ></FaStar>
                    ))}
                </div>

                <img src={recipe.photo || "https://via.placeholder.com/150"} alt={recipe.name} className="w-full h-64 object-cover rounded mb-4"/>
                <p className="text-sm text-gray-600">Rating: {recipe.rating}</p>
                <p className="text-sm text-gray-600">Serves: {recipe.serves}</p>
                <p className="text-sm text-gray-600"> Cooking Time: {recipe.cooking_hours} hours {recipe.cooking_minutes} minutes</p>
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">Ingredients:</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{recipe.ingredient_desc}</p>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">Method:</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{recipe.method_desc}</p>
                </div>
            </div>
        </div>
    );
}
  
  export async function loader({ params }) {
    const recipe = await getRecipe(params.id);
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
  }
  
  export default RecipeDetail;