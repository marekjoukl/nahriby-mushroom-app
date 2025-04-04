/**
 * Project: ITU - Mushroom app
 * Author: Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */
import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushroom, getImageUrl } from "../../api/apiMushrooms";
import Header from "../../ui/Header";
import { FaEdit } from "react-icons/fa";
import { useUserId } from "../../contexts/UserContext";
import { useState, useEffect } from "react";
import { searchMushroomsByName } from "../../api/apiMushrooms";
import SimilarMushroomsPopup from "../../ui/SimilarMushroomsPopup";
import { addOrUpdateSimilarMushrooms, getSimilarMushroomsByMushroomId, removeMushroomFromSimilarityGroups } from "../../api/apiSimilarMushrooms";
import toast from "react-hot-toast";

function MushroomDetail() {
    const { mushroom } = useLoaderData();
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [similarMushrooms, setSimilarMushrooms] = useState([]);
    const [similarMushroomImages, setSimilarMushroomImages] = useState({});
    const [imageUrl, setImageUrl] = useState(null);

    // Fetch similar mushrooms and their images
    const fetchSimilarMushrooms = async () => {
        const similarMushroomIds = await getSimilarMushroomsByMushroomId(mushroom.id);
        const similarMushroomsData = await Promise.all(similarMushroomIds.map(id => getMushroom(id)));
        setSimilarMushrooms(similarMushroomsData);

        const imageUrls = {};
        for (const similarMushroom of similarMushroomsData) {
            if (similarMushroom.image_url) {
                const url = await getImageUrl(similarMushroom.image_url);
                imageUrls[similarMushroom.id] = url;
            }
        }
        setSimilarMushroomImages(imageUrls);
    };

    // Fetch image URL for the mushroom
    useEffect(() => {
        async function fetchImageUrl() {
          try {
            if (mushroom.image_url) {
              const url = await getImageUrl(mushroom.image_url);
              setImageUrl(url);
            }
          } catch (error) {
            console.error("Error fetching image URL:", error);
          }
        }
    
        fetchImageUrl();
    }, [mushroom.image_url]);

    // Fetch similar mushrooms when mushroom ID changes
    useEffect(() => {
        fetchSimilarMushrooms();
    }, [mushroom.id]);

    // Navigate to edit mushroom form
    const handleEdit = () => {
        navigate(`/mushrooms/mushroomForm/${mushroom.id}`);
    };

    // Handle search for similar mushrooms
    const handleAddSimilarMushroom = async (searchTerm) => {
        const results = await searchMushroomsByName(searchTerm);
        setSearchResults(results);
    };

    // Add mushroom to similarity group
    const handleAddSimilar = async (mushroomId) => {
        if (mushroomId == mushroom.id) {
           toast.error("Mushroom cannot be similar to itself!");
           setIsPopupOpen(false);
           return;
        }
        const { alreadyInGroup } = await addOrUpdateSimilarMushrooms(mushroom.id, mushroomId);
        if (alreadyInGroup) {
            toast.error("These mushrooms are already in the same similarity group!");
        } else {
            toast.success("Mushroom added to similarity group!");
            fetchSimilarMushrooms();
        }
    };

    // Remove mushroom from similarity groups
    const handleRemoveFromSimilarityGroups = async () => {
        await removeMushroomFromSimilarityGroups(mushroom.id);
        toast.success("Mushroom removed from similarity group!");
        setSimilarMushrooms([]);
    };

    // Get toxicity label based on toxicity level
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

    // Get toxicity color based on toxicity level
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

    // Close the similar mushrooms popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSearchResults([]);
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
                    src={imageUrl}
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
                        onClose={handleClosePopup}
                        onSearch={handleAddSimilarMushroom}
                        searchResults={searchResults}
                        onAddSimilar={handleAddSimilar}
                        currentMushroomId={mushroom.id}
                    />
                )}
                <div className="mt-10">
                    {similarMushrooms.length > 0 && (
                        <>
                            <h3 className="text-2xl font-bold mb-4">Similar Mushrooms</h3>
                            <button
                                onClick={handleRemoveFromSimilarityGroups}
                                className="mb-4 bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Remove from Similarity Groups
                            </button>
                        </>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarMushrooms.map((similarMushroom) => (
                            <div key={similarMushroom.id} className="bg-gray-800 p-4 rounded-lg flex items-center">
                                <img
                                    src={similarMushroomImages[similarMushroom.id]}
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

// Loader function to fetch mushroom data by ID
export async function loader({ params }) {
    const mushroom = await getMushroom(params.id);
    if (!mushroom) {
        throw new Response("Mushroom not found", { status: 404 });
    }
    return { mushroom };
}

export default MushroomDetail;