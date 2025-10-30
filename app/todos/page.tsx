import { createServerSupabase } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createServerSupabase();
  const { data: todos, error } = await supabase.from("todos").select("id, title");

  if (error) {
    console.error("Supabase fetch error:", error);
    return <div>Failed to load todos</div>;
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
