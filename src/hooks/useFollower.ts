import kyInstance from "@/lib/ky";
import { IFollowerInfo } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

export default function useFollower(userId: string, initialState: IFollowerInfo) {

    const query = useQuery({
        queryKey: ["follower-info", userId],
        queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<IFollowerInfo>(),
        initialData: initialState,
        staleTime: Infinity
    })

    return query
}