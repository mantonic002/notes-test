import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (creds: { username: string; password: string }) =>
      api.post("/auth/login", creds).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      queryClient.invalidateQueries();
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.clear();
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    error: loginMutation.error,
    isAuthenticated: !!token,
    logout,
  };
};
