/*
# Add admin_profiles insert policy for self-registration

Allows an authenticated user to insert a single admin_profiles row
for themselves (user_id = auth.uid()). Used during the initial setup flow.
*/

DROP POLICY IF EXISTS "admin_profiles_self_insert" ON admin_profiles;
CREATE POLICY "admin_profiles_self_insert" ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
