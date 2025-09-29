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

# Run all tests with summary (recommended)
node run-all-tests.js

# Or run individual tests
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

#### `test-production-jwt.mjs`
**Purpose**: Test production JWT generation using the built shared package  
**Features**: 
- Uses actual production JWT generation code
- Tests system date compatibility (2025 → 2024-12-01 fallback)
- Validates complete GitHub App authentication flow

**Usage**:
```bash
cd /home/izlobin/wb/open-swe/tests
node test-production-jwt.mjs
```

**Expected Output**:
```
🔧 Testing Production JWT Generation

✅ Production JWT generated successfully
✅ Installation token generated successfully!
🎉 Production JWT generation is working correctly!
```

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
