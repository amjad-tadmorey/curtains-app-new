import { useFormContext, useFieldArray } from "react-hook-form";
import { AiOutlinePlus as Plus, AiOutlineDelete as Trash } from "react-icons/ai";

export default function MultipleLabeledInputs({ name }) {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    return (
        <div className="w-full">
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-2 border p-3 rounded-md shadow">
                        <div className="flex items-center gap-2">
                            <label className="w-1/4 text-sm font-medium">Name</label>
                            <input
                                type="text"
                                {...register(`${name}.${index}.name`, { required: "Name is required" })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                                    ${errors[name]?.[index]?.name ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="w-1/4 text-sm font-medium">Content</label>
                            <input
                                type="text"
                                {...register(`${name}.${index}.content`, { required: "Content is required" })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                                    ${errors[name]?.[index]?.content ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>
                        <button type="button" onClick={() => remove(index)} className="text-red-500 cursor-pointer hover:text-red-700 self-end">
                            <Trash size={18} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => append({ name: "", content: "" })} className="text-primary cursor-pointer hover:text-primary-hover flex items-center gap-1">
                    <Plus size={18} /> Add Item
                </button>
            </div>
        </div>
    )
}
