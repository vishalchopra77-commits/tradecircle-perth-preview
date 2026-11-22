-- Rate Buddies v2.2.2 build 16: members can delete their own photos (QA #32 remove photo); admins can remove any member photo.
drop policy if exists rb_images_delete_own on storage.objects;
create policy rb_images_delete_own on storage.objects for delete to authenticated
  using ((bucket_id = any (array['avatars','covers'])) and ((storage.foldername(name))[1] = ((select auth.uid()))::text));
drop policy if exists rb_images_delete_admin on storage.objects;
create policy rb_images_delete_admin on storage.objects for delete to authenticated
  using ((bucket_id = any (array['avatars','covers'])) and (select private.is_admin()));
