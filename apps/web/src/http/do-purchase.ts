"use server";
import rpc from '@/http/rpc';



export default async function purchase({ office, fruits }:
    { office: string; fruits: string; }
) {
    const response = await rpc.api.purchase.$post({
        form: {
            office,
            fruits,
        }
    });

    if (response.ok) {
        return await response.json();
    }
    // TODO: handle error in the client
    return null;
}