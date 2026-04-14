-- Allow anonymous inserts/updates to responses (for public surveys)
-- NOTE: This grants broad INSERT/UPDATE privileges to anon and authenticated roles. Adjust conditions for stricter security if needed.

-- Ensure RLS is enabled on the responses table
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies with the same name
DROP POLICY IF EXISTS "Public can insert responses" ON public.responses;
DROP POLICY IF EXISTS "Public can update responses" ON public.responses;

-- Allow anonymous and authenticated users to INSERT responses
CREATE POLICY "Public can insert responses"
  ON public.responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous and authenticated users to UPDATE responses (for upsert/update flows)
CREATE POLICY "Public can update responses"
  ON public.responses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
