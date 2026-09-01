-- =========================================================
-- Account Deletion Policy & Procedure
-- Enables authenticated learners to delete their own profile
-- and invoke secure user account deletion.
-- =========================================================

-- 1. Add DELETE policy on public.profiles
drop policy if exists "Users can delete own profile" on public.profiles;

create policy "Users can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using ((select auth.uid()) = id);

-- 2. Stored Procedure for Complete User & Profile Deletion
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- 1. Cascade delete profile and related tables (enrollments, notes, drafts, bookmarks)
  delete from public.profiles where id = v_user_id;

  -- 2. Delete user from auth.users (cascades to auth.identities, auth.sessions)
  delete from auth.users where id = v_user_id;
end;
$$;

grant execute on function public.delete_user_account() to authenticated;
