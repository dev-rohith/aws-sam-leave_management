const mockSend = jest.fn();
const mockDynamoSend = jest.fn();

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

jest.mock('@aws-sdk/client-secrets-manager', () => {
  return {
    SecretsManagerClient: jest.fn(() => ({
      send: mockSend,
    })),
    GetSecretValueCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const actual = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...actual,
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockDynamoSend,
      })),
    },
    GetCommand: jest.fn(),
  };
});

import { handler } from '../../../functions/auth/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Login Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TABLE_NAME = 'TestTable';
    process.env.AWS_REGION = 'us-east-1';
  });

  it('should return 400 if username or password is missing', async () => {
    const res = await handler({ body: JSON.stringify({}) } as any);
    expect(res.statusCode).toBe(400);
  });

  it('should return 500 if SecretString is missing', async () => {
    mockSend.mockResolvedValueOnce({}); // No SecretString

    const res = await handler({
      body: JSON.stringify({ userName: 'test', password: 'pass' }),
    } as any);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe('JWT secret missing in Secrets Manager');
  });

  it('should return 404 if user not found in DynamoDB', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: 'mock-secret' });
    mockDynamoSend.mockResolvedValueOnce({ Item: undefined });

    const res = await handler({
      body: JSON.stringify({ userName: 'nouser', password: 'pass' }),
    } as any);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body).message).toBe('User not found');
  });

  it('should return 401 if password does not match', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: 'mock-secret' });
    mockDynamoSend.mockResolvedValueOnce({
      Item: { password: 'hashed', email: 'user@example.com' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await handler({
      body: JSON.stringify({ userName: 'test', password: 'wrong' }),
    } as any);

    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body).message).toBe('Email or Password is invalid');
  });

  it('should return 200 and a token for valid credentials', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: 'mock-secret' });
    mockDynamoSend.mockResolvedValueOnce({
      Item: { password: 'hashed', email: 'user@example.com' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');

    const res = await handler({
      body: JSON.stringify({ userName: 'test', password: 'correct' }),
    } as any);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.message).toBe('Login successful');
    expect(body.data.token).toBe('mock-token');
  });
});
