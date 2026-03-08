
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('parent', 'child');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
  role user_role NOT NULL,
  school_name TEXT,
  link_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create parent-child links table
CREATE TABLE public.parent_child_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their links"
  ON public.parent_child_links FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Children can view their links"
  ON public.parent_child_links FOR SELECT
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can create links"
  ON public.parent_child_links FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Children can update link status"
  ON public.parent_child_links FOR UPDATE
  USING (auth.uid() = child_id);

-- Parents can view linked children profiles
CREATE POLICY "Parents can view linked children profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_links
      WHERE parent_id = auth.uid() AND child_id = profiles.user_id AND status = 'active'
    )
  );

-- Function to look up a child by link code (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.link_parent_to_child(p_link_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_child_id UUID;
BEGIN
  SELECT user_id INTO v_child_id
  FROM public.profiles
  WHERE link_code = p_link_code AND role = 'child';

  IF v_child_id IS NULL THEN
    RAISE EXCEPTION 'Invalid link code';
  END IF;

  INSERT INTO public.parent_child_links (parent_id, child_id, status)
  VALUES (auth.uid(), v_child_id, 'active')
  ON CONFLICT (parent_id, child_id) DO UPDATE SET status = 'active';

  RETURN v_child_id;
END;
$$;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
