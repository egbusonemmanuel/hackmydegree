import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHRqcWdna2RzcGdxdHNmYXRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE1MDc4OCwiZXhwIjoyMDg3NzI2Nzg4fQ.VBEedGIW7_pl6vXuPIzRVFWlbSIT5XHaXhBUAfGp7II';

const supabase = createClient(url, key);

async function run() {
    const { data, error } = await supabase.from('purchases')
        .select('id, paystack_reference, paystack_status, resource_id, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching purchases:', error);
        return;
    }

    console.log('Recent Purchases:');
    data.forEach(p => {
        console.log(`${p.created_at} | ${p.paystack_reference} | ${p.paystack_status} | ${p.resource_id}`);
    });
}

run();
