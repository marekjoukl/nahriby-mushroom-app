import { useLoaderData, useNavigate } from "react-router-dom";
import { getRecipe, updateRecipeRating } from "../../api/apiRecipes";
import { useEffect, useState } from "react";
import { FaStar, FaHeart, FaEdit } from "react-icons/fa";
import Header from "../../ui/Header";
import { useUserId } from "../../contexts/UserContext";
import { getMushrooms } from "../../api/apiMushrooms";

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
                            className="text-green-600 cursor-pointer"
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
  
    const changeRating = async (newRating) => {
        setRating(newRating);
        await updateRecipeRating(recipe.id, newRating); // New API
    }

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

            {/* Docasne - zahladenie prekryvania hlavickov pomocou top marginu */}
            {/* <div className="mt-16"></div> */}

            <div className="bg-white shadow-md rounded-lg p-6 border border-zinc-900 ml-8 mr-8 mt-16">
                <h1 className="text-2xl font-bold mb-4 text-black">{recipe.name}</h1>

                {/* Rating the recipe */}
                <div className="flex items-center justify-end space-x-2 pb-3">
                    <span className="text-green-700 font-light">Rate this recipe:</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} size={16}
                                    className={`cursor-pointer ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => changeRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(null)}
                            ></FaStar>
                        ))}
                    </div>
                </div>

                <img src={recipe.image_url || "https://via.placeholder.com/150"} alt={recipe.name} className="w-full h-64 object-cover rounded mb-4"/>
                <p>
                    <span className="text-sm font-semibold text-gray-600">Rating: </span>
                    <span className="text-sm text-black">{recipe.rating}</span>
                </p>
                <p>
                    <span className="text-sm text-gray-600">Serves: {recipe.serves}</span>
                    <span>{recipe.serves}</span>
                </p>
                <p>
                    <span className="text-sm font-semibold text-gray-600"> Cooking Time: </span>                                           
                    <span className="text-sm text-black">{recipe.cooking_hours} hours {recipe.cooking_minutes} minutes</span>
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