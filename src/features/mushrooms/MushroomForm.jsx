/**
 * Project: ITU - Mushroom app
 * Author: Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */
import { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { createMushroom, getMushroom, updateMushroom, deleteMushroom, uploadImageAndGetUrl } from "../../api/apiMushrooms";
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
    const [imageFile, setImageFile] = useState(null); // State to store the selected image file

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMushroomData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        await deleteMushroom(mushroom.id); // Delete mushroom
        toast.success("Mushroom deleted successfully!");
        navigate("/mushrooms"); // Navigate to mushrooms list
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file); // Set the selected image file
        setMushroomData((prev) => ({
            ...prev,
            image_url: file.name,
        }));
    };

    const removeImage = () => {
        setImageFile(null); // Remove the selected image file
        setMushroomData((prev) => ({
            ...prev,
            image_url: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = mushroom.image_url;

        try {
            if (imageFile) {
                console.log("Image file selected:", imageFile); // Debugging information
                imageUrl = await uploadImageAndGetUrl(imageFile); // Upload image and get URL
            }

            const updatedData = {
                ...mushroomData,
                image_url: imageUrl,
            };

            if (mushroom.id) {
                await updateMushroom(mushroom.id, updatedData); // Update mushroom
                toast.success("Mushroom updated successfully!");
            } else {
                await createMushroom(updatedData); // Create new mushroom
                toast.success("Mushroom created successfully!");
            }

            navigate("/mushrooms"); // Navigate to mushrooms list
        } catch (error) {
            console.error("Error in handleSubmit:", error); // Debugging information
            toast.error("Failed to upload image. Please try again.");
        }
    };

    return (
        <Form
            method="POST"
            className="mx-auto max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg pb-20"
            onSubmit={handleSubmit}
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
                <label className="block text-sm font-medium text-gray-700">
                    Upload Photo
                </label>
                <div className="mt-2 flex flex-row items-center space-x-4">
                    {!mushroomData.image_url && (
                        <label
                            className={`flex cursor-pointer items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 ${imageFile ? "hidden" : ""}`}
                        >
                            Choose File
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    {mushroomData.image_url && (
                    <>
                        <p className="text-black">
                        {mushroomData.image_url.split("_")[1] ||
                            mushroomData.image_url}
                        </p>
                        <button
                        type="button"
                        onClick={removeImage}
                        className="rounded-full bg-red-500 p-2 text-xs font-bold text-white hover:bg-red-600"
                        title="Remove Photo"
                        >
                        ✕
                        </button>
                    </>
                    )}
                </div>
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