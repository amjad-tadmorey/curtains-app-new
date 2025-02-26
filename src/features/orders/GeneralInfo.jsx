import Input from '../../ui/Input'
import Select from '../../ui/Select'

export default function GeneralInfo() {
    return (
        <div className='mb-8 pb-4 border-b border-gray-300'>
            <h2 className='text-xl font-bold mb-4'>General Info : </h2>

            <div className='grid grid-cols-2 gap-4'>
                <Input name='customer_name' label="إسم العميل" required={true} />
                <Input name='phone_number' label="رقم الهاتف (مصر)" required={true} re={'11-digit'} />
                <Input name='phone_number_2' label="رقم الهاتف 2 (مصر) (اختياري)" re={'11-digit'} />
                <Input name='phone_number_3' label="الهاتف رقم 3 (اختياراي)" />
                <Input name='address' label="العنوان" required={true} />
                <Select name='show_room' label="إسم الصالة" required={true} options={[{ key: 'التجمع الاول', label: 'التجمع الاول', value: 'التجمع الاول' }]} />
                <Select name='sales_man' label="إسام البائع" required={true} options={[{ key: 'عبد الرحمن اشمر', label: 'عبد الرحمن أشمر', value: 'عبد الرحمن أشمر' }]} />
                <Select name='order_type' label="نوع الأوردر" required={true} options={[{ key: 'خياطة', label: 'خياطة', value: 'خياطة' }, { key: 'خام', label: 'خام', value: 'خام' }]} />
                <Select name='delivery_type' label=" نوع التوصيل " required={true} options={[{ key: 'تسليم صالة', label: 'تسليم صالة', value: 'تسليم صالة' }, { key: 'تركيب', label: 'تركيب', value: 'تركيب' }]} />
                <Input name='technical' label="الفني" required={true} />
                <Input name='delivery_date' label="تاريخ التسليم" required={true} type='date' />
            </div>
        </div>
    )
}
