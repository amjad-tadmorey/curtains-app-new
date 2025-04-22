import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToSchedule as addToScheduleApi } from "../../services/scheduleِApi";

export function useAddToSchedule() {

    const queryClient = useQueryClient()
    const { mutate: addToSchedule, isLoading: isAdding } = useMutation({
        mutationFn: addToScheduleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule'] })
        }
    })

    return { addToSchedule, isAdding }
}