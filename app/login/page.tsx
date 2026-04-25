'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!form.username || !form.password) return setError('Preencha todos os campos.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }

      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      setSuccess(true)
      setTimeout(() => { alert(`Bem-vindo, ${data.user.username}! ✅`) }, 800)
    } catch {
      setError('Não foi possível conectar ao servidor.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'var(--bg)' }}>
      <div style={{ width:'640px', maxWidth:'100%', display:'flex', border:'1px solid var(--teal)', borderRadius:'4px', overflow:'hidden', boxShadow:'0 0 30px var(--teal-glow), 0 0 80px rgba(0,201,200,0.1)', position:'relative', background:'var(--card-bg)' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, transparent 55%, #0d5252 55%, #0e3a3a 100%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents:'none', zIndex:10 }} />

        {/* Form */}
        <div style={{ flex:1, padding:'44px 36px', background:'rgba(10,13,18,0.92)', display:'flex', flexDirection:'column', gap:'20px', position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:'Orbitron', fontSize:'1.5rem', fontWeight:700, color:'var(--text)', letterSpacing:'0.08em' }}>Login</div>

          {['username','password'].map((field) => (
            <div key={field} style={{ position:'relative' }}>
              <input
                type={field === 'password' ? 'password' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1.5px solid var(--input-border)', color:'var(--text)', fontFamily:'Rajdhani', fontSize:'1rem', padding:'10px 36px 10px 2px', outline:'none' }}
              />
              <span style={{ position:'absolute', right:4, bottom:10, fontSize:'1rem', opacity:0.75 }}>
                {field === 'username' ? '👤' : '🔒'}
              </span>
            </div>
          ))}

          {error && <p style={{ color:'#ff4f4f', fontSize:'0.82rem', textAlign:'center', margin:'-8px 0' }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            style={{ padding:'13px', border:'none', borderRadius:'30px', background: success ? 'linear-gradient(90deg,#007f3a,#00c87a)' : 'linear-gradient(90deg,#007f7e,#00c9c8)', color:'#fff', fontFamily:'Orbitron', fontSize:'0.85rem', fontWeight:700, letterSpacing:'0.12em', cursor:'pointer', boxShadow:'0 0 18px var(--teal-glow)' }}
          >
            {success ? '✓ Entrando...' : loading ? 'Verificando...' : 'Login'}
          </button>

          <p style={{ fontSize:'0.82rem', color:'rgba(200,230,230,0.5)', textAlign:'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color:'var(--teal)', textDecoration:'none', fontWeight:600 }}>Sign Up</Link>
          </p>
        </div>

        {/* Welcome */}
        <div style={{ flex:'0 0 42%', display:'flex', alignItems:'center', justifyContent:'center', padding:'50px 20px', position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:'Orbitron', fontSize:'1.5rem', fontWeight:900, color:'var(--text)', letterSpacing:'0.1em', textShadow:'0 0 20px var(--teal)', textAlign:'center', lineHeight:1.25 }}>WELCOME<br/>BACK!</div>
        </div>
      </div>
    </main>
  )
}