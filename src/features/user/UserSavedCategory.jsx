import { useLoaderData, useNavigate } from "react-router-dom";
import { getUserSavedMushrooms, getUserSavedRecipes, getUserSavedLocations } from "../../api/apiUsers";
import { FiSearch, FiClock} from "react-icons/fi";
import { FaStar} from "react-icons/fa";
import Header from "../../ui/Header";
import { useEffect } from "react";

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
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer transition-transform duration-100 hover:opacity-90"
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
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer transition-transform duration-100 hover:opacity-90"
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
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${
                    item.rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
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
          className="relative flex p-4 mb-4 bg-green-800 rounded-lg cursor-pointer transition-transform duration-100 hover:opacity-90"
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
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${
                    item.stars >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []); // Runs only once

  return (
    <div className="min-h-screen bg-bg-primary p-6 text-white">
      <Header
        title={`Favourite ${category}`}
        backButtonFlag={true}
        navigateTo={`/user/${userId}/saved`}
      />
      <div className="mt-20">{renderContent()}</div>
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