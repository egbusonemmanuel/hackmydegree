import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHRqcWdna2RzcGdxdHNmYXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTA3ODgsImV4cCI6MjA4NzcyNjc4OH0.u_M0EVn-JnIZ_086e7KRIveb9666AnPZNrI68Qavcw4';

const supabase = createClient(url, anonKey);

async function run() {
    const testRef = 'TEST_' + Date.now();
    console.log('Testing with ref:', testRef);

    // Try insert
    const { error: insErr } = await supabase.from('purchases').insert({
        user_id: '50d28b60-4514-4d41-b2dc-e3eac7161b55', // Using a known user ID from previous output
        resource_id: '86ad93ea-8822-487b-8902-6c2be66099bd', // Replace with valid ID if fails
        amount_paid: 100,
        paystack_reference: testRef,
        paystack_status: 'pending'
    });
    console.log('Insert error:', insErr);

    // Try update
    const { error: updErr } = await supabase.from('purchases')
        .update({ paystack_status: 'success' })
        .eq('paystack_reference', testRef);
    console.log('Update error:', updErr);
}

run();
