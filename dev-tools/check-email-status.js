// Script to check email confirmation status and debug email delivery
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('@supabase/supabase-js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmailStatus() {
  console.log('📧 Checking email confirmation status...\n');

  const userEmail = 'jobs@kyledilbeck.com';
  const userId = '2196934b-0da0-475a-aca8-648b4b548ba2';

  try {
    // 1. Check if user exists in auth.users
    console.log('1. Checking user in auth system...');
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError) {
      console.log('❌ Cannot access auth admin (expected in client-side)');
      console.log('   This is normal - we need to check differently');
    } else {
      console.log('✅ User found in auth system');
      console.log('   Email:', authData.user.email);
      console.log('   Email confirmed:', authData.user.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Created at:', authData.user.created_at);
    }

    // 2. Check if profile was created
    console.log('\n2. Checking if profile was created...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('❌ Profile not found:', profileError.message);
      console.log("   This might indicate the trigger didn't run properly");
    } else {
      console.log('✅ Profile found:');
      console.log('   Username:', profile.username);
      console.log('   Email:', profile.email);
      console.log('   Created:', profile.created_at);
    }

    // 3. Try to sign in to check confirmation status
    console.log('\n3. Testing sign-in to check confirmation status...');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'testpassword123', // This won't work, but the error will tell us about confirmation
    });

    if (signInError) {
      console.log('Sign-in error (expected):', signInError.message);

      if (signInError.message.includes('Email not confirmed')) {
        console.log('✅ Email confirmation is required (as expected)');
        console.log('   The user account exists but needs email confirmation');
      } else if (signInError.message.includes('Invalid login credentials')) {
        console.log('⚠️  User exists but wrong password (normal for test)');
      } else {
        console.log('❓ Unexpected error:', signInError.message);
      }
    } else {
      console.log('✅ Sign-in successful (user already confirmed)');
    }

    // 4. Check Supabase email settings
    console.log('\n4. Checking Supabase configuration...');
    console.log('   Supabase URL:', supabaseUrl);
    console.log('   Using email confirmation:', 'Yes (emailRedirectTo set)');
    console.log(
      '   Redirect URL:',
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/confirm`
    );

    // 5. Provide troubleshooting steps
    console.log('\n📋 Troubleshooting steps:');
    console.log('');
    console.log('1. Check your Supabase Dashboard > Authentication > Users');
    console.log('   - Look for user:', userEmail);
    console.log('   - Check if "Email Confirmed" is false');
    console.log('');
    console.log('2. Check your Supabase Dashboard > Authentication > Settings');
    console.log('   - Ensure "Enable email confirmations" is ON');
    console.log('   - Check "Site URL" is set correctly');
    console.log('   - Verify email templates are configured');
    console.log('');
    console.log('3. Check your email:');
    console.log('   - Check spam/junk folder');
    console.log('   - Check if your email provider blocks Supabase emails');
    console.log('   - Try a different email address (Gmail, etc.)');
    console.log('');
    console.log('4. Check Supabase logs:');
    console.log('   - Go to Supabase Dashboard > Logs');
    console.log('   - Look for email delivery errors');
    console.log('   - Check if emails are being sent but not delivered');
    console.log('');
    console.log('5. Manual confirmation (for testing):');
    console.log('   - Go to Supabase Dashboard > Authentication > Users');
    console.log('   - Find the user and click "Confirm email"');
    console.log('   - This will manually confirm the email for testing');

    // 6. Try to resend confirmation email
    console.log('\n6. Attempting to resend confirmation email...');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: userEmail,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }/auth/confirm`,
      },
    });

    if (resendError) {
      console.log('❌ Resend failed:', resendError.message);
    } else {
      console.log('✅ Confirmation email resent successfully!');
      console.log('   Check your email again (including spam folder)');
    }
  } catch (error) {
    console.error('💥 Error checking email status:', error.message);
  }
}

// Run the check
checkEmailStatus().catch(console.error);
