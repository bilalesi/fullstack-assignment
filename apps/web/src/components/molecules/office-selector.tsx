"use client";

import { useState } from 'react';
import Selector from '@/components/atoms/selector-dropdown';

export default function OfficeSelector() {
    const [items, setItems] = useState([]);

    return (
        <Selector
            id='office'
            label='Select an office'
            items={items}
        />
    )
}