import Input from '../../ui/Input'
import Select from '../../ui/Select'

export default function GeneralInfo() {
    return (
        <div className='mb-8 pb-4 border-b border-gray-300'>
            <h2>General Info : </h2>

            <div className='grid grid-cols-2 gap-4'>
                <Input name='customer_name' label="Customer Name" required={true} />
                <Input name='phone_number' label="PhoneNumber" required={true} />
                <Input name='phone_number_2' label="Phone Number 2 (Optional)" />
                <Input name='address' label="Address" required={true} />
                <Select name='show_room' label="Show Room" required={true} options={[{ label: 'التجمع الاول', value: 'tagamo' }]} />
                <Select name='sales_man' label="Sales Man" required={true} options={[{ label: 'عبد الرحمن أشمر', value: 'abd alrahman ashmar' }]} />
                <Select name='order_type' label="Order Type" required={true} options={[{ label: 'خياطة', value: 'sewing' }, { label: 'خام', value: 'raw' }]} />
                <Select name='delivery_type' label="Delivery Type" required={true} options={[{ label: 'تسليم صالة', value: 'show_room_delivery' }, { label: 'تركيب', value: 'installation' }]} />
            </div>
        </div>
    )
}
