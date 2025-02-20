import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../services/ordersApi";
import { useParams } from "react-router";

export function useOrderById() {
    const { orderId } = useParams()
    const { isLoading: isLoadingOrder, data: order } = useQuery({
        queryKey: ['order'],
        queryFn: () => getOrderById(orderId),
        retry: false
    })

    return { isLoadingOrder, order }
}