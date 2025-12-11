import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetch("http://localhost:3000/notes").then((r) => r.json()),
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
