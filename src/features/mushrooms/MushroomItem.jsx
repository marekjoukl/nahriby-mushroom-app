/**
 * Project: ITU - Mushroom app
 * Author: Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../api/apiMushrooms"; // Import your new function
import { useEffect, useState } from "react";

function MushroomItem({ mushroom }) {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);

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

    // Navigate to mushroom detail page
    const handleClick = () => {
        navigate(`/mushrooms/mushroomDetail/${mushroom.id}`);
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

    return (
        <div 
            onClick={handleClick}
            className="border border-green-700 p-4 m-4 rounded-lg bg-green-50 flex flex-row items-start bg-[#86EFAC] max-w-lg cursor-pointer transition-transform duration-100 hover:opacity-90"
            style={{ width: '380px' }}
        >
            <img 
                src={imageUrl}
                alt={mushroom.name} 
                className="w-24 h-24 object-cover rounded-lg mr-4" 
            />
            <div className="flex-grow text-left overflow-hidden">
                <h3 className="text-xl font-semibold mb-1 text-green-900 truncate">{mushroom.name}</h3>
                <p className="text-base mb-1 text-green-800 break-words">{mushroom.short_description}</p>
                <p className={`text-sm ${getToxicityColor(mushroom.toxicity)}`}><strong>Toxicity:</strong> {getToxicityLabel(mushroom.toxicity)}</p>
            </div>
        </div>
    );
}

export default MushroomItem;
