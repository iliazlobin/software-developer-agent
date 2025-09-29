// Test DynamoDB operations with our fixed schema
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configure AWS SDK v3 for local DynamoDB
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  }
});

const dynamodb = DynamoDBDocumentClient.from(client);

async function testDynamoDB() {
  console.log('🔍 Testing DynamoDB operations...\n');
  
  const testKey = 'test-issue-123';
  const testMetadata = {
    runId: 'run-' + Date.now(),
    repositoryOwner: 'iliazlobin',
    repositoryName: 'test-repo',
    issueNumber: 123,
    installationId: '87396728',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  try {
    // Test store operation
    console.log('📝 Storing run metadata...');
    await dynamodb.send(new PutCommand({
      TableName: 'openswe-run-metadata',
      Item: {
        issueKey: testKey,
        ...testMetadata
      }
    }));
    console.log('✅ Store successful');
    
    // Test retrieve operation
    console.log('📖 Retrieving run metadata...');
    const result = await dynamodb.send(new GetCommand({
      TableName: 'openswe-run-metadata',
      Key: { issueKey: testKey }
    }));
    
    if (result.Item) {
      console.log('✅ Retrieve successful');
      console.log('📋 Retrieved data:', JSON.stringify(result.Item, null, 2));
    } else {
      console.log('❌ No data found');
    }
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await dynamodb.send(new DeleteCommand({
      TableName: 'openswe-run-metadata',
      Key: { issueKey: testKey }
    }));
    console.log('✅ Cleanup successful');
    
    console.log('\n🎉 All DynamoDB tests passed!');
    
  } catch (error) {
    console.error('❌ DynamoDB test failed:', error.message);
    
    if (error.code === 'ResourceNotFoundException') {
      console.log('\n🔧 Creating table...');
      try {
        const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
        await client.send(new CreateTableCommand({
          TableName: 'openswe-run-metadata',
          KeySchema: [
            { AttributeName: 'issueKey', KeyType: 'HASH' }
          ],
          AttributeDefinitions: [
            { AttributeName: 'issueKey', AttributeType: 'S' }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }));
        console.log('✅ Table created successfully');
        
        // Retry the test
        console.log('🔄 Retrying test...');
        await testDynamoDB();
      } catch (createError) {
        console.error('❌ Failed to create table:', createError.message);
      }
    }
  }
}

testDynamoDB();
