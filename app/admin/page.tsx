'use client';
import React, { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/utils/supabase/browser';

const supabase = createBrowserSupabase();

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy/todos');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    await fetch('/api/proxy/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    await fetchItems();
  }

  async function updateItem(id: number) {
    if (!editing) return;
    await fetch(`/api/proxy/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editing.title }),
    });
    setEditing(null);
    await fetchItems();
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete?')) return;
    await fetch(`/api/proxy/todos/${id}`, { method: 'DELETE' });
    await fetchItems();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin — Todos</h1>
      <form onSubmit={createItem} style={{ marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit" style={{ marginLeft: 8 }}>Create</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <ul>
          {items.map((it: any) => (
            <li key={it.id} style={{ marginBottom: 8 }}>
              {editing?.id === it.id ? (
                <>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                  <button onClick={() => updateItem(it.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{ marginRight: 8 }}>{it.title}</span>
                  <button onClick={() => setEditing(it)}>Edit</button>
                  <button onClick={() => deleteItem(it.id)} style={{ marginLeft: 6 }}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
