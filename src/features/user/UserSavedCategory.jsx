import { useLoaderData, useNavigate } from "react-router-dom";
import { getUserSavedMushrooms, getUserSavedRecipes, getUserSavedLocations } from "../../api/apiUsers";
import { FiSearch, FiStar, FiClock, FiZap } from "react-icons/fi";
import BackButton from "../../ui/BackButton";

function UserSavedCategory() {
  const { items, category, userId } = useLoaderData();
  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    if (category === "mushrooms") {
      navigate(`/mushrooms/mushroomDetail/${id}`);
    } else if (category === "recipes") {
      navigate(`/recipes/${id}`);
    } else if (category === "locations") {
      navigate(`/map/${id}`);
    }
  };

  const renderContent = () => {
    if (category === "mushrooms") {
      return items.map((item) => (
        <div
          key={item.id}
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer"
          onClick={() => handleViewDetail(item.id)}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-24 h-24 rounded-md border-2 border-white"
          />
          <div className="ml-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-300">{item.short_description}</p>
          </div>
        </div>
      ));
    }

    if (category === "recipes") {
      return items.map((item) => (
        <div
          key={item.id}
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer"
          onClick={() => handleViewDetail(item.id)}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-24 h-24 rounded-md border-2 border-white"
          />
          <div className="ml-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <FiClock className="mr-1" />
              <span>{item.cooking_minutes} min</span>
            </div>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-yellow-500" />
              ))}
            </div>
          </div>
        </div>
      ));
    }

    if (category === "locations") {
      return items.map((item) => (
        <div
          key={item.id}
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer"
          onClick={() => handleViewDetail(item.id)}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-24 h-24 rounded-md border-2 border-white"
          />
          <div className="ml-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-300">Latitude: {item.lat}</p>
            <p className="text-sm text-gray-300">Longitude: {item.lng}</p>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-yellow-500" />
              ))}
            </div>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 text-white">
      <div className="flex items-center justify-between">
        <BackButton iconType="arrow" navigateTo={`/user/${userId}/saved`} />
        <h1 className="text-2xl font-serif capitalize">Saved {category}</h1>
        <FiSearch className="text-2xl" />
      </div>
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}

export async function loader({ params }) {
    const userId = params.id;
    const category = params.category;
  
    let items;
    if (category === "mushrooms") {
      items = await getUserSavedMushrooms(userId);
    } else if (category === "recipes") {
      items = await getUserSavedRecipes(userId);
    } else if (category === "locations") {
      items = await getUserSavedLocations(userId);
    }
  
    if (items.error) {
      throw new Error(items.error);
    }
  
    return { items, category, userId };
}

export default UserSavedCategory;