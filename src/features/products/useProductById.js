import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProductById } from "../../services/productsApi";

export function useProductById() {
    const { productId } = useParams()
    const { isLoading: isLoadingProduct, data: product } = useQuery({
        queryKey: [`product-${productId}`],
        queryFn: () => getProductById(productId),
        retry: false
    })

    return { isLoadingProduct, product }
}