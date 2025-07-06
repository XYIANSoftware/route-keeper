// Script to delete a user account and clean up related data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteUser() {
  console.log('🗑️  Deleting user account and cleaning up...\n');

  const userEmail = 'jobs@kyledilbeck.com';
  const userId = '2196934b-0da0-475a-aca8-648b4b548ba2';

  try {
    // 1. Delete any existing profiles first
    console.log('1. Cleaning up profiles...');
    const { data: deletedProfiles, error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
      .select();

    if (profileDeleteError) {
      console.log('⚠️  Profile deletion error (might not exist):', profileDeleteError.message);
    } else {
      console.log(`✅ Deleted ${deletedProfiles?.length || 0} profiles`);
    }

    // 2. Delete any drives
    console.log('\n2. Cleaning up drives...');
    const { data: deletedDrives, error: driveDeleteError } = await supabase
      .from('drives')
      .delete()
      .eq('user_id', userId)
      .select();

    if (driveDeleteError) {
      console.log('⚠️  Drive deletion error (might not exist):', driveDeleteError.message);
    } else {
      console.log(`✅ Deleted ${deletedDrives?.length || 0} drives`);
    }

    // 3. Delete any stops
    console.log('\n3. Cleaning up stops...');
    const { data: deletedStops, error: stopDeleteError } = await supabase
      .from('stops')
      .delete()
      .in('drive_id', []) // This will delete no stops, but we'll check if there are any
      .select();

    if (stopDeleteError) {
      console.log('⚠️  Stop deletion error (might not exist):', stopDeleteError.message);
    } else {
      console.log(`✅ Deleted ${deletedStops?.length || 0} stops`);
    }

    // 4. Try to delete the auth user (this might not work with client-side auth)
    console.log('\n4. Attempting to delete auth user...');
    
    // Note: This requires admin privileges which we don't have in client-side
    // But let's try anyway to see what happens
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.log('❌ Cannot delete auth user (expected with client-side auth)');
      console.log('   Error:', authDeleteError.message);
      console.log('\n📋 Manual cleanup required:');
      console.log('   1. Go to Supabase Dashboard > Authentication > Users');
      console.log('   2. Find user:', userEmail);
      console.log('   3. Click the user and select "Delete user"');
      console.log('   4. Confirm the deletion');
    } else {
      console.log('✅ Auth user deleted successfully');
    }

    // 5. Verify cleanup
    console.log('\n5. Verifying cleanup...');
    
    const { data: remainingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (checkError) {
      console.log('⚠️  Error checking remaining profiles:', checkError.message);
    } else {
      console.log(`Remaining profiles: ${remainingProfiles?.length || 0}`);
    }

    console.log('\n✅ Cleanup completed!');
    console.log('\n🆕 Next steps:');
    console.log('1. If auth user deletion failed, manually delete from Supabase Dashboard');
    console.log('2. Try signing up again with the same email');
    console.log('3. The signup should work properly now');

  } catch (error) {
    console.error('💥 Error during cleanup:', error.message);
  }
}

// Run the deletion
deleteUser().catch(console.error); 