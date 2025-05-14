const mockSend = jest.fn();
const mockJwtVerify = jest.fn();

jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: jest.fn(() => ({
    send: mockSend,
  })),
  GetSecretValueCommand: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: (...args: any[]) => mockJwtVerify(...args),
}));

jest.mock('../../../utils/policy', () => ({
  generatePolicy: jest.fn((principalId, effect, resource, role, userEmail) => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      role,
      userEmail,
    },
  })),
}));

import { handler } from '../../../functions/auth/authorizer';
import { generatePolicy } from '../../../utils/policy';

describe('Authorizer Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_REGION = 'us-east-1';
  });

  it('should deny access if token is not a Bearer token', async () => {
    const res = await handler({
      authorizationToken: 'InvalidToken',
      methodArn: 'test-method-arn',
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe('Deny');
  });

  it('should deny access if secret is missing', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: undefined });

    const res = await handler({
      authorizationToken: 'Bearer some.token.value',
      methodArn: 'test-method-arn',
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe('Deny');
  });

  it('should deny access if JWT verification fails', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: 'supersecret' });
    mockJwtVerify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const res = await handler({
      authorizationToken: 'Bearer invalid.token.here',
      methodArn: 'test-method-arn',
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe('Deny');
  });

  it('should allow access for valid token', async () => {
    mockSend.mockResolvedValueOnce({ SecretString: 'supersecret' });
    mockJwtVerify.mockReturnValue({
      userName: 'testuser',
      userEmail: 'test@example.com',
      role: 'admin',
    });

    const res = await handler({
      authorizationToken: 'Bearer valid.jwt.token',
      methodArn: 'test-method-arn',
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe('Allow');
    expect(res.context).toEqual({
      role: 'admin',
      userEmail: 'test@example.com',
    });
    expect(generatePolicy).toHaveBeenCalledWith(
      'testuser',
      'Allow',
      'test-method-arn',
      'admin',
      'test@example.com'
    );
  });
});
