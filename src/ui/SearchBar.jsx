/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ setPosition }) {
  const [query, setQuery] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="fixed left-1/2 top-4 z-[9999] w-2/3 max-w-md -translate-x-1/2"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search locations..."
          className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-600 shadow-md focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
}
