/**
 * Project: ITU - Mushroom app
 * Author: Igor Mikula (xmikul74)
 * Date: 15.12. 2024
 */

import { useLoaderData, useNavigate } from "react-router-dom";
import { getRecipe, getImageUrl, addRecipeRating } from "../../api/apiRecipes"; 
import { useEffect, useState } from "react";
import { FaStar, FaEdit } from "react-icons/fa";
import Header from "../../ui/Header";
import { useUserId } from "../../contexts/UserContext";
import { getMushrooms } from "../../api/apiMushrooms";
import toast from "react-hot-toast";

function HighlightIngredients({ ingredientDesc }) {
    const [mushrooms, setMushrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMushrooms = async () => {
            try {
                const mushroomsData = await getMushrooms();
                setMushrooms(mushroomsData);
            } catch (error) {
                console.error("Error fetching mushrooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMushrooms();
    }, []);

    const navigateToMushroom = (id) => {
        window.location.href = `/mushrooms/mushroomDetail/${id}`;
    };

    const parseIngredients = () => {
        if (!mushrooms.length || !ingredientDesc) return "No ingredients available.";

        return ingredientDesc.split("\n").map((line, index) => (
            <div key={index} className="mb-2">
                {line.split(/,\s*| /).map((word, wordIndex) => {
                    const trimmedWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                    const mushroom = mushrooms.find(m =>
                        m.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(trimmedWord)
                    );

                    return mushroom ? (
                        <span
                            key={wordIndex}
                            className="text-green-600 cursor-pointer font-bold"
                            onClick={() => navigateToMushroom(mushroom.id)}
                        >
                            {word}{" "}
                        </span>
                    ) : (
                        <span key={wordIndex}>{word} </span>
                    );
                })}
            </div>
        ));
    };

    if (loading) {
        return <p>Loading ingredients...</p>;
    }

    return <div className="text-sm text-gray-700">{parseIngredients()}</div>;
}

function RecipeDetail() {
    const recipe = useLoaderData();
    const userId = useUserId(); // Current Users ID
    const navigate = useNavigate();

    const [rating, setRating] = useState(recipe.rating || 0);
    const [hover, setHover] = useState(null);   // Showing when hovering stars
    const [imageUrl, setImageUrl] = useState(null); // public URL state
    const [isLoadingImage, setIsLoadingImage] = useState(true); // image loading state

    useEffect(() => {
        async function fetchImageUrl() {
            if (recipe.image_url) {
                try {
                    const url = await getImageUrl(recipe.image_url);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching image URL:", error);
                } finally {
                    setIsLoadingImage(false);
                }
            } else {
                setIsLoadingImage(false);
            }
        }

        fetchImageUrl();
    }, [recipe.image_url]);

    const changeRating = async (newRating) => {
        try {
            const updatedRating = await addRecipeRating(recipe.id, userId, newRating);
            toast.success("Thank you for rating this recipe");
            // Setting new avg rating
            setRating(updatedRating); 
        } catch (error) {
            console.error("Error updating rating:", error.message);
        }
    };

    const handleEditClick = () => {
        navigate(`/recipes/${recipe.id}/edit`);
    };

    return (
        <div className="pb-16">

            {/* Header */}    
            <Header 
                title="Recipes"
                backButtonFlag={true}
                // RightIcon1={FaHeart}
                RightIcon2={recipe.author === userId ? FaEdit : null}
                onRightIcon2Click={handleEditClick}
                userId={userId}
                itemId={recipe.id}
                type="saved_recipes"
                >
            </Header>            

            <div className="bg-white shadow-md rounded-lg p-6 border border-zinc-900 ml-8 mr-8 mt-16">
                <h1 className="text-2xl font-bold mb-4 text-black">{recipe.name}</h1>

                {/* Rating the recipe */}
                <div className="flex items-center justify-end space-x-2 pb-3">
                    <span className="text-green-700 font-light">Rate this recipe:</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                            key={star}
                            size={16}
                            className={`cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => changeRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                        />
                        ))}
                    </div>
                </div>

                {isLoadingImage ? (
                    <p>Loading image...</p>
                ) : (
                    <img 
                        src={imageUrl || "https://via.placeholder.com/150"} 
                        alt={recipe.name} 
                        className="w-full h-64 object-cover rounded mb-4"
                    />
                )}

                <p>
                    <span className="text-sm font-semibold text-gray-600">Serves: </span>
                    <span className="text-sm text-black">{recipe.serves}</span>
                </p>
                <p>
                    <span className="text-sm font-semibold text-gray-600"> Cooking Time: </span>                                           
                    <span className="text-sm text-black">
                    {recipe.cooking_hours > 0 && `${recipe.cooking_hours} ${recipe.cooking_hours === 1 ? "hour" : "hours"} `}
                    {recipe.cooking_minutes > 0 && `${recipe.cooking_minutes} ${recipe.cooking_minutes === 1 ? "minute" : "minutes"}`}
                </span>
                </p>
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">Ingredients:</h3>
                    <HighlightIngredients className="text-gray-800" ingredientDesc={recipe.ingredient_desc}></HighlightIngredients>
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