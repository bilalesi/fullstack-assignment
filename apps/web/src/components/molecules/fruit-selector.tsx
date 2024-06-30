"use client";

import { ChangeEventHandler, useEffect, useState } from 'react';
import Selector, { type Item } from '@/components/atoms/selector-dropdown';
import retrieveAvailableFruits from '@/http/get-fruits';

type Props = {
    onAddFruit: (id: string, name: string, quantity: number) => void;
}

type Fruit = {
    id: number;
    name: string;
    fruityvice_id: number;
}

export default function FruitSelector({ onAddFruit }: Props) {
    const [items, setItems] = useState<Array<Item>>([]);
    const [fruit, setFruit] = useState<{ id: string; name: string }>();
    const [quantity, setQuantity] = useState<number>(0);

    const onQuantityChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setQuantity(Number(e.target.value));
    }

    const onFruitSelect = (id: string, label: string) => setFruit({ id, name: label });

    const onSubmitAdd = () => {
        // TODO: add validation
        if (fruit && quantity) {
            onAddFruit(fruit.id, fruit.name, quantity);
            setFruit(undefined);
            setQuantity(0);
        }
    }


    useEffect(() => {
        (async () => {
            const result = await retrieveAvailableFruits();
            if (result) {
                setItems(result.map((elt: Fruit) => ({
                    id: elt.id.toString(),
                    value: elt.id.toString(),
                    label: elt.name,
                })));
            }
        })();
    }, []);

    return (
        <div className='flex items-end gap-2'>
            <Selector
                id='fruit'
                label='Select a fruit'
                items={items}
                onSelect={onFruitSelect}
            />
            <div className='flex flex-col items-start gap-2 w-full'>
                <label className='text-gray-400 font-light text-sm'>Specify a quantity</label>
                <input
                    type='number'
                    min={1}
                    className='h-11 w-full border border-gray-400 rounded-md py-2 px-4 disabled:pointer-events-none'
                    value={quantity}
                    onChange={onQuantityChange}
                />
            </div>
            <button
                className='h-11 px-3 py-2 text-blue-600 disabled:text-gray-400 rounded-md text-base min-w-max'
                type='button'
                onClick={onSubmitAdd}
                disabled={!fruit || !quantity}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" /></svg>
            </button>
        </div>
    )
}