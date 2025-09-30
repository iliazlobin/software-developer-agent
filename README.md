# Software Engineer Agent for Enterprise Development
## Abstract
This project provides an AI software engineer that automates the complete software development lifecycle—from requirements analysis and architecture design to implementation, testing. Powered by LangGraph, it acts as an autonomous development team member, creating production-ready code, comprehensive test suites, and maintaining high software quality standards for enterprise organizations.

## Motivation
Enterprise software development faces unique challenges: complex requirements, strict compliance needs, extensive testing requirements, and the need for maintainable, scalable solutions. Manual development processes are bottlenecks in modern enterprises where speed and quality are both critical. This project solves these challenges by providing an AI agent that can understand business requirements, design appropriate solutions, implement code following enterprise standards, create comprehensive tests, and ensure quality—all while maintaining the rigor and documentation standards expected in enterprise environments.

## System Design
The diagram below illustrates the end-to-end architecture of the Software Engineer Agent. It shows how the Manager Agent coordinates specialized sub-agents for planning, programming, reviewing, and testing. The system integrates with GitHub for issue tracking and pull requests, uses sandboxed environments for safe code execution, and includes comprehensive testing capabilities via Playwright. State management ensures consistent tracking of tasks, code changes, and quality metrics throughout the development lifecycle.

![System Design Diagram](./images/swe-agent-workflow.png)

## System Overview

### Cognitive Architecture
- **Manager Agent**: Orchestrates the complete development workflow, manages task delegation, and ensures quality gates
- **Planner Agent**: Analyzes requirements, designs architecture, and creates detailed implementation plans
- **Programmer Agent**: Implements code, handles complex programming tasks, and manages technical debt
- **Reviewer Agent**: Conducts code reviews, ensures quality standards, and validates implementations
- **Testing Agent**: Creates comprehensive test suites, runs E2E tests, and ensures code reliability

### Requirements Analysis & Planning
- **Issue Processing**: Uses NLP to extract requirements from GitHub issues, user stories, and specifications
- **Architecture Design**: Creates system design documents, API specifications, and technical architecture plans
- **Task Decomposition**: Breaks complex features into manageable development tasks with clear acceptance criteria

### Code Generation & Implementation
- **Enterprise Patterns**: Generates code following enterprise architectural patterns (MVC, DDD, microservices)
- **Technology Stack Integration**: Supports multiple languages, frameworks, and enterprise technologies
- **Code Quality**: Implements SOLID principles, design patterns, and enterprise coding standards

### Quality Assurance & Testing
- **Automated Testing**: Creates unit tests, integration tests, and end-to-end test suites
- **Code Review**: Performs automated code reviews with quality metrics and improvement suggestions
- **Compliance Checking**: Validates code against security, performance, and compliance requirements

### GitHub Integration
- **Issue-to-PR Workflow**: Automatically converts GitHub issues into pull requests with complete implementations
- **Branch Management**: Handles feature branches, merge strategies, and git workflows
- **Documentation**: Generates comprehensive documentation, API docs, and technical specifications

## Custom Agents & Specialized Tools

### Advanced Programming Agent
This repository includes sophisticated programming capabilities with specialized tools for enterprise development. The Programmer Agent uses advanced code generation, refactoring tools, and integration with development environments. It understands enterprise patterns, can work with legacy codebases, and generates maintainable, scalable solutions.

### Comprehensive Testing Suite
The Testing Agent leverages Playwright for end-to-end testing, Jest for unit testing, and custom tools for integration testing. It creates test scenarios that cover business logic, user workflows, API integrations, and edge cases—ensuring enterprise-grade reliability.

### Security & Compliance Integration
Built-in security scanning, vulnerability assessment, and compliance checking ensure that generated code meets enterprise security standards and regulatory requirements.

## Repository Structure
```
apps/
├── open-swe/          – Core LangGraph agents and orchestration logic
├── web/               – Next.js web interface for agent interaction
└── cli/               – Command-line interface for automation

packages/
└── shared/            – Common utilities, types, and shared components

graphs/
├── manager/           – Top-level orchestration and workflow management
├── planner/           – Requirements analysis and architecture design
├── programmer/        – Code generation and implementation
├── reviewer/          – Code review and quality assurance
└── testing/           – Automated testing and quality validation

tools/
├── code-generation/   – Advanced code generation and templating
├── testing/           – Testing frameworks and automation
├── github/            – GitHub API integration and workflow management
└── security/          – Security scanning and compliance checking

docs/                  – Architecture diagrams, guides, and specifications
tests/                 – Integration tests and agent validation
static/                – UI assets and documentation images
```

## Setup Instructions

### Prerequisites
- **Node.js** (v18+) with Yarn package manager
- **TypeScript** (v5+) for type safety and enterprise development
- **Docker** (optional) for containerized deployments
- **GitHub** account with appropriate repository access

### Node.js & Dependencies
```bash
# Install dependencies
yarn install

# Verify installation
yarn --version
node --version
```

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure required variables
ANTHROPIC_API_KEY=your_anthropic_key_here
GITHUB_TOKEN=your_github_token_here
GITHUB_INSTALLATION_ID=your_app_installation_id
```

### Agent Development Environment
```bash
# Build shared packages
yarn build

# Start development server
yarn dev

# Run agent locally
yarn start:agent
```

### LangGraph Studio Integration
```bash
# Launch LangGraph Studio for visual debugging
langgraph dev

# Access Studio UI
open http://localhost:2024
```

## Secrets & Configuration

### GitHub Integration
Set up GitHub App for enterprise integration:
```bash
# GitHub App configuration
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### Model Configuration
Configure AI models for different agents:
```bash
# Primary programming model
PROGRAMMER_MODEL=claude-3-5-sonnet-20241022
PLANNER_MODEL=claude-3-5-sonnet-20241022
REVIEWER_MODEL=claude-3-5-sonnet-20241022

# Testing and analysis models
TESTING_MODEL=claude-3-5-sonnet-20241022
```

### Enterprise Security
```bash
# Security and compliance
SECURITY_SCAN_ENABLED=true
COMPLIANCE_RULES=enterprise-standard
VULNERABILITY_DB_URL=your_vuln_db_endpoint
```

## Running the Project

### Local Development
```bash
# Start the complete agent system
yarn dev

# Access web interface
open http://localhost:3000

# Access API documentation
open http://localhost:3000/api/docs
```

### Production Deployment
```bash
# Build for production
yarn build

# Deploy to enterprise infrastructure
yarn deploy:prod

# Monitor agent performance
yarn monitor
```

### GitHub Webhook Integration
```bash
# Configure webhook endpoint
WEBHOOK_URL=https://your-domain.com/api/webhooks/github

# Test webhook connectivity
yarn test:webhooks
```

## Enterprise Features

### Advanced Code Generation
- **Multi-language Support**: TypeScript, Python, Java, C#, Go
- **Framework Integration**: React, Next.js, NestJS, Spring Boot, .NET
- **Database Integration**: PostgreSQL, MongoDB, Redis, Elasticsearch
- **Cloud Platforms**: AWS, Azure, GCP with IaC support

### Quality Assurance
- **Automated Code Review**: Style, security, performance analysis
- **Test Generation**: Unit, integration, E2E test creation
- **Documentation**: API docs, technical specifications, user guides
- **Compliance**: SOC2, GDPR, HIPAA compliance checking

### Monitoring & Analytics
- **Performance Metrics**: Code quality scores, development velocity
- **Agent Analytics**: Task completion rates, error analysis
- **Business Intelligence**: Development insights and productivity metrics

## Usage

The Software Engineer Agent can be used in multiple ways:

- 🖥️ **From the UI**: Create, manage and execute development tasks from the web application. The interface provides real-time visibility into agent progress, code changes, and quality metrics.
- 📝 **From GitHub**: Start development tasks directly from GitHub issues by adding specific labels
- 🔗 **API Integration**: Use REST APIs to integrate with existing enterprise systems and workflows
- 📊 **Analytics Dashboard**: Monitor development metrics, quality trends, and agent performance

## GitHub Workflow Integration

The Software Engineer Agent integrates seamlessly with GitHub through webhooks, providing a streamlined workflow where you can request code changes by simply adding labels to issues in repositories where the agent is installed.

![GitHub Flow Diagram](./images/github-flow.png)

### Triggering Runs with Labels

The agent monitors GitHub issues for specific labels that trigger automated development runs. When you add one of these labels to an issue, the agent automatically creates a new run to process your request.

#### Label Types

The agent supports multiple label types that control how it operates:

**Manual Mode (`software-engineer`)**
- Requires manual approval of the generated plan before code execution
- Gives you full control over what changes will be made
- Ideal for complex or sensitive changes where you want to review the approach first

**Auto Mode (`software-engineer-auto`)**
- Automatically approves and executes the generated plan
- Provides faster turnaround for straightforward requests
- Best for simple changes or when you trust the agent to proceed autonomously

**Enterprise Mode (`software-engineer-enterprise`)**
- Uses enhanced models for both planning and programming tasks
- Includes comprehensive testing, security scanning, and compliance checking
- Provides enterprise-grade performance and quality assurance for critical projects

**Enterprise Auto Mode (`software-engineer-enterprise-auto`)**
- Combines automatic execution with enterprise-grade capabilities
- Ideal for production environments that require both speed and quality
- Includes all enterprise features with minimal human intervention

> **Note**: In development environments, the labels are `software-engineer-dev`, `software-engineer-auto-dev`, `software-engineer-enterprise-dev`, and `software-engineer-enterprise-auto-dev` respectively. The system automatically uses the appropriate labels based on the `NODE_ENV` environment variable.

### Automatic Run Creation

When you add a supported label to a GitHub issue, the agent's webhook handler automatically:

1. **Validates the request** - Verifies webhook signatures and authentication
2. **Extracts issue context** - Captures the issue title, description, and metadata
3. **Creates a new thread** - Generates a unique thread ID for the conversation
4. **Starts the Manager Graph** - Initiates the agent workflow with the issue content
5. **Configures execution mode** - Sets auto-accept based on the label type used

The entire process happens within seconds of adding the label, providing immediate feedback through issue comments.

### Issue Comments and Run Links

Once a run is created, the agent automatically posts a comment on the triggering issue to confirm processing has started. This comment includes:

- **Status confirmation** - "🤖 Software Engineer Agent has been triggered for this issue. Processing..."
- **Run link** - Direct URL to view the run in the agent's web interface
- **Access restriction notice** - Clarifies that only the issue creator can access the run
- **Development metadata** - Run ID and thread ID for debugging (in a collapsible section)

> **Tip**: The run link allows you to monitor progress in real-time, view the generated plan, and interact with the agent if needed. You can switch between manual and auto mode even after the run has started.

### User Access Restrictions

The agent implements strict access controls to ensure security and privacy:

#### Issue Creator Access
- Only the user who created the issue can access the generated run URL
- This prevents unauthorized users from viewing or modifying runs triggered by others
- Access is enforced through GitHub authentication and user verification

#### Repository Permissions
- The agent respects GitHub's repository permissions
- Users must have appropriate access to the repository to trigger runs
- The GitHub App installation determines which repositories can use the agent

> **Note**: If you need to share access to a run with team members, you can do so through the agent's web interface after the run is created, or by having team members with repository access create their own issues.

### Pull Request Integration

When the agent successfully completes code changes, it automatically creates pull requests that are linked back to the original issue:

#### Automatic PR Creation
- **Generated after plan execution** - PRs are created once the Programmer Graph completes its work
- **Linked to triggering issue** - PRs reference the original issue in their description
- **Preserves commit history** - All intermediate commits are maintained for transparency
- **Includes test results** - PR description contains comprehensive testing and quality metrics

#### Issue Resolution
- **Automatic closure** - When the generated PR is merged, GitHub automatically closes the linked issue
- **Clear audit trail** - The connection between issue, run, and PR provides complete traceability
- **Status updates** - Issue comments track the progress from request to completion

> **Tip**: You can review the generated PR before merging, even in auto mode. The auto-accept setting only applies to plan approval, not PR merging, giving you final control over what code enters your repository.

### Getting Started with GitHub Integration

To start using the Software Engineer Agent with webhooks:

1. **Install the agent** - Ensure the agent is installed on your repository as a GitHub App
2. **Create a detailed issue** - Describe the changes you want with clear requirements and acceptance criteria
3. **Add the appropriate label** - Use `software-engineer` for manual mode or `software-engineer-auto` for automatic mode
4. **Monitor progress** - Watch issue comments for the run link and status updates
5. **Review and merge** - Examine the generated PR and merge when satisfied with the changes

For setup instructions, see the [Development Setup](./docs/setup-development.md) guide.

## Testing Status Management

The agent includes sophisticated testing status management that tracks testing progress throughout the development lifecycle:

- **Intelligent Routing**: Testing only occurs when code changes require validation
- **Status Tracking**: Comprehensive status management (`not_started`, `required`, `in_progress`, `completed`, `failed`, `skipped`)
- **Retry Capability**: Automatic retry of failed tests with error analysis
- **Agent Control**: AI can determine when testing should be skipped or required based on change analysis

## References & Links
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Enterprise Architecture Guide](./docs/enterprise-architecture.md)
- [Security & Compliance](./docs/security-compliance.md)
- [API Documentation](./docs/api-reference.md)
- [Testing Status Flow](./TESTING_STATUS_FLOW.md)
- [Contributing Guide](./CONTRIBUTING.md)

