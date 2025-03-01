import { useMutation } from "@tanstack/react-query";
import { changeStatus as changeStatusApi } from "../../services/ordersApi";
export function useChangeStatus() {
    const { mutate: changeStatus, isLoading: isChanging } = useMutation({
        mutationFn: changeStatusApi,
    })
    return { changeStatus, isChanging }
}