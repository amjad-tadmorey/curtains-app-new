import { useAuth } from '../../context/AuthContext'
import { useReference } from '../../context/ReferenceContext'
import Input from '../../ui/Input'
import Select from '../../ui/Select'

export default function GeneralInfo() {
    const { show_rooms } = useReference()
    const { user, isLoading } = useAuth()
    if (isLoading) return null
    console.log(user.user_metadata.branch);
    console.log(show_rooms[user.user_metadata.branch]);


    return (
        <div className='mb-8 pb-4 border-b border-gray-300'>
            <h2 className='text-xl font-bold mb-4'>General Info : </h2>

            <div className='grid grid-cols-2 gap-4'>
                <Input name='customer_name' label="إسم العميل" required={true} />
                <Input name='phone_number' label="رقم الهاتف (مصر)" required={true} re={'11-digit'} />
                <Input name='phone_number_2' label="رقم الهاتف 2 (مصر) (اختياري)" re={'11-digit'} />
                <Input name='phone_number_3' label="الهاتف رقم 3 (اختياراي)" />
                <Input name='area' label="المنطقة" required={true} />
                <Input name='address' label="العنوان" required={true} />

                <Select name='show_room' label="إسم الصالة" required={true} options={
                    show_rooms[user.user_metadata.branch]
                }
                />
                <Select name='sales_man' label="إسام البائع" required={true} options={
                    [
                        { key: 'عبد الرحمن اشمر', label: 'عبد الرحمن أشمر', value: 'عبد الرحمن أشمر' },
                        { key: 'اسماء محمد عبد القادر', label: 'اسماء محمد عبد القادر', value: 'اسماء محمد عبد القادر' },
                        { key: 'زكريا أحمد', label: 'زكريا أحمد', value: 'زكريا أحمد' },
                        { key: 'رضوان الخطيب', label: 'رضوان الخطيب', value: 'رضوان الخطيب' },
                        { key: 'احمد عبد السلام', label: 'احمد عبد السلام', value: 'احمد عبد السلام' },
                        { key: 'اميرة محمد', label: 'اميرة محمد', value: 'اميرة محمد' },
                        { key: 'يحيى اسامة', label: 'يحيى اسامة', value: 'يحيى اسامة' },
                        { key: 'عبد الرحمن سيد', label: 'عبد الرحمن سيد', value: 'عبد الرحمن سيد' },
                        { key: 'محمد علاء اسماعيل', label: 'محمد علاء اسماعيل', value: 'محمد علاء اسماعيل' }

                    ]}
                />
                <Select name='order_type' label="نوع الأوردر" required={true} options={[{ key: 'خياطة', label: 'خياطة', value: 'خياطة' }, { key: 'خام', label: 'خام', value: 'خام' }]} />
                <Select name='delivery_type' label=" نوع التوصيل " required={true} options={[{ key: 'تسليم صالة', label: 'تسليم صالة', value: 'تسليم صالة' }, { key: 'تركيب', label: 'تركيب', value: 'تركيب' }]} />
                <Input name='technical' label="الفني" required={true} />
                <Input name='delivery_date' label="تاريخ التسليم" required={true} type='date' />
            </div>
        </div>
    )
}
