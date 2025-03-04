import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../services/ordersApi";
import { useParams } from "react-router";

export function useOrderById(id) {
    const { orderId } = useParams()
    const { isLoading: isLoadingOrder, data: order } = useQuery({
        queryKey: [`order-${orderId}`],
        queryFn: () => getOrderById(orderId || id),
        retry: false
    })

    return { isLoadingOrder, order }
}