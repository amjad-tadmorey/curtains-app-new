import { Controller } from 'react-hook-form'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import { useEffect } from 'react';

export default function Products({ methods, products }) {
    const watchedProducts = methods.watch("products", [{ product: '2202 كتان فرنسي || 270-10-0001-16-00112 || 247 || fabrics', quantity: 10 }]);
    useEffect(() => {
        // console.log("Form changed, current products:", watchedProducts);
    }, [watchedProducts]);
    console.log(methods.getValues('products'));
    const handleAddProduct = () => {
        const currentProducts = methods.getValues('products') || [];
        methods.setValue('products', [...watchedProducts, { product: '', quantity: null }]);
    };
    console.log(watchedProducts);

    const handleDeleteProduct = (index, globalProducts) => {
        console.log(index);

        const currentProducts = [...(methods.getValues('products') ?? [])];

        if (index < 0 || index >= currentProducts.length) return;

        const productToDelete = watchedProducts[index];
        const existsInGlobal = globalProducts?.some(group =>
            Object.values(group)?.some(category =>
                Array.isArray(category) && category?.some(item => item.product === productToDelete.product)
            )
        );

        if (existsInGlobal) {
            alert("🚨 لا يمكن حذف منتج تم استخدامه في إحدى الغرف \n برجاء حذف المنتج من الغرفة ثم حذفه من القائمة الرئيسية!");
            return;
        }

        currentProducts.splice(index, 1);
        methods.setValue('products', currentProducts);
    };

    return (
        <>
            <div className='pb-4 border-b border-gray-300'>
                <h2 className='text-xl font-bold mb-4'>المنتجات : </h2>

                <Controller
                    name="products"
                    control={methods.control}
                    // defaultValue={oldOrder}
                    render={({ field }) => (
                        <>
                            {field.value?.map((_, index) => (
                                <div key={index} className="mb-4 flex items-center space-x-4">
                                    <Select
                                        name={`products[${index}].product`}
                                        // options={products}
                                        options={products.sort((a, b) => a.productName.localeCompare(b.productName, "ar")).map(p => ({ key: p.id, value: `${p.productName} || ${p.sapID} || ${p.id} || ${p.productType}`, label: `${p.productName} || ${p.sapID} || ${p.id} || ${p.productType}` }))}
                                        label="Select Product"
                                        required={true}
                                    />
                                    <Input
                                        name={`products[${index}].quantity`}
                                        label="Quantity"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required={true}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteProduct(index, methods.getValues().rooms)}
                                        className="px-3 py-1 bg-dark text-white rounded-md hover:bg-dark-hover transition-all cursor-pointer"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                />

                {/* Add Product Button */}
                <button
                    type="button"
                    onClick={handleAddProduct}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer"
                >

                    + أضف منتج
                </button>
            </div>
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
