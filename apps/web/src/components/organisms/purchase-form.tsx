"use client";

import { useState, useTransition } from 'react';
import OfficeSelector from '@/components/molecules/office-selector';
import FruitSelector from '@/components/molecules/fruit-selector';
import Button from '@/components/atoms/button';
import Error from '@/components/atoms/error';
import { z } from 'zod';
import purchase from '@/http/do-purchase';

type Fruit = {
    id: string;
    name: string;
    quantity: number;
}

type FruitItemProps = {
    id: string; name: string; quantity: number;
    onDeleteFruit: (fruitId: string) => void;
}

function FruitItem({ id, name, quantity, onDeleteFruit }: FruitItemProps) {
    return (
        <div
            id={`fruit-${id}`}
            className='p-3 grid grid-cols-[1fr,.5fr,.5fr] items-center justify-center gap-2 border-b border-gray-300 last:border-none'
        >
            <div className='font-bold'>{name}</div>
            <div className='font-light'>{quantity}</div>
            <button onClick={() => onDeleteFruit(id)}>❌</button>
        </div>
    )
}

const PurchaseFormSchema = z.object({
    office: z
        .number({ message: "Please select an office from the list." })
        .transform(val => val.toString()),
    fruits: z
        .string()
        .refine(val => {
            // check if the fruits object is a json obj
            try {
                const obj = JSON.parse(val);
                // check if the hidden fruit input is not empty
                if (Array.isArray(obj) && !!obj.length) {
                    return true;
                }
                return false;
            } catch (_) {
                return false;
            }
        }, { message: "Please select at least one fruit from the list." })
});

export default function PurchaseForm() {
    const [fruits, setFruits] = useState<Array<Fruit>>([]);
    const [errors, setErrors] = useState<{ office?: string[] | undefined; fruits?: string[] | undefined; }>();
    const [purchaseStatus, setPurchaseStatus] = useState<'success' | 'failed' | null>(null);
    const [isPending, startTransition] = useTransition();

    const onAddFruit = (id: string, name: string, quantity: number) => {
        setFruits(prev => [...prev.filter(el => el.id !== id), { id, name, quantity }]);
    };

    const onDeleteFruit = (fruitId: string) => setFruits(prev => prev.filter(elt => elt.id !== fruitId));

    const onSubmit = async (formData: FormData) => {
        setErrors({ office: undefined, fruits: undefined });
        setPurchaseStatus(null);

        const office = formData.get('office') ? Number(formData.get('office')) : null;
        const fruits = formData.get('fruits') ? String(formData.get('fruits')) : null;
        const { data, error } = await PurchaseFormSchema.safeParseAsync({ office, fruits });

        if (error && !data) {
            setErrors(error.flatten().fieldErrors);
        } else {

            startTransition(async () => {
                const result = await purchase({
                    office: data.office,
                    fruits: data.fruits,
                });
                
                if (result) {
                    setErrors({ office: undefined, fruits: undefined });
                    setFruits([]);
                    setPurchaseStatus('success');
                } else {
                    setPurchaseStatus('failed');
                }
            });

            setTimeout(() => {
                setPurchaseStatus(null);
            }, 2000);
        }
    }
    return (
        <form
            noValidate
            id='form-purchase-fruit'
            name='form-purchase-fruit'
            className='flex flex-col w-full'
            action={onSubmit}
        >
            <input
                readOnly
                hidden
                type='text'
                name='fruits'
                value={JSON.stringify(fruits)}
            />
            <div className='my-2 flex flex-col w-full relative'>
                <OfficeSelector />
                {errors?.office?.map((er, indx) => <Error key={`${er}-${indx}`} error={er} />)}
            </div>
            <div className='my-4'>
                <div className='flex flex-col w-full relative'>
                    <FruitSelector {...{
                        onAddFruit,
                    }} />
                    {errors?.fruits?.map((er, indx) => <Error key={`${er}-${indx}`} error={er} />)}
                </div>
                <div className='p-4 flex flex-col gap-1 w-full max-w-xl mx-auto'>
                    {fruits.map(({ id, name, quantity }) => (
                        <FruitItem
                            key={`${id}-${name}-${quantity}`}
                            {...{
                                id,
                                name,
                                quantity,
                                onDeleteFruit,
                            }} />
                    ))}
                </div>
            </div>
            <div className='self-end'>
                <Button
                    title="Buy"
                    className='!px-10'
                    disabled={isPending}
                    loading={isPending}
                />
            </div>
            {purchaseStatus && (
                <div className={`border w-full p-4 rounded-md mt-4 ${purchaseStatus === 'success' ? 'bg-teal-300' : 'bg-rose-300'}`}>
                    {purchaseStatus === 'success' && <div className='text-center'>Purchase terminated successfully!</div>}
                    {purchaseStatus === 'failed' && <div className='text-center'>Purchase terminated with failure!</div>}
                </div>
            )}
        </form>
    )
}