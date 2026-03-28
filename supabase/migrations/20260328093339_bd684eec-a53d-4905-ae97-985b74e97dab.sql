
CREATE TABLE public.user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  device_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_id)
);

ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own devices"
  ON public.user_devices FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own devices"
  ON public.user_devices FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view linked children devices"
  ON public.user_devices FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parent_child_links
    WHERE parent_child_links.parent_id = auth.uid()
      AND parent_child_links.child_id = user_devices.user_id
      AND parent_child_links.status = 'active'
  ));
