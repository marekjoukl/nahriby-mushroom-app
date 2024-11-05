import { useLoaderData, useNavigate } from "react-router-dom";
import { getMushrooms } from "../../api/apiMushrooms";
import MushroomItem from "./MushroomItem";

function Mushrooms() {
    const { mushrooms } = useLoaderData();

    return (
        <div className="mushroom-list">
            {mushrooms.map((mushroom) => (
                //<MushroomItem key={mushroom.id} mushroom={mushroom} />
                <p key={mushroom.id}>{mushroom.name}</p>
            ))}
            <p>There are {mushrooms.length} mushrooms in the database.</p>
        </div>
    );
}

export async function loader() {
  const mushrooms = await getMushrooms();
  return { mushrooms };
}

export default Mushrooms;
