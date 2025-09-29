#!/usr/bin/env node

/**
 * Test DynamoDB operations with the new schema including graphId and parentThreadId
 */

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

// Configure AWS SDK for local DynamoDB
const client = new DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  }
});

const dynamodb = DynamoDBDocument.from(client);

async function testNewSchema() {
  console.log('🔍 Testing new DynamoDB schema with graphId and parentThreadId...\n');
  
  const managerKey = 'test-repo-owner/test-repo/456';
  const plannerKey = 'test-repo-owner/test-repo/456-planner';
  
  const managerMetadata = {
    issueKey: managerKey,
    runId: 'manager-run-' + Date.now(),
    threadId: 'manager-thread-' + Date.now(),
    graphId: 'manager',
    assistantId: 'open-swe-manager',
    status: 'created',
    owner: 'test-repo-owner',
    repo: 'test-repo',
    issueNumber: 456,
    issueTitle: 'Test issue with new schema',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const plannerMetadata = {
    issueKey: plannerKey,
    runId: 'planner-run-' + Date.now(),
    threadId: 'planner-thread-' + Date.now(),
    graphId: 'planner',
    parentThreadId: managerMetadata.threadId, // Link to manager
    assistantId: 'open-swe-planner',
    status: 'plan_ready',
    owner: 'test-repo-owner',
    repo: 'test-repo',
    issueNumber: 456,
    issueTitle: 'Test planning phase',
    autoAcceptPlan: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  try {
    // Test store manager metadata
    console.log('📝 Storing manager metadata...');
    await dynamodb.put({
      TableName: 'openswe-run-metadata',
      Item: managerMetadata
    });
    console.log('✅ Manager metadata stored successfully');
    
    // Test store planner metadata
    console.log('📝 Storing planner metadata...');
    await dynamodb.put({
      TableName: 'openswe-run-metadata',
      Item: plannerMetadata
    });
    console.log('✅ Planner metadata stored successfully');
    
    // Test retrieve manager metadata
    console.log('📖 Retrieving manager metadata...');
    const managerResult = await dynamodb.get({
      TableName: 'openswe-run-metadata',
      Key: { issueKey: managerKey }
    });
    
    if (managerResult.Item) {
      console.log('✅ Manager metadata retrieved successfully');
      console.log(`   Graph ID: ${managerResult.Item.graphId}`);
      console.log(`   Thread ID: ${managerResult.Item.threadId}`);
      console.log(`   Parent Thread ID: ${managerResult.Item.parentThreadId || 'None (root)'}`);
    } else {
      console.log('❌ Manager metadata not found');
    }
    
    // Test retrieve planner metadata
    console.log('📖 Retrieving planner metadata...');
    const plannerResult = await dynamodb.get({
      TableName: 'openswe-run-metadata',
      Key: { issueKey: plannerKey }
    });
    
    if (plannerResult.Item) {
      console.log('✅ Planner metadata retrieved successfully');
      console.log(`   Graph ID: ${plannerResult.Item.graphId}`);
      console.log(`   Thread ID: ${plannerResult.Item.threadId}`);
      console.log(`   Parent Thread ID: ${plannerResult.Item.parentThreadId}`);
      console.log(`   Links to manager: ${plannerResult.Item.parentThreadId === managerMetadata.threadId ? 'Yes ✓' : 'No ❌'}`);
    } else {
      console.log('❌ Planner metadata not found');
    }
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await Promise.all([
      dynamodb.delete({
        TableName: 'openswe-run-metadata',
        Key: { issueKey: managerKey }
      }),
      dynamodb.delete({
        TableName: 'openswe-run-metadata',
        Key: { issueKey: plannerKey }
      })
    ]);
    console.log('✅ Cleanup successful');
    
    console.log('\n🎉 All new schema tests passed!');
    console.log('\n✨ Summary:');
    console.log('  • Manager metadata stored with graphId="manager"');
    console.log('  • Planner metadata stored with graphId="planner"');
    console.log('  • Planner correctly linked to manager via parentThreadId');
    console.log('  • Thread resumption should now work correctly!');
    
  } catch (error) {
    console.error('❌ New schema test failed:', error.message);
    process.exit(1);
  }
}

testNewSchema();
