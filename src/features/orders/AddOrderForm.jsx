import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useProducts } from '../products/useProducts'
import { useAddOrder } from './useAddOrder'
import { useAuth } from '../../context/AuthContext'
import GeneralInfo from './GeneralInfo'
import Products from './Products'
import Rooms from './Rooms'
import CuttOff from './CuttOff'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import Spinner from '../../ui/Spinner'
import { compareRoomQuantities, validateProducts } from '../../utils/helpers'


export default function AddOrderForm({ close }) {
    const { user: { user_metadata: { branch }, isLoading: isLoadingAuth } } = useAuth()
    const { products, isLoading: isLoadingProducts } = useProducts()
    const { addOrder, isAdding } = useAddOrder()

    const methods = useForm();
    useEffect(() => {
    }, [methods.watch()]);

    function onSubmit(orderData) {
        if (orderData.order_type === 'خياطة' && orderData.rooms === undefined) return alert('🚨 يجب اضافة غرفة واحدة على الاقل في نوع الاوردر (خياطة)')
        if (orderData.order_type === "خام") {
            addOrder({ ...orderData, status: 'قيد الانتظار', branch }, {
                onSuccess: () => {
                    close()
                    methods.reset()
                    toast.success('The Order Successfuly Added ✔!')
                }
            });
        } else {

            if (!validateProducts(orderData.rooms, orderData.products)) return alert('🚨 لا يمكن اختيار نوع خياطة ويفي و لم يتم ضافة مجر ويفي في المنتجات')

            const { products, rooms, cuttoff_materials } = orderData;
            const result = compareRoomQuantities(products, rooms, cuttoff_materials);
            if (!result.isValid) {
                // Display errors (You can use alert, console.log, or set state if using React)
                alert(result.errors.join("\n"));  // Show errors in an alert
                return; // Stop form submission if invalid
            }
            addOrder({ ...orderData, status: 'قيد الانتظار', branch }, {
                onSuccess: () => {
                    close()
                    methods.reset()
                    toast.success('The Order Successfuly Add ✔!')
                }
            });
        }
    }


    if (isLoadingProducts || isLoadingAuth) return <Spinner />
    return (
        <div dir='rtl' className='min-w-[95vw] h-[90vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pl-12 pb-2 font-bold text-2xl'>إضافة أوردر</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className='px-4'>
                    {/* Genral Info */}
                    <GeneralInfo />

                    {/* Products Selection */}
                    <Products methods={methods} products={products} />

                    {/* Rooms */}
                    <Rooms methods={methods} />

                    {/* Cutt Off */}
                    <CuttOff methods={methods} products={methods.getValues().products || []} />
                    <Button disabled={isAdding} className='mt-12 block' variant='success' size='lg'>Submit</Button>
                </form>
            </FormProvider>
        </div>
    )
}

