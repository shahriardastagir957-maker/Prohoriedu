-- প্রহরী: Supabase SQL Editor-এ পুরোটা পেস্ট করে Run করুন
create table profiles(id uuid primary key references auth.users on delete cascade,
 full_name text, phone text, school text, district text, class text, batch text, exam_year text,
 role text not null default 'student' check (role in ('student','admin')),
 status text not null default 'active' check (status in ('active','blocked')),
 created_at timestamptz default now());
create table courses(id uuid primary key default gen_random_uuid(), title text not null, description text,
 subject text, batch text, cover_url text, is_free boolean default false, published boolean default false, created_at timestamptz default now());
create table chapters(id uuid primary key default gen_random_uuid(), course_id uuid not null references courses on delete cascade,
 title text not null, position int default 0, published boolean default true);
create table lessons(id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters on delete cascade,
 title text not null, youtube_url text, description text, is_free boolean default false, locked boolean default false,
 position int default 0, published boolean default true);
create table notes(id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters on delete cascade,
 title text not null, description text, drive_url text, is_free boolean default false, position int default 0, published boolean default true);
create table enrollments(user_id uuid references profiles on delete cascade, course_id uuid references courses on delete cascade, primary key(user_id,course_id));
create table registrations(id uuid primary key default gen_random_uuid(), full_name text not null, phone text not null, email text not null,
 school text, district text, class text, batch text, exam_year text, requested_courses text,
 status text not null default 'pending' check (status in ('pending','approved','rejected')), created_at timestamptz default now());

create function is_admin() returns boolean language sql security definer stable set search_path=public as
$$ select exists(select 1 from profiles where id=auth.uid() and role='admin' and status='active') $$;
create function can_view_course(cid uuid) returns boolean language sql security definer stable set search_path=public as
$$ select is_admin() or exists(select 1 from courses c where c.id=cid and c.published and (c.is_free or exists(
   select 1 from enrollments e join profiles p on p.id=e.user_id where e.user_id=auth.uid() and e.course_id=cid and p.status='active'))) $$;
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as
$$ begin insert into profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security; alter table courses enable row level security; alter table chapters enable row level security;
alter table lessons enable row level security; alter table notes enable row level security; alter table enrollments enable row level security;
alter table registrations enable row level security;

create policy "admin all" on profiles for all using (is_admin()) with check (is_admin());
create policy "admin all" on courses for all using (is_admin()) with check (is_admin());
create policy "admin all" on chapters for all using (is_admin()) with check (is_admin());
create policy "admin all" on lessons for all using (is_admin()) with check (is_admin());
create policy "admin all" on notes for all using (is_admin()) with check (is_admin());
create policy "admin all" on enrollments for all using (is_admin()) with check (is_admin());
create policy "admin all" on registrations for all using (is_admin()) with check (is_admin());

create policy "own profile" on profiles for select using (id=auth.uid());
create policy "published courses" on courses for select using (published);
create policy "chapters" on chapters for select using (published and exists(select 1 from courses c where c.id=course_id and c.published));
create policy "lessons" on lessons for select using (published and not locked and
  (is_free or can_view_course((select course_id from chapters where id=chapter_id))));
create policy "notes" on notes for select using (published and
  (is_free or can_view_course((select course_id from chapters where id=chapter_id))));
create policy "own enrollments" on enrollments for select using (user_id=auth.uid());
create policy "anyone can register" on registrations for insert with check (status='pending');

insert into storage.buckets(id,name,public) values('covers','covers',true) on conflict do nothing;
create policy "admin covers write" on storage.objects for insert with check (bucket_id='covers' and public.is_admin());
create policy "admin covers update" on storage.objects for update using (bucket_id='covers' and public.is_admin());
create policy "admin covers delete" on storage.objects for delete using (bucket_id='covers' and public.is_admin());
