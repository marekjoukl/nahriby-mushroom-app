import { useNavigate } from "react-router-dom";

function MushroomItem({ mushroom }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/mushrooms/mushroomDetail/${mushroom.id}`);
    };

    return (
        <div 
            onClick={handleClick}
            className="border border-green-700 p-4 m-4 rounded-lg bg-green-50 flex flex-row items-start bg-[#86EFAC] max-w-lg"
        >
            <img 
                src={mushroom.image_url} 
                alt={mushroom.name} 
                className="w-24 h-24 object-cover rounded-lg mr-4" 
            />
            <div className="flex-grow text-left">
                <h3 className="text-xl font-semibold mb-1 text-green-900">{mushroom.name}</h3>
                <p className="text-base mb-1 text-green-800">{mushroom.short_description}</p>
                <p className="text-sm text-green-700">{mushroom.long_description}</p>
            </div>
        </div>
    );
}

export default MushroomItem;
