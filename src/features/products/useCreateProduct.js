import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct as createProductApi } from "../../services/productsApi";

export function useCreateProduct() {

    const queryClient = useQueryClient()
    const { mutate: createProduct, isLoading: isCreating } = useMutation({
        mutationFn: createProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    return { createProduct, isCreating }
}