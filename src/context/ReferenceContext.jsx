import { createContext, useContext, useState, useEffect } from "react";
import { getReference } from "../services/referenceApi";

const ReferenceContext = createContext();

export function ReferenceProvider({ children }) {
    const [productsTypeOptions, setProductsTypeOptions] = useState([]);
    const [windows, setWindows] = useState([]);
    const [show_rooms, set_show_rooms] = useState([]);
    const [sales_men, set_sales_men] = useState([]);
    const [product_types, set_product_types] = useState([]);

    useEffect(() => {
        getReference().then(data => setProductsTypeOptions(data.type_options))
    }, []);
    useEffect(() => {
        getReference().then(data => setWindows(data.windows))
    }, []);
    useEffect(() => {
        getReference().then(data => set_show_rooms(data.show_rooms))
    }, []);
    useEffect(() => {
        getReference().then(data => set_sales_men(data.sales_men))
    }, []);
    useEffect(() => {
        getReference().then(data => set_product_types(data.product_types))
    }, []);


    return (
        <ReferenceContext.Provider value={{ productsTypeOptions, windows, show_rooms, sales_men, product_types }}>
            {children}
        </ReferenceContext.Provider>
    );
}

export function useReference() {
    return useContext(ReferenceContext);
}
