'use client'
import Link from 'next/link'
export default function Top() {
  return (<div className="top"><Link href="/"><img src="/logo.webp" alt="প্রহরী" /></Link>
    <nav><Link className="btn s o" href="/register">রেজিস্ট্রেশন</Link><Link className="btn s" href="/login">লগইন</Link></nav></div>)
}
