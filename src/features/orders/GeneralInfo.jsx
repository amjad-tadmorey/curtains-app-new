import Input from '../../ui/Input'
import Select from '../../ui/Select'

export default function GeneralInfo() {
    return (
        <div className='mb-8 pb-4 border-b border-gray-300'>
            <h2 className='text-xl font-bold mb-4'>General Info : </h2>

            <div className='grid grid-cols-2 gap-4'>
                <Input name='customer_name' label="Customer Name" required={true} />
                <Input name='phone_number' label="PhoneNumber (egypt)" required={true} re={'11-digit'} />
                <Input name='phone_number_2' label="Phone Number 2 (egypt) (Optional)" re={'11-digit'} />
                <Input name='phone_number_3' label="Phone Number 3 (Optional)" />
                <Input name='address' label="Address" required={true} />
                <Select name='show_room' label="Show Room" required={true} options={[{ key: 'التجمع الاول', label: 'التجمع الاول', value: 'التجمع الاول' }]} />
                <Select name='sales_man' label="Sales Man" required={true} options={[{ key: 'عبد الرحمن اشمر', label: 'عبد الرحمن أشمر', value: 'عبد الرحمن أشمر' }]} />
                <Select name='order_type' label="Order Type" required={true} options={[{ key: 'خياطة', label: 'خياطة', value: 'خياطة' }, { key: 'خام', label: 'خام', value: 'خام' }]} />
                <Select name='delivery_type' label="Delivery Type" required={true} options={[{ key: 'تسليم صالة', label: 'تسليم صالة', value: 'تسليم صالة' }, { key: 'تركيب', label: 'تركيب', value: 'تركيب' }]} />
                <Input name='technical' label="technical" required={true} />
            </div>
        </div>
    )
}
