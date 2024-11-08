import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import './User.css';
import { getUser } from "../../api/apiUsers";
import { FiSettings, FiMapPin, FiBookmark, FiPlus } from "react-icons/fi"; // Using icons from react-icons for settings, location, and bookmark icons

function User() {
  const { user } = useLoaderData();

  const [activeTab, setActiveTab] = useState("Recipes");

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    if (activeTab === "Recipes") {
      navigate("/recipes/add");
    }
    // TODO: Add redirects for all tabs
  };

  return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your profile</h1>
          <FiSettings className="settings-icon" />
        </div>
        <div className="profile-info">
          <div className="profile-image">
            <img src={user.image_url} alt={`${user.name}'s profile`} />
          </div>
          <div className="profile-details">
            <h2>{user.name}</h2>
            <div className="profile-location">
              <FiMapPin />
              <span>{user.country}</span>
            </div>
          </div>
          <FiBookmark className="bookmark-icon" />
        </div>
  
        <div className="profile-stats">
          <span className="post-count">Post</span> {/* Example for post count */}
        </div>
  
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === "Recipes" ? "active" : ""}`} 
            onClick={() => handleTabClick("Recipes")}
          >
            Recipes
          </button>
          <button 
            className={`tab ${activeTab === "Mushrooms" ? "active" : ""}`} 
            onClick={() => handleTabClick("Mushrooms")}
          >
            Mushrooms
          </button>
          <button 
            className={`tab ${activeTab === "Locations" ? "active" : ""}`} 
            onClick={() => handleTabClick("Locations")}
          >
            Locations
          </button>
        </div>
  
        <div className="content-grid">
          <div className="add-item" onClick={handleAddClick}>
            <FiPlus className="add-icon" />
          </div>
          {/* Example content */}
          <div className="content-item">
            <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"/>
          </div>
        </div>
      </div>
  );
}

export async function loader() {
  const user = await getUser("45c4b990-4a01-46aa-87a5-f73e243c338c");
  return { user };
}

export default User;
