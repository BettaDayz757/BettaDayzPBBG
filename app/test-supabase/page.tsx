import { createClient } from '@/utils/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()

  // Test the connection
  const { data: todos, error } = await supabase.from('todos').select()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error ? (
        <div className="text-red-500">
          <p>Error: {error.message}</p>
          <p>This is expected if the todos table doesn't exist yet.</p>
        </div>
      ) : (
        <div className="text-green-500">
          <p>✅ Supabase connection successful!</p>
          {todos && todos.length > 0 ? (
            <ul className="mt-4">
              {todos.map((todo: any, index: number) => (
                <li key={index} className="p-2 border-b">
                  {JSON.stringify(todo)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4">No todos found (table exists but is empty).</p>
          )}
        </div>
      )}
    </div>
  )
}