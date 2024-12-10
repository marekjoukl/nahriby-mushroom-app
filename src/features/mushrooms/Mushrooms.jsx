import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushrooms } from "../../api/apiMushrooms";
import MushroomItem from "./MushroomItem";
import Header from "../../ui/Header";
import { FaPlus, FaSearch } from "react-icons/fa";

function Mushrooms() {
    const { mushrooms } = useLoaderData() || { mushrooms: [] };
    const navigate = useNavigate();

    const handleAddMushroom = () => {
        navigate("/mushrooms/mushroomForm");
    };

    const handleSearch = () => {
        // Implement search functionality here
    };

    return (
        <div className="min-h-screen gap-6 bg-[#1a2a1d] pb-16 pt-20">
            <Header 
                title="Atlas"
                backButtonFlag={false}
                RightIcon1={FaSearch}
                onRightIcon1Click={handleSearch}
                RightIcon2={FaPlus}
                onRightIcon2Click={handleAddMushroom}>
            </Header>
            <div className="container mx-auto flex flex-col items-center">
                {mushrooms.length > 0 ? (
                    mushrooms.map((mushroom) => (
                        <MushroomItem key={mushroom.id} mushroom={mushroom} />
                    ))
                ) : (
                    <p className="text-white">No mushrooms found</p>
                )}
            </div>
        </div>
    );
}

export async function loader() {
  const mushrooms = await getMushrooms();
  return { mushrooms };
}

export default Mushrooms;
