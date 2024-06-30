import { ChangeEventHandler } from "react";

type Item = {
    id: string;
    value: string;
    label: string;
}

type Props<T> = {
    id: string;
    label: string;
    items: Array<T & Item>;
    onSelect?: (id: string, value: string) => void;
}

export default function SelectorDropdown({ id, label, items, onSelect }: Props<Item>) {

    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const label = selectedOption?.dataset["label"];
        const value = e.target.value;
        onSelect?.(value!, label!);
    }

    return (
        <div className='flex flex-col items-start gap-2 w-full'>
            <label className='text-gray-400 font-light text-sm'>{label}</label>
            <select
                id={id}
                name={id}
                className='h-11 w-full border border-gray-400 rounded-md py-2 px-4 disabled:pointer-events-none'
                onChange={onChange}
                disabled={!items.length}
            >
                <option
                    value={undefined}
                    className='cursor-not-allowed'
                />
                {!!items.length && (
                    items.map(elt => (
                        <option
                            key={`${id}-${elt.value}`}
                            data-id={elt.id}
                            data-label={elt.label}
                            value={elt.value}
                            className='cursor-pointer'
                        >
                            {elt.label}
                        </option>
                    ))
                )}
            </select>
        </div>
    )
}