import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserSavedMushrooms, getUserSavedRecipes, getUserSavedLocations, getImageUrl } from "../../api/apiUsers";
import { FaStar, FaClock, FaUtensils } from "react-icons/fa";
import Header from "../../ui/Header";

function UserSavedCategory() {
  const { category, userId } = useLoaderData();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDots, setLoadingDots] = useState(""); // State to manage dots animation

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 300); // update every 300ms
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    let fetchedItems;

    if (category === "mushrooms") {
      const mushrooms = await getUserSavedMushrooms(userId);
      fetchedItems = await Promise.all(
        mushrooms.map(async (mushroom) => {
          if (mushroom.image_url) {
            try {
              const imageUrl = await getImageUrl(mushroom.image_url, "mushrooms-images");
              return { ...mushroom, image_url: imageUrl };
            } catch (error) {
              console.error(`Error fetching image for mushroom: ${mushroom.name}`, error);
              return { ...mushroom, image_url: null };
            }
          }
          return mushroom;
        })
      );
    } else if (category === "locations") {
      const locations = await getUserSavedLocations(userId);
      fetchedItems = await Promise.all(
        locations.map(async (location) => {
          if (location.image_url) {
            try {
              const imageUrl = await getImageUrl(location.image_url, "location-images");
              return { ...location, image_url: imageUrl };
            } catch (error) {
              console.error(`Error fetching image for location: ${location.name}`, error);
              return { ...location, image_url: null };
            }
          }
          return location;
        })
      );
    } else {
      const recipes = await getUserSavedRecipes(userId);
      fetchedItems = recipes; // Recipes don't have dynamic image fetching
    }

    setItems(fetchedItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [category, userId]);

  const handleViewDetail = (id) => {
    if (category === "mushrooms") {
      navigate(`/mushrooms/mushroomDetail/${id}`);
    } else if (category === "recipes") {
      navigate(`/recipes/${id}`);
    } else if (category === "locations") {
      navigate(`/map/${id}`);
    }
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

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-lg text-gray-300">Loading{loadingDots}</div>;
    }

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

          {/* Additional details based on category */}
          {category === "recipes" && (
            <>
              <div className="flex items-center text-xs text-gray-300 mt-1">
                <FaClock className="mr-1" />
                <span>{item.cooking_minutes} min</span>
              </div>
              <div className="flex items-center text-xs text-gray-300 mt-1">
                <FaUtensils className="mr-1" />
                <span>{item.serves} servings </span>
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
            </>
          )}

          {category === "mushrooms" && (
            <>
              <p className="text-sm text-gray-300">{item.short_description}</p>
              <p className={`text-sm mt-2 ${getToxicityColor(item.toxicity)}`}>
                <strong>Toxicity:</strong> {getToxicityLabel(item.toxicity)}
              </p>
            </>
          )}

          {category === "locations" && (
            <>
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
            </>
          )}
        </div>
      </div>
    ));
  };

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

  if (!userId) {
    throw new Error("User ID is undefined");
  }

  return { category, userId };
}

export default UserSavedCategory;
