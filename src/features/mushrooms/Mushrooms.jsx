import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushrooms, searchMushroomsByName, getMushroomsByToxicity } from "../../api/apiMushrooms";
import MushroomItem from "./MushroomItem";
import Header from "../../ui/Header";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

function Mushrooms() {
    const { mushrooms: initialMushrooms } = useLoaderData() || { mushrooms: [] };
    const navigate = useNavigate();
    const [mushrooms, setMushrooms] = useState(initialMushrooms);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [category, setCategory] = useState("ALL");

    const handleAddMushroom = () => {
        navigate("/mushrooms/mushroomForm");
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm) {
                const results = await searchMushroomsByName(searchTerm);
                setMushrooms(results);
            } else {
                setMushrooms(initialMushrooms);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, initialMushrooms]);

    useEffect(() => {
        const fetchMushrooms = async () => {
            const results = await getMushroomsByToxicity(category === "ALL" ? null : category);
            setMushrooms(results);
        };

        fetchMushrooms();
    }, [category]);

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (!isSearchVisible) {
            setSearchTerm("");
            setCategory("ALL");
            setMushrooms(initialMushrooms);
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case "TOXIC":
                return "Toxic";
            case "WARNING":
                return "Warning";
            case "EDIBLE":
                return "Edible";
            default:
                return "All";
        }
    };

    return (
        <div className="min-h-screen gap-6 bg-[#1a2a1d] pb-16 pt-20">
            <Header 
                title="Atlas"
                backButtonFlag={false}
                RightIcon1={FaSearch}
                onRightIcon1Click={toggleSearch}
                RightIcon2={FaPlus}
                onRightIcon2Click={handleAddMushroom}
            />
            {isSearchVisible && (
                <div className="container mx-auto mt-4 flex justify-center items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-3/4 p-2 border border-gray-300 rounded text-gray-900 bg-gray-100"
                        placeholder="Search mushrooms"
                    />
                    <button
                        onClick={toggleSearch}
                        className="ml-2 text-red-600 hover:text-red-800 text-4xl"
                    >
                        &times;
                    </button>
                </div>
            )}
            {!isSearchVisible && (
                <div className="container mx-auto mt-4 flex justify-center space-x-4">
                    {["ALL", "TOXIC", "WARNING", "EDIBLE"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded ${category === cat ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
            <div className="container mx-auto flex flex-col items-center mt-4">
                {mushrooms.length > 0 ? (
                    mushrooms.map((mushroom) => (
                        <MushroomItem key={mushroom.id} mushroom={mushroom} />
                    ))
                ) : (
                    <p className="text-white">There are no mushrooms available with toxicity level: {getCategoryName(category)}</p>
                )}
            </div>
        </div>
    );
}

export async function loader() {
    const mushrooms = await getMushrooms();
    return { mushrooms };
}

export default Mushrooms;
