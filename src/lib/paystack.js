// src/lib/paystack.js
// ─────────────────────────────────────────────────────
// Install: npm install @paystack/inline-js
// Or load script: https://js.paystack.co/v2/inline.js
//
// Add to .env:
//   REACT_APP_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxx
//   (Use pk_test_xxxx during development)
//
// Backend webhook (see paystack-webhook.js) must be deployed
// to verify transactions server-side before unlocking content.
// ─────────────────────────────────────────────────────

import { supabase } from './supabase';

const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

// ─── LOAD PAYSTACK SCRIPT ────────────────────────────
const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) return resolve(window.PaystackPop);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.onload = () => resolve(window.PaystackPop);
    document.head.appendChild(script);
  });
};

// ─── GENERATE REFERENCE ──────────────────────────────
const generateRef = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// ─── PAY FOR PREMIUM RESOURCE ────────────────────────
export const payForResource = async ({ resource, user, onSuccess, onClose }) => {
  const PaystackPop = await loadPaystackScript();
  const reference = generateRef('RES');

  // Pre-create purchase record (pending)
  const { error: dbError } = await supabase.from('purchases').insert({
    user_id: user.id,
    resource_id: resource.id,
    amount_paid: resource.price,
    paystack_reference: reference,
    paystack_status: 'pending'
  });

  if (dbError && dbError.code !== '23505') { // ignore duplicate
    console.error('DB error:', dbError);
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: Math.round(resource.price * 100), // Paystack uses kobo
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: [
        { display_name: 'Resource', variable_name: 'resource_id', value: resource.id },
        { display_name: 'User', variable_name: 'user_id', value: user.id },
        { display_name: 'Type', variable_name: 'payment_type', value: 'resource' }
      ]
    },
    callback: async (response) => {
      // Verify via your backend webhook (recommended) OR directly update here
      await verifyAndActivate({
        reference: response.reference,
        type: 'resource',
        resourceId: resource.id,
        userId: user.id
      });
      onSuccess?.(response);
    },
    onClose: () => onClose?.()
  });

  handler.openIframe();
};

// ─── PAY FOR PRO SUBSCRIPTION (₦500/month) ───────────
export const payForProSubscription = async ({ user, onSuccess, onClose }) => {
  const PaystackPop = await loadPaystackScript();
  const reference = generateRef('PRO');
  const PRO_PRICE = 500; // NGN

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: PRO_PRICE * 100, // 50,000 kobo = ₦500
    currency: 'NGN',
    ref: reference,
    plan: process.env.REACT_APP_PAYSTACK_PRO_PLAN_CODE, // optional: recurring plan code
    metadata: {
      custom_fields: [
        { display_name: 'User', variable_name: 'user_id', value: user.id },
        { display_name: 'Type', variable_name: 'payment_type', value: 'pro_subscription' }
      ]
    },
    callback: async (response) => {
      await verifyAndActivate({
        reference: response.reference,
        type: 'subscription',
        userId: user.id
      });
      onSuccess?.(response);
    },
    onClose: () => onClose?.()
  });

  handler.openIframe();
};

// ─── PAY TO BOOK A TUTOR ─────────────────────────────
export const payForTutorBooking = async ({
  tutor, student, subject, message, scheduledAt, durationHours, onSuccess, onClose
}) => {
  const PaystackPop = await loadPaystackScript();
  const reference = generateRef('BOOK');
  const amount = tutor.hourly_rate * durationHours;

  // Pre-create booking record
  const { data: booking, error } = await supabase.from('bookings').insert({
    student_id: student.id,
    tutor_id: tutor.id,
    subject,
    message,
    scheduled_at: scheduledAt,
    duration_hours: durationHours,
    amount_paid: amount,
    paystack_reference: reference,
    status: 'pending'
  }).select().single();

  if (error) { console.error(error); return; }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: student.email,
    amount: Math.round(amount * 100),
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: [
        { display_name: 'Booking', variable_name: 'booking_id', value: booking.id },
        { display_name: 'Tutor', variable_name: 'tutor_id', value: tutor.id },
        { display_name: 'Type', variable_name: 'payment_type', value: 'tutor_booking' }
      ]
    },
    callback: async (response) => {
      await verifyAndActivate({
        reference: response.reference,
        type: 'booking',
        bookingId: booking.id,
        tutorUserId: tutor.profile.id,
        amount
      });
      onSuccess?.({ ...response, booking });
    },
    onClose: () => onClose?.()
  });

  handler.openIframe();
};

// ─── VERIFY & ACTIVATE (client-side fallback) ────────
// ⚠️  In production, ALWAYS verify via backend webhook.
// This function is a client-side fallback only.
const verifyAndActivate = async ({ reference, type, resourceId, userId, bookingId, tutorUserId, amount }) => {
  if (type === 'resource') {
    // 1. Mark purchase as success and credit tutor atomically via RPC
    const { data: success, error: rpcErr } = await supabase.rpc('confirm_resource_purchase', {
      p_reference: reference
    });

    if (rpcErr || !success) {
      console.error('[Paystack] Error confirming resource purchase via RPC:', rpcErr || 'Function returned false');
    }
  }

  if (type === 'subscription') {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await supabase.from('subscriptions').insert({
      user_id: userId,
      amount_paid: 500,
      paystack_reference: reference,
      expires_at: expires.toISOString(),
      is_active: true
    });
    await supabase.from('profiles')
      .update({ is_pro: true, pro_expires_at: expires.toISOString() })
      .eq('id', userId);
  }

  if (type === 'booking') {
    await supabase.from('bookings')
      .update({ status: 'confirmed' })
      .eq('paystack_reference', reference);

    // Note: The 70% tutor share is NO LONGER credited immediately.
    // Funds are held in escrow until the student marks the session
    // as successfully completed via the dashboard.
  }
};
