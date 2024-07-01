import rpc from "./rpc";

export default async function retrieveOffices() {
    const response = await rpc.api.common.offices.$get();
    if (response.ok) {
        const result = await response.json();
        return result.data;
    }
    // TODO: handle error in the client
    // NOTE: just for simplicity I will return null
    return null;
}
