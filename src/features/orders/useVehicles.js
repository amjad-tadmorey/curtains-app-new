import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../../services/vehiclesApi";

export function useVehicles() {

    const { isLoading, data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: getVehicles,
    })
    return { isLoading, vehicles }
}