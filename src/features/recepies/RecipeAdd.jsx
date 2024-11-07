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

    // Handling submiting new recipe
    const submitRecipe = async (e) => {
        e.preventDefault();
        await createRecipes(recipeData);
        navigate()
    };

    // Changes when typing given form inputs
    const onChange = (e) => {
        const { name, value } = e.target;
        setRecipeData((prevData) => ({
            ...prevData,
            [name]: value,  
        }));
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 mt-5">
            <h1 className="text-2xl font-bold text-green-800 text-center mb-6">Add New Recipe</h1>
    
            <form onSubmit={submitRecipe} className="space-y-4">
                <input className="w-full border-gray-300 rounded p-2" onChange={onChange}
                       type="text" name="name" placeholder="Recipe Name" value={recipeData.name}>
                </input>
                <input className="w-full border-gray-300 rounded p-2" onChange={onChange}
                       type="text" name="photo" placeholder="Photo URL" value={recipeData.photo}>
                </input>
                <input className="w-full border-gray-300 rounded p-2" onChange={onChange}
                       type="number" name="serves" placeholder="Serves" value={recipeData.serves}>
                </input>
                <input className="w-full border-gray-300 rounded p-2" onChange={onChange}
                       type="number" name="cooking_hours" placeholder="Hours" value={recipeData.cooking_hours}>
                </input>
                <input className="w-full border-gray-300 rounded p-2" onChange={onChange}
                       type="number" name="serves" placeholder="Minutes" value={recipeData.cooking_minutes}>
                </input>
                <textarea className="w-full border-gray-300 rounded p-2" onChange={onChange}
                          name="ingredient_desc" placeholder="Describe Ingredients ..." value={recipeData.ingredient_desc}>                            
                </textarea>
                <textarea className="w-full border-gray-300 rounded p-2" onChange={onChange}
                          name="method_desc" placeholder="Describe Cooking Process ..." value={recipeData.method_desc}>                            
                </textarea>

                <button type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Save Recipe
                </button>
            </form>
        </div>
        
    );
}

export default RecipeAdd;