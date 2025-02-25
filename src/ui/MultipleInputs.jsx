import { useFormContext, useFieldArray } from "react-hook-form";
import { AiOutlinePlus as Plus, AiOutlineDelete as Trash } from "react-icons/ai";

const MultipleInputs = ({ name, label, type = "text", placeholder, required = true, transition = true }) => {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <input
                            type={type}
                            placeholder={placeholder}
                            {...register(`${name}.${index}.value`, { required: "This field is required" })}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                                ${transition ? "focus:ring-2 focus:ring-primary transition-all duration-200" : "focus:ring-0"} 
                                ${(errors[name]?.[index]?.value ? "border-red-500" : "border-gray-300")}`}
                        />
                        <button type="button" onClick={() => remove(index)} className="text-red-500 cursor-pointer hover:text-red-700">
                            <Trash size={18} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => append({ value: "" })} className="text-primary cursor-pointer hover:text-primary-hover flex items-center gap-1">
                    <Plus size={18} /> Add
                </button>
            </div>
        </div>
    );
};

export default MultipleInputs;
