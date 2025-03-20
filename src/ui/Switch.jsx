import { useFormContext } from "react-hook-form";

const Switch = ({ name, label, required = false }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="w-full flex items-center">
            {label && <label className="text-sm font-medium mr-2" htmlFor={name}>{label}</label>}
            <label className="relative w-12 h-6 flex items-center cursor-pointer">
                <input
                    id={name}
                    type="checkbox"
                    {...register(name, {
                        required: required && "This field is required",
                    })}
                    className="peer hidden"
                />
                <div className={`w-full h-full rounded-full transition-all ${errors[name] ? "bg-success" : "bg-gray-300 peer-checked:bg-success-hover"}`}></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-6"></div>
            </label>
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default Switch;
