'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  const signInWithGoogle = async () => {
    setSigningIn(true)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  if (loading) {
    return <p style={{ padding: '40px' }}>Loading...</p>
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          textAlign: 'center',
          width: '340px',
        }}
      >
        {/* Logo + Title (INLINE) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <Image
            src="/bookmark_log.png"
            alt="Smart Bookmark Logo"
            width={28}
            height={28}
          />
          <h1
            style={{
              margin: 0,
              color: '#667eea',
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            Smart Bookmark
          </h1>
        </div>

        <p style={{ marginBottom: '25px', color: '#666' }}>
          Save and manage your bookmarks securely.
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={signingIn}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            backgroundColor: '#667eea',
            color: 'white',
            cursor: signingIn ? 'not-allowed' : 'pointer',
            transition: '0.2s ease',
          }}
        >
          {signingIn ? 'Redirecting...' : 'Sign in with Google'}
        </button>
      </div>
    </main>
  )
}
