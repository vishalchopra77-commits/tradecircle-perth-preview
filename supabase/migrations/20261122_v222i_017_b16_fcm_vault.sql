-- v2.2.2 build 16 · 017: push-send reads the FCM service account from Vault (name FCM_SERVICE_ACCOUNT)
-- when the function secret is not set. Only service_role may execute; no secret is stored here.
create or replace function public.push_fcm_service_account()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'FCM_SERVICE_ACCOUNT' limit 1;
$$;
revoke all on function public.push_fcm_service_account() from public;
revoke all on function public.push_fcm_service_account() from anon;
revoke all on function public.push_fcm_service_account() from authenticated;
grant execute on function public.push_fcm_service_account() to service_role;
comment on function public.push_fcm_service_account() is 'service_role only: FCM service account JSON from Vault for the push-send Edge Function';
