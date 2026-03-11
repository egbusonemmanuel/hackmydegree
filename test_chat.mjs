import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
// Use the Anon key to simulate a real user request
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3NzIxNTA3ODgsImV4cCI6MjA4NzcyNjc4OH0.u_M0EVn-JnIZ_086e7KRIveb9666AnPZNrI68Qavcw4';

// A known student ID from previous logs: '50d28b60-4514-4d41-b2dc-e3eac7161b55'
// We need to impersonate this user to test RLS
const supabase = createClient(url, anonKey);

async function run() {
    console.log('--- Chat System Diagnostics ---');

    // 1. First, let's just query a booking directly using the Service Key to find a valid booking to test
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE1MDc4OCwiZXhwIjoyMDg3NzI2Nzg4fQ.VBEedGIW7_pl6vXuPIzRVFWlbSIT5XHaXhBUAfGp7II';
    const adminDb = createClient(url, serviceKey);

    const { data: bookings, error: bkErr } = await adminDb.from('bookings').select('id, student_id, tutor_id').limit(1);
    if (bkErr || !bookings || bookings.length === 0) {
        console.log('Admin could not fetch any bookings. Error:', bkErr);
        return;
    }

    const booking = bookings[0];
    console.log('Found test booking ID:', booking.id);
    console.log('Student ID:', booking.student_id);
    console.log('Tutor ID:', booking.tutor_id);

    // Unfortunately, without a real JWT session, true RLS testing 'auth.uid()' is impossible directly from node 
    // without heavily mocking the JWT headers. 
    // However, we can check if the SELECT policy is just completely blocking everything even if we try.

    const { data: rawMsgs, error: rawErr } = await adminDb.from('booking_messages').select('*').eq('booking_id', booking.id);
    console.log('\\nMessages visible to Admin:', rawMsgs?.length, 'Error:', rawErr);

    // Now let's just check the structure of tutor_profiles to see if my JOIN in the SQL was wrong
    const { data: tp, error: tpErr } = await adminDb.from('tutor_profiles').select('id, user_id').eq('id', booking.tutor_id).select();
    console.log('\\nTutor Profile mapping (Tutor ID -> User ID):', tp, 'Error:', tpErr);
}

run();
