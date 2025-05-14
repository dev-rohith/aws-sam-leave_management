const mockDynamoSend = jest.fn();

jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn(() => 'salt'),
  hashSync: jest.fn((password: string) => `hashed-${password}`),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const actual = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...actual,
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockDynamoSend,
      })),
    },
    PutCommand: jest.fn(),
  };
});

import { handler } from '../../../functions/auth/signup';

describe('Signup Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TABLE_NAME = 'TestTable';
  });

  it('should return 400 if userName, email, or password is missing', async () => {
    const res = await handler({ body: JSON.stringify({}) } as any);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe(
      'Username with email and password is required for signup'
    );
  });

  it('should return 200 on successful user creation', async () => {
    mockDynamoSend.mockResolvedValueOnce({});

    const res = await handler({
      body: JSON.stringify({
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    } as any);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe('Successfully created the user');
    expect(mockDynamoSend).toHaveBeenCalled();
  });

  it('should return 500 on internal server error', async () => {
    mockDynamoSend.mockRejectedValueOnce(new Error('DynamoDB error'));

    const res = await handler({
      body: JSON.stringify({
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    } as any);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe('Internal server error');
  });
});
