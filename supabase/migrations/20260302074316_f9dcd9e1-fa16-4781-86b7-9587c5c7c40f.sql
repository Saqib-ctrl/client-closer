
-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to all portfolio images
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');
