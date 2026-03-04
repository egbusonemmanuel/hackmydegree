import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHRqcWdna2RzcGdxdHNmYXRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE1MDc4OCwiZXhwIjoyMDg3NzI2Nzg4fQ.VBEedGIW7_pl6vXuPIzRVFWlbSIT5XHaXhBUAfGp7II';

const supabase = createClient(url, key);

async function run() {
    const { data, error } = await supabase.from('purchases')
        .select('id, paystack_status, amount_paid, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
    console.log('Recent purchases:');
    console.table(data);
    if (error) console.error('Error:', error);
}

run();
