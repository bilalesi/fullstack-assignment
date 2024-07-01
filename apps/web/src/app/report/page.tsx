import { Suspense } from 'react';

import ReportFilter from '@/components/organisms/report-filter'
import ReportDetails from '@/components/organisms/report-details';

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: {
        office: string;
        year: string;
    }
}


export default function Report({ searchParams }: Props) {
    return (
        <div className='p-3'>
            <div className='py-4'>
                <h1 className='text-lg font-bold'>Lepaya Fruity dashboard</h1>
                <p className='text-sm font-light'>Please select an office and a year to get latest stats:</p>
            </div>
            <ReportFilter />
            {/* TODO: build a skeleton for the report details */}
            <Suspense fallback={null}>
                <ReportDetails {...{ ...searchParams }} />
            </Suspense>
        </div>
    )
}