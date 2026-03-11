import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE1MDc4OCwiZXhwIjoyMDg3NzI2Nzg4fQ.VBEedGIW7_pl6vXuPIzRVFWlbSIT5XHaXhBUAfGp7II';
const supabase = createClient(url, serviceKey);

async function runSQL() {
    const sql = `
    -- 1. First, make sure RLS is actually enabled on the table
    ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist so we can recreate them cleanly
    DROP POLICY IF EXISTS "Users can view messages for their bookings" ON booking_messages;
    DROP POLICY IF EXISTS "Users can insert messages into their bookings" ON booking_messages;

    -- 2. Allow users (tutors & students) to read messages in their own bookings
    CREATE POLICY "Users can view messages for their bookings" 
    ON booking_messages FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM bookings b
        LEFT JOIN tutor_profiles tp ON b.tutor_id = tp.id
        WHERE b.id = booking_messages.booking_id
          AND (b.student_id = auth.uid() OR tp.user_id = auth.uid())
      )
    );

    -- 3. Allow users to send messages in their own bookings
    CREATE POLICY "Users can insert messages into their bookings" 
    ON booking_messages FOR INSERT 
    WITH CHECK (
      auth.uid() = sender_id AND
      EXISTS (
        SELECT 1 FROM bookings b
        LEFT JOIN tutor_profiles tp ON b.tutor_id = tp.id
        WHERE b.id = booking_messages.booking_id
          AND (b.student_id = auth.uid() OR tp.user_id = auth.uid())
      )
    );
  `;

    // Note: Since supabase-js doesn't have a direct raw SQL execution method via the client,
    // we typically have to use an RPC function if allowed, or the user must run it in the dashboard.
    // HOWEVER, we can query the backend using a REST or PostgREST workaround if needed.
    // The most standard way for migrations in JS is to have an RPC function 'exec_sql'
    // But let's try calling a non-existent RPC just to see if it allows execution, otherwise alert the user.
    console.log("Attempting to run SQL remotely...");

    // Try to use a known technique: passing it to a generic exec_sql RPC if it exists
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });
    if (error) {
        console.error("RPC exec_sql failed (likely doesn't exist):", error.message);
        console.log("\\nSince I lack direct SQL execution privileges from node via standard JS client (unless an exec_sql RPC exists), I cannot run this SQL directly on your database structure.");
    } else {
        console.log("SQL executed successfully!");
    }
}

runSQL();
