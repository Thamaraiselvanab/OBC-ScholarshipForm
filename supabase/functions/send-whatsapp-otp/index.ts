import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tenant-api-key',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone } = await req.json()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store OTP
    await supabase.from('otp_verifications').insert({ phone_number: phone, otp_code: otp })

    // Format phone: digits only, start with 91
    const cleanPhone = phone.replace(/\D/g, ''); 
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    console.log(`Sending OTP ${otp} to ${finalPhone} using template obc_party...`);

    // TalkingShops API Call with official documentation structure
    const response = await fetch("https://api.talkingshops.com/v1/messages/authentication-template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-api-key": Deno.env.get('WHATSAPP_API_KEY') ?? ''
      },
      body: JSON.stringify({
        recipient: finalPhone,
        template_name: "obc_party",
        language_code: "en_US",
        code: otp
      })
    })

    const rawResponse = await response.text();
    console.log("TALKINGSHOPS API RESPONSE:", rawResponse);

    if (!response.ok) {
      throw new Error(`API Error: ${rawResponse}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
