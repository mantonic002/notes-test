import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import { getErrorMessage } from "../helpers/helpers";

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

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (creds: { username: string; password: string }) =>
      api.post("/auth/register", creds).then((res) => res.data),
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.clear();
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error
      ? getErrorMessage(loginMutation.error)
      : null,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error
      ? getErrorMessage(registerMutation.error)
      : null,

    // Auth state
    isAuthenticated: !!token,
    logout,
  };
};
