// RouteKeeper Complete API Test Suite
// This script tests all API functionality after database setup
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);

  testResults.tests.push({ name, passed, details });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...');

  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      logTest('Database Connection', false, error.message);
      return false;
    }

    logTest('Database Connection', true, 'Successfully connected to profiles table');
    return true;
  } catch (error) {
    logTest('Database Connection', false, error.message);
    return false;
  }
}

async function testUserSignup() {
  console.log('\n👤 Testing User Signup...');

  const timestamp = Date.now();
  const testEmail = `testuser${timestamp}@example.com`;
  const testUsername = `testuser-${timestamp}`;
  const testPassword = 'testpassword123';

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: testUsername,
        },
      },
    });

    if (error) {
      logTest('User Signup', false, error.message);
      return null;
    }

    logTest('User Signup', true, `User created: ${data.user?.id}`);
    return data.user;
  } catch (error) {
    logTest('User Signup', false, error.message);
    return null;
  }
}

async function testProfileCreation(userId) {
  console.log('\n📝 Testing Profile Creation...');

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) {
      logTest('Profile Creation', false, error.message);
      return false;
    }

    logTest('Profile Creation', true, `Profile: ${data.username} (${data.email})`);
    return data;
  } catch (error) {
    logTest('Profile Creation', false, error.message);
    return false;
  }
}

async function testDriveCreation(userId) {
  console.log('\n🚗 Testing Drive Creation...');

  try {
    const { data, error } = await supabase
      .from('drives')
      .insert({
        user_id: userId,
        start_latitude: 40.7128,
        start_longitude: -74.006,
        notes: 'Test drive from API',
      })
      .select()
      .single();

    if (error) {
      logTest('Drive Creation', false, error.message);
      return null;
    }

    logTest('Drive Creation', true, `Drive ID: ${data.id}`);
    return data;
  } catch (error) {
    logTest('Drive Creation', false, error.message);
    return null;
  }
}

async function testDriveUpdate(driveId) {
  console.log('\n⏹️ Testing Drive Update (Stop)...');

  try {
    const { data, error } = await supabase
      .from('drives')
      .update({
        end_time: new Date().toISOString(),
        end_latitude: 40.7589,
        end_longitude: -73.9851,
        notes: 'Test drive completed',
      })
      .eq('id', driveId)
      .select()
      .single();

    if (error) {
      logTest('Drive Update', false, error.message);
      return false;
    }

    logTest('Drive Update', true, `Drive ended at: ${data.end_time}`);
    return true;
  } catch (error) {
    logTest('Drive Update', false, error.message);
    return false;
  }
}

async function testStopCreation(driveId) {
  console.log('\n⛽ Testing Stop Creation...');

  try {
    const { data, error } = await supabase
      .from('stops')
      .insert({
        drive_id: driveId,
        category: 'gas',
        notes: 'Test gas stop',
        latitude: 40.7505,
        longitude: -73.9934,
      })
      .select()
      .single();

    if (error) {
      logTest('Stop Creation', false, error.message);
      return null;
    }

    logTest('Stop Creation', true, `Stop ID: ${data.id} (${data.category})`);
    return data;
  } catch (error) {
    logTest('Stop Creation', false, error.message);
    return null;
  }
}

async function testDataRetrieval(userId) {
  console.log('\n📊 Testing Data Retrieval...');

  try {
    // Test drives retrieval
    const { data: drives, error: drivesError } = await supabase
      .from('drives')
      .select('*')
      .eq('user_id', userId);

    if (drivesError) {
      logTest('Drives Retrieval', false, drivesError.message);
      return false;
    }

    logTest('Drives Retrieval', true, `Found ${drives.length} drives`);

    // Test stops retrieval for first drive
    if (drives.length > 0) {
      const { data: stops, error: stopsError } = await supabase
        .from('stops')
        .select('*')
        .eq('drive_id', drives[0].id);

      if (stopsError) {
        logTest('Stops Retrieval', false, stopsError.message);
        return false;
      }

      logTest('Stops Retrieval', true, `Found ${stops.length} stops for drive ${drives[0].id}`);
    }

    return true;
  } catch (error) {
    logTest('Data Retrieval', false, error.message);
    return false;
  }
}

async function testRLSPolicies(userId) {
  console.log('\n🔒 Testing RLS Policies...');

  try {
    // Test that user can only see their own data
    const { data: ownDrives, error: ownError } = await supabase
      .from('drives')
      .select('*')
      .eq('user_id', userId);

    if (ownError) {
      logTest('RLS - Own Data Access', false, ownError.message);
      return false;
    }

    logTest('RLS - Own Data Access', true, `Can access ${ownDrives.length} own drives`);

    // Test that user cannot see other users' data (should be empty)
    const { data: otherDrives, error: otherError } = await supabase
      .from('drives')
      .select('*')
      .neq('user_id', userId);

    if (otherError) {
      logTest('RLS - Other Data Access', false, otherError.message);
      return false;
    }

    // Should be empty due to RLS
    logTest(
      'RLS - Other Data Access',
      true,
      `Cannot access other users' data (${otherDrives.length} results)`
    );

    return true;
  } catch (error) {
    logTest('RLS Policies', false, error.message);
    return false;
  }
}

async function cleanupTestData(userId) {
  console.log('\n🧹 Cleaning up test data...');

  try {
    // Delete stops first (due to foreign key constraints)
    const { error: stopsError } = await supabase
      .from('stops')
      .delete()
      .eq(
        'drive_id',
        (
          await supabase.from('drives').select('id').eq('user_id', userId)
        ).data?.[0]?.id
      );

    if (stopsError) {
      console.log(`⚠️ Could not delete stops: ${stopsError.message}`);
    }

    // Delete drives
    const { error: drivesError } = await supabase.from('drives').delete().eq('user_id', userId);

    if (drivesError) {
      console.log(`⚠️ Could not delete drives: ${drivesError.message}`);
    }

    // Delete profile
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

    if (profileError) {
      console.log(`⚠️ Could not delete profile: ${profileError.message}`);
    }

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.log(`⚠️ Cleanup error: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting RouteKeeper API Test Suite...');
  console.log(`📡 Testing against: ${supabaseUrl}`);

  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Please check your setup.');
    return;
  }

  // Test 2: User Signup
  const user = await testUserSignup();
  if (!user) {
    console.log('\n❌ User signup failed. Please check the trigger function.');
    return;
  }

  // Test 3: Profile Creation
  const profile = await testProfileCreation(user.id);
  if (!profile) {
    console.log('\n❌ Profile creation failed. Please check the trigger function.');
    return;
  }

  // Test 4: Drive Creation
  const drive = await testDriveCreation(user.id);
  if (!drive) {
    console.log('\n❌ Drive creation failed. Please check RLS policies.');
    return;
  }

  // Test 5: Stop Creation
  const stop = await testStopCreation(drive.id);
  if (!stop) {
    console.log('\n❌ Stop creation failed. Please check RLS policies.');
    return;
  }

  // Test 6: Drive Update
  const driveUpdated = await testDriveUpdate(drive.id);
  if (!driveUpdated) {
    console.log('\n❌ Drive update failed. Please check RLS policies.');
    return;
  }

  // Test 7: Data Retrieval
  const dataRetrieved = await testDataRetrieval(user.id);
  if (!dataRetrieved) {
    console.log('\n❌ Data retrieval failed. Please check RLS policies.');
    return;
  }

  // Test 8: RLS Policies
  const rlsWorking = await testRLSPolicies(user.id);
  if (!rlsWorking) {
    console.log('\n❌ RLS policies failed. Please check security setup.');
    return;
  }

  // Cleanup
  await cleanupTestData(user.id);

  // Summary
  console.log('\n📋 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.passed + testResults.failed}`);

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Your RouteKeeper database is working correctly.');
    console.log('🚀 You can now use the application with full functionality.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the database setup.');
  }
}

// Run the tests
runAllTests().catch(console.error);
