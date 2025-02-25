import { Controller } from 'react-hook-form'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import MultipleInputs from '../../ui/MultipleInputs'
import { useEffect } from 'react';
import MultipleLabeledInputs from '../../ui/MultipleLabeledInputs';

export default function Products({ methods, products }) {
    const watchedProducts = methods.watch("products");
    useEffect(() => {
        console.log("Form changed, current products:", watchedProducts);
    }, [watchedProducts]);
    const handleAddProduct = () => {
        const currentProducts = methods.getValues('products') || [];
        methods.setValue('products', [...currentProducts, { product: '', quantity: null }]);
    };

    const handleDeleteProduct = (index) => {
        const currentProducts = methods.getValues('products') || [];
        const updatedProducts = currentProducts.filter((_, i) => i !== index);
        methods.setValue('products', updatedProducts);
    };


    return (
        <>
            <div className='pb-4 border-b border-gray-300'>
                <h2 className='text-xl font-bold mb-4'>Products : </h2>

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
                                        options={products.sort((a, b) => a.productName.localeCompare(b.productName, "ar")).map(p => ({ key: p.id, value: p.productName, label: p.productName }))}
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
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all cursor-pointer"
                >

                    + Add Product
                </button>
            </div>


            {/* division */}

            {/* <div className='mt-12'>
                <h2>Divisions : </h2>
                <MultipleLabeledInputs name={'divisions'} />
            </div> */}

            {/* Display Selected Products */}
            {watchedProducts &&
                <div className="my-8 pb-4 border-b border-gray-300">
                    <h2 className="font-bold text-lg">Selected Products:</h2>
                    <div className="space-y-4 mt-4">
                        {watchedProducts.map((item, index) => (
                            <div key={index} className="flex justify-between p-2 border rounded-md">
                                <span>Product: {item.product || 'Not selected'}</span>
                                <span>Quantity: {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }


        </>
    )
}
