import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushroom } from "../../api/apiMushrooms";
import Header from "../../ui/Header";
import { FaEdit, FaStar } from "react-icons/fa";
import { useUserId } from "../../contexts/UserContext";
import { useState, useEffect } from "react";
import { searchMushroomsByName } from "../../api/apiMushrooms";
import SimilarMushroomsPopup from "../../ui/SimilarMushroomsPopup";
import { addOrUpdateSimilarMushrooms, getSimilarMushroomsByMushroomId, removeMushroomFromSimilarityGroups } from "../../api/apiSimilarMushrooms";

function MushroomDetail() {
    const { mushroom } = useLoaderData();
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [similarMushrooms, setSimilarMushrooms] = useState([]);

    const fetchSimilarMushrooms = async () => {
        const similarMushroomIds = await getSimilarMushroomsByMushroomId(mushroom.id);
        const similarMushroomsData = await Promise.all(similarMushroomIds.map(id => getMushroom(id)));
        setSimilarMushrooms(similarMushroomsData);
    };

    useEffect(() => {
        fetchSimilarMushrooms();
    }, [mushroom.id]);

    const handleEdit = () => {
        navigate(`/mushrooms/mushroomForm/${mushroom.id}`);
    };

    const handleAddSimilarMushroom = async (searchTerm) => {
        const results = await searchMushroomsByName(searchTerm);
        setSearchResults(results);
    };

    const handleAddSimilar = async (mushroomId) => {
        await addOrUpdateSimilarMushrooms(mushroom.id, mushroomId);
        fetchSimilarMushrooms();
    };

    const handleRemoveFromSimilarityGroups = async () => {
        await removeMushroomFromSimilarityGroups(mushroom.id);
        setSimilarMushrooms([]);
    };

    const getToxicityLabel = (toxicity) => {
        switch (toxicity) {
            case 1:
                return "Edible";
            case 2:
                return "Warning";
            case 3:
                return "Toxic";
            default:
                return "Unknown";
        }
    };

    const getToxicityColor = (toxicity) => {
        switch (toxicity) {
            case 1:
                return "text-green-500";
            case 2:
                return "text-yellow-500";
            case 3:
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="bg-[#1a2a1d] pb-20 min-h-screen p-5 text-white">
            <Header
                title="Atlas"
                backButtonFlag={true}
                RightIcon2={mushroom.author === useUserId() ? FaEdit : null}
                onRightIcon2Click={handleEdit}
                userId={useUserId()}
                itemId={mushroom.id}
                type="saved_mushrooms"
            />
            <div className="mt-20">
                <img
                    src={mushroom.image_url}
                    alt={mushroom.name}
                    className="w-64 h-64 object-cover rounded-lg mb-4 mx-auto"
                />
                <h2 className="text-3xl font-bold mb-2 text-left">{mushroom.name}</h2>
                <p className="text-lg text-left">{mushroom.long_description}</p>
                <p className={`text-lg text-left mt-4 ${getToxicityColor(mushroom.toxicity)}`}>
                    <strong>Toxicity:</strong> {getToxicityLabel(mushroom.toxicity)}
                </p>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Add to Similar Mushrooms
                </button>
                {isPopupOpen && (
                    <SimilarMushroomsPopup
                        onClose={() => setIsPopupOpen(false)}
                        onSearch={handleAddSimilarMushroom}
                        searchResults={searchResults}
                        currentMushroomId={mushroom.id}
                        onAddSimilar={handleAddSimilar}
                    />
                )}
                <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4">Similar Mushrooms</h3>
                    <button
                        onClick={handleRemoveFromSimilarityGroups}
                        className="mb-4 bg-red-500 text-white py-2 px-4 rounded"
                    >
                        Remove from Similarity Groups
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarMushrooms.map((similarMushroom) => (
                            <div key={similarMushroom.id} className="bg-gray-800 p-4 rounded-lg flex items-center">
                                <img
                                    src={similarMushroom.image_url}
                                    alt={similarMushroom.name}
                                    className="w-24 h-24 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h4 className="text-xl font-bold">{similarMushroom.name}</h4>
                                    <p className="text-sm">{similarMushroom.short_description}</p>
                                    <p className={`text-sm mt-2 ${getToxicityColor(similarMushroom.toxicity)}`}>
                                        <strong>Toxicity:</strong> {getToxicityLabel(similarMushroom.toxicity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function loader({ params }) {
    const mushroom = await getMushroom(params.id);
    if (!mushroom) {
        throw new Response("Mushroom not found", { status: 404 });
    }
    return { mushroom };
}

export default MushroomDetail;