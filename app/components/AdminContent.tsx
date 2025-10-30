'use client'

import { useEffect, useState } from 'react'

interface ContentItem {
  id: string
  type: string
  title: string
  description: string
  created_at: string
}

export default function AdminContent() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [newItem, setNewItem] = useState({ type: 'event', title: '', description: '' })

  const fetchContent = async () => {
    const res = await fetch('/api/admin/content')
    const data = await res.json()
    setContent(data.content || [])
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const addContent = async () => {
    if (!newItem.title.trim() || !newItem.description.trim()) return

    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })

    if (res.ok) {
      setNewItem({ type: 'event', title: '', description: '' })
      fetchContent()
    }
  }

  const deleteContent = async (id: string) => {
    const res = await fetch('/api/admin/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (res.ok) {
      fetchContent()
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-green-600 mb-2">Content Management</h2>
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex gap-2 mb-2">
          <select
            value={newItem.type}
            onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="event">Event</option>
            <option value="location">Location</option>
            <option value="culture">Culture</option>
            <option value="hbcu">HBCU</option>
          </select>
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Title"
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
          <input
            type="text"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
          <button
            onClick={addContent}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto">
        {content.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
            <div>
              <strong>{item.type}:</strong> {item.title} - {item.description}
            </div>
            <button
              onClick={() => deleteContent(item.id)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}