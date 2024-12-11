import { useState, useEffect } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../../api/apiUsers";
import { FiCamera } from "react-icons/fi";
import Header from "../../ui/Header";
import TrashCan from "../../ui/TrashCan";
import toast from "react-hot-toast";

function UserEdit() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [countries, setCountries] = useState([]); // State to store the list of countries

  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "", // Leave password empty, update only if user provides new value
    birth_date: user.birth_date || "",
    country: user.country || "",
    image_url: user.image_url || "",
  });

  // Fetch the list of countries from REST API
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort(); // Extract and sort country names
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    toast.error("This is your only user, dummy.");
    navigate(`/user/${user.id}`);
  };

  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "#0B2602" }}
    >
      {/* Updated Header */}
      <Header
        title="Edit Profile"
        backButtonFlag={true}
        navigateTo={`/user/${user.id}`}
        RightIcon2={TrashCan} // Pass the TrashCan component
        onRightIcon2Click={handleDeleteClick} // Handle click via Header
      />

      <Form
        method="POST"
        className="mx-auto w-3/4 max-w-lg space-y-4 p-6 pb-20 text-white"
        style={{ backgroundColor: "#0B2602", borderRadius: "10px" }}
      >
        <div className="flex justify-center mb-4 mt-20">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
            <img
              src={userData.image_url}
              alt="Profile"
              className="object-cover w-full h-full"
            />
            <label
              className="absolute bottom-0 right-0 m-2 bg-gray-800 p-2 rounded-full cursor-pointer z-10 flex items-center justify-center"
              style={{ width: "30px", height: "30px" }}
            >
              <FiCamera className="text-white" />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <label className="mb-2 block text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            value={userData.name}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="name"
            required
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            value={userData.email}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="email"
            required
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            value={userData.password}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            placeholder="Enter a new password"
            autoComplete="new-password"
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Date of Birth
          <input
            type="date"
            name="birth_date"
            value={userData.birth_date}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="bday"
          />
        </label>

        {/* Country Dropdown */}
        <label className="mb-2 block text-sm font-medium">
          Country/Region
          <select
            name="country"
            value={userData.country}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                country: e.target.value, // Update the country field
              }))
            }
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
      </label>

        <button
          type="submit"
          className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate(`/user/${user.id}`)}
          className="mt-4 w-full rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </Form>

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <p className="text-lg text-black mb-4">
              Do you really want to delete your account?
            </p>
            <button
              onClick={confirmDelete}
              className="w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-2"
            >
              Delete account
            </button>
            <button
              onClick={cancelDelete}
              className="w-full rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Loader Function
export async function loader({ params }) {
  const user = await getUser(params.id);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  return { user };
}

// Action Function
export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  toast.success("Changes have been saved!");
  await updateUser(params.id, data);
  return redirect(`/user/${params.id}`);
}

export default UserEdit;
