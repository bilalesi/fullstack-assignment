"use client";

import { useEffect, useState } from 'react';
import Selector, { type Item } from '@/components/atoms/selector-dropdown';
import retrieveOffices from '@/http/get-offices';

export default function OfficeSelector() {
    const [items, setItems] = useState<Array<Item>>([]);

    useEffect(() => {
        (async () => {
            const result = await retrieveOffices();
            if (result) {
                setItems(result.map((elt) => ({
                    id: elt.id.toString(),
                    value: elt.id.toString(),
                    label: `${elt.name}, (${elt.headcount})`
                })));
            }
        })();
    }, []);

    return (
        <Selector
            id='office'
            label='Select an office'
            items={items}
        />
    )
}