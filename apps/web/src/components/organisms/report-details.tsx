import Statistic from '@/components/molecules/statistic';
import reportApi from '@/http/get-report';


type Params = {
    office: string;
    year: string;
}
type Props = Params;

async function fetchStatistics({ year, office }: Params): Promise<{
    topFruit: { fruit: string, consumption: number } | null;
    avgConsumption: number | null;
}> {
    const [topFruit, avgConsumption] = await Promise.all([
        reportApi.retrieveTopFruitEatenYear({ year, office }),
        reportApi.retrieveAvgConsumptionYear({ year, office }),
    ])

    return ({
        topFruit,
        avgConsumption,
    })
}

export default async function ReportDetails({ year, office }: Props) {
    if (!year || !office) return null;
    const { avgConsumption, topFruit } = await fetchStatistics({ year, office });
    return (
        <div className='grid grid-cols-2 gap-4 py-4'>
            <Statistic {...{
                label: `Most fruit with most pieces eaten in ${year}`,
                value: `${topFruit?.fruit}, ${topFruit?.consumption}`,
            }} />
            <Statistic {...{
                label: `Fruit consumed per person in ${year}`,
                value: avgConsumption,
            }} />
        </div>
    )
}