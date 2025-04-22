import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDivision as editDivisionApi } from "../../services/productsApi";

export function useEditDivision() {

    const queryClient = useQueryClient()
    const { mutate: editDivision, isLoading: isediting } = useMutation({
        mutationFn: editDivisionApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    return { editDivision, isediting }
}