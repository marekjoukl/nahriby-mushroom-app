import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipes } from "../../api/apiRecipes";

function RecipeAdd() {
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({
       name: "",
       photo: "",
       rating: 0,
       serves: 0,
       cooking_hours: 0,
       cooking_minutes: 0,
       ingredient_desc: "",
       method_desc: "",
    });

    const submitRecipe = async (e) => {
        e.preventDefault();
        await createRecipes(recipeData);
        navigate("/recipes");
    }

    return (
        <div className="border-solid border-gray-800 shadow-md m-5">
            <h1 className="text-green-800 text-center text-2xl">Add New Recipe</h1>
    
            <form onSubmit={submitRecipe} className="space-y-4">
                <input className="border-gray-300 rounded p-2"
                       type="text" name="name" placeholder="Recipe Name" value={recipeData.name}>
                </input>
                <input className="border-gray-300 rounded p-2"
                       type="text" name="photo" placeholder="Photo URL" value={recipeData.photo}>
                </input>
                <input className="border-gray-300 rounded p-2"
                       type="number" name="serves" placeholder="Serves" value={recipeData.serves}>
                </input>
                <input className="border-gray-300 rounded p-2"
                       type="number" name="cooking_hours" placeholder="Hours" value={recipeData.cooking_hours}>
                </input>
                <input className="border-gray-300 rounded p-2"
                       type="number" name="serves" placeholder="Minutes" value={recipeData.cooking_minutes}>
                </input>
                <textarea className="border-gray-300 rounded p-2"
                          name="ingredient_desc" placeholder="Describe Ingredients ..." value={recipeData.ingredient_desc}>                            
                </textarea>
                <textarea className="border-gray-300 rounded p-2"
                          name="method_desc" placeholder="Describe Cooking Process ..." value={recipeData.method_desc}>                            
                </textarea>
            </form>
        </div>
        
    );
}

export default RecipeAdd;