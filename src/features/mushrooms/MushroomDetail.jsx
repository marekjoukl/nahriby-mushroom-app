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

    return (
        <div className="bg-[#1a2a1d] min-h-screen p-5 text-white">
            <Header
                title="Atlas"
                backButtonFlag={true}
                RightIcon2={mushroom.author === useUserId() ? FaEdit : null}
                onRightIcon2Click={handleEdit}
                userId={useUserId()}
                itemId={mushroom.id}
                type="saved_mushrooms"
            />
            <div className="text-center mt-20">
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