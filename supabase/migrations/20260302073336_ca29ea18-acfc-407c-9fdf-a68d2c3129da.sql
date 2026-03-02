
-- Portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Portfolio',
  bio TEXT DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'minimal',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique slug constraint
CREATE UNIQUE INDEX portfolios_slug_unique ON public.portfolios (slug);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Users can manage own portfolios" ON public.portfolios
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public can view published portfolios
CREATE POLICY "Anyone can view published portfolios" ON public.portfolios
  FOR SELECT USING (is_published = true);
