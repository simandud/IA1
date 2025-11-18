// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_EXPIRE = '1d';

// Increase test timeout for database operations
jest.setTimeout(30000);
