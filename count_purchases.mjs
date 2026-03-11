import { createClient } from '@supabase/supabase-js';

const url = 'https://dddtjqggkdspgqtsfatc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHRqcWdna2RzcGdxdHNmYXRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE1MDc4OCwiZXhwIjoyMDg3NzI2Nzg4fQ.VBEedGIW7_pl6vXuPIzRVFWlbSIT5XHaXhBUAfGp7II';

const supabase = createClient(url, key);

async function run() {
    const { count, error } = await supabase.from('purchases')
        .select('*', { count: 'exact', head: true });

    console.log('Total purchase count:', count);

    const { data } = await supabase.from('purchases')
        .select('paystack_reference, paystack_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

    console.log('Last 10 references:');
    data.forEach(p => console.log(`${p.created_at} | ${p.paystack_reference} | ${p.paystack_status}`));
}

run();
