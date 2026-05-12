import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, otp } = await req.json()

    // Standardize both inputs
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const cleanOtp = otp.toString().trim();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Verifying: Phone=${cleanPhone}, OTP=${cleanOtp}`);

    // Look for the LATEST unverified OTP for this phone number
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('id, created_at')
      .eq('phone_number', cleanPhone)
      .eq('otp_code', cleanOtp)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    
    if (!data) {
      console.log("No matching OTP found in database for this phone/code combination.");
      throw new Error('Invalid or expired OTP code')
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', data.id)

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Verification Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
