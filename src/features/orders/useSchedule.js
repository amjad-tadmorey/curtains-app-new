import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../../services/scheduleِApi";

export function useSchedule() {

    const { isLoading, data: schedule } = useQuery({
        queryKey: ['schedule'],
        queryFn: getSchedule,
    })
    return { isLoading, schedule }
}