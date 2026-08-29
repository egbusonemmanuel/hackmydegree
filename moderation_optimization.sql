-- 1. Review Moderation System
-- Add columns to tutor_reviews
ALTER TABLE tutor_reviews 
ADD COLUMN IF NOT EXISTS is_reported boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS report_reason text;

-- Policy: Authenticated users can report reviews
-- Note: We use UPDATE because 'reporting' is updating the is_reported flag.
DROP POLICY IF EXISTS "Users can report reviews" ON tutor_reviews;
CREATE POLICY "Users can report reviews" ON tutor_reviews 
FOR UPDATE USING (auth.uid() IS NOT NULL);


-- 2. Optimized Rating Stats (Triggers)
-- Add cached columns to tutor_profiles
ALTER TABLE tutor_profiles 
ADD COLUMN IF NOT EXISTS rating_avg float DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews int DEFAULT 0;

-- Function to update the tutor stats
CREATE OR REPLACE FUNCTION update_tutor_stats() 
RETURNS TRIGGER AS $$
DECLARE
  v_tutor_id uuid;
BEGIN
  v_tutor_id := COALESCE(NEW.tutor_id, OLD.tutor_id);

  UPDATE tutor_profiles
  SET 
    rating_avg = (SELECT ROUND(AVG(rating)::numeric, 1) FROM tutor_reviews WHERE tutor_id = v_tutor_id),
    total_reviews = (SELECT COUNT(*) FROM tutor_reviews WHERE tutor_id = v_tutor_id)
  WHERE id = v_tutor_id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Insert Trigger
DROP TRIGGER IF EXISTS refresh_tutor_stats_after_insert ON tutor_reviews;
CREATE TRIGGER refresh_tutor_stats_after_insert
AFTER INSERT ON tutor_reviews
FOR EACH ROW EXECUTE FUNCTION update_tutor_stats();

-- Update Trigger
DROP TRIGGER IF EXISTS refresh_tutor_stats_after_update ON tutor_reviews;
CREATE TRIGGER refresh_tutor_stats_after_update
AFTER UPDATE OF rating ON tutor_reviews
FOR EACH ROW EXECUTE FUNCTION update_tutor_stats();

-- Delete Trigger
DROP TRIGGER IF EXISTS refresh_tutor_stats_after_delete ON tutor_reviews;
CREATE TRIGGER refresh_tutor_stats_after_delete
AFTER DELETE ON tutor_reviews
FOR EACH ROW EXECUTE FUNCTION update_tutor_stats();
