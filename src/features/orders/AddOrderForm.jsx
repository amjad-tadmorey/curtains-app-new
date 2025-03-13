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
import { useOrderById } from './useOrderById'


export default function AddOrderForm({ close, edit }) {
    const { user: { user_metadata: { branch }, isLoading: isLoadingAuth } } = useAuth()

    const [editSession, setEditSession] = useState(false)
    useEffect(() => {
        if (edit) setEditSession(true)
        if (!edit) setEditSession(false)
    }, [edit])


    const { products, isLoading: isLoadingProducts } = useProducts()
    const { order, isLoading: isLoadingOrder } = useOrderById(edit || 0)
    const { addOrder, isAdding } = useAddOrder()
    const methods = useForm();
    useEffect(() => {
    }, [methods.watch()]);

    function compareRoomQuantities(products, rooms, cuttoffMaterials = []) {
        const productQuantities = {};
        const usedQuantities = {};
        const errors = [];

        // Store total product quantities from the main products list
        products.forEach(({ product, quantity }) => {
            productQuantities[product] = parseFloat(quantity) || 0;
        });

        // Store total quantities used in rooms
        rooms?.forEach((room) => {
            Object.keys(room).forEach(field => {
                if (!Array.isArray(room[field])) return; // Ensure it's an array before looping
                room[field].forEach(({ product, quantity }) => {
                    if (!product) return;
                    const roomQuantity = parseFloat(quantity) || 0;
                    usedQuantities[product] = (usedQuantities[product] || 0) + roomQuantity;
                });
            });
        });

        // Store total quantities used in cuttoff materials (if any)
        if (Array.isArray(cuttoffMaterials)) {
            cuttoffMaterials.forEach(({ product, quantity }) => {
                if (!product) return;
                const cutoffQuantity = parseFloat(quantity) || 0;
                usedQuantities[product] = (usedQuantities[product] || 0) + cutoffQuantity;
            });
        }

        // Compare the total quantities
        Object.keys(productQuantities).forEach(product => {
            const available = productQuantities[product];
            const used = usedQuantities[product] || 0;

            if (used.toFixed(2) > available.toFixed(2)) {
                errors.push(`🚨 لا يمكن استهلاك كميات اكبر من الكمية المطلوبة للمنتج \n(${product.split(" || ")[0]}" تم استهلاك: ${used.toFixed(2)}, الكمية المطلوبة: ${(available).toFixed(2)}) \n ________________________________________________________________`);
            } else if (used < available) {
                errors.push(`⚠ لا يمكن إنشاء الأوردر مع وجود منتجات لم يتم استهلاك كميتها بالكامل \n (${product.split(" || ")[0]}" تم استهلاك: ${used.toFixed(2)}, المتاح: ${(available - used).toFixed(2)}) \n ______________________________________________________________`);
            }
        });

        return {
            isValid: errors.length === 0,  // Returns true if no errors
            errors,
        };
    }

    function validateProducts(rooms, products) {
        const requiredProduct = "مجر ويفي || 270-10-0003-01-00002 || 418 || rails";

        // Check if any fabric has type "ويفي"
        const hasWeaveFabric = rooms.some(room =>
            room.fabrics.some(fabric => fabric.type === "ويفي")
        );

        // If there is a "ويفي" fabric, check if the required product exists in products
        if (hasWeaveFabric) {
            return products.some(product => product.product === requiredProduct);
        }

        return true;
    }

    function onSubmit(orderData) {
        if (orderData.order_type === 'خياطة' && orderData.rooms === undefined) return alert('🚨 يجب اضافة غرفة واحدة على الاقل في نوع الاوردر (خياطة)')
        if (orderData.order_type === "خام") {
            addOrder({ ...orderData, status: 'pending', branch }, {
                onSuccess: () => {
                    close()
                    methods.reset()
                    toast.success('The Order Successfuly Add ✔!')
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
            addOrder({ ...orderData, status: 'pending', branch }, {
                onSuccess: () => {
                    close()
                    methods.reset()
                    toast.success('The Order Successfuly Add ✔!')
                }
            });
        }
    }


    if (isLoadingProducts || isLoadingOrder || isLoadingAuth) return <Spinner />
    return (
        <div dir='rtl' className='min-w-[95vw] h-[80vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pr-12 pb-2 font-bold text-2xl'>Add Order</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className='px-4'>
                    {/* Genral Info */}
                    <GeneralInfo editSession={editSession} />

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

