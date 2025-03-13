import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/ordersApi";
import { useAuth } from "../../context/AuthContext";

export function useOrders() {
    const { user: { user_metadata: { branch } } } = useAuth()


    const { isLoading, data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders(branch),
    })
    return { isLoading, orders }
}