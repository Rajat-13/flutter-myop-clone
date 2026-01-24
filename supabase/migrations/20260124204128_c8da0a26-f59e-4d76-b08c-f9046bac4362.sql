-- Create assets table for asset management
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    size_bytes BIGINT DEFAULT 0,
    mime_type VARCHAR(100),
    used_in TEXT[] DEFAULT '{}',
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view assets (for public display)
CREATE POLICY "Assets are viewable by everyone"
ON public.assets FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can upload assets"
ON public.assets FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only uploader or admin can delete
CREATE POLICY "Users can delete their own assets"
ON public.assets FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('assets', 'assets', true, 52428800);

-- Storage policies for assets bucket
CREATE POLICY "Anyone can view assets files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Users can delete their own asset files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();