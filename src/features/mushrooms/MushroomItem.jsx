import { useNavigate } from "react-router-dom";

function MushroomItem({ mushroom }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/mushrooms/mushroomForm/${mushroom.id}`);
    };

    return (
        <div className="border border-green-700 p-4 m-4 rounded-lg text-center bg-green-50 flex flex-column bg-[#86EFAC]">
            <img src={mushroom.image_url} alt={mushroom.name} className="max-w-full h-auto rounded-lg mb-4" />
            <div className="flex-grow text-left p-4">
                <h3 className="text-xl font-semibold mb-2 text-green-900">{mushroom.name}</h3>
                <p className="text-base mb-2 text-green-800">{mushroom.short_description}</p>
                <p className="text-sm text-green-700">{mushroom.long_description}</p>
                <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white p-2 rounded mt-4"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default MushroomItem;