// src/lib/supabase.js
// ─────────────────────────────────────────────────────
// Install: npm install @supabase/supabase-js
// Add to .env:
//   REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
// ─────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

// ── Singleton: only create one client instance across the whole app ──
// Multiple instances cause the "lock not released" warning because each
// one tries to acquire the same localStorage auth-token lock.
let _supabase = null;
function getClient() {
  if (!_supabase) {
    console.log('[Supabase] Client initializing with URL:', process.env.REACT_APP_SUPABASE_URL);
    if (!process.env.REACT_APP_SUPABASE_URL) {
      console.error('[Supabase] ERROR: URL is missing!');
    }
    _supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    );
    console.log('[Supabase] Client instance created.');
  }
  return _supabase;
}

export const supabase = getClient();


// ─── AUTH ────────────────────────────────────────────

export const signUp = async ({ email, password, fullName, username }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, username }
    }
  });
  return { data, error };
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  console.log('[Supabase] signOut() called');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[Supabase] signOut() error:', error);
    return { error };
  }
  console.log('[Supabase] signOut() success');
  return { error: null };
};

export const getSession = () => supabase.auth.getSession();

export const onAuthChange = (callback) =>
  supabase.auth.onAuthStateChange(callback);

// ─── PROFILE ─────────────────────────────────────────

export const getProfile = async (userId) => {
  console.log('[Supabase Debug] getProfile (Direct Fetch) for:', userId);
  const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
        // Removed the strict 'object+json' to handle empty results gracefully
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Supabase Debug] Profile fetch fail:', response.status, errorText);
      return { data: null, error: { message: errorText, status: response.status } };
    }

    const data = await response.json();
    console.log('[Supabase Debug] Profile fetch success:', data);

    // Return the first item if exists, otherwise null
    return { data: data[0] || null, error: null };
  } catch (err) {
    console.error('[Supabase Debug] Profile fetch CRITICAL:', err);
    return { data: null, error: err };
  }
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const uploadAvatar = async (userId, file) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (uploadError) return { error: uploadError };

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  await updateProfile(userId, { avatar_url: data.publicUrl });
  return { url: data.publicUrl };
};

// ─── RESOURCES ───────────────────────────────────────

export const getResources = async ({ categorySlug, search, limit = 20, offset = 0 } = {}) => {
  let query = supabase
    .from('resources')
    .select(`
      *,
      uploader:profiles(id, username, full_name, avatar_url, university),
      category:categories(id, name, slug, icon)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    const { data: catRows } = await supabase
      .from('categories').select('id').eq('slug', categorySlug);
    const cat = catRows?.[0];
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,school.ilike.%${search}%`);
  }

  return query;
};

export const getResource = async (id) => {
  return supabase
    .from('resources')
    .select(`
      *,
      uploader:profiles(id, username, full_name, avatar_url, university),
      category:categories(id, name, slug, icon)
    `)
    .eq('id', id)
    .single();
};

export const uploadResource = async (uploaderId, resourceData, file, thumbnail, sessionToken) => {
  console.log('[Upload] Starting authenticated upload for user:', uploaderId);
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const token = sessionToken || key;

  if (!uploaderId) return { error: { message: 'User ID missing', step: 'init' } };

  try {
    console.log('[Upload] Auth state:', sessionToken ? 'Session Token Provided' : 'Using Anon Key');

    // 1. Upload file to storage via direct fetch
    const fileExt = file.name.split('.').pop();
    const filePath = `${uploaderId}/${Date.now()}.${fileExt}`;
    const storageUrl = `${url}/storage/v1/object/resources/${filePath}`;

    console.log('[Upload] Sending file to Storage:', storageUrl);
    const storageRes = await fetch(storageUrl, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token}`, // Use User Token
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true'
      },
      body: file
    });

    if (!storageRes.ok) {
      const err = await storageRes.text();
      console.error('[Upload] Storage fetch error:', storageRes.status, err);
      return { error: { message: `Storage error (${storageRes.status}): ${err}`, step: 'storage' } };
    }
    console.log('[Upload] File uploaded successfully');

    // 2. Insert into DB via direct fetch
    const dbUrl = `${url}/rest/v1/resources?select=*`;
    const body = {
      uploader_id: uploaderId,
      file_url: filePath,
      status: 'pending',
      ...resourceData
    };
    console.log('[Upload] Inserting into DB:', dbUrl, 'with body:', body);

    const dbRes = await fetch(dbUrl, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token}`, // Use User Token
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!dbRes.ok) {
      const err = await dbRes.text();
      console.error('[Upload] DB fetch error:', dbRes.status, err);
      return { error: { message: `Database error (${dbRes.status}): ${err}`, step: 'database' } };
    }

    const [data] = await dbRes.json();
    console.log('[Upload] Success!', data.id);
    return { data, error: null };

  } catch (err) {
    console.error('[Upload] CRITICAL upload error:', err);
    return { error: { message: err.message, step: 'critical' } };
  }
};

export const getDownloadUrl = async (resourceId, userId) => {
  // Check access first
  const { data: hasAccess } = await supabase
    .rpc('has_resource_access', { p_user_id: userId, p_resource_id: resourceId });

  if (!hasAccess) return { error: { message: 'Purchase required' } };

  const { data: resourceRows } = await supabase
    .from('resources').select('file_url, download_count').eq('id', resourceId);

  const resource = resourceRows?.[0];
  if (!resource) return { error: { message: 'Resource not found' } };

  const { data, error } = await supabase.storage
    .from('resources')
    .createSignedUrl(resource.file_url, 60 * 60); // 1-hour signed URL

  // Log download
  if (!error) {
    await supabase.from('downloads').insert({ user_id: userId, resource_id: resourceId });
    await supabase.from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', resourceId);
  }

  return { url: data?.signedUrl, error };
};

// ─── CATEGORIES ──────────────────────────────────────

export const getCategories = async () => {
  console.log('[Supabase] getCategories called (using direct fetch)...');
  const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/categories?select=*`;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    console.log('[Supabase] Sending direct fetch to:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Supabase] Direct fetch error:', response.status, errorText);
      return { data: [], error: { message: errorText, status: response.status } };
    }

    const data = await response.json();
    console.log('[Supabase] Direct fetch success:', data.length, 'rows');
    return { data, error: null };
  } catch (err) {
    console.error('[Supabase] Direct fetch CRITICAL error:', err);
    return { data: [], error: err };
  }
};

// ─── TUTORS ──────────────────────────────────────────

export const getTutors = async ({ subject, limit = 20 } = {}) => {
  let query = supabase
    .from('tutor_profiles')
    .select(`
      *,
      profile:profiles(id, username, full_name, avatar_url, university)
    `)
    .eq('is_available', true)
    .order('rating_avg', { ascending: false })
    .limit(limit);

  if (subject) {
    query = query.contains('subjects', [subject]);
  }

  return query;
};

export const getPendingTutors = async () => {
  return supabase
    .from('tutor_profiles')
    .select(`*, profile:profiles(id, username, full_name, avatar_url, university)`)
    .eq('is_available', false)
    .order('created_at', { ascending: false });
};

export const approveTutor = async (tutorProfileId, token) => {
  const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/tutor_profiles?id=eq.${tutorProfileId}`;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token || key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ is_available: true })
    });

    if (!response.ok) {
      const err = await response.text();
      return { error: { message: err } };
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return { error: { message: 'Update failed: Access Denied. Please run the SQL fix script provided by the developer.' } };
    }
    return { data: true, error: null };
  } catch (err) {
    return { error: err };
  }
};

export const getPendingResources = async () => {
  return supabase
    .from('resources')
    .select(`
      *,
      uploader:profiles(id, username, full_name, avatar_url, university),
      category:categories(id, name, icon)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
};

export const approveResource = async (id, token) => {
  const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/resources?id=eq.${id}`;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token || key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ status: 'approved' })
    });

    if (!response.ok) {
      const err = await response.text();
      return { error: { message: err } };
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return { error: { message: 'Update failed: Access Denied. Please run the SQL fix script provided by the developer.' } };
    }
    return { data: true, error: null };
  } catch (err) {
    return { error: err };
  }
};

export const deleteResource = async (id, token) => {
  const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/resources?id=eq.${id}`;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${token || key}`,
        'Prefer': 'return=representation'
      }
    });

    if (!response.ok) {
      const err = await response.text();
      return { error: { message: err } };
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return { error: { message: 'Delete failed: Access Denied. Please run the SQL fix script.' } };
    }
    return { data: true, error: null };
  } catch (err) {
    return { error: err };
  }
};

export const createTutorProfile = async (userId, tutorData) => {
  const { data, error } = await supabase
    .from('tutor_profiles')
    .insert({ user_id: userId, ...tutorData })
    .select()
    .single();

  if (!error) {
    await updateProfile(userId, { is_tutor: true });
  }

  return { data, error };
};

// ─── BOOKINGS ────────────────────────────────────────

export const getMyBookings = async (userId) => {
  return supabase
    .from('bookings')
    .select(`
      *,
      tutor:tutor_profiles(
        id, hourly_rate,
        profile:profiles(id, username, full_name, avatar_url)
      )
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false });
};

export const getTutorBookings = async (tutorProfileId) => {
  return supabase
    .from('bookings')
    .select(`
      *,
      student:profiles!student_id(id, username, full_name, avatar_url)
    `)
    .eq('tutor_id', tutorProfileId)
    .order('scheduled_at', { ascending: true });
};

export const confirmBooking = async (bookingId, meetLink) => {
  return supabase
    .from('bookings')
    .update({ status: 'confirmed', meet_link: meetLink })
    .eq('id', bookingId);
};

// ─── PURCHASES ───────────────────────────────────────

export const getMyPurchases = async (userId) => {
  return supabase
    .from('purchases')
    .select(`
      *,
      resource:resources(id, title, thumbnail_url, resource_type)
    `)
    .eq('user_id', userId)
    .eq('paystack_status', 'success')
    .order('created_at', { ascending: false });
};

export const hasPurchased = async (userId, resourceId) => {
  const { data } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('resource_id', resourceId)
    .eq('paystack_status', 'success');
  return !!(data?.length > 0);
};

// ─── REVIEWS ─────────────────────────────────────────

export const addReview = async (reviewData) => {
  return supabase.from('reviews').insert(reviewData).select().single();
};

export const getResourceReviews = async (resourceId) => {
  return supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles(id, username, full_name, avatar_url)
    `)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false });
};
