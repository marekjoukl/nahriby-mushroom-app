import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushroom } from "../../api/apiMushrooms";
import Header from "../../ui/Header";
import { FaEdit, FaStar } from "react-icons/fa";
import { useUserId } from "../../contexts/UserContext";

function MushroomDetail() {
    const { mushroom } = useLoaderData();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/mushrooms/mushroomForm/${mushroom.id}`);
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