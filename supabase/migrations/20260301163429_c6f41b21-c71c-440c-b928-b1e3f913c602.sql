
-- Create mockups table
CREATE TABLE public.mockups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  style_prompt TEXT,
  original_images_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mockups ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own mockups" ON public.mockups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own mockups" ON public.mockups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own mockups" ON public.mockups FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for mockups
INSERT INTO storage.buckets (id, name, public) VALUES ('mockups', 'mockups', true);

-- Storage policies
CREATE POLICY "Users can upload mockups" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own mockups" ON storage.objects FOR SELECT USING (bucket_id = 'mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own mockups" ON storage.objects FOR DELETE USING (bucket_id = 'mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public read access for mockups" ON storage.objects FOR SELECT USING (bucket_id = 'mockups');
