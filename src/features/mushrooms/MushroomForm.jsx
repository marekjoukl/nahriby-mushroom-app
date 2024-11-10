import { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { createMushroom, getMushroom, updateMushroom, deleteMushroom } from "../../api/apiMushrooms";
import BackButton from "../../ui/BackButton";

function MushroomForm() {
    const { mushroom } = useLoaderData(); // Load initial data from loader
    const navigate = useNavigate();

    const [mushroomData, setMushroomData] = useState({
        name: mushroom.name,
        image_url: mushroom.image_url || "",
        short_description: mushroom.short_description,
        long_description: mushroom.long_description,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMushroomData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        await deleteMushroom(mushroom.id);
        navigate("/mushrooms");
    };

    return (
        <Form
            method="POST"
            className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg"
        >
            <BackButton iconType="arrow" navigateTo={-1}/>
            <h2 className="text-center text-xl font-semibold">
                {mushroom.id ? "Edit Mushroom" : "Add a New Mushroom"}
            </h2>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={mushroomData.name}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Image URL
                </label>
                <input
                    type="text"
                    name="image_url"
                    value={mushroomData.image_url}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Short Description
                </label>
                <input
                    type="text"
                    name="short_description"
                    value={mushroomData.short_description}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Long Description
                </label>
                <textarea
                    name="long_description"
                    value={mushroomData.long_description}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200"
                    rows="3"
                    placeholder="Enter a detailed description of the mushroom"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                {mushroom.id ? "Update Mushroom" : "Add Mushroom"}
            </button>

            {mushroom.id && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="mt-4 w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    Delete Mushroom
                </button>
            )}
        </Form>
    );
}

export async function loader({ params }) {
    if (params.id) {
        const mushroom = await getMushroom(params.id);
        if (!mushroom) {
            throw new Response("Mushroom not found", { status: 404 });
        }
        return { mushroom };
    }
    return { mushroom: { name: "", image_url: "", short_description: "", long_description: "" } };
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    if (params.id) {
        await updateMushroom(params.id, data);
        // TODO : Redirect to the updated mushroom page
        return redirect(`/mushrooms`);
    } else {
        await createMushroom(data);
        return redirect("/mushrooms");
    }
}

export default MushroomForm;