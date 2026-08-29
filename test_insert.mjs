import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHRqcWdna2RzcGdxdHNmYXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTA3ODgsImV4cCI6MjA4NzcyNjc4OH0.u_M0EVn-JnIZ_086e7KRIveb9666AnPZNrI68Qavcw4';

const supabase = createClient(url, anonKey);

async function run() {
    const ref = 'TEST_INS_' + Date.now();
    const { data, error } = await supabase.from('purchases').insert({
        user_id: '50d28b60-4514-4d41-b2dc-e3eac7161b55',
        resource_id: 'f8156d01-1275-4340-9f4a-714046dd1502',
        amount_paid: 200,
        paystack_reference: ref,
        paystack_status: 'pending'
    }).select();

    console.log('Result:', data);
    console.log('Error:', error);
}

run();
