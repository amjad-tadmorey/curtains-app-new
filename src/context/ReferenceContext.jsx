import { createContext, useContext, useState, useEffect } from "react";
import { getProductsTypeOptions } from "../services/referenceApi";
import { useAuth } from "./AuthContext";

const ReferenceContext = createContext();

export function ReferenceProvider({ children }) {
    const [productsTypeOptions, setProductsTypeOptions] = useState([]);
    const [windows, setWindows] = useState([]);
    const [show_rooms, set_show_rooms] = useState([]);
    const { user } = useAuth()

    useEffect(() => {
        getProductsTypeOptions().then(data => setProductsTypeOptions(data.type_options))
    }, []);
    useEffect(() => {
        getProductsTypeOptions().then(data => setWindows(data.windows))
    }, []);
    useEffect(() => {
        getProductsTypeOptions().then(data => set_show_rooms(data.show_rooms))
    }, []);


    return (
        <ReferenceContext.Provider value={{ productsTypeOptions, windows, show_rooms }}>
            {children}
        </ReferenceContext.Provider>
    );
}

export function useReference() {
    return useContext(ReferenceContext);
}
