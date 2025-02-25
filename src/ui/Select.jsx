import { useFormContext } from "react-hook-form";

const Select = ({ name, label, options, required = false }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <select
                {...register(name, { required: required && "This field is required" })}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option.key} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default Select;
