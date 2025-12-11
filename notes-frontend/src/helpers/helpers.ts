import { AxiosError } from "axios";
import type { ApiError } from "../api/apiError";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    console.log(error.response?.data as ApiError);
    return (
      (error.response?.data as ApiError)?.message ||
      error.message ||
      "An error occurred"
    );
  }
  return "An unexpected error occurred";
};
