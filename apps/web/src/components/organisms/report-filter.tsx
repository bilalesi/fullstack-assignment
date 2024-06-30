"use client";

import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { z } from "zod";

import OfficeSelector from '@/components/molecules/office-selector'
import YearSelector from '@/components/molecules/year-selector'
import Button from '@/components/atoms/button';

const ReportFilterSchema = z.object({
    office: z.number({ message: "Please select an office from the list." }).transform(val => String(val)),
    year: z.number({ message: "Please select a year from the list." })
        .min(2016, "Year must be equal or greater then 2016.")
        .max(2024, "Year must be less or equal then 2024.")
        .transform(val => String(val)),
});

export default function ReportFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const [errors, setErrors] = useState<{ office?: string[] | undefined; year?: string[] | undefined; }>();
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({ office: undefined, year: undefined });

        const formData = new FormData(e.currentTarget);
        const office = formData.get('office') ? Number(formData.get('office')) : null;
        const year = formData.get('year') ? Number(formData.get('year')) : null;
        const { error, data } = await ReportFilterSchema.safeParseAsync({ year, office });

        if (error && !data) {
            setErrors(error.flatten().fieldErrors);
        } else {
            const params = new URLSearchParams(window.location.search);
            params.set('year', data.year);
            params.set('office', data.office);

            startTransition(() => {
                setErrors({ office: undefined, year: undefined });
                router.replace(`${pathname}?${params.toString()}`)
            });
        }
    }

    const onReset = () => {
        setErrors({ office: undefined, year: undefined });

        const params = new URLSearchParams(window.location.search);
        params.delete('office');
        params.delete('year');
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <form
            noValidate
            className='flex gap-2 items-end w-full'
            name='report-filter'
            onSubmit={onSubmit}
            onReset={onReset}
        >
            <OfficeSelector />
            <YearSelector />

            <Button title='Go' type='submit' disabled={isPending} loading={isPending} className={isPending ? 'pointer-events-none !bg-gray-200 !text-red-500' : ''} />
            <Button title='Reset' type='reset' className='!bg-gray-300 !text-gray-600' />
        </form>
    )
}