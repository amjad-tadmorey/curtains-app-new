import { useState, useRef, useEffect } from "react";

export default function DynamicInputs({ methods }) {
    const { register, setValue, getValues } = methods;
    const [inputs, setInputs] = useState([""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[inputs.length - 1]?.focus();
    }, [inputs]);

    const handleKeyDown = (e, index) => {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            const values = getValues("fields") || [];

            if (values[index] !== "" && index === inputs.length - 1) {
                setInputs((prevInputs) => {
                    const newInputs = [...prevInputs, ""];

                    // Ensure the new input is registered properly
                    setValue(`fields.${newInputs.length - 1}`, "");

                    return newInputs;
                });
            }
        }
    };

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">Dynamic Inputs</h2>
            {inputs.map((_, index) => (
                <input
                    key={index}
                    {...register(`fields.${index}`, { value: "" })} // Ensure default empty string
                    ref={(el) => (inputRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="Type and press Tab"
                    className="border p-2 rounded w-full"
                />
            ))}
        </div>
    );
}
