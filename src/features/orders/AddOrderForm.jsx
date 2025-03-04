import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useProducts } from '../products/useProducts'
import { useAddOrder } from './useAddOrder'
import GeneralInfo from './GeneralInfo'
import Products from './Products'
import Rooms from './Rooms'
import CuttOff from './CuttOff'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import Spinner from '../../ui/Spinner'
import { useOrderById } from './useOrderById'


export default function AddOrderForm({ close, edit }) {
    const [editSession, setEditSession] = useState(false)
    useEffect(() => {
        if (edit) setEditSession(true)
        if (!edit) setEditSession(false)
    }, [edit])


    const { products, isLoading } = useProducts()
    const { order, isLoading: isLoadingOrder } = useOrderById(edit || 0)
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
                errors.push(`🚨 Product "${product.split(" || ")[0]}" is OVERUSED. Used: ${used}, Available: ${(available - used).toFixed(2)}`);
            } else if (used < available) {
                errors.push(`⚠️ Product "${product.split(" || ")[0]}" is UNDERUSED. Used: ${used}, Available: ${(available - used).toFixed(2)}`);
            }
        });

        return {
            isValid: errors.length === 0,  // Returns true if no errors
            errors,
        };
    }

    function onSubmit(orderData) {
        if (orderData.order_type === 'خياطة' && orderData.rooms === undefined) return alert('🚨 يجب اضافة غرفة واحدة على الاقل في نوع الاوردر (خياطة)')
        if (orderData.order_type === "خام") {
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
            addOrder({ ...orderData, status: 'pending' }, {
                onSuccess: () => {
                    close()
                    methods.reset()
                    toast.success('The Order Successfuly Add ✔!')
                }
            });
        }
    }
    console.log(order);


    if (isLoading || isLoadingOrder) return <Spinner />
    return (
        <div dir='rtl' className='min-w-[95vw] h-[80vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pr-12 pb-2 font-bold text-2xl'>Add Order</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className='px-4'>
                    {/* Genral Info */}
                    <GeneralInfo editSession={editSession} />

                    {/* Products Selection */}
                    <Products methods={methods} products={products} editSession={editSession} oldOrder={[
                        {
                            product: "قطيفة سيليا عرضين || 270-10-0001-15-00007 || 143 || fabrics",
                            quantity: 2.5
                        },
                        {
                            product: "مواسير برونز سادة || 270-10-0003-13-00004 || 400 || rails",
                            quantity: 2
                        },
                        {
                            product: "حمالة كريستال وردة || 270-10-0003-05-00001 || 235 || accessories",
                            quantity: 1
                        }
                    ]} />

                    {/* Rooms */}
                    <Rooms methods={methods} editSession={editSession} oldOrder={[{
                        oima: [],
                        roll: [],
                        rails: {
                            type: "لايوجد",
                            notes: "",
                            product: "مواسير برونز سادة || 270-10-0003-13-00004 || 400 || rails",
                            quantity: "1.15"
                        },
                        cleats: [],
                        fabrics: {
                            type: "عادي",
                            notes: "",
                            product: "قطيفة سيليا عرضين || 270-10-0001-15-00007 || 143 || fabrics",
                            quantity: "2.5"
                        },
                        remarks: "مربط قماش عدد 1 من القطيفة",
                        windows: {
                            src: "/windows/shape-1.svg",
                            note: "",
                            type: "تركيب",
                            width: "115",
                            height: "250",
                            imageId: 1
                        },
                        room_name: "طرقة",
                        accessories: {
                            type: "برونز",
                            notes: "",
                            product: "حمالة كريستال وردة || 270-10-0003-05-00001 || 235 || accessories",
                            quantity: "1"
                        }
                    }]} />

                    {/* Cutt Off */}
                    <CuttOff methods={methods} products={methods.getValues().products || []} editSession={editSession} />
                    <Button className='mt-12 block' variant='success' size='lg'>Submit</Button>
                </form>
            </FormProvider>
        </div>
    )
}

