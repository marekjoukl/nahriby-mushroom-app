// src/features/mushrooms/MushroomItem.jsx
import React from "react";

function MushroomItem({ mushroom }) {
    return (
        <div className="mushroom-item">
            <h3>{mushroom.name}</h3>
            <p>{mushroom.description}</p>
            {/* Add more details if necessary */}
        </div>
    );
}

export default MushroomItem;