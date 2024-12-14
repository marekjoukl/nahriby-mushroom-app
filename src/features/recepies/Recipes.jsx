import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom"
import { FaPlus, FaSearch, FaStar, FaUtensils, FaClock } from "react-icons/fa";
import { getRecipes } from "../../api/apiRecipes";
import Header from "../../ui/Header";

// background-color: #1a2a1d; /* Dark green background */

function Recipes() {
    const { recipes } = useLoaderData();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const handleRecipeClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleAddRecipeClick = () => {
        navigate("/recipes/add");
    };

    // Changing visibility of search bar
    const searchBarVisible = () => {
        // If search bar was visible, after clicking will be invisible
        // If search bar was invisible, after clicking will be visible
        setShowSearchBar((prev) => !prev);
    }

    // Filtering recipes based on their name
    const handleSearch = () => {
        const filtered = recipes.filter(
            recipe => recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRecipes(filtered);
    };

    // Changing characters in search input
    const searchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (        
        <div className="min-h-screen gap-6 bg-green-950 pb-16 pt-20">
            {/* Header */}    
            <Header 
                title="Recipes"
                backButtonFlag={false}
                RightIcon1={FaSearch}
                onRightIcon1Click={searchBarVisible}
                RightIcon2={FaPlus}
                onRightIcon2Click={handleAddRecipeClick}>
            </Header>                        

            {/* Search bar input */}
            {showSearchBar && (
                <div className="fixed top-16 w-1/2 right-4">
                    <div className="relative">
                        <input type="text" value={searchQuery} onChange={searchChange} placeholder="Recipe name"
                            className="w-full p-2 border border-gray-400 rounded-md text-black">
                        </input>
                        <button onClick={handleSearch} className="absolute inset-y-0 right-0 flex items-center font-light bg-blue-600 rounded-md p-2">Find</button>
                    </div>
                </div>
            )}

            {/* Recipes */}
            <div className="container mx-auto grid grid-cols1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {filteredRecipes.map((recipe) => (
                    
                    <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}
                    className="bg-white shadow-md cursor-pointer rounded-lg overflow-hidden border border-gray-400 mr-8 ml-8">

                        {/* Image - higher half */}
                        <div className="h-40 bg-gray-100">
                        <img
                            src={recipe.image_url || "https://via.placeholder.com/150"}
                            alt={recipe.name}
                            className="h-full w-full object-cover"
                        />
                        </div>
                        
                        {/* General recipe info */}
                        <div className="p-4 space-y-2">
                            <h2 className="text-lg font-bold text-gray-900 font-serif">{recipe.name}</h2>

                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={star <= recipe.rating ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-gray-600 flex items-center font-semibold font-mono">
                                <FaUtensils className="text-orange-500 mr-2"/> {recipe.serves}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center font-semibold font-mono">
                                <FaClock className="text-orange-500 mr-2"/>
                                {recipe.cooking_hours > 0 && `${recipe.cooking_hours} hours`}
                                {recipe.cooking_minutes > 0 && `${recipe.cooking_minutes} minutes`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>   
    );
}

export async function loader() {
  const recipes = await getRecipes();  
  return { recipes };
}

export default Recipes;


