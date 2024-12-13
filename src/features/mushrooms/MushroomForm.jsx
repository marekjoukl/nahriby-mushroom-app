import { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { createMushroom, getMushroom, updateMushroom, deleteMushroom } from "../../api/apiMushrooms";
import BackButton from "../../ui/BackButton";
import { useUserId } from "../../contexts/UserContext";
import toast from "react-hot-toast";

function MushroomForm() {
    const { mushroom } = useLoaderData(); // Load initial data from loader
    const navigate = useNavigate();

    const [mushroomData, setMushroomData] = useState({
        name: mushroom.name,
        image_url: mushroom.image_url || "",
        short_description: mushroom.short_description,
        long_description: mushroom.long_description,
        toxicity: mushroom.toxicity || 1,
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
        toast.success("Mushroom deleted successfully!");
        navigate("/mushrooms");
    };

    return (
        <Form
            method="POST"
            className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg pb-20"
        >
            <BackButton iconType="arrow" navigateTo={-1} />
            <h2 className="text-center text-xl font-semibold text-gray-900">
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200 text-gray-900"
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200 text-gray-900"
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200 text-gray-900"
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
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200 text-gray-900"
                    rows="3"
                    placeholder="Enter a detailed description of the mushroom"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Toxicity
                </label>
                <select
                    name="toxicity"
                    value={mushroomData.toxicity}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-green-200 text-gray-900"
                    required
                >
                    <option value={1}>Edible</option>
                    <option value={2}>Warning</option>
                    <option value={3}>Toxic</option>
                </select>
            </div>

            <input type="hidden" name="author" value={useUserId()} />

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
        toast.success("Mushroom updated successfully!");
        return redirect("/mushrooms");
    } else {
        await createMushroom(data);
        toast.success("Mushroom created successfully!");
        return redirect("/mushrooms");
    }
}

export default MushroomForm;