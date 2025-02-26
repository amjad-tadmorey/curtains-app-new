import { useFormContext } from "react-hook-form";

const Input = ({
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    transition = true,
    re, // <-- Prop for regex validation
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    // Define validation rules
    const validationRules = {
        required: required && "This field is required",
        pattern: re === "11-digit"
            ? { value: /^\d{11}$/, message: "Must be exactly 11 digits" } // <-- If "11-digit", apply this regex
            : undefined,
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>}
            <input
                step="0.01"
                min={0}
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, validationRules)}
                className={`w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none ${transition ? "focus:ring-2 focus:ring-primary transition-all duration-200" : "focus:ring-0"
                    } ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default Input;
