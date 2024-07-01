import { ReactNode } from 'react'

type Props = {
    label: string;
    value: ReactNode;
}

export default function Statistic({ label, value }: Props) {
    return (
        <div className="flex items-center justify-center p-4 bg-white rounded shadow-md border border-gray-100 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-between h-full gap-5">
                <div className="text-gray-400 text-base font-light">{label}</div>
                <div className="text-3xl font-bold text-red-500">
                    {value}
                </div>
            </div>
        </div>
    )
}