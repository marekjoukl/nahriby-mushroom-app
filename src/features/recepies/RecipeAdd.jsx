/**
 * Project: ITU - Mushroom app
 * Author: Igor Mikula (xmikul74)
 * Date: 15.12. 2024
 */

import { useId, useState } from "react";
import { useNavigate, redirect, Form } from "react-router-dom";
import { createRecipes } from "../../api/apiRecipes";
import Header from "../../ui/Header";
import { FaCheckCircle } from "react-icons/fa";
import { useUserId } from "../../contexts/UserContext";
import toast from "react-hot-toast";

// Fix tab indent
function RecipeAdd() {
    const userId = useUserId();
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const removeImage = () => {
      setImageFile(null);
    };

    return (
      <>
        <Header 
            title="New Recipe"
            backButtonFlag={true}
        //   RightIcon1={FaCheckCircle}
        />
        <Form
            method="POST"
            encType="multipart/form-data"
            className="space-y-4 mx-auto min-h-screen bg-white p-6 rounded-lg shadow-lg text-black pt-16"
        >
            {/* Recipe Name */}
            <div>
            <label className="block font-semibold">Recipe Name<span className="text-red-600"> *</span></label>
            <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                className="w-full border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500"
                required
            />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-white">
                    Upload Photo
                </label>
                <div className="mt-2 flex flex-row items-center space-x-4">
                <label
                    className={`flex cursor-pointer items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                    imageFile ? "hidden" : ""
                    }`}>
                    Choose File
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
                <div
                    className={`flex items-center space-x-4 ${imageFile ? "" : "hidden"}`}
                >
                    <span className="text-sm text-gray-300">{imageFile?.name}</span>
                    <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-full bg-red-500 p-2 text-xs font-bold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Remove Photo"
                    >
                    ✕
                    </button>
                </div>
            </div>
        </div>

            {/* Serves */}
            <div>
            <label className="block font-semibold">Number of serves<span className="text-red-600"> *</span></label>
            <input
                type="number"
                name="serves"
                placeholder="Serves"
                className="w-full border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500"
                min="1"
                required
            />
            </div>

            {/* Cooking Time */}
            <div>
            <label className="block font-semibold">Estimated Cooking Time<span className="text-red-600"> *</span></label>
            <div className="flex space-x-4">
                <input
                type="number"
                name="cooking_hours"
                placeholder="Hours"
                className="w-1/2 border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500"
                min="0"
                />
                <input
                type="number"
                name="cooking_minutes"
                placeholder="Minutes"
                className="w-1/2 border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500"
                min="0"
                max="59"
                />
            </div>
            </div>

            {/* Ingredients */}
            <div>
            <label className="block font-semibold">Ingredients Description<span className="text-red-600"> *</span></label>
            <textarea
                name="ingredient_desc"
                placeholder="Describe Ingredients ..."
                className="w-full border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500 min-h-32"
                rows="4"
                required
            />
            </div>

            {/* Method */}
            <div>
            <label className="block font-semibold">Method<span className="text-red-600"> *</span></label>
            <textarea
                name="method_desc"
                placeholder="Describe Cooking Process ..."
                className="w-full border-2 border-green-900 rounded p-2 focus:ring focus:ring-green-500 min-h-32"
                rows="4"
                required
            />
            </div>

            {/* Hidden Fields */}
            <input type="hidden" name="author" value={userId} />

            {/* Submit Button */}
            <div className="flex justify-center pb-20">
            <button
                type="submit"
                className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
                Publish Recipe
            </button>
            </div>
        </Form>
        </>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData); // Konvertovanie formulára na objekt

    console.log("FormData entries:", Array.from(formData.entries())); // Skontrolujte obsah FormData
    console.log("data: ", data);
    const imageFile = formData.get("imageFile");

    console.log("Image file received:", imageFile);

    if (imageFile && imageFile.size > 0) {
        console.log("Valid image file:", imageFile.name);
    } else {
        console.error("No valid image file found");
    }

    
    data.imageFile = imageFile; // Pridanie súboru späť do objektu

    try {
        const newRecipe = await createRecipes(data); // Odoslanie do API
        toast.success("Recipe created successfully!");

        return redirect(`/recipes/${newRecipe[0].id}`); // Presmerovanie
    } catch (error) {
        console.error("Failed to create recipe:", error);
        toast.error("Failed to create recipe. Please try again.");
        return null;
    }
}

export default RecipeAdd;