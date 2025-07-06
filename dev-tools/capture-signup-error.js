// Script to capture exact signup error details
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function captureSignupError() {
  console.log('🔍 Capturing detailed signup error...');

  const timestamp = Date.now();
  const testEmail = `error-test-${timestamp}@example.com`;
  const testUsername = `errortest-${timestamp}`;
  const testPassword = 'testpassword123';

  console.log(`📧 Testing with email: ${testEmail}`);
  console.log(`👤 Testing with username: ${testUsername}`);

  try {
    console.log('\n1. Attempting signup...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: testUsername,
        },
      },
    });

    console.log('\n2. Signup response:');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', JSON.stringify(error, null, 2));

    if (error) {
      console.log('\n❌ Signup failed with error:');
      console.log('Code:', error.code);
      console.log('Message:', error.message);
      console.log('Status:', error.status);
      console.log('Details:', error.details);

      // Check if it's a database error
      if (error.message.includes('Database error')) {
        console.log('\n🔍 This appears to be a database error. Checking Supabase logs...');
        console.log('Please check your Supabase Dashboard > Logs > Database for more details.');
      }
    } else {
      console.log('\n✅ Signup appeared successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);

      // Check if profile was created
      console.log('\n3. Checking if profile was created...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.log('❌ Profile not found:', profileError.message);
      } else {
        console.log('✅ Profile created successfully:', profile);
      }
    }
  } catch (exception) {
    console.log('\n💥 Exception during signup:');
    console.log('Type:', exception.constructor.name);
    console.log('Message:', exception.message);
    console.log('Stack:', exception.stack);
  }

  // Also test the trigger function directly
  console.log('\n4. Testing trigger function directly...');
  try {
    const { data: funcTest, error: funcError } = await supabase.rpc('handle_new_user');
    console.log('Function test result:', funcTest);
    console.log('Function test error:', funcError);
  } catch (funcException) {
    console.log('Function test exception:', funcException.message);
  }
}

captureSignupError().catch(console.error);
