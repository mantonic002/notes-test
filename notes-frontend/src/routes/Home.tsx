import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => api.get("/notes").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <h1>Welcome!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
