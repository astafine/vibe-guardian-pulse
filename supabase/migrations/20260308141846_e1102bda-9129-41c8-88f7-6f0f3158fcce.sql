
-- Fix parent_child_links RLS: restrictive policies require ALL to pass, 
-- so having separate parent/child SELECT policies both as restrictive breaks it.
-- Drop and recreate as PERMISSIVE so either parent OR child can view.

DROP POLICY IF EXISTS "Children can view their links" ON public.parent_child_links;
DROP POLICY IF EXISTS "Parents can view their links" ON public.parent_child_links;
DROP POLICY IF EXISTS "Children can update link status" ON public.parent_child_links;
DROP POLICY IF EXISTS "Parents can create links" ON public.parent_child_links;

CREATE POLICY "Parents can view their links"
  ON public.parent_child_links FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id);

CREATE POLICY "Children can view their links"
  ON public.parent_child_links FOR SELECT
  TO authenticated
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can create links"
  ON public.parent_child_links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Children can update link status"
  ON public.parent_child_links FOR UPDATE
  TO authenticated
  USING (auth.uid() = child_id);

-- Also fix profiles RLS: "Parents can view linked children profiles" is restrictive too
DROP POLICY IF EXISTS "Parents can view linked children profiles" ON public.profiles;

CREATE POLICY "Parents can view linked children profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_links
      WHERE parent_child_links.parent_id = auth.uid()
        AND parent_child_links.child_id = profiles.user_id
        AND parent_child_links.status = 'active'
    )
  );
