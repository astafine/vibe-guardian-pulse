CREATE POLICY "Parents can delete their links"
ON public.parent_child_links
FOR DELETE
TO authenticated
USING (auth.uid() = parent_id);