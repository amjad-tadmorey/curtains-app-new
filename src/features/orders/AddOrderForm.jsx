import React, { useEffect } from 'react'
import Input from '../../ui/Input'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import Button from '../../ui/Button'
import Select from '../../ui/Select'
import GeneralInfo from './GeneralInfo'
import Products from './Products'
import Rooms from './Rooms'
import { useProducts } from '../products/useProducts'
import { useCreateProduct } from '../products/useCreateProduct'
import toast from 'react-hot-toast'
import { useAddOrder } from './useAddOrder'


export default function AddOrderForm() {

    const { products, isLoading } = useProducts()
    const { addOrder } = useAddOrder()
    const methods = useForm();
    useEffect(() => {
    }, [methods.watch()]);


    function compareRoomQuantities(products, rooms) {
        const productQuantities = {};

        // Store total product quantities from the main products list
        products.forEach(({ product, quantity }) => {
            productQuantities[product] = parseFloat(quantity) || 0;
        });

        // Store total quantities used in rooms
        const usedQuantities = {};

        rooms.forEach((room, roomIndex) => {
            Object.keys(room).forEach(field => { // Iterate through fabrics, cleats, accessories
                room[field].forEach(({ product, quantity }) => {
                    if (!product) return; // Skip empty product entries
                    const roomQuantity = parseFloat(quantity) || 0;
                    usedQuantities[product] = (usedQuantities[product] || 0) + roomQuantity;
                });
            });
        });

        // Compare the total quantities
        Object.keys(productQuantities).forEach(product => {
            const available = productQuantities[product];
            const used = usedQuantities[product] || 0;

            if (used.toFixed(2) > available.toFixed(2)) {
                console.log(`🚨 Product "${product}" is OVERUSED. Used: ${used.toFixed(2)}, Available: ${available.toFixed(2)}`);
            } else if (used < available) {
                console.log(`⚠️ Product "${product}" is UNDERUSED. Used: ${used.toFixed(2)}, Available: ${available.toFixed(2)}`);
            } else {
                console.log(`✅ Product "${product}" is EXACTLY USED. Used: ${used.toFixed(2)}, Available: ${available.toFixed(2)}`);
            }
        });
    }


    function onSubmit(data) {
        console.log(data);

        compareRoomQuantities(data.products, data.rooms);

    }
    if (isLoading) return null
    return (
        <div className='min-w-[95vw] h-[80vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pr-12 pb-2 font-bold'>Add Order</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className='px-4'>
                    {/* Genral Info */}
                    <GeneralInfo />

                    {/* Products Selection */}
                    <Products methods={methods} products={products} />

                    {/* Rooms */}
                    <Rooms methods={methods} />

                    <div className='mt-12'>
                        <Button variant='success' size='lg'>Submit</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

