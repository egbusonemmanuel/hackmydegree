-- Ensure tutor_profiles has is_available column if not already there
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tutor_profiles' AND column_name='is_available') THEN
    ALTER TABLE tutor_profiles ADD COLUMN is_available boolean DEFAULT false;
  END IF;
END $$;

-- Tutor Reviews Table
CREATE TABLE IF NOT EXISTS tutor_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id uuid REFERENCES tutor_profiles(id) NOT NULL,
  student_id uuid REFERENCES profiles(id) NOT NULL,
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, booking_id) -- One review per booking
);

ALTER TABLE tutor_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON tutor_reviews FOR SELECT USING (true);
CREATE POLICY "Students can leave reviews" ON tutor_reviews FOR INSERT WITH CHECK (auth.uid() = student_id);

-- RPC for fetching tutors with ratings
CREATE OR REPLACE FUNCTION get_tutors_with_ratings()
RETURNS TABLE (
  tutor_id uuid,
  averagerating float,
  totalreviews bigint
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT 
    tutor_id,
    COALESCE(AVG(rating), 0) as averagerating,
    COUNT(*) as totalreviews
  FROM tutor_reviews
  GROUP BY tutor_id;
$$;
