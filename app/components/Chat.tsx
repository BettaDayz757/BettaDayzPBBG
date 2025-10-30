'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Message {
  id: string
  user: string
  message: string
  created_at: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState('Anonymous')

  const supabase = createClient()

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) console.error('Error fetching messages:', error)
      else setMessages(data || [])
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const { error } = await supabase
      .from('chat_messages')
      .insert([{ user, message: newMessage }])

    if (error) console.error('Error sending message:', error)
    else setNewMessage('')
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-purple-600 mb-2">Live Chat</h2>
      <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Your name"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}