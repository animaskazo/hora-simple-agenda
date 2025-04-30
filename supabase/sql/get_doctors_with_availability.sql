
-- Updated to remove any permission restrictions
-- This function will return all doctors that have availability set up
CREATE OR REPLACE FUNCTION public.get_doctors_with_availability()
RETURNS TABLE (
  id uuid,
  name text,
  specialty text,
  has_availability boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id, 
    d.name, 
    d.specialty,
    CASE WHEN COUNT(da.id) > 0 THEN true ELSE false END AS has_availability
  FROM 
    public.doctors d
  LEFT JOIN 
    public.doctor_availability da ON d.id = da.doctor_id
  GROUP BY 
    d.id, d.name, d.specialty
  HAVING 
    COUNT(da.id) > 0
  ORDER BY 
    d.name;
END;
$$;

-- Grant execute permissions to all roles including anonymous
GRANT EXECUTE ON FUNCTION public.get_doctors_with_availability() TO anon, authenticated, service_role;
