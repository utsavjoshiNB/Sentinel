import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Better dev experience
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      onError: (error: any) => {
        // Global error handler for mutations
        const message = error?.message || "Something went wrong";
        toast.error(message);
      },
    },
  },
});
