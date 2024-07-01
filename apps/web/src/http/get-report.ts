import rpc from "./rpc";

type QueryParams = {
    office: string;
    year: string
};

type TopFruitResponse = Promise<{ fruit: string; consumption: number } | null>;
type AvgConsumptionResponse = Promise<number | null>;

const report = {
    retrieveTopFruitEatenYear: async ({ office, year }: QueryParams): TopFruitResponse => {
        const response = await rpc.api.report.top_fruit.$get({
            query: {
                office, year
            }
        });
        if (response.ok) {
            const result = await response.json();
            return ({
                fruit: result.data?.fruit ?? 'N/A',
                consumption: result.data?.consumption ?? 0,
            });
        }
        // TODO: handle error in the client
        return null;
    },
    retrieveAvgConsumptionYear: async ({ office, year }: QueryParams): AvgConsumptionResponse => {
        const response = await rpc.api.report.avg_consumption.$get({
            query: {
                office, year
            }
        });
        if (response.ok) {
            const result = await response.json();
            return result.data?.avgConsumption ?? 0;
        }
        // TODO: handle error in the client
        return null;
    }
}

export default report;