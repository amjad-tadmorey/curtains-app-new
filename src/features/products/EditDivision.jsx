import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FiX } from "react-icons/fi"; // Feather X icon for delete
import Input from "../../ui/Input";
import { useEditDivision } from "./useEditDivision";
import { useAuth } from "../../context/AuthContext";

export default function NumberInputForm({ initialProductDivisions, id, type, name }) {
    const { user, isLoading } = useAuth()



    const { editDivision, isediting } = useEditDivision()


    const [productDivisions, setProductDivisions] = useState(initialProductDivisions);

    const methods = useForm({
        defaultValues: {
            numbers: initialProductDivisions,
        },
    });

    const handleAdd = () => {
        const updated = [...productDivisions, 0];
        setProductDivisions(updated);
        methods.setValue(`numbers.${updated.length - 1}`, 0);
    };

    const handleDelete = (indexToDelete) => {
        const updated = productDivisions.filter((_, i) => i !== indexToDelete);
        setProductDivisions(updated);

        // Remove and re-register the values to keep them in sync
        const currentValues = methods.getValues("numbers") || [];
        const newValues = currentValues.filter((_, i) => i !== indexToDelete);
        methods.reset({ numbers: newValues });
    };

    const onSubmit = (data) => {
        console.log(data);
        const parsedNumbers = data.numbers.map(n => Number(n)); // نحول كل قيمة لرقم
        if (parsedNumbers.includes(0)) {
            alert('🚨 لا يمكن تحديث الكمية و يوجد كميات صفر !');
            return;
        }
        editDivision({ id, newDiv: parsedNumbers, type }, {
            onSuccess: () => {
                window.location.reload()
                queryClient.invalidateQueries({ queryKey: [`products-${id}`] })
            }
        })
    };

    if (isLoading) return null

    if (user.user_metadata.role !== 'inventoryManager') return null

    else return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 col-span-3" dir="rtl">
                <h2 className="text-2xl font-bold">{name}</h2>

                <div className="flex items-center gap-2 flex-wrap">
                    {productDivisions.map((value, index) => (
                        <div key={index} className="relative">
                            <Input
                                name={`numbers.${index}`}
                                type="number"
                                label={`تقسيمة#${index + 1}`}
                                required={true}
                                transition={true}
                                placeholder={`e.g. ${value}`}
                            />
                            <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                className="absolute -top-1 left-1 text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        أضف تقسيمة
                    </button>
                    <button
                        disabled={isediting}
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        تحديث
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}
