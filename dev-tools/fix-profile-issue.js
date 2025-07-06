// Script to fix profile creation issue
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfileIssue() {
  console.log('🔧 Fixing profile creation issue...\n');

  const userEmail = 'jobs@kyledilbeck.com';
  const userId = '2196934b-0da0-475a-aca8-648b4b548ba2';
  const username = 'XYIANSoftware';

  try {
    // 1. Check current profiles
    console.log('1. Checking current profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (profilesError) {
      console.log('❌ Error checking profiles:', profilesError.message);
      return;
    }

    console.log(`Found ${profiles.length} profiles for user ID ${userId}`);

    if (profiles.length > 1) {
      console.log('⚠️  Multiple profiles found - cleaning up duplicates...');

      // Keep the first one, delete the rest
      for (let i = 1; i < profiles.length; i++) {
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)
          .eq('created_at', profiles[i].created_at);

        if (deleteError) {
          console.log(`❌ Error deleting duplicate profile: ${deleteError.message}`);
        } else {
          console.log(`✅ Deleted duplicate profile created at ${profiles[i].created_at}`);
        }
      }
    } else if (profiles.length === 0) {
      console.log('❌ No profile found - creating one...');

      // Create the missing profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: username,
          email: userEmail,
        })
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creating profile:', createError.message);
      } else {
        console.log('✅ Profile created successfully:', newProfile);
      }
    } else {
      console.log('✅ Profile exists and is unique');
      console.log('   Username:', profiles[0].username);
      console.log('   Email:', profiles[0].email);
    }

    // 2. Verify the fix
    console.log('\n2. Verifying fix...');
    const { data: finalProfile, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (finalError) {
      console.log('❌ Verification failed:', finalError.message);
    } else {
      console.log('✅ Profile verified:');
      console.log('   ID:', finalProfile.id);
      console.log('   Username:', finalProfile.username);
      console.log('   Email:', finalProfile.email);
      console.log('   Created:', finalProfile.created_at);
    }
  } catch (error) {
    console.error('💥 Error fixing profile issue:', error.message);
  }
}

// Run the fix
fixProfileIssue().catch(console.error);
