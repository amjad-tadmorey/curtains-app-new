import { useFormContext } from "react-hook-form";

const Textarea = ({
    name,
    label,
    placeholder,
    required = false,
    transition = true,
    rows = 4, // Default number of rows
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>}
            <textarea
                id={name}
                placeholder={placeholder}
                rows={rows}
                {...register(name, { required: required && "This field is required" })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none resize-none ${transition ? "focus:ring-2 focus:ring-primary transition-all duration-200" : "focus:ring-0"
                    } ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default Textarea;
