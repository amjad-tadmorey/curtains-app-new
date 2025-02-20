import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrder as addOrderApi } from "../../services/ordersApi";

export function useAddOrder() {

    const queryClient = useQueryClient()
    const { mutate: addOrder, isLoading: isAdding } = useMutation({
        mutationFn: addOrderApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    return { addOrder, isAdding }
}