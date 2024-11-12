import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushroom } from "../../api/apiMushrooms";
import BackButton from "../../ui/BackButton";

function MushroomDetail() {
    const { mushroom } = useLoaderData();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/mushrooms/mushroomForm/${mushroom.id}`);
    };

    const handleFavorite = () => {
        // Implement favorite functionality here
        console.log("Favorite button clicked");
    };

    return (
        <div className="bg-[#1a2a1d] min-h-screen p-5 text-white">
            <header className="flex items-center justify-between mb-4">
                <BackButton iconType="arrow" navigateTo={-1}/>
                <h1 className="text-2xl font-semibold">Atlas</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleFavorite}
                        className="bg-yellow-500 text-white p-2 rounded"
                    >
                        Favorites
                    </button>
                </div>
            </header>
            <div className="text-center">
                <img
                    src={mushroom.image_url}
                    alt={mushroom.name}
                    className="max-w-full h-auto rounded-lg mb-4"
                />
                <h2 className="text-3xl font-bold mb-2">{mushroom.name}</h2>
                <p className="text-lg">{mushroom.long_description}</p>
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