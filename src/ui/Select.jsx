import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";

const SearchableSelect = ({ name, label, options, required = false, defaultValue }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <Controller
                defaultValue={defaultValue}
                name={name}
                control={control}
                rules={{ required: required && "This field is required" }}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        isSearchable
                        placeholder="Search and select..."
                        className="w-full"
                        getOptionLabel={(e) => e.label} // Ensures correct label rendering
                        getOptionValue={(e) => e.value} // Ensures correct value selection
                        value={options.find((opt) => opt.value === field.value) || null} // Fix for stored value
                        onChange={(selectedOption) => field.onChange(selectedOption.value)} // Ensures value is stored correctly
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: errors[name] ? "red" : "#ccc",
                            }),
                        }}
                    />
                )}
            />
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default SearchableSelect;
