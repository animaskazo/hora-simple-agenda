
-- Function to find a doctor by user's email
-- This should be run in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.find_doctor_by_email(email_param TEXT)
RETURNS TABLE (
    id uuid,
    name text,
    specialty text,
    user_id uuid,
    specialty_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.name, d.specialty, d.user_id, d.specialty_id
    FROM public.doctors d
    JOIN auth.users u ON u.id = d.user_id
    WHERE u.email = email_param;
END;
$$;

-- Grant usage to everyone as this is a public endpoint
GRANT EXECUTE ON FUNCTION public.find_doctor_by_email TO public;
