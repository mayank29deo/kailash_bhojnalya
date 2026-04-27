import { getSupabase } from '../lib/supabase.js';

// Contact / enquiry submission. Falls back to a `mailto:` style payload
// when Supabase isn't configured so the form still feels responsive
// during local dev.

export async function submitEnquiry({ name, phone, message, occasion }) {
  const supabase = getSupabase();
  const payload = {
    name: name.trim(),
    phone: phone.trim(),
    message: message.trim(),
    occasion: occasion || null,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    return {
      ok: true,
      offline: true,
      payload,
    };
  }

  const { error } = await supabase.from('enquiries').insert(payload);
  if (error) {
    console.error('[contactService] failed to submit enquiry', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
