import { useAuth } from '../../context/AuthContext'
import { useReference } from '../../context/ReferenceContext'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import Switch from '../../ui/Switch'

export default function GeneralInfo() {
    const { show_rooms, sales_men } = useReference()
    const { user, isLoading } = useAuth()
    if (isLoading) return null


    return (
        <div className='mb-8 pb-4 border-b border-gray-300'>
            <h2 className='text-xl font-bold mb-4'>معلومات العميل : </h2>

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
                    sales_men[user.user_metadata.branch]
                }
                />
                <Select name='order_type' label="نوع الأوردر" required={true} options={[{ key: 'خياطة', label: 'خياطة', value: 'خياطة' }, { key: 'خام', label: 'خام', value: 'خام' }]} />
                <Select name='delivery_type' label=" نوع التوصيل " required={true} options={[{ key: 'تسليم صالة', label: 'تسليم صالة', value: 'تسليم صالة' }, { key: 'تركيب', label: 'تركيب', value: 'تركيب' }]} />
                <Input name='technical' label="فني المقاس" required={true} />
                {/* <Input name='delivery_date' label="تاريخ التسليم" required={true} type='date' /> */}
                <Switch name="vip" label="Vip" required={false} />
            </div>
        </div>
    )
}
