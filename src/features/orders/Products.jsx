import { Controller, useFieldArray } from 'react-hook-form'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import { useEffect } from 'react';

export default function Products({ methods, products }) {
    const watchedProducts = methods.watch("products", []);
    useEffect(() => {
        console.log("Form changed, current products:", watchedProducts);
    }, [watchedProducts]);

    const { control, register, setValue, getValues } = methods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });
    const options = products.map(p => ({
        key: p.id,
        value: `${p.productName} || ${p.sapID} || ${p.id} || ${p.productType}`,
        label: `${p.productName} || ${p.sapID} || ${p.id} || ${p.productType}`
    }));


    // const handleAddProduct = () => {
    //     const currentProducts = methods.getValues('products') || [];
    //     methods.setValue('products', [...currentProducts, { product: '', quantity: null }]);
    // };


    const handleDeleteProduct = (index, globalProducts) => {
        // Function to extract the product ID from the product string
        const currentProducts = [...(methods.getValues('products') ?? [])];
        if (index < 0 || index >= currentProducts.length) return;
        const productToDelete = currentProducts[index];
        const extractId = (str) => str?.split("||")[2]?.trim();
        const productIdToDelete = extractId(productToDelete.product);
        const productTypes = ['fabrics', 'cleats', 'accessories', 'rails', 'roll', 'oima'];
        const exists = globalProducts?.some(room =>
            productTypes.some(type =>
                room[type]?.some(item => {
                    const id = item.product?.split("||")[2]?.trim();
                    return id === productIdToDelete;
                })
            )
        ) || false
        console.log(exists);
        if (exists) return alert('🚨 لا يمكن حذف المنتج و قد تم استخدامه في احد الغرف')
        else remove(index)
    };

    return (
        <>
            {fields.map((field, index) => (
                <div key={field.id} className="mb-4 flex items-center space-x-4">
                    <Controller
                        control={control}
                        name={`products[${index}].product`}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={options}
                                label="إختر منتج"
                                required
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name={`products[${index}].quantity`}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="الكمية"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                            />
                        )}
                    />
                    <button className='px-3 py-1 bg-dark text-white rounded-md hover:bg-dark-hover transition-all cursor-pointer' type="button" onClick={() => handleDeleteProduct(index, methods.getValues().rooms)}>x</button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ product: "", quantity: "" })}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer"
            >
                + أضف منتج
            </button>

            {/* Display Selected Products */}
            {watchedProducts &&
                <div className="my-8 pb-4 border-b border-gray-300">
                    <h2 className="font-bold text-lg">المنتجات التي تم إختيارها :</h2>
                    <div className="space-y-4 mt-4">
                        {watchedProducts.map((item, index) => (
                            <div key={index} className="flex justify-between p-2 border rounded-md">
                                <span>إسم المنتج: {item.product || 'Not selected'}</span>
                                <span>الكمية: {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}
