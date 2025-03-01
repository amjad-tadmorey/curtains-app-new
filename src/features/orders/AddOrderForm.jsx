import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useProducts } from '../products/useProducts'
import { useAddOrder } from './useAddOrder'
import GeneralInfo from './GeneralInfo'
import Products from './Products'
import Rooms from './Rooms'
import CuttOff from './CuttOff'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import { updateStock } from '../../services/productsApi'


export default function AddOrderForm({ close }) {

    const { products, isLoading } = useProducts()
    const { addOrder } = useAddOrder()
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

            if (used > available) {
                errors.push(`🚨 Product "${product}" is OVERUSED. Used: ${used.toFixed(2)}, Available: ${available.toFixed(2)}`);
            } else if (used < available) {
                errors.push(`⚠️ Product "${product}" is UNDERUSED. Used: ${used.toFixed(2)}, Available: ${available.toFixed(2)}`);
            }
        });

        return {
            isValid: errors.length === 0,  // Returns true if no errors
            errors,
        };
    }



    function onSubmit(orderData) {
        updateStock(orderData.products).then(data => {
            if (data.state === false) {
                return alert(data.error)
            } else {
                if (orderData.order_type === 'خياطة' && orderData.rooms === undefined) {
                    return alert('🚨 يجب اضافة غرفة واحدة على الاقل في نوع الاوردر (خياطة)')
                } else {
                    console.log(data);
                    if (orderData.order_type === "خام") {
                        console.log("a");
                        try {
                            updateStock(orderData.products);
                        } catch (e) {
                            console.log(e);
                        }
                        addOrder({ ...orderData, status: 'pending' }, {
                            onSuccess: () => {
                                close()
                                methods.reset()
                                toast.success('The Order Successfuly Add ✔!')
                            }
                        });
                    } else {
                        const { products, rooms, cuttoff_materials } = orderData;
                        const result = compareRoomQuantities(products, rooms, cuttoff_materials);
                        if (!result.isValid) {
                            // Display errors (You can use alert, console.log, or set state if using React)
                            alert(result.errors.join("\n"));  // Show errors in an alert
                            return; // Stop form submission if invalid
                        }
                        try {
                            updateStock(orderData.products);
                        } catch (e) {
                            console.log(e);

                        }
                        addOrder({ ...orderData, status: 'pending' }, {
                            onSuccess: () => {
                                close()
                                methods.reset()
                                toast.success('The Order Successfuly Add ✔!')
                            }
                        });
                    }
                }
            }
        })




    }


    if (isLoading) return null
    return (
        <div dir='rtl' className='min-w-[95vw] h-[80vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pr-12 pb-2 font-bold text-2xl'>Add Order</h1>
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
                    <Button className='mt-12 block' variant='success' size='lg'>Submit</Button>
                </form>
            </FormProvider>
        </div>
    )
}

