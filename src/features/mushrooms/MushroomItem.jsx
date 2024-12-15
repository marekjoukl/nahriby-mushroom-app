import { useLoaderData, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../api/apiMushrooms"; // Import your new function
import { useEffect, useState } from "react";

function MushroomItem({ mushroom }) {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);

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

    const handleClick = () => {
        navigate(`/mushrooms/mushroomDetail/${mushroom.id}`);
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
        <div 
            onClick={handleClick}
            className="border border-green-700 p-4 m-4 rounded-lg bg-green-50 flex flex-row items-start bg-[#86EFAC] max-w-lg cursor-pointer transition-transform duration-100 hover:opacity-90"
        >
            <img 
                src={imageUrl}
                alt={mushroom.name} 
                className="w-24 h-24 object-cover rounded-lg mr-4" 
            />
            <div className="flex-grow text-left">
                <h3 className="text-xl font-semibold mb-1 text-green-900">{mushroom.name}</h3>
                <p className="text-base mb-1 text-green-800">{mushroom.short_description}</p>
                <p className={`text-sm ${getToxicityColor(mushroom.toxicity)}`}><strong>Toxicity:</strong> {getToxicityLabel(mushroom.toxicity)}</p>
            </div>
        </div>
    );
}

export default MushroomItem;
