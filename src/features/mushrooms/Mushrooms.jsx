import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushrooms, searchMushroomsByName } from "../../api/apiMushrooms";
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

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (!isSearchVisible) {
            setSearchTerm("");
            setMushrooms(initialMushrooms);
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
            <div className="container mx-auto flex flex-col items-center mt-4">
                {mushrooms.length > 0 ? (
                    mushrooms.map((mushroom) => (
                        <MushroomItem key={mushroom.id} mushroom={mushroom} />
                    ))
                ) : (
                    <p className="text-white">No mushrooms found</p>
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
