-- Make mockups bucket private
UPDATE storage.buckets SET public = false WHERE id = 'mockups';

-- Drop public read policy if it exists
DROP POLICY IF EXISTS "Public read access for mockups" ON storage.objects;

-- Ensure owner-only SELECT policy exists for storage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can view own mockup files'
  ) THEN
    CREATE POLICY "Users can view own mockup files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
