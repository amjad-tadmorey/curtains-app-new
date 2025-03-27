/* eslint-disable react/prop-types */
import { useState } from "react";

export default function CutOff({ methods, products }) {

    const { register, unregister } = methods;
    const [fields, setFields] = useState([]);

    const handleAddField = () => {
        setFields([...fields, {}]);
    };

    const handleRemoveField = (index) => {
        unregister(`cuttoff_materials.${index}`); // ✅ Fix: Ensure removal from React Hook Form state
        setFields(fields.filter((_, i) => i !== index));
    };

    if (products.length === 0) return null;

    return (
        <div className="p-4 border rounded-lg mt-4">
            <h2 className="text-xl font-bold mb-4">تهليك مواد</h2>
            {fields.map((_, index) => (
                <div key={index} className="flex space-x-4 rtl:space-x-reverse items-center mb-2">
                    <select
                        {...register(`cuttoff_materials.${index}.product`, { required: true })}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">إختر منتج</option>
                        {products.map((product) => (
                            <option key={product.product} value={product.product}>{product.product}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        {...register(`cuttoff_materials.${index}.quantity`, { required: true })}
                        className="border p-2 rounded w-full"
                        step="0.01"
                        min="0"
                        max={'3'}
                    />
                    <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500 cursor-pointer">×</button>
                </div>
            ))}
            <button type="button" onClick={handleAddField} className="text-blue-500 mt-2 cursor-pointer">+ أضف منتج</button>
        </div>
    );
}
