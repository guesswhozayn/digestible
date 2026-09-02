-- ==========================================
-- Digestible Database Schema for Supabase
-- ==========================================

-- 1. Create custom enum type for task status
DO $$ BEGIN
    CREATE TYPE summary_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create summaries table
CREATE TABLE IF NOT EXISTS public.summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    reel_url TEXT NOT NULL,
    prompt TEXT NULL,
    status summary_status NOT NULL DEFAULT 'pending',
    summary_data JSONB NULL,
    error_message TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create updated_at automatic trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_summaries_updated_at ON public.summaries;
CREATE TRIGGER trigger_summaries_updated_at
    BEFORE UPDATE ON public.summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON public.summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_status ON public.summaries(status);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON public.summaries(created_at DESC);

-- 5. Enable Row-Level Security (RLS)
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (authenticated or anonymous) can view their own tasks or public tasks
CREATE POLICY "Allow public read access to summaries"
    ON public.summaries
    FOR SELECT
    USING (true);

-- Policy: Allow inserts for authenticated users or anonymous submissions
CREATE POLICY "Allow insert for all users"
    ON public.summaries
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow service role or record creator to update
CREATE POLICY "Allow service role full access"
    ON public.summaries
    FOR ALL
    USING (auth.role() = 'service_role' OR auth.uid() = user_id);
