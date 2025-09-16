-- Storage bucket per-user folder policies
-- Replace 'documents' with your actual bucket name if different

begin;

-- Ensure the storage schema is available
-- Policies apply to the storage.objects table

-- READ: users can read objects only inside their own {user_id}/ prefix
create policy if not exists "Read own documents"
on storage.objects for select
using (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- INSERT: users can upload only inside their own {user_id}/ prefix
create policy if not exists "Upload own documents"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- UPDATE: users can update only their own objects
create policy if not exists "Update own documents"
on storage.objects for update
using (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
);

-- DELETE: users can delete only their own objects
create policy if not exists "Delete own documents"
on storage.objects for delete
using (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
);

commit;

