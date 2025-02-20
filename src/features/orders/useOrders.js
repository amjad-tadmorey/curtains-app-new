import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/ordersApi";

export function useOrders() {
    const { isLoading, data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    })
    return { isLoading, orders }
}