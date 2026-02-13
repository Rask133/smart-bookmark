'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


interface Bookmark {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/')
        return
      }

      await fetchBookmarks()
      setLoading(false)
    }

    initialize()
  }, [router])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to load bookmarks.')
      return
    }

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (submitting) return // Prevent double submit
    setError(null)

    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required.')
      return
    }

    //  URL validation
    try {
      new URL(url.trim())
    } catch {
      setError('Please enter a valid URL (include https://).')
      return
    }

    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/')
      return
    }

    const { error } = await supabase.from('bookmarks').insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      },
    ])

    if (error) {
      setError('Failed to add bookmark.')
      setSubmitting(false)
      return
    }

    setTitle('')
    setUrl('')
    await fetchBookmarks()
    setSubmitting(false)
  }

  const deleteBookmark = async (id: string) => {
    if (submitting) return

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      setError('Failed to delete bookmark.')
      return
    }

    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  //  Consistent loading screen
  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          fontSize: '18px',
        }}
      >
        Loading...
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '700px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        {/* HEADER */}
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  }}
>
  {/* Left side: Logo + Title */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Image
      src="/bookmark_log.png"
      alt="Smart Bookmark Logo"
      width={24}
      height={24}
    />
    <strong style={{ color: '#667eea', fontSize: '16px' }}>
      Smart Bookmark
    </strong>
  </div>

  {/* Right side: Sign Out */}
  <button
    onClick={async () => {
      await supabase.auth.signOut()
      router.replace('/')
    }}
    style={{
      background: 'transparent',
      border: 'none',
      color: '#667eea',
      fontWeight: 500,
      cursor: 'pointer',
      transition: '0.2s ease',
    }}
  >
    Sign Out
  </button>
</div>


        <h1
          style={{
            marginBottom: '20px',
            color: '#1f2937',
            fontWeight: 600,
          }}
        >
          Your Bookmarks
        </h1>

        {error && (
          <p style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        {/* INPUT SECTION */}
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#1f2937',
            }}
          />

          <input
            placeholder="URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#1f2937',
            }}
          />

          <button
            onClick={addBookmark}
            disabled={submitting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: '0.2s ease',
            }}
          >
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* LIST / EMPTY STATE */}
        {bookmarks.length === 0 ? (
          <p
            style={{
              color: '#6b7280',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            You haven't added any bookmarks yet.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookmarks.map((b) => (
              <li
                key={b.id}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {b.title}
                </a>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: '0.2s ease',
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
