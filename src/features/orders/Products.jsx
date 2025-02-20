import { Controller } from 'react-hook-form'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import { useEffect } from 'react';

export default function Products({ methods, products }) {
    const watchedProducts = methods.watch("products");
    useEffect(() => {
        console.log("Form changed, current products:", watchedProducts);
    }, [watchedProducts]);
    const handleAddProduct = () => {
        const currentProducts = methods.getValues('products') || [];
        methods.setValue('products', [...currentProducts, { product: '', quantity: 0 }]);
    };

    const handleDeleteProduct = (index) => {
        const currentProducts = methods.getValues('products') || [];
        const updatedProducts = currentProducts.filter((_, i) => i !== index);
        methods.setValue('products', updatedProducts);
    };
    return (
        <>
            <div>
                <h2>Products : </h2>

                <Controller
                    name="products"
                    control={methods.control}
                    // defaultValue={[{ product: '', quantity: 0 }]}
                    render={({ field }) => (
                        <>
                            {field.value?.map((_, index) => (
                                <div key={index} className="mb-4 flex items-center space-x-4">
                                    <Select
                                        name={`products[${index}].product`}
                                        // options={products}
                                        options={products.map(p => ({ value: p.productName, label: p.productName }))}
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
                                        onClick={() => handleDeleteProduct(index)}
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
                    className="mt-4 px-4 py-2 bg-warning text-white rounded-md hover:bg-warning-hover transition-all cursor-pointer"
                >
                    Add Another Product
                </button>
            </div>

            {/* Display Selected Products */}
            <div className="mt-8">
                <h2 className="font-bold text-lg">Selected Products:</h2>
                <div className="space-y-4 mt-4">
                    {watchedProducts && watchedProducts.map((item, index) => (
                        <div key={index} className="flex justify-between p-2 border rounded-md">
                            <span>Product: {item.product || 'Not selected'}</span>
                            <span>Quantity: {item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
