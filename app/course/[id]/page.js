'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, ytId } from '../../../lib/supabase'
const by = (a, b) => (a.position || 0) - (b.position || 0)
export default function Course() {
  const { id } = useParams(); const [co, setCo] = useState(null), [ch, setCh] = useState(null), [e, setE] = useState(''), [vid, setVid] = useState(null)
  useEffect(() => { (async () => {
    const a = await supabase.from('courses').select('title,subject,batch').eq('id', id).maybeSingle()
    const b = await supabase.from('chapters').select('id,title,position,lessons(id,title,youtube_url,position),notes(id,title,drive_url,position)').eq('course_id', id)
    if (a.error || b.error || !a.data) return setE('এই কোর্স পাওয়া যায়নি।')
    setCo(a.data); setCh(b.data.sort(by)) })() }, [id])
  return (<><Link className="back" href="/">← সব কোর্স</Link>{e && <p className="err">{e}</p>}
    {co && <><h1>{co.title}</h1><p className="sub">{[co.subject, co.batch].filter(Boolean).join(' · ')}</p></>}
    {vid && <div style={{ marginBottom: 20 }}><iframe src={`https://www.youtube.com/embed/${vid}`} allow="fullscreen; picture-in-picture" allowFullScreen /></div>}
    {ch && ch.length === 0 && <p className="sub">এই কোর্সে এখনো কোনো অধ্যায় নেই, অথবা এটি দেখার অনুমতি আপনার নেই।</p>}
    {(ch || []).map(c => (<details key={c.id} open><summary>{c.title}</summary>
      {c.lessons.sort(by).map(l => (<div className="it" key={l.id}><div className="t">{l.title}</div>
        <button className="btn s" disabled={!ytId(l.youtube_url)} onClick={() => { setVid(ytId(l.youtube_url)); scrollTo(0, 0) }}>দেখুন</button></div>))}
      {c.notes.sort(by).map(n => (<div className="it" key={n.id}><div className="t"><span className="lbl">CLASS NOTE</span><div>{n.title}</div></div>
        <a className="btn s o" href={n.drive_url} target="_blank" rel="noopener noreferrer">Open Note</a></div>))}</details>))}</>)
}
