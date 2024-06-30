"use client";

import { useMemo } from 'react';
import { range } from '@/lib/utils';
import Selector from '@/components/atoms/selector-dropdown';

export default function YearSelector() {
    const items = useMemo(() => range(2016, 2024).map((value) => ({
        id: value.toString(),
        label: value.toString(),
        value: value.toString(),
    })), []);

    return (
        <Selector
            id='year'
            label='Select a year'
            items={items}
        />
    )
}