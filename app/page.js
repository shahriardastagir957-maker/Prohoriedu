'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
export default function Home() {
  const [c, setC] = useState(null), [e, setE] = useState('')
  useEffect(() => { supabase.from('courses').select('id,title,subject,batch,cover_url').eq('published', true)
    .order('created_at', { ascending: false }).then(({ data, error }) => error ? setE('কোর্স লোড করা যায়নি। ইন্টারনেট ও সেটিংস দেখুন।') : setC(data)) }, [])
  return (<><h1>কোর্সসমূহ</h1><p className="sub">আপনার কোর্স বেছে নিন</p>
    {e && <p className="err">{e}</p>}{!c && !e && <p className="sub">লোড হচ্ছে…</p>}
    {c && c.length === 0 && <p className="sub">এখনো কোনো কোর্স প্রকাশ করা হয়নি।</p>}
    <div className="grid">{(c || []).map(x => (<article className="card" key={x.id}>
      <div className="cover">{x.cover_url ? <img src={x.cover_url} alt="" /> : <img className="lg" src="/logo.webp" alt="" />}</div>
      <div className="cb"><h3>{x.title}</h3><div className="meta">{[x.subject, x.batch].filter(Boolean).join(' · ')}</div>
      <Link className="btn" href={`/course/${x.id}`}>কোর্সে প্রবেশ করুন →</Link></div></article>))}</div></>)
}
