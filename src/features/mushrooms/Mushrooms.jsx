import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushrooms } from "../../api/apiMushrooms";
import MushroomItem from "./MushroomItem";

function Mushrooms() {
    const { mushrooms } = useLoaderData() || { mushrooms: [] };
    const navigate = useNavigate();

    const handleAddMushroom = () => {
        navigate("/mushrooms/mushroomForm");
    };

    return (
        <div className="mushroom-list bg-[#1a2a1d] min-h-screen p-5">
            <button
                onClick={handleAddMushroom}
                className="bg-green-700 text-white p-2 rounded mb-4"
            >
                Add Mushroom
            </button>
            {mushrooms.length > 0 ? (
                mushrooms.map((mushroom) => (
                    <MushroomItem key={mushroom.id} mushroom={mushroom} />
                ))
            ) : (
                <p className="text-white">No mushrooms found</p>
            )}
        </div>
    );
}

export async function loader() {
  const mushrooms = await getMushrooms();
  return { mushrooms };
}

export default Mushrooms;
