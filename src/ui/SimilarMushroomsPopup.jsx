import { useState } from "react";
import { addOrUpdateSimilarMushrooms } from "../api/apiSimilarMushrooms";

function SimilarMushroomsPopup({ onClose, onSearch, searchResults, currentMushroomId, onAddSimilar }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleAddSimilar = async (mushroomId) => {
        await addOrUpdateSimilarMushrooms(currentMushroomId, mushroomId);
        onAddSimilar(mushroomId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg w-1/2 shadow-lg">
                <h2 className="text-2xl mb-4 text-gray-800">Search for Similar Mushrooms</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900 bg-gray-100"
                    placeholder="Enter mushroom name"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Search
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Close
                </button>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {searchResults.length > 0 ? (
                        searchResults.map((mushroom) => (
                            <div
                                key={mushroom.id}
                                className="p-2 border-b border-gray-300 text-gray-800 last:border-none cursor-pointer"
                                onClick={() => handleAddSimilar(mushroom.id)}
                            >
                                {mushroom.name}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-600">No results found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SimilarMushroomsPopup;
