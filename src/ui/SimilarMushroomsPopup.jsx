/**
 * Project: ITU - Mushroom app
 * Author: Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */
import { useState, useEffect } from "react";

function SimilarMushroomsPopup({ onClose, onSearch, searchResults, onAddSimilar }) {
    const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                onSearch(searchTerm); // Trigger search when searchTerm changes
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
    }, [searchTerm, onSearch]);

    const handleAddSimilar = async (mushroomId) => {
        onAddSimilar(mushroomId); // Add similar mushroom
        onClose(); // Close the popup
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg w-3/4 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-4xl"
                >
                    &times; {/* Close button */}
                </button>
                <h2 className="text-2xl mb-4 text-gray-800">Search for Similar Mushrooms</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900 bg-gray-100"
                    placeholder="Enter mushroom name"
                />
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {searchResults.length > 0 ? (
                        searchResults.map((mushroom) => (
                            <div
                                key={mushroom.id}
                                className="p-2 border-b border-gray-300 text-gray-800 last:border-none cursor-pointer"
                                onClick={() => handleAddSimilar(mushroom.id)}
                            >
                                {mushroom.name} {/* Display search results */}
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
