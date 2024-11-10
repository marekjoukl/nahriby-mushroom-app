import { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../../api/apiUsers";
import { FiTrash2, FiCamera } from "react-icons/fi";
import BackButton from "../../ui/BackButton";

function UserEdit() {
  const { user } = useLoaderData(); // Load initial data from loader
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDiscardPopupOpen, setIsDiscardPopupOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [userData, setUserData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "", // leave password empty, update only if user provides new value
    birth_date: user.birth_date || "", 
    country: user.country || "",
    image_url: user.image_url || "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    setHasUnsavedChanges(true); // Set this to true whenever a change is made
  };

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    await deleteUser(user.id);
    navigate(`/user/${user.id}`);
  };

  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
  };

  const handleCancelClick = (event) => {
    if (hasUnsavedChanges) {
      event.preventDefault(); // Prevent navigation
      setIsDiscardPopupOpen(true);
      return true; // Return true to prevent navigation in BackButton
    }
    return false; // Allow navigation if there are no unsaved changes
  };

  const confirmDiscardChanges = () => {
    setIsDiscardPopupOpen(false);
    navigate(`/user/${user.id}`);
  };

  const cancelDiscard = () => {
    setIsDiscardPopupOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#0B2602" }}>
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
        <BackButton
          iconType="arrow"
          navigateTo={`/user/${user.id}`}
          onClick={handleCancelClick}
        />
        <button
          type="button"
          onClick={handleDeleteClick}
          className="bg-red-500 text-white p-2 rounded-full"
        >
          <FiTrash2 className="text-2xl" />
        </button>
      </div>

      <Form
        method="POST"
        className="mx-auto w-3/4 max-w-lg space-y-4 p-6 pb-20 text-white"
        style={{ backgroundColor: "#0B2602", borderRadius: "10px" }}
      >
        <h2 className="text-center text-xl font-semibold" style={{ fontFamily: "'YourFancyFont', sans-serif" }}>
          Edit Profile
        </h2>

        <div className="flex justify-center mb-4">
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

        {/* Form fields */}
        <label className="mb-2 block text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            placeholder="Enter a new password if you want to change it"
            autoComplete="new-password"
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Date of Birth
          <input
            type="date"
            name="birth_date"
            value={userData.birth_date}
            onChange={handleChange}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="bday"
          />
        </label>

        <label className="mb-2 block text-sm font-medium">
          Country/Region
          <input
            type="text"
            name="country"
            value={userData.country}
            onChange={handleChange}
            className="w-full rounded border border-green-500 p-2 bg-transparent focus:ring focus:ring-green-200"
            autoComplete="country-name"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleCancelClick}
          className="mt-4 w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </Form>

      {/* Delete confirmation popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <p className="text-lg mb-4">Do you really want to delete your account?</p>
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

      {/* Discard changes confirmation popup */}
      {isDiscardPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <p className="text-lg mb-4">You have unsaved changes. Discard them?</p>
            <button
              onClick={confirmDiscardChanges}
              className="w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-2"
            >
              Discard changes
            </button>
            <button
              onClick={cancelDiscard}
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

// Loader function to load user data by ID
export async function loader({ params }) {
    const user = await getUser(params.id);
    if (!user) {
      throw new Response("User not found", { status: 404 });
    }
    return { user };
}

// Action function to handle form submission for updating the user
export async function action({ request, params }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    await updateUser(params.id, data);
    return redirect(`/user/${params.id}`);
}

export default UserEdit;
