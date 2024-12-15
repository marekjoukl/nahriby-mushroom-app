import { useState, useEffect } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, updateUser, getImageUrl, uploadImageAndGetUrl } from "../../api/apiUsers";
import { FiCamera } from "react-icons/fi";
import Header from "../../ui/Header";
import TrashCan from "../../ui/TrashCan";
import toast from "react-hot-toast";

function UserEdit() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [countries, setCountries] = useState([]);

  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    birth_date: user.birth_date || "",
    country: user.country || "",
    image_url: user.image_url || "", // This should be the public URL if available
  });

  const [showImageUrlField, setShowImageUrlField] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const handleCameraClick = () => {
    setShowImageUrlField((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle image file selection and upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the image to storage, get the path
        const imagePath = await uploadImageAndGetUrl(file);
        // Get the public URL from the path
        const publicUrl = await getImageUrl(imagePath, "user-images");

        if (publicUrl) {
          setUserData((prev) => ({
            ...prev,
            image_url: publicUrl,
          }));
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to retrieve image URL.");
        }
      } catch (error) {
        toast.error(`Failed to upload image: ${error.message}`);
        console.error(error);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "#0B2602" }}
    >
      <Header
        title="Edit Profile"
        backButtonFlag={true}
        navigateTo={`/user/${user.id}`}
        RightIcon2={TrashCan}
        onRightIcon2Click={handleDeleteClick}
      />

      <Form
        method="POST"
        className="mx-auto w-3/4 max-w-lg space-y-4 p-6 pb-20 text-white"
        style={{ backgroundColor: "#0B2602", borderRadius: "10px" }}
      >
        <div className="flex justify-center mb-4 mt-20">
          <div className="relative w-32 h-32">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white">
              {userData.image_url ? (
                <img
                  src={userData.image_url}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-700">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <label
              className="border-2 border-white absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-gray-800 p-2 rounded-full cursor-pointer z-5 flex items-center justify-center transition-transform duration-100 hover:opacity-80"
              style={{ width: "35px", height: "35px" }}
            >
              <FiCamera className="text-white" />
              {/* Hidden file input for image upload */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Hidden input to ensure image_url is always submitted */}
        <input type="hidden" name="image_url" value={userData.image_url} />

        {showImageUrlField && (
          <label className="mb-2 block text-sm font-medium">
            Image URL
            <input
              type="url"
              name="image_url"
              value={userData.image_url}
              onChange={handleInputChange}
              className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
              placeholder="Enter new image URL"
              required
            />
          </label>
        )}

        <label className="mb-2 block text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="bday"
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Country/Region
          <select
            name="country"
            value={userData.country}
            onChange={handleInputChange}
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
          className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white transition-transform duration-100 hover:opacity-80"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate(`/user/${user.id}`)}
          className="mt-4 w-full rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition-transform duration-100 hover:opacity-80"
        >
          Cancel
        </button>
      </Form>

      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg w-full max-w-md mx-4">
            <p className="text-lg text-black mb-4">
              Do you really wish to delete your account?
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

export async function loader({ params }) {
  const user = await getUser(params.id);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  return { user };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (!data.password) {
    delete data.password;
  }

  await updateUser(params.id, data);
  toast.success("Changes have been saved!");
  return redirect(`/user/${params.id}`);
}

export default UserEdit;
