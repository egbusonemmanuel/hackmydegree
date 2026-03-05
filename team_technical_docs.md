# HackMyDegree: Technical Implementation Report

This document provides a comprehensive overview of the recent architectural changes and feature implementations for the HackMyDegree platform.

---

## 1. Manual Withdrawal System
**Objective:** Enable tutors to withdraw their earned balance through a secure, admin-verified process.

### Architecture
- **Database Table:** `withdrawals` (Tracks `user_id`, `amount`, `bank_details`, `status`).
- **Security:** 
  - **RLS Policies:** Users can only view their own withdrawals. Admins can view and update all.
  - **Atomic Transaction:** Uses a PostgreSQL RPC function `request_withdrawal` to ensure balance is deducted ONLY if the withdrawal record is successfully created.

### Workflow
1. **Tutor Side:** Forms in `DashboardPage.jsx` allow tutors to enter bank details. Upon submission, balance is instantly deducted (escrowed) and status is set to `pending`.
2. **Admin Side:** Admins see a list of pending requests. After manually transferring funds (e.g., via Bank App), the Admin marks the request as `success` in the Dashboard.

---

## 2. Tutor Star Rating System
**Objective:** Build trust and highlight quality tutors through student-driven feedback.

### Architecture
- **Database Table:** `tutor_reviews` (Stores `rating`, `review_text`, and links `student_id` to `tutor_id` & `booking_id`).
- **Constraint:** A student can only leave **one review per booking** (Unique constraint on `student_id` + `booking_id`).
- **Business Logic:** 
  - Ratings are only accessible after a Booking status is changed to `completed`.
  - Average ratings are dynamically calculated during the `getTutors` fetch to ensure "Live" stats without storage overhead.

### Frontend Integration
- **Dashboard**: Students see a "⭐ Rate Tutor" button for completed sessions.
- **Tutor Directory**: Tutor cards display average stars (e.g., ★ 4.8) and total review counts. Each card can be expanded to view individual reviews.

---

## 3. Review Moderation & Abuse Prevention
**Objective:** Ensure the platform remains professional by allowing users to flag inappropriate feedback.

### Architecture
- **Reporting**: Added `is_reported` (boolean) and `report_reason` (text) to the `tutor_reviews` table.
- **Auto-Hide**: Reviews flagged as reported are automatically filtered out from the public `getTutorReviews` fetch.

### Workflow
- **User Side**: A 🚩 **Report** button is available next to every review.
- **Process**: When a user reports a review, they are prompted for a reason, and the review is instantly hidden from the public view pending admin review.

---

## 4. Performance Optimization (Cached Ratings)
**Objective:** Support high-scale growth (>1,000 tutors) by shifting heavy calculations from Frontend JS to Database Triggers.

### Architecture
- **Cached Columns**: Added `rating_avg` and `total_reviews` directly to the `tutor_profiles` table.
- **Database Triggers**: A PostgreSQL function `update_tutor_stats()` is triggered on every **Insert**, **Update**, or **Delete** in the `tutor_reviews` table.
- **Benefit**: The `getTutors` API no longer performs complex joins or averages; it simply reads the pre-calculated stats from the tutor's profile row.

---

## 5. Database Schema Reference (Supabase)

Below are the consolidated SQL definitions required for these features:

```sql
-- WITHDRAWALS SYSTEM
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 100),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_name text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  created_at timestamptz DEFAULT now()
);

-- STAR RATING SYSTEM
CREATE TABLE IF NOT EXISTS tutor_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id uuid REFERENCES tutor_profiles(id) NOT NULL,
  student_id uuid REFERENCES profiles(id) NOT NULL,
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_reported boolean DEFAULT false,
  report_reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, booking_id)
);

-- CACHED STATS TRIGGER
CREATE OR REPLACE FUNCTION update_tutor_stats() RETURNS TRIGGER AS $$
BEGIN
  UPDATE tutor_profiles SET 
    rating_avg = (SELECT ROUND(AVG(rating)::numeric, 1) FROM tutor_reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_reported = false),
    total_reviews = (SELECT COUNT(*) FROM tutor_reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_reported = false)
  WHERE id = COALESCE(NEW.tutor_id, OLD.tutor_id);
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_tutor_stats AFTER INSERT OR UPDATE OR DELETE ON tutor_reviews FOR EACH ROW EXECUTE FUNCTION update_tutor_stats();

-- HELPER: RPC for Atomic Withdrawal
CREATE OR REPLACE FUNCTION request_withdrawal(p_amount numeric, p_bank_name text, p_account_number text, p_account_name text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF (SELECT balance FROM profiles WHERE id = auth.uid()) < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  UPDATE profiles SET balance = balance - p_amount WHERE id = auth.uid();
  INSERT INTO withdrawals (user_id, amount, bank_name, account_number, account_name)
  VALUES (auth.uid(), p_amount, p_bank_name, p_account_number, p_account_name);
  RETURN true;
END;
$$;
```

---

## 📋 Maintenance & Roadmap
1. **Automated Payouts:** Integrate Paystack Transfer API to automate the tutor payments from the Admin Dashboard.
2. **Review Dashboard:** Create an Admin UI to view "Reported" reviews and either delete them or clear the flag.
3. **Advanced Tutors**: Consider adding "Tutor Badges" (e.g., Top Rated, Fast Responder) based on the cached stats.

---
*Generated by Antigravity AI for the HackMyDegree Team.*
