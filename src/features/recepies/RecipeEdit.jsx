/**
 * Project: ITU - Mushroom app
 * Author: Igor Mikula (xmikul74)
 * Date: 15.12. 2024
 */

import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Header from "../../ui/Header";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { updateRecipe, deleteRecipe, getRecipe, uploadImageAndGetUrl } from "../../api/apiRecipes";
import toast from "react-hot-toast";

function RecipeAdd() {
    const navigate = useNavigate();
    const recipe = useLoaderData();

    const [recipeData, setRecipeData] = useState({
       name: recipe.name || "",
       image_url: recipe.image_url || "",
       rating: recipe.rating || 0,
       serves: recipe.serves || "",
       cooking_hours: recipe.cooking_hours || 0,
       cooking_minutes: recipe.cooking_minutes || 0,
       ingredient_desc: recipe.ingredient_desc || "",
       method_desc: recipe.method_desc || "",
    });

    const [imageFile, setImageFile] = useState(null); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };
    
    const removeImage = () => {
        setImageFile(null);
        setRecipeData((prev) => ({ ...prev, image_url: "" }));
    };

    // Handling submiting new recipe
    const submitRecipe = async (e) => {
        e.preventDefault();

        let imageUrl = recipeData.image_url;

        try {
            // Adding new photo, if old one already exists
            if (imageFile) {
                imageUrl = await uploadImageAndGetUrl(imageFile);
            }

            const updatedData = {
                ...recipeData,
                image_url: imageUrl,
            };

            await updateRecipe(recipe.id, updatedData);

            toast.success("Recipe updated successfully");
            navigate(-1);
        } catch (error) {
            console.error("Error updating recipe:", error);
            toast.error("Failed to update recipe.");
        }
    };

    // Changes when typing given form inputs
    const onChange = (e) => {
        const { name, value } = e.target;
        setRecipeData((prevData) => ({
            ...prevData,
            [name]: value,  
        }));
    }

    // Deleting recipe
    const handleDelete = async () => {
        await deleteRecipe(recipe.id);

        navigate("/recipes");
        toast.success("Recipe deleted successfully");
    }

    return (
        <div className="pl-8 pr-8 pt-20 pb-20">
        <div className="bg-white shadow-md rounded-lg border border-gray-200 mt-5 pt-5 text-black flex justify-center w-full">
            {/* Header */}    
            <Header 
                title="New Recipe"                
                backButtonFlag={true}
                RightIcon1={FaCheckCircle}
                onRightIcon1Click={submitRecipe}
                RightIcon2={FaTrash}                
                onRightIcon2Click={handleDelete}
                >
            </Header>       
    
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 w-3/4 pb-5">
                {/* Recipe Name  */}
                <div className="space-y-1">
                    <label className="block font-semibold">Recipe Name<span className="text-red-600"> *</span></label>
                    <input className="w-full border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500" onChange={onChange}
                        type="text" name="name" placeholder="Recipe Name" value={recipeData.name}>
                    </input>
                </div>
                {/* Image Upload */}
                <div>
                    <label className="block font-semibold">Upload Image</label>
                    <div className="flex items-center space-x-4">
                        {!imageFile && (
                            <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Choose File
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="hidden"
                                />
                            </label>
                        )}
                        {imageFile && (
                            <div className="flex items-center space-x-4">
                                <span>{imageFile.name}</span>
                                <button 
                                    type="button" 
                                    onClick={removeImage} 
                                    className="bg-red-500 text-white rounded-full px-2 hover:bg-red-600">
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Serves */}
                <div className="space-y-1">
                    <label className="block font-semibold">Number of serves<span className="text-red-600"> *</span></label>
                    <input className="w-full border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500" onChange={onChange}
                        type="number" name="serves" placeholder="Serves" value={recipeData.serves}>
                    </input>
                </div>
                {/* Cooking Time */}
                <div className="space-y-1">
                    <label className="block font-semibold">Estimated Cooking Time<span className="text-red-600"> *</span></label>
                    <div className="flex space-x-4">
                        <input className="w-1/2 border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500" onChange={onChange}
                            type="number" name="cooking_hours" placeholder="Hours" value={recipeData.cooking_hours} min="0">
                        </input>                
                        <input className="w-1/2 border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500" onChange={onChange}
                            type="number" name="cooking_minutes" placeholder="Minutes" value={recipeData.cooking_minutes} min="0" max="59">
                        </input>
                    </div>
                </div>
                {/* Ingredients */}
                <div className="space-y-1">
                    <label className="block font-semibold">Ingredients Description<span className="text-red-600"> *</span></label>
                    <textarea className="w-full border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500 min-h-32" onChange={onChange}
                            name="ingredient_desc" placeholder="Describe Ingredients ..." value={recipeData.ingredient_desc}>                            
                    </textarea>
                </div>
                {/* Method */}
                <div className="space-y-1">
                    <label className="block font-semibold">Method<span className="text-red-600"> *</span></label>
                    <textarea className="w-full border-2 border-green-900 rounded p-2 focus:outline-none focus:ring focus:ring-green-500 min-h-32" onChange={onChange}
                            name="method_desc" placeholder="Describe Cooking Process ..." value={recipeData.method_desc}>                            
                    </textarea>
                </div>
            </form>
        </div>
        </div>
        
    );
}

export async function loader({ params }) {
    const recipe = await getRecipe(params.id);
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
}

export default RecipeAdd;