import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipes } from "../../api/apiRecipes";
import Header from "../../ui/Header";
import { FaCheckCircle } from "react-icons/fa";
import { useUserId } from "../../contexts/UserContext";

function RecipeAdd() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [recipeData, setRecipeData] = useState({
    name: "",
    image_url: "",
    rating: 0,
    serves: "",
    cooking_hours: "",
    cooking_minutes: "",
    ingredient_desc: "",
    method_desc: "",
    author: userId,
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Handling submiting new recipe
  const submitRecipe = async (e) => {
    await createRecipes(recipeData);

    setSuccessMessage("Recipe added successfully", useUserId);
    setRecipeData({
      name: "",
      image_url: "",
      rating: 0,
      serves: "",
      cooking_hours: "",
      cooking_minutes: "",
      ingredient_desc: "",
      method_desc: "",
      author: userId,
    });

    navigate("/recipes");
    // Show message for 4 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // Changes when typing given form inputs
  const onChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="pb-20 pl-8 pr-8 pt-20">
      <div className="mt-5 flex w-full justify-center rounded-lg border border-gray-200 bg-white pt-5 text-black shadow-md">
        {/* Header */}
        <Header
          title="New Recipe"
          backButtonFlag={true}
          RightIcon1={FaCheckCircle}
          onRightIcon1Click={submitRecipe}
        ></Header>

        {/* Success message after adding recipe */}
        {successMessage && (
          <div className="fixed top-16 h-16 w-full rounded bg-green-500 p-3 text-center text-white">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-3/4 space-y-4 pb-5"
        >
          {/* Recipe Name  */}
          <div className="space-y-1">
            <label className="block font-semibold">
              Recipe Name<span className="text-red-600"> *</span>
            </label>
            <input
              className="w-full rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
              onChange={onChange}
              type="text"
              name="name"
              placeholder="Recipe Name"
              value={recipeData.name}
            ></input>
          </div>
          {/* Image URL */}
          <div className="space-y-1">
            <label className="block font-semibold">Image URL</label>
            <input
              className="w-full rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
              onChange={onChange}
              type="text"
              name="image_url"
              placeholder="Image URL"
              value={recipeData.image_url}
            ></input>
          </div>
          {/* Serves */}
          <div className="space-y-1">
            <label className="block font-semibold">
              Number of serves<span className="text-red-600"> *</span>
            </label>
            <input
              className="w-full rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
              onChange={onChange}
              type="number"
              name="serves"
              placeholder="Serves"
              value={recipeData.serves}
              min="1"
            ></input>
          </div>
          {/* Cooking Time */}
          <div className="space-y-1">
            <label className="block font-semibold">
              Estimated Cooking Time<span className="text-red-600"> *</span>
            </label>
            <div className="flex space-x-4">
              <input
                className="w-1/2 rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
                onChange={onChange}
                type="number"
                name="cooking_hours"
                placeholder="Hours"
                value={recipeData.cooking_hours}
                min="0"
              ></input>
              <input
                className="w-1/2 rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
                onChange={onChange}
                type="number"
                name="cooking_minutes"
                placeholder="Minutes"
                value={recipeData.cooking_minutes}
                min="0"
                max="59"
              ></input>
            </div>
          </div>

          {/* <input type="hidden" name="author" value={useUserId()} /> */}

          {/* Ingredients */}
          <div className="space-y-1">
            <label className="block font-semibold">
              Ingredients Description<span className="text-red-600"> *</span>
            </label>
            <textarea
              className="min-h-32 w-full rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
              onChange={onChange}
              name="ingredient_desc"
              placeholder="Describe Ingredients ..."
              value={recipeData.ingredient_desc}
            ></textarea>
          </div>
          {/* Method */}
          <div className="space-y-1">
            <label className="block font-semibold">
              Method<span className="text-red-600"> *</span>
            </label>
            <textarea
              className="min-h-32 w-full rounded border-2 border-green-900 p-2 focus:outline-none focus:ring focus:ring-green-500"
              onChange={onChange}
              name="method_desc"
              placeholder="Describe Cooking Process ..."
              value={recipeData.method_desc}
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeAdd;
