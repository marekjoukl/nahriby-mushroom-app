import { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../../api/apiUsers";
import BackButton from "../../ui/BackButton";

// UserEdit Component
function UserEdit() {
  const { user } = useLoaderData(); // Load initial data from loader
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    password: "", // leave password empty, update only if user provides new value
    birth_date: user.birth_date || "", 
    country: user.country || "",
    image_url: user.image_url || "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    await deleteUser(user.id);
    navigate("/user");
  };

  return (
    <Form
      method="POST"
      className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg pb-20"
    >
      <BackButton iconType="arrow" />
      <h2 className="text-center text-xl font-semibold">Edit User</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
          placeholder="Enter a new password if you want to change it"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          name="birth_date"
          value={userData.birth_date}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={userData.country}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Profile Picture URL
        </label>
        <input
          type="text"
          name="image_url"
          value={userData.image_url}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-4 w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Delete User
      </button>
    </Form>
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
    return redirect(`/user`);
}
  
export default UserEdit;
