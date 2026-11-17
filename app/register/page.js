'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
const WA = '8801797266069'
const F = [['full_name','পূর্ণ নাম'],['phone','ফোন নম্বর (০১XXXXXXXXX)'],['email','Gmail ঠিকানা'],['school','স্কুলের নাম'],['district','জেলা'],['class','শ্রেণি'],['batch','ব্যাচ'],['exam_year','পরীক্ষার বছর']]
export default function Register() {
  const [v, setV] = useState({}), [cs, setCs] = useState([]), [sel, setSel] = useState([]), [m, setM] = useState(''), [b, setB] = useState(false), [done, setDone] = useState(null)
  useEffect(() => { supabase.from('courses').select('title').eq('published', true).then(({ data }) => setCs(data || [])) }, [])
  async function go(ev) { ev.preventDefault(); setM('')
    if (F.some(([k]) => !(v[k] || '').trim())) return setM('সব ঘর পূরণ করুন।')
    if (!/^01\d{9}$/.test(v.phone)) return setM('ফোন নম্বর ১১ সংখ্যার হতে হবে (যেমন 01XXXXXXXXX)।')
    if (!/^[\w.+-]+@gmail\.com$/i.test(v.email)) return setM('সঠিক Gmail ঠিকানা দিন।')
    if (!sel.length) return setM('কমপক্ষে একটি কোর্স বেছে নিন।')
    setB(true); const d = { ...v, requested_courses: sel.join(', ') }
    const { error } = await supabase.from('registrations').insert(d); setB(false)
    if (error) return setM('জমা দেওয়া যায়নি। আবার চেষ্টা করুন।'); setDone(d) }
  if (done) { const t = `প্রহরী রেজিস্ট্রেশন\nনাম: ${done.full_name}\nফোন: ${done.phone}\nGmail: ${done.email}\nস্কুল: ${done.school}\nজেলা: ${done.district}\nশ্রেণি: ${done.class}\nব্যাচ: ${done.batch}\nপরীক্ষার বছর: ${done.exam_year}\nকোর্স: ${done.requested_courses}`
    return (<><h1>আবেদন জমা হয়েছে</h1><p className="sub">নিচের বোতামে WhatsApp খুলবে। মেসেজটি আপনাকে নিজে Send চাপতে হবে। WhatsApp-এ কখনো পাসওয়ার্ড পাঠাবেন না। অনুমোদনের পর ইমেইলে একাউন্ট চালুর লিংক যাবে।</p>
      <a className="btn" style={{ maxWidth: 520 }} target="_blank" rel="noopener noreferrer" href={`https://wa.me/${WA}?text=${encodeURIComponent(t)}`}>WhatsApp-এ পাঠান</a></>) }
  return (<><h1>রেজিস্ট্রেশন</h1><p className="sub">তথ্য দিন, এডমিন যাচাই করে অনুমোদন দেবেন</p><form onSubmit={go}>
    {F.map(([k, l]) => <label key={k}>{l}<input value={v[k] || ''} onChange={e => setV({ ...v, [k]: e.target.value })} inputMode={k === 'phone' ? 'numeric' : undefined} /></label>)}
    <div><div style={{ color: 'var(--mut)', fontSize: 16, marginBottom: 6 }}>কোন কোর্সে ভর্তি হতে চান</div>
      {cs.length === 0 && <p className="sub">এখনো কোনো কোর্স প্রকাশিত নেই।</p>}
      {cs.map(c => <label className="chk" key={c.title}><input type="checkbox" checked={sel.includes(c.title)} onChange={e => setSel(e.target.checked ? [...sel, c.title] : sel.filter(x => x !== c.title))} />{c.title}</label>)}</div>
    {m && <p className="err">{m}</p>}<button className="btn" disabled={b}>{b ? 'জমা হচ্ছে…' : 'আবেদন জমা দিন'}</button></form></>)
}
