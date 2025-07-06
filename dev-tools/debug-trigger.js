// Debug script to get detailed error information about the trigger function
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTriggerFunction() {
  console.log('🔍 Debugging trigger function...');

  // Test 1: Check if the trigger function exists
  console.log('\n1. Checking if trigger function exists...');
  try {
    const { data, error } = await supabase.rpc('handle_new_user', {});
    if (error) {
      console.log('❌ Function exists but has error:', error.message);
    } else {
      console.log('✅ Function exists and can be called');
    }
  } catch (error) {
    console.log('❌ Function does not exist or cannot be called:', error.message);
  }

  // Test 2: Check if trigger exists
  console.log('\n2. Checking if trigger exists...');
  try {
    const { data, error } = await supabase
      .from('information_schema.triggers')
      .select('*')
      .eq('trigger_name', 'on_auth_user_created')
      .single();

    if (error) {
      console.log('❌ Trigger not found:', error.message);
    } else {
      console.log('✅ Trigger exists:', data);
    }
  } catch (error) {
    console.log('❌ Error checking trigger:', error.message);
  }

  // Test 3: Check profiles table structure
  console.log('\n3. Checking profiles table structure...');
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
      console.log('❌ Profiles table error:', error.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
  } catch (error) {
    console.log('❌ Error accessing profiles table:', error.message);
  }

  // Test 4: Try to manually insert a profile to see the exact error
  console.log('\n4. Testing manual profile insertion...');
  const testUserId = '00000000-0000-0000-0000-000000000000';
  const testUsername = 'debug_test_' + Date.now();
  const testEmail = 'debug@test.com';

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        username: testUsername,
        email: testEmail,
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Manual insertion error:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Manual insertion successful');

      // Clean up test data
      await supabase.from('profiles').delete().eq('id', testUserId);
    }
  } catch (error) {
    console.log('❌ Exception during manual insertion:', error.message);
  }

  // Test 5: Check RLS policies
  console.log('\n5. Checking RLS policies...');
  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');

    if (error) {
      console.log('❌ Error checking policies:', error.message);
    } else {
      console.log('✅ Found policies for profiles table:', data.length);
      data.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd} on ${policy.tablename}`);
      });
    }
  } catch (error) {
    console.log('❌ Exception checking policies:', error.message);
  }
}

// Run the debug
debugTriggerFunction().catch(console.error);
