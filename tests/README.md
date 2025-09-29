# Test Scripts

This directory contains various test and debug scripts for the Open SWE project. These scripts help validate the infrastructure, authentication, and core components of the system.

## Prerequisites

- Docker services running (PostgreSQL, DynamoDB Local)
- Environment variables configured in `apps/open-swe/.env`
- Node.js dependencies installed (`yarn install` from project root)

## Quick Start

```bash
# Navigate to tests directory
cd /home/izlobin/wb/open-swe/tests

# Run all main tests
node test-dynamodb.js           # Test database operations
node test-github-auth-simple.js # Test GitHub authentication

# Run debug scripts if needed
node debug-env.js               # Debug environment variable parsing
```

## Test Scripts

### 🔐 GitHub Authentication Tests

#### `test-github-auth-simple.js`
**Purpose**: Complete GitHub App authentication testing with environment variable parsing  
**Features**:
- Multi-line environment variable parsing (handles GitHub private keys)
- JWT token generation with proper timing
- GitHub App information retrieval
- Installation discovery and token generation

**Usage**:
```bash
# From tests directory (recommended)
cd /home/izlobin/wb/open-swe/tests
node test-github-auth-simple.js

# Or from project root
cd /home/izlobin/wb/open-swe
node tests/test-github-auth-simple.js
```

**Expected Output**:
```
🚀 Testing GitHub App Authentication

📋 Configuration:
  App ID: 2010770
  Private Key configured: Yes
  Private Key length: 1675

✅ App info retrieved successfully:
  Name: backstage-agent-app
  Owner: iliazlobin

✅ Installations retrieved: 1
  Installation ID: 87396728

✅ Installation token generated successfully!

🎉 All tests passed! Your GitHub App authentication is working.
```

**Troubleshooting**:
- `❌ GITHUB_APP_ID not found`: Check `.env` file path and format
- `❌ Bad credentials`: Verify GitHub App private key and timing
- `❌ 404 errors`: Check GitHub App installation status

---

#### `test-github-auth.js`
**Purpose**: Alternative GitHub authentication test script  
**Usage**: Similar to `test-github-auth-simple.js` but with different implementation approach

---

#### `test-jwt.js`
**Purpose**: Focused JWT token generation testing  
**Features**: Tests JWT signing and timing validation

---

### 🗄️ Database Tests

#### `test-dynamodb.js`
**Purpose**: Validate DynamoDB Local operations and schema  
**Features**:
- Tests connection to DynamoDB Local (port 8000)
- Validates `openswe-run-metadata` table schema with `issueKey` primary key
- Tests CRUD operations (Create, Read, Delete)
- Automatic table creation if missing

**Usage**:
```bash
# From tests directory (recommended)
cd /home/izlobin/wb/open-swe/tests
node test-dynamodb.js

# Or from project root
cd /home/izlobin/wb/open-swe
node tests/test-dynamodb.js
```

**Expected Output**:
```
🔍 Testing DynamoDB operations...

📝 Storing run metadata...
✅ Store successful
📖 Retrieving run metadata...
✅ Retrieve successful
📋 Retrieved data: {
  "issueKey": "test-issue-123",
  "runId": "run-1759123437976",
  "installationId": "87396728",
  ...
}
🧹 Cleaning up test data...
✅ Cleanup successful

🎉 All DynamoDB tests passed!
```

**Troubleshooting**:
- `ResourceNotFoundException`: Script will auto-create the table
- Connection errors: Ensure DynamoDB Local is running on port 8000
- Permission errors: Check AWS credentials configuration

---

### 🐛 Debug Scripts

#### `debug-env.js`
**Purpose**: Debug environment variable parsing, especially multi-line values  
**Features**:
- Analyzes `.env` file structure
- Identifies multi-line variable boundaries
- Shows character counts and line numbers

**Usage**:
```bash
# From tests directory (recommended)
cd /home/izlobin/wb/open-swe/tests
node debug-env.js

# Or from project root
cd /home/izlobin/wb/open-swe
node tests/debug-env.js
```

---

#### `debug-env-detailed.js`
**Purpose**: Detailed environment variable parsing analysis  
**Features**: Step-by-step parsing with verbose output

---

#### `debug-quotes.js`
**Purpose**: Debug quote handling in environment variable parsing  
**Features**: Tests single-line vs multi-line quote detection logic

---

## Infrastructure Status Check

Before running tests, verify your local infrastructure:

### 1. Check Docker Services
```bash
cd /home/izlobin/wb/open-swe/local
docker-compose ps
```

Expected status:
- `langgraph-postgres`: Up (healthy)
- `dynamodb-local`: Up

### 2. Check LangGraph Server
```bash
curl http://localhost:2024/health
```

### 3. Test Database Connections

**PostgreSQL**:
```bash
psql -h localhost -p 5432 -U langgraph -d langgraph -c "SELECT COUNT(*) FROM checkpoints;"
```

**DynamoDB Local**:
```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
```

## Configuration Summary

### Current GitHub App Configuration
- **App Name**: backstage-agent-app
- **App ID**: 2010770
- **Installation ID**: 87396728 (for user iliazlobin)
- **Permissions**: Full repository access (issues, PRs, workflows, etc.)

### Local Services
- **LangGraph Server**: `http://localhost:2024`
- **PostgreSQL**: `localhost:5432` (checkpointer storage)
- **DynamoDB Local**: `http://localhost:8000` (run metadata)
- **Redis**: `localhost:6379` (optional caching)

## Troubleshooting Common Issues

### Authentication Issues
1. **Bad Credentials**: 
   - Verify GitHub App private key is complete and properly formatted in `.env`
   - Check that `GITHUB_APP_ID` matches your GitHub App
   - Ensure GitHub App has not been revoked or regenerated
   
2. **JWT Timing Issues**:
   - **"'exp' is too far in the future"**: System date is set incorrectly (scripts handle this automatically)
   - **"Token expired"**: System clock is behind real time
   - Scripts automatically detect future system dates and use conservative base times
   
3. **Installation Missing**: 
   - Verify GitHub App is installed on target repositories
   - Check installation permissions in GitHub App settings

### System Date Issues
⚠️ **Important**: If your system date is set to the future (e.g., 2025), the authentication scripts will automatically detect this and use a conservative base time (2024-12-01) for GitHub API compatibility. This is normal behavior.

**Symptoms of future system date**:
- Scripts show: `⚠️ System year 2025 detected, using base time 2024-12-01`
- JWT timing shows different years for `now` vs `baseTime`

### Database Issues
1. **Connection Refused**: Ensure Docker services are running
2. **Table Not Found**: Scripts will auto-create tables when possible
3. **Permission Denied**: Check AWS credentials for DynamoDB access

### Environment Issues
1. **Multi-line Variables**: Use quotes around multi-line values in `.env`
2. **Path Issues**: Run scripts from correct directory (tests scripts work from `tests/` dir)
3. **Dependencies**: Ensure `yarn install` completed successfully from project root

## Test Results Summary

✅ **Authentication Status**: GitHub App working (ID: 2010770, Installation: 87396728)  
✅ **Database Status**: DynamoDB schema fixed (`issueKey` primary key)  
✅ **Infrastructure Status**: All services operational  
✅ **Environment Parsing**: Multi-line variable support working  
✅ **JWT Generation**: Proper timing with future date handling  

The system is ready for end-to-end workflow testing with proper authentication and persistence configured.
