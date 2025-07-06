// Script to verify database state and identify issues
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying database state...');

  // Check 1: Tables exist
  console.log('\n1. Checking if tables exist...');
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists and accessible');
    }
  } catch (error) {
    console.log('❌ Exception accessing profiles:', error.message);
  }

  try {
    const { data: drives, error: drivesError } = await supabase
      .from('drives')
      .select('count')
      .limit(1);

    if (drivesError) {
      console.log('❌ Drives table error:', drivesError.message);
    } else {
      console.log('✅ Drives table exists and accessible');
    }
  } catch (error) {
    console.log('❌ Exception accessing drives:', error.message);
  }

  try {
    const { data: stops, error: stopsError } = await supabase
      .from('stops')
      .select('count')
      .limit(1);

    if (stopsError) {
      console.log('❌ Stops table error:', stopsError.message);
    } else {
      console.log('✅ Stops table exists and accessible');
    }
  } catch (error) {
    console.log('❌ Exception accessing stops:', error.message);
  }

  // Check 2: Try to get table structure
  console.log('\n2. Checking table structure...');
  try {
    const { data: profileData, error: profileStructError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileStructError) {
      console.log('❌ Profile structure error:', profileStructError.message);
    } else {
      console.log('✅ Profile table structure accessible');
      if (profileData && profileData.length > 0) {
        console.log('   Sample profile columns:', Object.keys(profileData[0]));
      }
    }
  } catch (error) {
    console.log('❌ Exception checking profile structure:', error.message);
  }

  // Check 3: Check if there are any existing users/profiles
  console.log('\n3. Checking existing data...');
  try {
    const { data: existingProfiles, error: countError } = await supabase
      .from('profiles')
      .select('*');

    if (countError) {
      console.log('❌ Error counting profiles:', countError.message);
    } else {
      console.log(`✅ Found ${existingProfiles.length} existing profiles`);
      if (existingProfiles.length > 0) {
        console.log('   Sample profile:', {
          id: existingProfiles[0].id,
          username: existingProfiles[0].username,
          email: existingProfiles[0].email,
        });
      }
    }
  } catch (error) {
    console.log('❌ Exception counting profiles:', error.message);
  }

  // Check 4: Test RLS policies
  console.log('\n4. Testing RLS policies...');
  try {
    // Try to insert a profile (should fail due to RLS)
    const { data: insertTest, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000000',
        username: 'test_rls',
        email: 'test@rls.com',
      })
      .select();

    if (insertError) {
      console.log('✅ RLS is working (insert blocked):', insertError.message);
    } else {
      console.log('⚠️ RLS might not be working (insert succeeded)');
    }
  } catch (error) {
    console.log('❌ Exception testing RLS:', error.message);
  }

  // Check 5: Check environment variables
  console.log('\n5. Environment variables:');
  console.log('   Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('   Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');

  // Check 6: Test basic auth
  console.log('\n6. Testing basic auth connection...');
  try {
    const { data: authTest, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.log('❌ Auth connection error:', authError.message);
    } else {
      console.log('✅ Auth connection working');
      console.log('   Session:', authTest.session ? 'Active' : 'None');
    }
  } catch (error) {
    console.log('❌ Exception testing auth:', error.message);
  }
}

verifyDatabase().catch(console.error);
