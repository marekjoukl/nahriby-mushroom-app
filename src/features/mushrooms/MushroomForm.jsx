import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createMushroom, getMushroom, updateMushroom } from "../../api/apiMushrooms";

function MushroomForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchMushroom = async () => {
                const mushroom = await getMushroom(id);
                setName(mushroom.name);
                setImageUrl(mushroom.image_url);
                setShortDescription(mushroom.short_description);
                setLongDescription(mushroom.long_description);
            };
            fetchMushroom();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mushroomData = {
            name,
            image_url: imageUrl,
            short_description: shortDescription,
            long_description: longDescription,
        };
        if (isEdit) {
            await updateMushroom(id, mushroomData);
        } else {
            await createMushroom(mushroomData);
        }
        navigate("/mushrooms");
    };

    return (
        <div className="bg-[#1a2a1d] min-h-screen p-5 text-white">
            <h2 className="text-2xl font-semibold mb-4">
                {isEdit ? "Edit Mushroom" : "Add a New Mushroom"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Image URL</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Short Description</label>
                    <input
                        type="text"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Long Description</label>
                    <textarea
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <button type="submit" className="bg-green-700 p-2 rounded text-white">
                    {isEdit ? "Update Mushroom" : "Add Mushroom"}
                </button>
            </form>
        </div>
    );
}

export default MushroomForm;