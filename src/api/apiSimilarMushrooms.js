import supabase from "./supabase";

// Function to get all similar mushrooms records
export async function getSimilarMushrooms() {
    const { data, error } = await supabase
        .from("similar_mushrooms")
        .select("*");

    if (error) {
        console.error("Error fetching similar mushrooms:", error);
        throw new Error(error.message);
    }
    return data;
}

// Function to add or update similar mushrooms relationship
export async function addOrUpdateSimilarMushrooms(mushroomId1, mushroomId2) {
    const { data: similarMushrooms, error } = await supabase
        .from("similar_mushrooms")
        .select("*");

    if (error) {
        console.error("Error fetching similar mushrooms:", error);
        throw new Error(error.message);
    }

    let updated = false;

    for (let record of similarMushrooms) {
        if (record.mushroom_ids.includes(mushroomId1) || record.mushroom_ids.includes(mushroomId2)) {
            if (record.mushroom_ids.includes(mushroomId1)) {
                for (let record2 of similarMushrooms) {
                    if (record2.mushroom_ids.includes(mushroomId2)) {
                        if (record.id === record2.id) {
                            return { alreadyInGroup: true };
                        }
                        const mushroomIdsSet = new Set(record.mushroom_ids.concat(record2.mushroom_ids));
                        console.log("Mushroom IDs 1:", record.mushroom_ids);
                        console.log("Mushroom IDs 2:", record2.mushroom_ids);
                        console.log("Mushroom IDs set:", mushroomIdsSet);
                        await updateSimilarMushrooms(record.id, Array.from(mushroomIdsSet));
                        await deleteSimilarMushrooms(record2.id);
                        updated = true;
                        break;
                    }
                }
            }
            if (record.mushroom_ids.includes(mushroomId2) && !updated) {
                for (let record2 of similarMushrooms) {
                    if (record2.mushroom_ids.includes(mushroomId1)) {
                        if (record.id === record2.id) {
                            return { alreadyInGroup: true };
                        }
                        const mushroomIdsSet = new Set(record.mushroom_ids.concat(record2.mushroom_ids));
                        console.log("Mushroom IDs 2:", record.mushroom_ids);
                        console.log("Mushroom IDs 1:", record2.mushroom_ids);
                        console.log("Mushroom IDs set:", mushroomIdsSet);
                        await updateSimilarMushrooms(record.id, Array.from(mushroomIdsSet));
                        await deleteSimilarMushrooms(record2.id);
                        updated = true;
                        break;
                    }
                }
            }
            if (!updated) {
                const mushroomIdsSet = new Set(record.mushroom_ids);
                mushroomIdsSet.add(mushroomId1);
                mushroomIdsSet.add(mushroomId2);
                await updateSimilarMushrooms(record.id, Array.from(mushroomIdsSet));
                updated = true;
                break;
            }
        }
    }

    if (!updated) {
        await createSimilarMushrooms([mushroomId1, mushroomId2]);
    }

    return { alreadyInGroup: false };
}

// Function to get similar mushrooms by mushroom ID
export async function getSimilarMushroomsByMushroomId(mushroomId) {
    const { data, error } = await supabase
        .from("similar_mushrooms")
        .select("*");

    if (error) {
        console.error("Error fetching similar mushrooms:", error);
        throw new Error(error.message);
    }

    for (let record of data) {
        if (record.mushroom_ids.includes(mushroomId)) {
            return record.mushroom_ids.filter(id => id !== mushroomId);
        }
    }

    return [];
}

// Function to create a new similar mushrooms record
async function createSimilarMushrooms(mushroomIds) {
    const { error } = await supabase
        .from("similar_mushrooms")
        .insert([{ mushroom_ids: mushroomIds }]);

    if (error) {
        console.error("Error creating similar mushrooms record:", error);
        throw new Error(error.message);
    }
}

// Function to update a similar mushrooms record by ID
async function updateSimilarMushrooms(id, mushroomIds) {
    const { error } = await supabase
        .from("similar_mushrooms")
        .update({ mushroom_ids: mushroomIds })
        .eq("id", id);

    if (error) {
        console.error("Error updating similar mushrooms record:", error);
        throw new Error(error.message);
    }
}

// Function to remove a mushroom from similarity groups
export async function removeMushroomFromSimilarityGroups(mushroomId) {
    const { data: similarMushrooms, error } = await supabase
        .from("similar_mushrooms")
        .select("*");

    if (error) {
        console.error("Error fetching similar mushrooms:", error);
        throw new Error(error.message);
    }

    for (let record of similarMushrooms) {
        if (record.mushroom_ids.includes(mushroomId)) {
            const updatedMushroomIds = record.mushroom_ids.filter(id => id !== mushroomId);
            if (updatedMushroomIds.length > 0) {
                await updateSimilarMushrooms(record.id, updatedMushroomIds);
            } else {
                await deleteSimilarMushrooms(record.id);
            }
        }
    }
}

// Function to delete a similar mushrooms record by ID
async function deleteSimilarMushrooms(id) {
    const { error } = await supabase
        .from("similar_mushrooms")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting similar mushrooms record:", error);
        throw new Error(error.message);
    }
}