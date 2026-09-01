-- =========================================================
-- Google OAuth & Profile Synchronization
-- Ensures new and existing Google OAuth users have full_name
-- and avatar_url properly populated from auth.users metadata.
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_avatar_url text;
begin
  -- Resolve full_name from standard email registration or Google OAuth metadata (full_name or name)
  v_full_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', '')
  );

  -- Resolve avatar_url from standard or Google OAuth metadata (avatar_url or picture)
  v_avatar_url := coalesce(
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(new.raw_user_meta_data ->> 'picture', '')
  );

  insert into public.profiles (
    id,
    full_name,
    avatar_url
  )
  values (
    new.id,
    v_full_name,
    v_avatar_url
  )
  on conflict (id) do update
  set
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

-- Ensure the trigger is active on auth.users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
