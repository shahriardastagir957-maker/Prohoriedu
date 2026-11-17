'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Reset() {
  const [pw, setPw] = useState(''), [m, setM] = useState(null)
  async function go(ev) { ev.preventDefault(); if (pw.length < 8) return setM({ e: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।' })
    const { error } = await supabase.auth.updateUser({ password: pw })
    setM(error ? { e: 'লিংকের মেয়াদ শেষ হতে পারে। আবার "পাসওয়ার্ড ভুলে গেছি" চাপুন।' } : { o: 'পাসওয়ার্ড সেট হয়েছে। এখন লগইন করুন।' }) }
  return (<><h1>নতুন পাসওয়ার্ড</h1><p className="sub">একাউন্ট চালু বা পাসওয়ার্ড রিসেটের জন্য</p><form onSubmit={go}>
    <label>নতুন পাসওয়ার্ড<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" /></label>
    {m && <p className={m.e ? 'err' : 'ok'}>{m.e || m.o}</p>}<button className="btn">সেট করুন</button></form></>)
}
