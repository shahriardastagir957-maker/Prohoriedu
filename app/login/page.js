'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Login() {
  const [em, setEm] = useState(''), [pw, setPw] = useState(''), [m, setM] = useState(null), [b, setB] = useState(false)
  async function go(ev) { ev.preventDefault(); if (!em.includes('@') || pw.length < 6) return setM({ e: 'সঠিক ইমেইল ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' })
    setB(true); const { error } = await supabase.auth.signInWithPassword({ email: em, password: pw }); setB(false)
    error ? setM({ e: 'ইমেইল বা পাসওয়ার্ড ভুল, অথবা একাউন্ট এখনো চালু হয়নি।' }) : (location.href = '/') }
  async function forgot() { if (!em.includes('@')) return setM({ e: 'আগে ইমেইল লিখুন।' })
    const { error } = await supabase.auth.resetPasswordForEmail(em, { redirectTo: location.origin + '/reset' })
    setM(error ? { e: 'ইমেইল পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।' } : { o: 'ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।' }) }
  return (<><h1>লগইন</h1><p className="sub">অনুমোদিত শিক্ষার্থীদের জন্য</p><form onSubmit={go}>
    <label>ইমেইল<input type="email" value={em} onChange={e => setEm(e.target.value)} autoComplete="email" /></label>
    <label>পাসওয়ার্ড<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" /></label>
    {m && <p className={m.e ? 'err' : 'ok'}>{m.e || m.o}</p>}
    <button className="btn" disabled={b}>{b ? 'অপেক্ষা করুন…' : 'লগইন'}</button>
    <button type="button" className="btn o" onClick={forgot}>পাসওয়ার্ড ভুলে গেছি</button></form></>)
}
