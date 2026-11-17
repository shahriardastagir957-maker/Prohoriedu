# প্রহরী – সেটআপ গাইড (ধাপ ২)

## ১. Supabase (ডাটাবেস ও লগইন)
1. https://supabase.com এ বিনামূল্যে একাউন্ট খুলুন → **New project** (নাম: prohori, একটি শক্ত Database Password দিন, Region: Singapore)।
2. বাম মেনু **SQL Editor → New query** → `supabase/schema.sql` ফাইলের পুরো লেখা পেস্ট করে **Run**।
3. **Project Settings → API** থেকে `Project URL` ও `anon public` key কপি করুন।
   ⚠️ `service_role` key কখনো কোথাও পেস্ট করবেন না।
4. **Authentication → URL Configuration**: Site URL-এ আপনার সাইটের ঠিকানা দিন, Redirect URLs-এ `সাইটের_ঠিকানা/reset` যোগ করুন।

## ২. নিজেকে এডমিন বানানো
1. **Authentication → Users → Add user** দিয়ে নিজের ইমেইল ও পাসওয়ার্ডে একাউন্ট খুলুন (Auto Confirm চালু রাখুন)।
2. **SQL Editor**-এ চালান (ইমেইল বদলে নিন):
   `update profiles set role='admin' where id=(select id from auth.users where email='আপনার@gmail.com');`

## ৩. সাইট অনলাইনে দেওয়া (Netlify)
1. এই ফোল্ডার GitHub-এ আপলোড করুন (github.com → New repository → Upload files)। `.env.example` ছাড়া কোনো গোপন তথ্য দেবেন না।
2. https://netlify.com → **Add new site → Import from Git** → রিপোজিটরি বেছে নিন।
3. **Site configuration → Environment variables**-এ দুটি মান দিন: `NEXT_PUBLIC_SUPABASE_URL` ও `NEXT_PUBLIC_SUPABASE_ANON_KEY`।
4. **Deploy**। শেষে ধাপ ১-এর Site URL আপডেট করুন।

## এই ধাপে যা কাজ করে
হোমে প্রকাশিত কোর্স, কোর্স পেজ (অধ্যায়, ভিডিও, নোট), রেজিস্ট্রেশন + WhatsApp, লগইন, পাসওয়ার্ড রিসেট/একাউন্ট চালু।
কোর্স ও লেসন ডাটাবেসে যোগ করার এডমিন প্যানেল ধাপ ৩-এ আসছে। তার আগে Supabase **Table Editor** থেকে হাতে যোগ করা যায়।

## নিরাপত্তা
সব নিয়ম ডাটাবেসে (Row Level Security) আছে: ছাত্র কেবল নিজের ডেটা ও অনুমোদিত কোর্স দেখে, এডমিনের কাজ শুধু role='admin' ব্যবহারকারী করতে পারে।
YouTube আনলিস্টেড ভিডিও সম্পূর্ণ গোপন নয়, লিংক পেলে যে কেউ দেখতে পারে।
