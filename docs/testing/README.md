# Testing Documentation

This section contains all testing-related documentation and guides.

## Contents

### Test Suites
- [`INTEGRATION_TEST_SUITE_COMPLETE.md`](INTEGRATION_TEST_SUITE_COMPLETE.md) - Complete integration test implementation
- `TESTING_*.md` - Additional testing documentation

### Testing Framework

#### Integration Testing
Comprehensive integration test suite covering:
- **Export Flow Tests** - CSS generation, performance, browser compatibility
- **Save Flow Tests** - Database persistence, usage limits, error handling
- **Auth Flow Tests** - Authentication, user management, security

#### Test Infrastructure
- **Vitest Configuration** - Modern testing framework setup
- **Mock System** - Comprehensive mocking for OpenAI, Clerk, Prisma
- **Test Utilities** - Shared testing utilities and helpers

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:integration
npm run test:run

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Categories

#### Unit Tests
- Component testing
- Utility function testing
- Service layer testing

#### Integration Tests
- API endpoint testing
- Database operation testing
- Authentication flow testing
- Export functionality testing

#### End-to-End Tests
- Complete user journey testing
- Cross-browser testing
- Performance testing

### Testing Best Practices

1. **Write tests for new features** - Ensure all new functionality is covered
2. **Mock external dependencies** - Use comprehensive mocking for third-party services
3. **Test error scenarios** - Include error handling and edge cases
4. **Maintain test performance** - Keep tests fast and reliable
5. **Use structured logging** - Leverage logging in tests for debugging

For detailed implementation status and results, see [INTEGRATION_TEST_SUITE_COMPLETE.md](INTEGRATION_TEST_SUITE_COMPLETE.md).