import PurchaseForm from '@/components/organisms/purchase-form';

export default function Report() {
    return (
        <div className='p-3'>
            <div className='py-4'>
                <h1 className='text-lg font-bold'>Welcome to Fruity marketplace</h1>
                <p className='text-sm font-light'>Please fill the form and then submit your order:</p>
            </div>
            <PurchaseForm/>
        </div>
    )
}