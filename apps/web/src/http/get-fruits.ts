import rpc from "./rpc";

export async function retrieveAvailableFruits() {
    const response = await rpc.api.common.fruits.$get();
    if (response.ok) {
        const result = await response.json();
        return result.data;
    }
    // TODO: handle error in the client
    return null;
}