type Props = {
    error: string;
}

export default function Error({ error }: Props) {
    return (
        <div className='absolute -bottom-5 left-0 text-xs text-red-500 font-light'>{error}</div>
    )
}